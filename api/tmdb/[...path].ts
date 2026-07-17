import { createApp } from "../../server/app.js";

// Explicit catch-all scoped to /api/tmdb/* specifically. Same Express app as
// every other entry point — Express's own internal routing (already mounted
// at app.use("/api/tmdb", tmdbRoutes) inside server/app.ts) handles the
// actual dispatching once the request reaches here.
export default createApp();