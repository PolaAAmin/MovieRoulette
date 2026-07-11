"use client";

import React, { useState } from "react";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import type { Genre, Movie } from "@/lib/tmdb/types";
import { useSearchStore, useFavouritesStore } from "@/store";
import { posterUrl, formatRating, formatYear, formatRuntime } from "@/lib/tmdb/images";
import { toast } from "sonner";
import { MovieTileSkeletonGrid } from "@/components/ui/Skeletons";
import MultiSelect from "@/components/ui/MultiSelect";
import {
  DEFAULT_GENRES,
  LANGUAGES,
  MOVIE_SORT,
  TV_SORT,
  type SortKey,
} from "@/lib/constants";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Import the new suspense-enabled hooks
import { useGenres, useDiscover, useDiscoverTV, useSearch } from "@/features/movies/useMovies";
// Import the optimistic favourites hook
import { useOptimisticFavourites } from "@/features/favourites";

type MediaType = "movie" | "series";

export default function MovieListPage({ mediaType = "movie" }: { mediaType?: MediaType }) {
  const isTV = mediaType === "series";
  const navigate = useNavigate();
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const { optimisticFavourites, isFavourite, toggleFavourite: optimisticToggleFavourite } = useOptimisticFavourites();

  // Load genres using suspense
  const genresResult = useGenres();

  // Set up genre list with fallback
  const genres = genresResult?.genres || [];
  const genreList = genres.length > 0 ? genres : [...DEFAULT_GENRES];

  // Initialize genre selections
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearFrom, setYearFrom] = useState(1970);
  const [langs, setLangs] = useState<string[]>(["en"]);
  const [sort, setSort] = useState<SortKey>("popular");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Prepare parameters for discover API
  const genreStr =
    selectedGenres.length > 0 ? selectedGenres.join("|") : undefined;
  const sortKey = isTV ? TV_SORT[sort] : MOVIE_SORT[sort];
  const languageParam = langs.length === 1 ? langs[0] : undefined;

  // Build discover params
  const discoverParams = {
    with_genres: genreStr,
    with_original_language: languageParam,
    ...(yearFrom > 1970
      ? {
          [isTV ? "first_air_date.gte" : "primary_release_date.gte"]: `${yearFrom}-01-01`,
        }
      : {}),
    sort_by: sortKey,
    ...(sort === "rating" ? { "vote_average.gte": 5 } : {}),
    page,
  };

  // Fetch data using suspense-enabled hooks
  let movies: Movie[] = [];
  let total: number = 0;

  if (searchQuery.trim()) {
    // Use the suspense-enabled search hook
    const searchResults = useSearch(searchQuery);
    movies = (searchResults?.results || []).filter((m: Movie) => m.poster_path || m.backdrop_path);
    total = searchResults?.total_pages || 0;
  } else {
    // Discover mode
    if (isTV) {
      const discoverResults = useDiscoverTV(discoverParams);
      movies = (discoverResults?.results || []).filter((m: Movie) => m.poster_path || m.backdrop_path);
      total = discoverResults?.total_pages || 0;
    } else {
      const discoverResults = useDiscover(discoverParams);
      movies = (discoverResults?.results || []).filter((m: Movie) => m.poster_path || m.backdrop_path);
      total = discoverResults?.total_pages || 0;
    }
  }

  // Set total pages (this runs after suspense resolves)
  React.useEffect(() => {
    if (total > 0) {
      setTotalPages(total);
    }
  }, [total]);

  const genreName = (id?: number): string => {
    if (!id) return isTV ? "Series" : "Movie";
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : isTV ? "Series" : "Movie";
  };

  function toggleLang(v: string) {
    setLangs((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    setPage(1);
  }

  function reset() {
    setSelectedGenres([]);
    setYearFrom(1970);
    setLangs(["en"]);
    setSort("popular");
    setPage(1);
  }

  const itemLabel = isTV ? "series" : "movies";
  const pageTitle = isTV ? "Browse series" : "Browse movies";
  const eyebrow = isTV ? "Series Catalog" : "Movie Catalog";

  return (
    <ErrorBoundary fallback={<div>Failed to load movie list.</div>}>
      <div className="movie-list-page">
        <main className="movie-list-main">
          <div className="container">
            <section className="page-intro">
              <span className="eyebrow">{eyebrow}</span>
              <h1>{pageTitle}</h1>
              <p>
                {searchQuery
                  ? <>Filtered by your search: &ldquo;{searchQuery}&rdquo;</>
                  : `Browse ${itemLabel} and sort them your way.`}
              </p>
            </section>

            <section className="catalog-shell">
              <aside className="filter-panel glass-panel">
                <div className="panel-title">
                  <h2>Filters</h2>
                  <button className="reset-btn" type="button" onClick={reset}>
                    Reset
                  </button>
                </div>

                <div className="filter-group">
                  <h3>Genre</h3>
                  <MultiSelect
                    id="list-genre"
                    options={genreList.map((g) => ({ value: String(g.id), label: g.name }))}
                    selected={selectedGenres.map(String)}
                    onChange={(vals: string[]) => {
                      setSelectedGenres(vals.map(Number));
                      setPage(1);
                    }}
                    placeholder="All genres"
                  />
                </div>

                <div className="filter-group">
                  <h3>{isTV ? "First Air Year" : "Release Year"}</h3>
                  <input
                    type="range"
                    min={1970}
                    max={2026}
                    value={yearFrom}
                    onChange={(e) => {
                      setYearFrom(Number(e.target.value));
                      setPage(1);
                    }}
                  />
                  <div className="range-display">From <span>{yearFrom}+</span></div>
                </div>

                <div className="filter-group">
                  <h3>Language</h3>
                  {LANGUAGES.map((l) => (
                    <label className="filter-check" key={l.value}>
                      <input
                        type="checkbox"
                        value={l.value}
                        checked={langs.includes(l.value)}
                        onChange={() => {
                          toggleLang(l.value);
                          setPage(1);
                        }}
                      />
                      {l.label}
                    </label>
                  ))}
                </div>
              </aside>

              <section className="results-panel glass-panel">
                <div className="results-toolbar">
                  <div>
                    <h2>
                      {searchQuery ? "Search Results" : isTV ? "Series Results" : "Movie Results"}
                    </h2>
                    <p>
                      {movies.length} {itemLabel} found
                    </p>
                  </div>
                  <div className="sort-list">
                    {([
                      "popular",
                      "rating",
                      "newest",
                    ] as SortKey[]).map((s) => (
                      <button
                        key={s}
                        className={`sort-btn ${sort === s ? "active" : ""}`}
                        onClick={() => {
                          setSort(s);
                          setPage(1);
                        }}
                        disabled={Boolean(searchQuery)}
                      >
                        {s === "popular" ? "Popular" : s === "rating" ? "Top Rated" : "Newest"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading state handled by Suspense in routes.tsx */}
                {movies.length > 0 ? (
                  <>
                    <div className="movies-grid">
                      {movies.map((m) => (
                        <MovieTile
                          key={m.id}
                          movie={m}
                          genreName={genreName(m.genre_ids?.[0])}
                          onOpen={() => navigate(`/movie/${m.id}`)}
                          isFavourite={isFavourite}
                          toggleFavourite={optimisticToggleFavourite}
                        />
                      ))}
                    </div>

                    {!searchQuery && totalPages > 1 && (
                      <div className="d-flex justify-content-center gap-2 mt-4">
                        <button
                          className="ghost-btn"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          <i className="bi bi-chevron-left" /> Prev
                        </button>
                        <span className="align-self-center" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                          Page {page} / {totalPages}
                        </span>
                        <button
                          className="ghost-btn"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                          Next <i className="bi bi-chevron-right" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-search" style={{ fontSize: "2.5rem", color: "var(--color-text-muted)" }} />
                    <p className="mt-3" style={{ color: "var(--color-text-primary)", fontSize: "1.1rem" }}>
                      No {itemLabel} match these filters
                    </p>
                    <p style={{ color: "var(--color-text-muted)" }}>
                      Try adjusting your filters or hit Reset.
                    </p>
                  </div>
                )}
              </section>
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function MovieTile({
  movie,
  genreName,
  onOpen,
  isFavourite,
  toggleFavourite,
}: {
  movie: Movie;
  genreName: string;
  onOpen: () => void;
  isFavourite: (id: number) => boolean;
  toggleFavourite: (movie: Movie) => void;
}) {
  const fav = isFavourite(movie.id);

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFavourite(movie);
    toast(fav ? "Removed from Favourites" : "Added to Favourites", {
      description: movie.title,
      duration: 2200,
    });
  }

  return (
    <article
      className="movie-tile glass-panel"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
    >
      <div className="movie-tile-poster-wrap position-relative">
        <img src={posterUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
        <button
          className={`movie-card-fav ${fav ? "active" : ""}`}
          onClick={handleFav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
        >
          <i className={fav ? "bi bi-heart-fill" : "bi bi-heart"} />
        </button>
      </div>
      <div>
        <div className="movie-badges">
          <span className="genre-badge">{genreName}</span>
          <span className="rating-badge">
            <i className="bi bi-star-fill" /> {formatRating(movie.vote_average)}
          </span>
          <span className="info-badge">{movie.original_language?.toUpperCase() || "EN"}</span>
        </div>
        <h3 className="mt-3">{movie.title}</h3>
        <p>{movie.overview}</p>
        <div className="movie-facts">
          <span>{formatYear(movie.release_date)}</span>
          <span>{formatRuntime(movie.runtime)}</span>
        </div>
      </div>
    </article>
  );
}