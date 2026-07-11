/**
 * Supported original-language filter values for TMDB `with_original_language`.
 * The superset covers everything currently used by RandomPage and MovieListPage.
 */
export interface Language {
  value: string;
  label: string;
}

export const LANGUAGES: readonly Language[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "Korean" },
  { value: "es", label: "Spanish" },
  { value: "ja", label: "Japanese" },
  { value: "fr", label: "French" },
  { value: "hi", label: "Hindi" },
  { value: "ar", label: "Arabic" },
] as const;
