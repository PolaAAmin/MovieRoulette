/**
 * Mood → TMDB genre id mapping used by the Random Movie generator.
 * Genre ids follow TMDB's official movie genre list.
 */
export type MoodId =
  | "happy"
  | "sad"
  | "chill"
  | "romantic"
  | "funny"
  | "chaotic";

export interface Mood {
  id: MoodId;
  label: string;
  /** TMDB genre ids that satisfy this mood. */
  genres: readonly number[];
}

export const MOODS: readonly Mood[] = [
  { id: "happy", label: "Happy", genres: [35, 10751] },
  { id: "sad", label: "Sad", genres: [18] },
  { id: "chill", label: "Chill", genres: [99, 35] },
  { id: "romantic", label: "Romantic", genres: [10749] },
  { id: "funny", label: "Funny", genres: [35] },
  { id: "chaotic", label: "Chaotic", genres: [28, 53] },
] as const;

/** O(1) lookup: mood id → genre ids. */
export const MOOD_GENRE_MAP: Record<MoodId, readonly number[]> = Object.fromEntries(
  MOODS.map((m) => [m.id, m.genres]),
) as Record<MoodId, readonly number[]>;
