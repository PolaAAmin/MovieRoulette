import { config } from "./config.js";

interface TmdbRequestOptions {
  method?: "GET" | "POST" | "DELETE";
  searchParams?: Record<string, string | number | undefined>;
  body?: unknown;
}

/**
 * General-purpose TMDB request helper. Supports GET/POST/DELETE with a JSON
 * body, which the simple `tmdbFetch` (GET-only) helper below doesn't cover —
 * needed for the authentication flow (create token, validate login, create
 * session, delete session all use POST/DELETE with bodies).
 */
export async function tmdbRequest<T = unknown>(
  path: string,
  options: TmdbRequestOptions = {}
): Promise<T> {
  const { method = "GET", searchParams = {}, body } = options;
  const url = new URL(`${config.tmdbBaseUrl}${path}`);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (config.tmdbAccessToken) {
    headers.Authorization = `Bearer ${config.tmdbAccessToken}`;
  } else if (config.tmdbApiKey) {
    url.searchParams.set("api_key", config.tmdbApiKey);
  } else {
    const err = new Error(
      "TMDB credentials are not configured on the server. Set TMDB_ACCESS_TOKEN or TMDB_API_KEY in .env."
    ) as Error & { status?: number };
    err.status = 500;
    throw err;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const responseBody = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (responseBody && (responseBody.status_message || responseBody.message)) ||
      `TMDB request failed (${res.status})`;
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return responseBody as T;
}

/**
 * Calls the real TMDB API and returns parsed JSON. GET-only convenience
 * wrapper around tmdbRequest, kept so existing routes (tmdb.routes.ts,
 * search.routes.ts) don't need to change.
 */
export async function tmdbFetch<T = unknown>(
  path: string,
  searchParams: Record<string, string | number | undefined> = {}
): Promise<T> {
  return tmdbRequest<T>(path, { searchParams });
}