import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearchQuery: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',

  setSearchQuery: (q) => set({ searchQuery: q }),

  clearSearchQuery: () => set({ searchQuery: '' }),
}));