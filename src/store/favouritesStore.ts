import { create } from 'zustand';
import type { Movie } from '@/lib/tmdb/types';

export type FavouriteItem = Movie;

interface FavouritesState {
  favourites: FavouriteItem[];
  loadFavourites: () => void;
  toggleFavourite: (movie: Movie) => void;
  isFavourite: (id: number) => boolean;
  clearFavourites: () => void;
}

const FAV_KEY = 'movieroulette:favourites';

function readFavs(): FavouriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as FavouriteItem[]) : [];
  } catch {
    return [];
  }
}

function writeFavs(favs: FavouriteItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  favourites: [],

  loadFavourites: () => set({ favourites: readFavs() }),

  toggleFavourite: (movie) => {
    const current = get().favourites;
    const exists = current.some((m) => m.id === movie.id);
    const next = exists
      ? current.filter((m) => m.id !== movie.id)
      : [...current, movie];
    writeFavs(next);
    set({ favourites: next });
  },

  isFavourite: (id) => get().favourites.some((m) => m.id === id),

  clearFavourites: () => {
    writeFavs([]);
    set({ favourites: [] });
  },
}));