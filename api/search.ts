import type { VercelRequest, VercelResponse } from "@vercel/node";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  }
  return headers;
}

function getApiKeyParam(): string {
  if (!process.env.TMDB_ACCESS_TOKEN && process.env.TMDB_API_KEY) {
    return `&api_key=${process.env.TMDB_API_KEY}`;
  }
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = req.query.q as string;
  const page = req.query.page as string;

  if (!q) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }

  try {
    const url = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(q)}&page=${page || "1"}${getApiKeyParam()}`;
    const response = await fetch(url, { headers: getHeaders() });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.status_message || "TMDB error" });
    }

    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}