import type { Movie, CastResponse, VideoResponse, MovieListResponse, Genre } from "./types";

// Curated demo data used when no TMDB_API_KEY is configured.
// Keeps the UI fully functional for preview purposes.

export const DEMO_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const P = (seed: string) =>
  `https://placehold.co/500x750/1a1a1a/e50914?text=${encodeURIComponent(seed)}`;
const B = (seed: string) =>
  `https://placehold.co/1280x720/0a0a0c/ffc107?text=${encodeURIComponent(seed)}`;

interface SeedMovie extends Movie {
  _genres: number[];
}

export const DEMO_MOVIES: SeedMovie[] = [
  {
    id: 101,
    title: "Velocity Run",
    overview:
      "A former stunt driver gets pulled into a one-night chase across the city to stop a high-tech robbery.",
    poster_path: P("Velocity Run"),
    backdrop_path: B("Velocity Run"),
    release_date: "2024-06-14",
    vote_average: 8.6,
    vote_count: 1842,
    runtime: 125,
    original_language: "en",
    popularity: 98,
    _genres: [28, 53],
    genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }],
    tagline: "One night. One city. No brakes.",
  },
  {
    id: 102,
    title: "Glass Letters",
    overview:
      "A journalist uncovers a family secret through decades of unsent letters and one final interview.",
    poster_path: P("Glass Letters"),
    backdrop_path: B("Glass Letters"),
    release_date: "2023-11-02",
    vote_average: 8.9,
    vote_count: 2104,
    runtime: 116,
    original_language: "en",
    popularity: 91,
    _genres: [18],
    genres: [{ id: 18, name: "Drama" }],
    tagline: "Every letter has a destination.",
  },
  {
    id: 103,
    title: "Orbit Code",
    overview:
      "Engineers aboard a failing station race to decode a message that may rewrite human survival.",
    poster_path: P("Orbit Code"),
    backdrop_path: B("Orbit Code"),
    release_date: "2025-03-21",
    vote_average: 8.4,
    vote_count: 1455,
    runtime: 131,
    original_language: "ko",
    popularity: 95,
    _genres: [878, 12],
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }],
    tagline: "The signal was never meant for us.",
  },
  {
    id: 104,
    title: "Skyline Tales",
    overview:
      "Two young inventors build a flying city from scraps and learn what home really means.",
    poster_path: P("Skyline Tales"),
    backdrop_path: B("Skyline Tales"),
    release_date: "2022-08-19",
    vote_average: 8.2,
    vote_count: 980,
    runtime: 104,
    original_language: "es",
    popularity: 87,
    _genres: [16, 10751],
    genres: [{ id: 16, name: "Animation" }, { id: 10751, name: "Family" }],
    tagline: "Dream it. Build it. Fly.",
  },
  {
    id: 105,
    title: "Shadow Protocol",
    overview:
      "An ex-agent returns for one final mission when a digital weapon begins targeting civilians.",
    poster_path: P("Shadow Protocol"),
    backdrop_path: B("Shadow Protocol"),
    release_date: "2021-05-07",
    vote_average: 7.9,
    vote_count: 1320,
    runtime: 120,
    original_language: "en",
    popularity: 82,
    _genres: [28, 53],
    genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }],
    tagline: "No name. No trace. No mercy.",
  },
  {
    id: 106,
    title: "After the Rain",
    overview:
      "A father and daughter reconnect while rebuilding their flood-damaged neighborhood theater.",
    poster_path: P("After the Rain"),
    backdrop_path: B("After the Rain"),
    release_date: "2025-01-30",
    vote_average: 9.1,
    vote_count: 1670,
    runtime: 128,
    original_language: "en",
    popularity: 96,
    _genres: [18],
    genres: [{ id: 18, name: "Drama" }],
    tagline: "Some things grow stronger after the storm.",
  },
  {
    id: 107,
    title: "Neon Requiem",
    overview:
      "In a neon-soaked megacity, a disillusioned hacker hunts the AI that erased her brother.",
    poster_path: P("Neon Requiem"),
    backdrop_path: B("Neon Requiem"),
    release_date: "2024-10-11",
    vote_average: 8.0,
    vote_count: 1190,
    runtime: 138,
    original_language: "en",
    popularity: 90,
    _genres: [878, 28, 53],
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 28, name: "Action" }, { id: 53, name: "Thriller" }],
    tagline: "Delete the past. Rewrite the future.",
  },
  {
    id: 108,
    title: "The Last Cartographer",
    overview:
      "A mapmaker discovers an uncharted island that may hold the key to a forgotten civilization.",
    poster_path: P("The Last Cartographer"),
    backdrop_path: B("The Last Cartographer"),
    release_date: "2023-07-04",
    vote_average: 7.7,
    vote_count: 870,
    runtime: 122,
    original_language: "en",
    popularity: 78,
    _genres: [12, 14],
    genres: [{ id: 12, name: "Adventure" }, { id: 14, name: "Fantasy" }],
    tagline: "Every map ends somewhere.",
  },
  {
    id: 109,
    title: "Midnight Bakery",
    overview:
      "A small-town baker and a traveling musician find love over a single unforgettable summer.",
    poster_path: P("Midnight Bakery"),
    backdrop_path: B("Midnight Bakery"),
    release_date: "2022-02-12",
    vote_average: 7.5,
    vote_count: 640,
    runtime: 98,
    original_language: "en",
    popularity: 70,
    _genres: [10749, 35],
    genres: [{ id: 10749, name: "Romance" }, { id: 35, name: "Comedy" }],
    tagline: "Love rises like dough.",
  },
  {
    id: 110,
    title: "Crimson Verdict",
    overview:
      "A defense attorney uncovers a conspiracy that reaches the highest levels of the justice system.",
    poster_path: P("Crimson Verdict"),
    backdrop_path: B("Crimson Verdict"),
    release_date: "2024-09-20",
    vote_average: 8.3,
    vote_count: 1410,
    runtime: 134,
    original_language: "en",
    popularity: 88,
    _genres: [80, 18, 53],
    genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }],
    tagline: "The truth is on trial.",
  },
  {
    id: 111,
    title: "Whispers in Static",
    overview:
      "A radio host begins receiving transmissions from a town that vanished thirty years ago.",
    poster_path: P("Whispers in Static"),
    backdrop_path: B("Whispers in Static"),
    release_date: "2023-10-13",
    vote_average: 7.4,
    vote_count: 510,
    runtime: 108,
    original_language: "en",
    popularity: 66,
    _genres: [27, 9648],
    genres: [{ id: 27, name: "Horror" }, { id: 9648, name: "Mystery" }],
    tagline: "Some frequencies never die.",
  },
  {
    id: 112,
    title: "Golden Hour Heist",
    overview:
      "A charming thief assembles a ragtag crew to pull off an impossible sunset robbery.",
    poster_path: P("Golden Hour Heist"),
    backdrop_path: B("Golden Hour Heist"),
    release_date: "2025-05-02",
    vote_average: 8.1,
    vote_count: 990,
    runtime: 117,
    original_language: "en",
    popularity: 93,
    _genres: [28, 35, 12],
    genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }, { id: 12, name: "Adventure" }],
    tagline: "Steal the sunset.",
  },
];

