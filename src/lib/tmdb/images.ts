// Image URL helpers for TMDB images. Works with demo data too (demo returns full URLs).

const IMG_BASE = "https://image.tmdb.org/t/p";

export function posterUrl(path: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string {
  if (!path) return "https://placehold.co/500x750/1a1a1a/e50914?text=No+Poster";
  if (path.startsWith("http")) return path;
  return `${IMG_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "https://placehold.co/1280x720/0a0a0c/ffc107?text=No+Backdrop";
  if (path.startsWith("http")) return path;
  return `${IMG_BASE}/${size}${path}`;
}

export function profileUrl(path: string | null, size: "w185" | "h632" | "original" = "w185"): string {
  if (!path) return "https://placehold.co/200x250/202027/ffc107?text=No+Photo";
  if (path.startsWith("http")) return path;
  return `${IMG_BASE}/${size}${path}`;
}

export function formatRuntime(minutes?: number): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatYear(date?: string): string {
  if (!date) return "—";
  return date.slice(0, 4);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
