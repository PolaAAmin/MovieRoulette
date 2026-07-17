import type { VercelRequest, VercelResponse } from "@vercel/node";

const TMDB_BASE = "https://api.themoviedb.org/3";

// ── TMDB fetch helper (same logic as your server/tmdbClient.ts) ──────────
async function tmdbFetch<T = unknown>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);

  const headers: Record<string, string> = { accept: "application/json" };

  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else if (process.env.TMDB_API_KEY) {
    url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  } else {
    throw Object.assign(
      new Error("TMDB credentials not configured. Set TMDB_ACCESS_TOKEN or TMDB_API_KEY."),
      { status: 500 }
    );
  }

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { headers });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (body && (body.status_message || body.message)) ||
      `TMDB request failed (${res.status})`;
    throw Object.assign(new Error(message), { status: res.status });
  }

  return body as T;
}

// ── Route handler ────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only GET for TMDB reads
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel puts catch-all segments in req.query.path as string[]
  const { path, ...params } = req.query;
  const route = Array.isArray(path) ? path.join("/") : String(path ?? "");

  try {
    let data: unknown;

    // ── Simple named routes ──────────────────────────────────────────
    switch (route) {
      case "genres":
        data = await tmdbFetch("/genre/movie/list");
        break;
      case "tv-genres":
        data = await tmdbFetch("/genre/tv/list");
        break;
      case "trending":
        data = await tmdbFetch("/trending/movie/week");
        break;
      case "popular":
        data = await tmdbFetch("/movie/popular", { page: params.page as string });
        break;
      case "top-rated":
        data = await tmdbFetch("/movie/top_rated", { page: params.page as string });
        break;
      case "discover":
        data = await tmdbFetch("/discover/movie", params as Record<string, string>);
        break;
      case "tv-discover":
        data = await tmdbFetch("/discover/tv", params as Record<string, string>);
        break;
      default: {
        // ── Movie sub-routes: movie/:id, movie/:id/credits, etc. ───
        const movieMatch = route.match(/^movie\/(\d+)(?:\/(credits|videos|similar))?$/);
        if (movieMatch) {
          const [, id, sub] = movieMatch;
          const tmdbPath = sub ? `/movie/${id}/${sub}` : `/movie/${id}`;
          data = await tmdbFetch(tmdbPath);
        } else {
          return res.status(404).json({ error: "Not found" });
        }
      }
    }

    // Same response shape as your Express routes: { data: ... }
    return res.json({ data });
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
}