const DEMO_CAST: Record<number, CastResponse> = DEMO_MOVIES.reduce((acc, m) => {
  acc[m.id] = {
    id: m.id,
    cast: Array.from({ length: 8 }).map((_, i) => ({
      id: m.id * 100 + i,
      name: ["Alex Carter", "Mia Sterling", "Devon Park", "Lena Frost", "Marcus Reed", "Sofa Vidal", "Noah Kim", "Ivy Blanchard"][i],
      character: ["The Lead", "The Ally", "The Antagonist", "The Mentor", "The Rogue", "The Strategist", "The Witness", "The Ghost"][i],
      profile_path: `https://placehold.co/200x250/202027/ffc107?text=${encodeURIComponent("Actor " + (i + 1))}`,
      order: i,
    })),
    crew: [
      { id: 1, name: "Jordan Vale", job: "Director", department: "Directing" },
      { id: 2, name: "Riley Cohen", job: "Screenplay", department: "Writing" },
    ],
  };
  return acc;
}, {} as Record<number, CastResponse>);

export function demoTrending(): MovieListResponse {
  const sorted = [...DEMO_MOVIES].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  return { page: 1, results: sorted.slice(0, 6), total_pages: 1, total_results: sorted.length };
}

export function demoTopRated(): MovieListResponse {
  const sorted = [...DEMO_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  return { page: 1, results: sorted, total_pages: 1, total_results: sorted.length };
}

export function demoPopular(): MovieListResponse {
  const sorted = [...DEMO_MOVIES].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  return { page: 1, results: sorted, total_pages: 1, total_results: sorted.length };
}

export function demoDiscover(params: Record<string, string | number | undefined>): MovieListResponse {
  let list = [...DEMO_MOVIES];
  const genres = params.with_genres as string | undefined;
  const lang = params.with_original_language as string | undefined;
  const ratingGte = Number(params["vote_average.gte"] ?? 0);
  const ratingLte = Number(params["vote_average.lte"] ?? 10);
  const yearGte = params["primary_release_date.gte"] as string | undefined;
  const yearLte = params["primary_release_date.lte"] as string | undefined;
  const rtGte = Number(params["with_runtime.gte"] ?? 0);
  const rtLte = Number(params["with_runtime.lte"] ?? 999);

  if (genres && genres !== "") {
    // TMDB uses both , (AND) and | (OR) as separators. We treat them as OR
    // (a movie matches if it has ANY of the selected genres).
    const ids = genres.split(/[,|]/).map(Number).filter((n) => !Number.isNaN(n));
    if (ids.length > 0) {
      list = list.filter((m) => ids.some((id) => (m._genres || []).includes(id)));
    }
  }
  if (lang) {
    list = list.filter((m) => m.original_language === lang);
  }
  list = list.filter((m) => m.vote_average >= ratingGte && m.vote_average <= ratingLte);
  if (yearGte) list = list.filter((m) => m.release_date >= yearGte);
  if (yearLte) list = list.filter((m) => m.release_date <= yearLte);
  list = list.filter((m) => (m.runtime ?? 0) >= rtGte && (m.runtime ?? 0) <= rtLte);

  const sort = params.sort_by as string | undefined;
  if (sort === "vote_average.desc") list.sort((a, b) => b.vote_average - a.vote_average);
  else if (sort === "primary_release_date.desc") list.sort((a, b) => b.release_date.localeCompare(a.release_date));
  else list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  return { page: 1, results: list, total_pages: 1, total_results: list.length };
}

export function demoMovieDetails(id: number): Movie | null {
  const m = DEMO_MOVIES.find((x) => x.id === id);
  if (!m) return null;
  const { _genres, ...rest } = m;
  return rest;
}

export function demoCast(id: number): CastResponse | null {
  return DEMO_CAST[id] || null;
}

export function demoVideos(id: number): VideoResponse {
  return {
    id,
    results: [
      {
        id: `demo-${id}`,
        key: "2h9CqRlHzrc",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  };
}

export function demoSimilar(id: number): MovieListResponse {
  const m = DEMO_MOVIES.find((x) => x.id === id);
  if (!m) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  const similar = DEMO_MOVIES.filter(
    (x) => x.id !== id && (x._genres || []).some((g) => (m._genres || []).includes(g))
  ).slice(0, 8);
  return { page: 1, results: similar, total_pages: 1, total_results: similar.length };
}

export function demoSearch(query: string): MovieListResponse {
  const q = query.toLowerCase();
  const list = DEMO_MOVIES.filter(
    (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  );
  return { page: 1, results: list, total_pages: 1, total_results: list.length };
}
