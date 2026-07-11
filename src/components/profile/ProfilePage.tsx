import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFavouritesStore } from "@/store";
import { useAuth } from "../auth/AuthProvider";
import { tmdbClient } from "@/lib/tmdb/client";
import { posterUrl, formatRating, formatYear } from "@/lib/tmdb/images";
import type { Genre, Movie } from "@/lib/tmdb/types";

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const favourites = useFavouritesStore((s) => s.favourites);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate("/signin");
  }, [authLoading, user, navigate]);

  // Load genres
  useEffect(() => {
    tmdbClient.genres().then((g) => setGenres(g.genres)).catch(() => {});
  }, []);

  // Build personalized recommendations from favourite genres via TMDB
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoadingRecs(true);
      try {
        // Collect unique genre IDs from favourites
        const genreIds = new Set<number>();
        favourites.forEach((m) => {
          if (m.genre_ids) {
            m.genre_ids.forEach((id) => genreIds.add(id));
          }
        });

        if (genreIds.size === 0) {
          setRecommendations([]);
          setLoadingRecs(false);
          return;
        }

        // Get recommendations based on favourite genres
        // We'll fetch movies for the first genre for simplicity
        const recommendations: Movie[] = [];
        const firstGenreId = Array.from(genreIds)[0];
        const res = await tmdbClient.discover({
          with_genres: String(firstGenreId),
          sort_by: "popularity.desc",
          page: 1,
        });
        res.results.forEach((m: Movie) => {
          if (m.poster_path && !recommendations.some((r) => r.id === m.id)) {
            recommendations.push(m);
          }
        });
        if (active) {
          setRecommendations(recommendations.slice(0, 10)); // Limit to 10
          setLoadingRecs(false);
        }
      } catch {
        if (active) {
          setLoadingRecs(false);
          toast.error("Failed to load recommendations");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [user, favourites]);

  function genreName(id?: number): string {
    if (!id) return "Movie";
    return genres.find((g) => g.id === id)?.name || "Movie";
  }

  if (authLoading) {
    return (
      <div className="profile-page">
        <div className="container py-5 text-center">
          <div className="mr-spinner mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.name || user.username).slice(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      <div className="container py-4">
        {/* Profile header */}
        <div className="profile-header glass-panel">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || "User"} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name || "MovieRoulette Member"}</h1>
            <p className="profile-email">
              <i className="bi bi-person me-1" />
              @{user.username}
            </p>
            <div className="profile-stats">
              <span className="profile-stat">
                <i className="bi bi-heart-fill" /> {favourites.length} Favourites
              </span>
              {/* TMDB has no API for renaming an account, so "editing" here
                  just links out to where that's actually possible. */}
              <a
                href="https://www.themoviedb.org/settings/account"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-edit-btn"
              >
                <i className="bi bi-box-arrow-up-right" /> Manage on TMDB
              </a>
            </div>
          </div>
          <button className="profile-signout-btn" onClick={signOut}>
            <i className="bi bi-box-arrow-right" /> Sign Out
          </button>
        </div>
      </div>

      {/* Recommendations section */}
      {loadingRecs ? (
        <div className="text-center py-5">
          <div className="mr-spinner mx-auto" />
        </div>
      ) : recommendations.length > 0 ? (
        <section className="recommendations-section">
          <div className="container">
            <h2 className="mb-4">Recommended for you</h2>
            <div className="movies-rail">
              {recommendations.map((movie) => (
                <div
                  className="movie-card glass-panel"
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/movie/${movie.id}`);
                  }}
                >
                  <div className="movie-card-poster-wrap">
                    <img src={posterUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
                  </div>
                  <div className="movie-card-body">
                    <h3>{movie.title}</h3>
                    <div className="movie-badges">
                      <span className="genre-badge">{genreName(movie.genre_ids?.[0])}</span>
                      <span className="rating-badge">
                        <i className="bi bi-star-fill" /> {formatRating(movie.vote_average)}
                      </span>
                    </div>
                    <span className="movie-meta">{formatYear(movie.release_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No recommendations available based on your favourites.</p>
        </div>
      )}
    </div>
  );
}