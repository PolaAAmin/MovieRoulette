import { createApp } from "../server/app.js";

// Vercel deploys this file as a single serverless function and routes every
// request under /api/* to it (see the catch-all filename below). Exporting
// the Express app directly works because Express apps are callable as
// (req, res) => void — exactly the signature Vercel's Node runtime expects.
// No app.listen() here: Vercel owns the HTTP binding, not us.
export default createApp();