import { useOptimistic, startTransition } from "react";
import type { Movie } from "@/lib/tmdb/types";
import { useFavouritesStore } from "@/store";

export function useOptimisticFavourites() {
  const { favourites, toggleFavourite: actualToggleFavourite } = useFavouritesStore();

  // Optimistic state for favourites
  const [optimisticFavourites, addOptimisticFavourite] = useOptimistic<
    Movie[],
    { type: "add"; movie: Movie } | { type: "remove"; id: number }
  >(favourites, (state, action) => {
    if (action.type === "add") {
      // Add movie if not already present
      if (!state.some((m) => m.id === action.movie.id)) {
        return [...state, action.movie];
      }
      return state;
    } else {
      // Remove movie by ID
      return state.filter((m) => m.id !== action.id);
    }
  });

  // Optimistic toggle function.
  // The optimistic update must be dispatched inside startTransition — React
  // requires this so it knows the update is provisional and should be
  // reconciled against the "real" state once it settles. Without this,
  // React logs a dev warning and the update isn't tracked as optimistic at
  // all (it just happens to look right today because the store write below
  // is synchronous; it would visibly break the moment favourites sync
  // against a backend with real latency).
  function optimisticToggleFavourite(movie: Movie) {
    const isCurrentlyFavourite = optimisticFavourites.some((m) => m.id === movie.id);

    startTransition(() => {
      if (isCurrentlyFavourite) {
        addOptimisticFavourite({ type: "remove", id: movie.id });
      } else {
        addOptimisticFavourite({ type: "add", movie });
      }
      // Persist to the real store (localStorage today; a future backend
      // sync would go here too) inside the same transition.
      actualToggleFavourite(movie);
    });
  }

  // Derived from the optimistic list, not the raw store — so the "is this
  // favourited" check always matches what favourites/toggleFavourite report
  // from this hook, even before the underlying store catches up.
  function isOptimisticFavourite(id: number): boolean {
    return optimisticFavourites.some((m) => m.id === id);
  }

  return {
    favourites: optimisticFavourites,
    isFavourite: isOptimisticFavourite,
    toggleFavourite: optimisticToggleFavourite,
  };
}