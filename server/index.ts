import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import tmdbRoutes from "./routes/tmdb.routes";
import searchRoutes from "./routes/search.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// credentials: true is required for the httpOnly session cookie set by
// /api/auth/signin to actually be sent back on subsequent requests.
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Simple request log — handy while wiring things up, remove later if too noisy
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

// 404 for anything else under /api
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler — anything thrown/rejected in a route lands here
// instead of Express's default HTML error page, and instead of a raw 502.
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[api error]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`API server listening on http://localhost:${config.port}`);
});