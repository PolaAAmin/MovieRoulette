import type { VercelRequest, VercelResponse } from "@vercel/node";

const TMDB_BASE = "https://api.themoviedb.org/3";

// ── TMDB fetch helper ────────────────────────────────────────────────────
async function tmdbFetch(
  tmdbPath: string,
  searchParams: Record<string, string | undefined> = {}
): Promise<{ status: number; data: any }> {
  const url = new URL(`${TMDB_BASE}${tmdbPath}`);

  // Auth: prefer Bearer token, fall back to api_key query param
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else if (process.env.TMDB_API_KEY) {
    url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  } else {
    return { status: 500, data: { error: "TMDB credentials not configured" } };
  }

  // Forward query params (language, page, with_genres, etc.)
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, { headers });
  const body = await response.json().catch(() => ({}));

  return { status: response.status, data: body };
}

// ── Route handler ────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel puts catch-all segments in req.query.path as string[]
  const rawPath = req.query.path;
  const segments: string[] = Array.isArray(rawPath)
    ? rawPath.filter((s): s is string => typeof s === "string")
    : typeof rawPath === "string"
    ? [rawPath]
    : [];

  // Remaining query params (page, language, with_genres, etc.)
  const { path: _path, ...params } = req.query;
  const cleanParams: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    cleanParams[key] = typeof value === "string" ? value : undefined;
  }

  const subRoute = segments.join("/");

  let tmdbPath = "";
  let tmdbParams: Record<string, string | undefined> = { ...cleanParams };

  // ── Route matching ────────────────────────────────────────────────
  switch (subRoute) {
    case "genres":
      tmdbPath = "/genre/movie/list";
      break;
    case "tv-genres":
      tmdbPath = "/genre/tv/list";
      break;
    case "trending":
      tmdbPath = "/trending/movie/week";
      break;
    case "popular":
      tmdbPath = "/movie/popular";
      break;
    case "top-rated":
      tmdbPath = "/movie/top_rated";
      break;
    case "discover":
      tmdbPath = "/discover/movie";
      break;
    case "tv-discover":
      tmdbPath = "/discover/tv";
      break;
    default: {
      // movie/:id, movie/:id/credits, movie/:id/videos, movie/:id/similar
      const movieMatch = subRoute.match(/^movie\/(\d+)(?:\/(credits|videos|similar))?$/);
      if (movieMatch) {
        const [, id, sub] = movieMatch;
        tmdbPath = sub ? `/movie/${id}/${sub}` : `/movie/${id}`;
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    }
  }

  const { status, data } = await tmdbFetch(tmdbPath, tmdbParams);

  if (status !== 200) {
    return res.status(status).json({
      error: data.status_message || data.message || `TMDB error (${status})`,
    });
  }

  // Same response shape as your original Express routes: { data: ... }
  return res.json({ data });
}