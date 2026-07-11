
import type {
  Movie,
  CastResponse,
  VideoResponse,
  MovieListResponse,
  Genre,
  DiscoverParams,
  DiscoverTVParams,
} from "./types";
import {
  DEMO_GENRES,
  demoTrending,
  demoTopRated,
  demoPopular,
  demoDiscover,
  demoMovieDetails,
  demoCast,
  demoVideos,
  demoSimilar,
  demoSearch,
} from "./demo-data";

const TMDB_BASE = "https://api.themoviedb.org/3";

function hasKey(): boolean {
  return Boolean(process.env.TMDB_API_KEY);
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY not configured");
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  // Use Bearer token (v4 read access token) — works with all v3 endpoints.
  // Falls back gracefully if the key is a legacy v3 api_key string.
  const useBearer = key.includes(".");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (useBearer) {
    headers["Authorization"] = `Bearer ${key}`;
  } else {
    url.searchParams.set("api_key", key);
  }
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  if (!hasKey()) return { genres: DEMO_GENRES };
  return tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
}

export async function getTrending(): Promise<MovieListResponse> {
  if (!hasKey()) return demoTrending();
  return tmdbFetch<MovieListResponse>("/trending/movie/week");
}

export async function getPopular(page = 1): Promise<MovieListResponse> {
  if (!hasKey()) return demoPopular();
  return tmdbFetch<MovieListResponse>("/movie/popular", { page });
}

export async function getTopRated(page = 1): Promise<MovieListResponse> {
  if (!hasKey()) return demoTopRated();
  return tmdbFetch<MovieListResponse>("/movie/top_rated", { page });
}

export async function discoverMovies(params: DiscoverParams): Promise<MovieListResponse> {
  if (!hasKey()) return demoDiscover(params as Record<string, string | number | undefined>);
  return tmdbFetch<MovieListResponse>("/discover/movie", {
    ...params,
    "vote_count.gte": params["vote_count.gte"] ?? 80,
    include_adult: "false",
  });
}

export async function getMovieDetails(id: number): Promise<Movie | null> {
  if (!hasKey()) return demoMovieDetails(id);
  try {
    return await tmdbFetch<Movie>(`/movie/${id}`);
  } catch {
    return null;
  }
}

export async function getMovieCast(id: number): Promise<CastResponse | null> {
  if (!hasKey()) return demoCast(id);
  try {
    return await tmdbFetch<CastResponse>(`/movie/${id}/credits`);
  } catch {
    return null;
  }
}

export async function getMovieVideos(id: number): Promise<VideoResponse> {
  if (!hasKey()) return demoVideos(id);
  try {
    return await tmdbFetch<VideoResponse>(`/movie/${id}/videos`);
  } catch {
    return { id, results: [] };
  }
}

export async function getSimilarMovies(id: number): Promise<MovieListResponse> {
  if (!hasKey()) return demoSimilar(id);
  try {
    return await tmdbFetch<MovieListResponse>(`/movie/${id}/similar`);
  } catch {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

export async function searchMovies(query: string, page = 1): Promise<MovieListResponse> {
  if (!hasKey() || !query.trim()) return demoSearch(query);
  return tmdbFetch<MovieListResponse>("/search/movie", { query, page, include_adult: "false" });
}

// ============ TV Series ============
// TMDB TV items use `name` / `first_air_date` instead of `title` / `release_date`.
// We normalize them to the Movie shape so the UI components can stay unchanged.

interface RawTVItem {
  id: number;
  name?: string;
  original_name?: string;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: Genre[];
  original_language?: string;
  popularity?: number;
  tagline?: string;
  status?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  homepage?: string;
  runtime?: number;
  episode_run_time?: number[];
}

function normalizeTV(item: RawTVItem): Movie {
  return {
    id: item.id,
    title: item.name || item.title || item.original_name || "Untitled",
    original_title: item.original_name,
    overview: item.overview || "",
    poster_path: item.poster_path ?? null,
    backdrop_path: item.backdrop_path ?? null,
    release_date: item.first_air_date || item.release_date || "",
    vote_average: item.vote_average ?? 0,
    vote_count: item.vote_count ?? 0,
    genre_ids: item.genre_ids,
    genres: item.genres,
    runtime: item.episode_run_time?.[0] ?? item.runtime,
    original_language: item.original_language,
    popularity: item.popularity,
    tagline: item.tagline,
    status: item.status,
    production_companies: item.production_companies,
    homepage: item.homepage,
  };
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  if (!hasKey()) return { genres: DEMO_GENRES };
  return tmdbFetch<{ genres: Genre[] }>("/genre/tv/list");
}

export async function discoverTV(params: DiscoverTVParams): Promise<MovieListResponse> {
  if (!hasKey()) {
    // Reuse movie demo data for the no-key fallback so the UI still works.
    return demoDiscover(params as Record<string, string | number | undefined>);
  }
  const raw = await tmdbFetch<MovieListResponse & { results: RawTVItem[] }>("/discover/tv", {
    ...params,
    "vote_count.gte": params["vote_count.gte"] ?? 80,
    include_adult: "false",
  });
  return {
    ...raw,
    results: raw.results.map(normalizeTV),
  };
}

export async function searchTV(query: string, page = 1): Promise<MovieListResponse> {
  if (!hasKey() || !query.trim()) return demoSearch(query);
  const raw = await tmdbFetch<MovieListResponse & { results: RawTVItem[] }>("/search/tv", {
    query,
    page,
    include_adult: "false",
  });
  return {
    ...raw,
    results: raw.results.map(normalizeTV),
  };
}

export function tmdbConfigured(): boolean {
  return hasKey();
}
