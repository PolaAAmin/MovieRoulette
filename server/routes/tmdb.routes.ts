import { Router, type Request, type Response, type NextFunction } from "express";
import { tmdbFetch } from "../tmdbClient.js";

const router = Router();

// Small wrapper so every route can just `await` and throw — errors land in
// the error-handling middleware in index.ts instead of crashing the process.
function handler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

// GET /api/tmdb/genres
router.get(
  "/genres",
  handler(async (_req, res) => {
    const data = await tmdbFetch("/genre/movie/list");
    res.json({ data });
  })
);

// GET /api/tmdb/tv-genres
router.get(
  "/tv-genres",
  handler(async (_req, res) => {
    const data = await tmdbFetch("/genre/tv/list");
    res.json({ data });
  })
);

// GET /api/tmdb/trending
router.get(
  "/trending",
  handler(async (_req, res) => {
    const data = await tmdbFetch("/trending/movie/week");
    res.json({ data });
  })
);

// GET /api/tmdb/popular?page=1
router.get(
  "/popular",
  handler(async (req, res) => {
    const data = await tmdbFetch("/movie/popular", { page: req.query.page as string });
    res.json({ data });
  })
);

// GET /api/tmdb/top-rated?page=1
router.get(
  "/top-rated",
  handler(async (req, res) => {
    const data = await tmdbFetch("/movie/top_rated", { page: req.query.page as string });
    res.json({ data });
  })
);

// GET /api/tmdb/discover?with_genres=28&sort_by=popularity.desc&...
router.get(
  "/discover",
  handler(async (req, res) => {
    const params = req.query as Record<string, string>;
    const data = await tmdbFetch("/discover/movie", params);
    res.json({ data });
  })
);

// GET /api/tmdb/tv-discover?with_genres=18&...
router.get(
  "/tv-discover",
  handler(async (req, res) => {
    const params = req.query as Record<string, string>;
    const data = await tmdbFetch("/discover/tv", params);
    res.json({ data });
  })
);

// GET /api/tmdb/movie-details?id=123
router.get(
  "/movie-details",
  handler(async (req, res) => {
    const data = await tmdbFetch(`/movie/${req.query.id}`);
    res.json({ data });
  })
);

// GET /api/tmdb/movie-credits?id=123
router.get(
  "/movie-credits",
  handler(async (req, res) => {
    const data = await tmdbFetch(`/movie/${req.query.id}/credits`);
    res.json({ data });
  })
);

// GET /api/tmdb/movie-videos?id=123
router.get(
  "/movie-videos",
  handler(async (req, res) => {
    const data = await tmdbFetch(`/movie/${req.query.id}/videos`);
    res.json({ data });
  })
);

// GET /api/tmdb/movie-similar?id=123
router.get(
  "/movie-similar",
  handler(async (req, res) => {
    const data = await tmdbFetch(`/movie/${req.query.id}/similar`);
    res.json({ data });
  })
);

export default router;