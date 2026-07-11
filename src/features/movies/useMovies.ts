import { use } from "react";
import type { Movie, Genre } from "@/lib/tmdb/types";
import { tmdbClient } from "@/lib/tmdb/client";

// ---------------------------------------------------------------------------
// Why this cache exists:
// React's `use()` suspends on a *promise object*, not on the arguments you
// used to create it. If a component creates a brand-new promise every render
// (even for identical arguments), it will suspend on every render forever —
// it never sees "the same" promise settle, because it's always handed a
// fresh, unresolved one. `createCache` makes sure calls with the same
// (stringified) arguments reuse the same in-flight/resolved promise, so
// `use()` only suspends once per unique query, not once per render.
// ---------------------------------------------------------------------------
function createCache<Args, T>(fetcher: (args: Args) => Promise<T>, keyFn: (args: Args) => string) {
  const cache = new Map<string, Promise<T>>();
  return (args: Args): Promise<T> => {
    const key = keyFn(args);
    let entry = cache.get(key);
    if (!entry) {
      entry = fetcher(args);
      cache.set(key, entry);
      // If the request fails, drop it from the cache so the next render
      // (or a manual retry) triggers a fresh fetch instead of being stuck
      // replaying the same rejected promise forever.
      entry.catch(() => cache.delete(key));
    }
    return entry;
  };
}

// Normalizes a params object into a stable string key regardless of key
// order, and drops `undefined` values so `{a:1, b:undefined}` and `{a:1}`
// hash identically.
function stableParamsKey(params: Record<string, unknown>): string {
  const sortedEntries = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined)
    .map((k) => [k, params[k]] as const);
  return JSON.stringify(sortedEntries);
}

// Module-level singletons — fetched once on load, shared by every consumer.
const genresPromise = tmdbClient.genres();
const trendingPromise = tmdbClient.trending();

// Parameterized fetchers — cached per unique key.
const getPopular = createCache(
  (page: number) => tmdbClient.popular(page),
  (page) => `popular:${page}`
);
const getTopRated = createCache(
  (page: number) => tmdbClient.topRated(page),
  (page) => `topRated:${page}`
);
const getDiscover = createCache((params: any) => tmdbClient.discover(params), stableParamsKey);
const getDiscoverTV = createCache((params: any) => tmdbClient.discoverTV(params), stableParamsKey);
const getSearch = createCache(
  (q: string) => tmdbClient.search(q),
  (q) => `search:${q}`
);
const getMovieDetails = createCache(
  (id: number) => tmdbClient.movieDetails(id),
  (id) => `details:${id}`
);
const getMovieCredits = createCache(
  (id: number) => tmdbClient.movieCredits(id),
  (id) => `credits:${id}`
);
const getMovieVideos = createCache(
  (id: number) => tmdbClient.movieVideos(id),
  (id) => `videos:${id}`
);
const getSimilarMovies = createCache(
  (id: number) => tmdbClient.similarMovies(id),
  (id) => `similar:${id}`
);

export function useGenres() {
  return use(genresPromise);
}

export function useTrending() {
  return use(trendingPromise);
}

export function usePopular(page = 1) {
  return use(getPopular(page));
}

export function useTopRated(page = 1) {
  return use(getTopRated(page));
}

export function useDiscover(params: any) {
  return use(getDiscover(params));
}

export function useDiscoverTV(params: any) {
  return use(getDiscoverTV(params));
}

export function useSearch(q: string) {
  return use(getSearch(q));
}

export function useMovieDetails(id: number) {
  return use(getMovieDetails(id));
}

export function useMovieCredits(id: number) {
  return use(getMovieCredits(id));
}

export function useMovieVideos(id: number) {
  return use(getMovieVideos(id));
}

export function useSimilarMovies(id: number) {
  return use(getSimilarMovies(id));
}