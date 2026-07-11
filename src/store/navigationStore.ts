import { create } from 'zustand';

export type ViewName =
  | 'home'
  | 'movies'
  | 'series'
  | 'random'
  | 'favourites'
  | 'about'
  | 'movie'
  | 'signin'
  | 'signup'
  | 'profile';

interface NavigationState {
  view: ViewName;
  previousView: ViewName;
  selectedMovieId: number | null;
  setView: (view: ViewName) => void;
  openMovie: (id: number) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  view: 'home',
  previousView: 'home',
  selectedMovieId: null,

  setView: (view) =>
    set((state) => ({
      view,
      previousView: state.view,
      selectedMovieId: view === 'movie' ? state.selectedMovieId : null,
    })),

  openMovie: (id) =>
    set((state) => ({
      view: 'movie',
      previousView: state.view,
      selectedMovieId: id,
    })),

  goBack: () =>
    set((state) => ({
      view: state.previousView,
      selectedMovieId: state.view === 'movie' ? null : state.selectedMovieId,
    })),
}));