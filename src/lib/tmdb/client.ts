import type {
  Movie,
  CastResponse,
  VideoResponse,
  MovieListResponse,
  Genre,
  DiscoverParams,
  DiscoverTVParams,
} from "./types";

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}

export const tmdbClient = {
  genres: () => fetchApi<{ genres: Genre[] }>("/api/tmdb/genres"),

  trending: () => fetchApi<MovieListResponse>("/api/tmdb/trending"),

  popular: (page = 1) => fetchApi<MovieListResponse>(`/api/tmdb/popular?page=${page}`),

  topRated: (page = 1) => fetchApi<MovieListResponse>(`/api/tmdb/top-rated?page=${page}`),

  discover: (params: DiscoverParams) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
    }
    return fetchApi<MovieListResponse>(`/api/tmdb/discover?${sp.toString()}`);
  },

  tvGenres: () => fetchApi<{ genres: Genre[] }>("/api/tmdb/tv-genres"),

  discoverTV: (params: DiscoverTVParams) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
    }
    return fetchApi<MovieListResponse>(`/api/tmdb/tv-discover?${sp.toString()}`);
  },

  // Changed from /api/tmdb/movie/:id (nested path) to /api/tmdb/movie-details?id=
  // (flat + query param) — Vercel's catch-all function routing was not
  // reliably matching multi-segment paths like movie/123/credits, only
  // single-segment ones like genres or discover. Every /api/tmdb/* route is
  // now exactly one path segment, matching the shape that's proven to work.
  movieDetails: (id: number) => fetchApi<Movie | null>(`/api/tmdb/movie-details?id=${id}`),

  movieCredits: (id: number) => fetchApi<CastResponse | null>(`/api/tmdb/movie-credits?id=${id}`),

  movieVideos: (id: number) => fetchApi<VideoResponse>(`/api/tmdb/movie-videos?id=${id}`),

  similarMovies: (id: number) => fetchApi<MovieListResponse>(`/api/tmdb/movie-similar?id=${id}`),

  search: (q: string) => fetchApi<MovieListResponse>(`/api/search?q=${encodeURIComponent(q)}`),
};