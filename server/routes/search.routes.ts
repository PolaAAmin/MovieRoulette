import { Router, type Request, type Response, type NextFunction } from "express";
import { tmdbFetch } from "../tmdbClient";

const router = Router();

function handler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

// GET /api/search?q=batman
router.get(
  "/",
  handler(async (req, res) => {
    const q = (req.query.q as string) || "";
    if (!q.trim()) {
      res.json({ data: { page: 1, results: [], total_pages: 0, total_results: 0 } });
      return;
    }
    const data = await tmdbFetch("/search/movie", { query: q });
    res.json({ data });
  })
);

export default router;