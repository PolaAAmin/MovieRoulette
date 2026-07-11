import { useNavigate } from "react-router-dom";
import type { Movie, Genre } from "@/lib/tmdb/types";
import { useGenres, useTrending } from "@/features/movies/useMovies";
import { useSearchStore } from "@/store";
import { posterUrl, formatYear } from "@/lib/tmdb/images";
import MovieCard from "../movie/MovieCard";
import { MovieCardSkeletonGrid } from "@/components/ui/Skeletons";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import React from "react";

// Helper component for search results
function SearchResults({ query, genreName }: { query: string; genreName: (ids?: number[]) => string }) {
  const [results, setResults] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Import here to avoid circular dependency issues
        const { tmdbClient } = await import("@/lib/tmdb/client");
        const searchResults = await tmdbClient.search(query);
        if (active) {
          setResults(searchResults.results.filter((m: Movie) => m.poster_path));
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError("Failed to search for movies");
          setLoading(false);
        }
      }
    };

    fetchResults();
    return () => {
      active = false;
    };
  }, [query]);

  if (loading) return <MovieCardSkeletonGrid count={4} />;
  if (error) return <p className="home-section-subtext">{error}</p>;
  if (results.length === 0)
    return <p className="home-section-subtext">No matches. Try a different title.</p>;

  return (
    <div className="movies-rail">
      {results.map((m) => (
        <MovieCard key={m.id} movie={m} genreName={genreName(m.genre_ids)} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const searchQuery = useSearchStore((s) => s.searchQuery);

  // Use suspense-enabled hooks
  const genresResult = useGenres();
  const trendingData = useTrending();

  // Extract data from the results (these will be available after suspense resolves)
  const genres = genresResult?.genres || [];
  const trendingMovies = (trendingData?.results || [])
    .filter((m: Movie) => m.poster_path)
    .slice(0, 8);
  const spotlightMovie = (trendingData?.results || [])[0] ?? null;

  function genreName(ids?: number[]): string {
    if (!ids || ids.length === 0) return "Movie";
    const g = genres.find((x) => x.id === ids[0]);
    return g?.name || "Movie";
  }

  function genreObj(ids?: number[]): Genre[] {
    if (!ids) return [];
    return ids.map((id) => genres.find((g) => g.id === id)).filter(Boolean) as Genre[];
  }

  return (
    <ErrorBoundary fallback={<div>Failed to load home page.</div>}>
      <div className="home-page">
        <main className="home-main">
          <section className="home-hero">
            <div className="container">
              <div className="hero-content">
                <div className="hero-copy">
                  <span className="eyebrow">Tonight&apos;s Spotlight</span>
                  <h1>
                    Discover your next <span className="text-gradient">cinematic obsession</span>.
                  </h1>
                  <p>
                    MovieRoulette brings together streaming-style browsing and mood-first discovery.
                    Jump into fresh releases, fan favorites, and quick filters that help you find the
                    right movie in minutes.
                  </p>
                  <div className="hero-meta">
                    <span>4K Premium Picks</span>
                    <span>Handpicked Genres</span>
                    <span>Fast Mood Filters</span>
                  </div>
                  <div className="hero-actions">
                    <button className="hero-btn" onClick={() => navigate("/movies")}>
                      <i className="bi bi-film" /> Browse Movies
                    </button>
                    <button className="ghost-btn" onClick={() => navigate("/random")}>
                      <i className="bi bi-shuffle" /> Try Randomizer
                    </button>
                  </div>
                </div>

                <div className="hero-side glass-panel">
                  <h2>Why MovieRoulette works</h2>
                  <p>
                    Instead of endless scrolling, we guide users with concise categories, strong
                    visuals, and ready-made moods for movie night.
                  </p>
                  <div className="hero-stats">
                    <div className="hero-stat">
                      <strong>12k+</strong>
                      <span>Curated titles</span>
                    </div>
                    <div className="hero-stat">
                      <strong>18</strong>
                      <span>Popular genres</span>
                    </div>
                    <div className="hero-stat">
                      <strong>6</strong>
                      <span>Mood shortcuts</span>
                    </div>
                    <div className="hero-stat">
                      <strong>1</strong>
                      <span>Tap to start exploring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {searchQuery && (
            <section className="home-section">
              <div className="container">
                <div className="home-section-header">
                  <div>
                    <h2 className="section-heading mb-2">Search results for &ldquo;{searchQuery}&rdquo;</h2>
                    <p className="home-section-subtext">Showing matches from the catalog.</p>
                  </div>
                </div>
                <SearchResults query={searchQuery} genreName={genreName} />
              </div>
            </section>
          )}

          <section className="home-section">
            <div className="container">
              <div className="home-section-header">
                <div>
                  <h2 className="section-heading mb-2">Featured Tonight</h2>
                  <p className="home-section-subtext">One immersive featured title to kick things off.</p>
                </div>
                {spotlightMovie && (
                  <button className="ghost-btn" onClick={() => navigate(`/movie/${spotlightMovie.id}`)}>
                    Open Details
                  </button>
                )}
              </div>

              {spotlightMovie ? (
                <article className="spotlight-card glass-panel">
                  <div className="spotlight-poster">
                    <img src={posterUrl(spotlightMovie.poster_path, "w500")} alt={spotlightMovie.title} />
                  </div>
                  <div className="spotlight-body">
                    <div className="spotlight-tags">
                      {genreObj(spotlightMovie.genre_ids)
                        .slice(0, 2)
                        .map((g) => (
                          <span className="genre-badge" key={g.id}>
                            {g.name}
                          </span>
                        ))}
                      <span className="year-badge">{formatYear(spotlightMovie.release_date)}</span>
                    </div>
                    <h3>{spotlightMovie.title}</h3>
                    <p>{spotlightMovie.overview || "No description available."}</p>
                    <div className="hero-actions">
                      <button className="hero-btn" onClick={() => navigate(`/movie/${spotlightMovie.id}`)}>
                        <i className="bi bi-play-fill" /> Watch Trailer
                      </button>
                      <button className="ghost-btn" onClick={() => navigate("/movies")}>
                        More Like This
                      </button>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="spotlight-card glass-panel" aria-hidden="true">
                  <div className="spotlight-poster">
                    <div className="skeleton-shine" style={{ aspectRatio: "2 / 3", borderRadius: "var(--radius-md)" }} />
                  </div>
                  <div className="spotlight-body">
                    <div className="skeleton-shine" style={{ width: "60%", height: 16, borderRadius: 4 }} />
                    <div className="skeleton-shine" style={{ width: "40%", height: 14, borderRadius: 4 }} />
                    <div className="skeleton-shine mt-2" style={{ width: "70%", height: 12, borderRadius: 4 }} />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="home-section">
            <div className="container">
              <div className="home-section-header">
                <div>
                  <h2 className="section-heading mb-2">Trending Right Now</h2>
                  <p className="home-section-subtext">Compact movie cards — tap any to open details.</p>
                </div>
                <button className="ghost-btn" onClick={() => navigate("/movies")}>
                  See Full List
                </button>
              </div>

              {trendingMovies.length > 0 ? (
                <div className="movies-rail">
                  {trendingMovies.map((m) => (
                    <MovieCard key={m.id} movie={m} genreName={genreName(m.genre_ids)} />
                  ))}
                </div>
              ) : (
                <MovieCardSkeletonGrid count={8} />
              )}
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}