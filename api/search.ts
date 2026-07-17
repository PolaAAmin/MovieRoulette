import { createApp } from "../server/app.js";

// /api/search has no sub-paths (just GET /api/search?q=...), so this doesn't
// need catch-all bracket syntax — a plain file matching the exact path is
// enough.
export default createApp();