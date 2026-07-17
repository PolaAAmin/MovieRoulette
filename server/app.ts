import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import tmdbRoutes from "./routes/tmdb.routes.js";
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";

export function createApp() {
  const app = express();

  // In production on Vercel, the frontend and /api are served from the same
  // origin, so CORS doesn't come into play for real requests — this only
  // matters for local dev, where the Vite dev server (5173) talks to this
  // API (4000) cross-origin.
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use("/api/tmdb", tmdbRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/auth", authRoutes);

  app.use("/api", (_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[api error]", err.message);
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  });

  return app;
}