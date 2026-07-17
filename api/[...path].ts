import type { VercelRequest, VercelResponse } from "@vercel/node";

// ── TMDB fetch helper ────────────────────────────────────────────────────
const TMDB_BASE = "https://api.themoviedb.org/3";

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
      new Error("TMDB credentials not configured"),
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

// ── Main handler ─────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel puts catch-all segments in req.query.path
  // /api/health           → path = ["health"]
  // /api/tmdb/genres      → path = ["tmdb", "genres"]
  // /api/tmdb/movie/123   → path = ["tmdb", "movie", "123"]
  const { path, ...params } = req.query;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const route = segments.join("/");

  try {
    // ── Health check ────────────────────────────────────────────────
    if (route === "health") {
      return res.json({ ok: true });
    }

    // ── TMDB routes ────────────────────────────────────────────────
    if (segments[0] === "tmdb") {
      return handleTmdb(segments.slice(1), params, res);
    }

    // ── Search routes ──────────────────────────────────────────────
    if (route === "search") {
      const data = await tmdbFetch("/search/movie", {
        query: params.q as string,
        page: params.page as string,
      });
      return res.json({ data });
    }

    // ── Auth routes (placeholder) ──────────────────────────────────
    if (segments[0] === "auth") {
      // TODO: Add auth handlers here if needed
      return res.status(404).json({ error: "Auth not implemented" });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
}

// ── TMDB route dispatcher ────────────────────────────────────────────────
async function handleTmdb(
  segments: string[],
  params: Record<string, string | string[] | undefined>,
  res: VercelResponse
) {
  const subRoute = segments.join("/");
  let data: unknown;

  switch (subRoute) {
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
      // Match: movie/:id, movie/:id/credits, movie/:id/videos, movie/:id/similar
      const movieMatch = subRoute.match(/^movie\/(\d+)(?:\/(credits|videos|similar))?$/);
      if (movieMatch) {
        const [, id, sub] = movieMatch;
        const tmdbPath = sub ? `/movie/${id}/${sub}` : `/movie/${id}`;
        data = await tmdbFetch(tmdbPath);
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    }
  }

  return res.json({ data });
}