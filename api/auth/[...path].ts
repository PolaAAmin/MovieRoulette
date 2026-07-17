import { createApp } from "../../server/app.js";

// Explicit catch-all scoped to /api/auth/* specifically — same reasoning as
// api/tmdb/[...path].ts.
export default createApp();