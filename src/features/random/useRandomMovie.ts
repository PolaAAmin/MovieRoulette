import { use } from "react";
import type { Movie } from "@/lib/tmdb/types";
import { tmdbClient } from "@/lib/tmdb/client";

// Note: Random movie logic is complex and stateful, so we'll keep the existing logic
// but we can create a helper for the discovery part if needed
export function useRandomMovieDiscovery(params: any) {
  return use(tmdbClient.discover(params));
}

export function useRandomMovieDetails(id: number) {
  return use(tmdbClient.movieDetails(id));
}