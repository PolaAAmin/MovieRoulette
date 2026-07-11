import type { Genre } from '@/lib/tmdb/types';

/**
 * Genre utility functions
 */

export function getGenreName(genres: Genre[] | undefined, id?: number): string {
  if (!id || !genres?.length) return 'Movie';
  const genre = genres.find((g) => g.id === id);
  return genre?.name || 'Movie';
}

export function getGenreNames(genres: Genre[] | undefined, ids?: number[]): string[] {
  if (!ids?.length || !genres?.length) return ['Movie'];
  return ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

export function getGenreObjects(genres: Genre[] | undefined, ids?: number[]): Genre[] {
  if (!ids?.length || !genres?.length) return [];
  return ids
    .map((id) => genres.find((g) => g.id === id))
    .filter((g): g is Genre => Boolean(g));
}

export function getPrimaryGenre(genres: Genre[] | undefined, genreIds?: number[]): Genre | undefined {
  if (!genreIds?.length || !genres?.length) return undefined;
  return genres.find((g) => g.id === genreIds[0]);
}