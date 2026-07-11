import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import type { Movie, CastResponse, VideoResponse } from "@/lib/tmdb/types";
import { backdropUrl, profileUrl, posterUrl, formatRating, formatYear, formatRuntime } from "@/lib/tmdb/images";
import { toast } from "sonner";
import { DetailsSkeleton } from "@/components/ui/Skeletons";
import React, { useMemo } from "react";

// Import the suspense-enabled hooks
import { useMovieDetails, useMovieCredits, useMovieVideos, useSimilarMovies } from "@/features/movies/useMovies";
// Import the optimistic favourites hook
import { useOptimisticFavourites } from "@/features/favourites";

export default function MovieDetailsPage({ movieId }: { movieId: number }) {
  const navigate = useNavigate();
  const { optimisticFavourites, isFavourite, toggleFavourite: optimisticToggleFavourite } = useOptimisticFavourites();

  // Use suspense-enabled hooks — these are already resolved by the time
  // this component renders (Suspense holds up rendering until they settle),
  // so there's no need to re-fetch anything on click.
  const movieData = useMovieDetails(movieId);
  const creditsData = useMovieCredits(movieId);
  const videosData: VideoResponse = useMovieVideos(movieId);
  const similarData = useSimilarMovies(movieId);

  // Extract data from the suspense-enabled hooks
  const movie = movieData ?? null;
  const cast = creditsData ?? null;
  const similar = (similarData?.results || []).filter((x) => x.poster_path).slice(0, 10) ?? [];

  // Find the best real trailer/teaser from the actual TMDB videos response.
  // Prefer an official trailer, then any trailer, then a teaser.
  const trailerKey = useMemo(() => {
    const results = videosData?.results || [];
    const officialTrailer = results.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official);
    const anyTrailer = results.find((v) => v.site === "YouTube" && v.type === "Trailer");
    const teaser = results.find((v) => v.site === "YouTube" && v.type === "Teaser");
    return (officialTrailer || anyTrailer || teaser)?.key ?? null;
  }, [videosData]);

  const [trailerOpen, setTrailerOpen] = React.useState(false);

  function handleWatchTrailer() {
    if (!trailerKey) {
      toast("No trailer available", { description: "TMDB doesn't have one listed for this title yet." });
      return;
    }
    setTrailerOpen(true);
  }

  if (!movie) {
    // This should not happen due to Suspense, but just in case
    return <DetailsSkeleton />;
  }

  const fav = !!movie.id && isFavourite(movie.id);
  const topCast = cast ? (cast.cast || []).slice(0, 8) : [];
  const director = cast?.crew.find((c) => c.job === "Director")?.name;
  const topProd = movie?.production_companies?.[0]?.name;

  return (
    <>
      <Modal
        show={trailerOpen}
        onHide={() => setTrailerOpen(false)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0 bg-black">
          {trailerKey && (
            <div className="ratio ratio-16x9">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      <div className="details-page">
        <main className="mb-5">
          <div className="details-back-bar">
            <div className="container">
              <button className="details-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <i className="bi bi-arrow-left" /> Back
              </button>
            </div>
          </div>
          <section className="details-hero">
            <img
              src={backdropUrl(movie.backdrop_path, "original")}
              alt={`${movie.title} backdrop`}
              className="backdrop"
            />
            <div className="backdrop-overlay" />
            <div className="container details-content">
              <div className="row">
                <div className="col-12 col-lg-8">
                  <div className="meta-row">
                    {(movie.genres || []).slice(0, 3).map((g) => (
                      <span className="badge genre-badge d-none d-lg-inline-flex" key={g.id}>
                        {g.name}
                      </span>
                    ))}
                    <span className="movie-rating">
                      <i className="bi bi-star-fill" /> {formatRating(movie.vote_average)}
                    </span>
                    <span className="text-uppercase text-secondary" style={{ fontSize: "0.95rem" }}>
                      {formatYear(movie.release_date)}
                    </span>
                    <span className="text-secondary">•</span>
                    <span className="text-uppercase text-secondary" style={{ fontSize: "0.95rem" }}>
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                  <h1 className="movie-title">{movie.title}</h1>
                  {movie.tagline && <p className="fst-italic text-secondary mb-2">&ldquo;{movie.tagline}&rdquo;</p>}
                  <p className="overview d-none d-lg-block">{movie.overview}</p>
                  <div className="details-action-row">
                    <Button
                      variant="primary"
                      className="details-action-btn"
                      onClick={handleWatchTrailer}
                      disabled={!trailerKey}
                    >
                      <i className="bi bi-play-fill" /> Watch Trailer
                    </Button>
                    <Button
                      variant="secondary"
                      className={`details-action-btn ${fav ? "active" : ""}`}
                      onClick={() => {
                        optimisticToggleFavourite(movie);
                        toast(fav ? "Removed from Favourites" : "Added to Favourites", {
                          description: movie.title,
                          duration: 2200,
                        });
                      }}
                    >
                      <i className={fav ? "bi bi-heart-fill" : "bi bi-heart"} />
                      {fav ? "In Favourites" : "Add to Favourites"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cast-section container mb-5 py-4">
            <div className="row g-3 d-flex align-items-start flex-column flex-lg-row">
              <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                <div className="d-flex justify-content-between mb-2 align-items-center">
                  <h2 className="fst-italic">Top Cast</h2>
                </div>
                <div className="cast-list">
                  {topCast.length === 0 ? (
                    <p className="text-secondary">No cast information available.</p>
                  ) : (
                    topCast.map((c) => (
                      <div className="cast-member" key={c.id}>
                        <img src={profileUrl(c.profile_path)} alt={c.name} />
                        <h5>{c.name}</h5>
                        <p>{c.character}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="movie-details-panel">
                  {director && (
                    <div>
                      <p>Director</p>
                      <h3>{director}</h3>
                    </div>
                  )}
                  {topProd && (
                    <div>
                      <p>Production</p>
                      <h3>{topProd}</h3>
                    </div>
                  )}
                  <div>
                    <p>Status</p>
                    <h3>{movie.status || "Released"}</h3>
                  </div>
                  {movie.vote_count > 0 && (
                    <div>
                      <p>Votes</p>
                      <h3>{movie.vote_count.toLocaleString()}</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {similar.length > 0 && (
            <section className="similar-movies-section container mb-5 py-4">
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <h2 className="fst-italic">Similar Movies</h2>
              </div>
              <div className="movie-list">
                {similar.map((s) => (
                  <div
                    className="movie"
                    key={s.id}
                    onClick={() => navigate(`/movie/${s.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/movie/${s.id}`);
                    }}
                  >
                    <div className="poster">
                      <img src={posterUrl(s.poster_path, "w342")} alt={s.title} loading="lazy" />
                      <span className="badge">
                        <i className="bi bi-star-fill me-1" /> {formatRating(s.vote_average)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <h5 className="mb-0" style={{ fontSize: "0.9rem" }}>{s.title}</h5>
                      <div className="d-flex gap-2 mt-1">
                        <span className="text-secondary" style={{ fontSize: "0.78rem" }}>{formatYear(s.release_date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}