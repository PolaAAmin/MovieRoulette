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

  movieDetails: (id: number) => fetchApi<Movie | null>(`/api/tmdb/movie/${id}`),

  movieCredits: (id: number) => fetchApi<CastResponse | null>(`/api/tmdb/movie/${id}/credits`),

  movieVideos: (id: number) => fetchApi<VideoResponse>(`/api/tmdb/movie/${id}/videos`),

  similarMovies: (id: number) => fetchApi<MovieListResponse>(`/api/tmdb/movie/${id}/similar`),

  search: (q: string) => fetchApi<MovieListResponse>(`/api/search?q=${encodeURIComponent(q)}`),
};
