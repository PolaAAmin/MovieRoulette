import type { Genre } from "@/lib/tmdb/types";

/**
 * Fallback genre list shown when the live TMDB `/genre/movie/list` call
 * fails or returns empty. Mirrors the most common discovery genres.
 */
export const DEFAULT_GENRES: readonly Genre[] = [
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
] as const;
