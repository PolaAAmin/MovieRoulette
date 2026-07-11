/**
 * Sort keys exposed in the MovieListPage UI, mapped to TMDB's
 * `sort_by` parameter. Movie and TV use different date fields
 * (`primary_release_date` vs `first_air_date`).
 */
export type SortKey = "popular" | "rating" | "newest";

export const MOVIE_SORT: Record<SortKey, string> = {
  popular: "popularity.desc",
  rating: "vote_average.desc",
  newest: "primary_release_date.desc",
};

export const TV_SORT: Record<SortKey, string> = {
  popular: "popularity.desc",
  rating: "vote_average.desc",
  newest: "first_air_date.desc",
};
