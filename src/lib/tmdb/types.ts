// TMDB type definitions

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  original_language?: string;
  popularity?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  homepage?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CastResponse {
  id: number;
  cast: CastMember[];
  crew: { id: number; name: string; job: string; department: string }[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverParams {
  with_genres?: string;
  with_original_language?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  sort_by?: string;
  page?: number;
  "vote_count.gte"?: number;
  include_adult?: boolean;
}

// ============ TV Series ============
// TMDB TV items use name/first_air_date instead of title/release_date.
// We normalize to the Movie shape in the server layer so the UI can reuse
// the same components, but expose the TV-specific discover params here.

export interface DiscoverTVParams {
  with_genres?: string;
  with_original_language?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  sort_by?: string;
  page?: number;
  "vote_count.gte"?: number;
  include_adult?: boolean;
}
