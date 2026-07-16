import "dotenv/config";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Preferred: TMDB_ACCESS_TOKEN (v4 "Read Access Token" — long JWT-looking string,
// used as a Bearer token). Get it from TMDB → Settings → API → "API Read Access Token".
// Fallback: TMDB_API_KEY (v3 "API Key" — short hex string, sent as ?api_key=...).
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_ACCESS_TOKEN && !TMDB_API_KEY) {
  console.warn(
    "[config] WARNING: Neither TMDB_ACCESS_TOKEN nor TMDB_API_KEY is set. " +
      "TMDB requests will fail with 401. See .env.example."
  );
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  tmdbBaseUrl: TMDB_BASE_URL,
  tmdbAccessToken: TMDB_ACCESS_TOKEN,
  tmdbApiKey: TMDB_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN ||
             (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173"),
};