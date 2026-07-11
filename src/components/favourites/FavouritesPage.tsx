import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOptimisticFavourites } from "@/features/favourites";
import { Form, Button } from "react-bootstrap";
import { toast } from "sonner";
import { posterUrl, formatRating, formatYear } from "@/lib/tmdb/images";

export default function FavouritesPage() {
  const navigate = useNavigate();
  const { favourites, toggleFavourite, isFavourite } = useOptimisticFavourites();

  useEffect(() => {
    // The optimistic hook doesn't have loadFavourites, so we need to get it from the store
    // For now, we'll rely on the fact that favourites are loaded automatically by the store
    // In a real implementation, we might want to move loading logic here or enhance the hook
  }, []);

  return (
    <div className="favourites-page">
      <section className="fav-hero container">
        <p className="small" style={{ color: "var(--color-accent)", letterSpacing: "2px", fontSize: "0.85rem" }}>
          PERSONAL GALLERY
        </p>
        <h1 className="fw-bold display-4" style={{ color: "var(--color-text-primary)" }}>
          Your <span className="accent" style={{ color: "var(--color-accent)" }}>Favorites</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          A curated collection of your most beloved cinematic moments.
        </p>
      </section>

      <section className="my-5">
        <div className="container">
          {favourites.length === 0 ? (
            <div className="empty-state glass-panel">
              <i className="bi bi-heart" style={{ fontSize: "3rem", color: "var(--color-accent)" }} />
              <h3 className="mt-3" style={{ color: "var(--color-text-primary)" }}>No favourites yet</h3>
              <p>Tap the heart on any movie to save it here for later.</p>
              <button className="watch-btn mt-3 px-4 py-2" onClick={() => navigate("/movies")}>
                <i className="bi bi-film me-1" /> Browse Movies
              </button>
            </div>
          ) : (
            <div className="fav-grid">
              {favourites.map((m) => (
                <div className="fav-card" key={m.id}>
                  <img
                    src={posterUrl(m.poster_path, "w500")}
                    alt={m.title}
                    className="card-img-top"
                    onClick={() => navigate(`/movie/${m.id}`)}
                    role="button"
                  />
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="tag">
                        {m.genres?.[0]?.name || "Movie"}
                      </span>
                      <span className="rate">
                        <i className="bi bi-star-fill me-1" />
                        {formatRating(m.vote_average)}
                      </span>
                    </div>
                    <h5 className="mt-2" style={{ color: "var(--color-text-primary)" }}>{m.title}</h5>
                    <p className="mb-2" style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
                      {formatYear(m.release_date)}
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="watch-btn py-2 px-3 rounded flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                        onClick={() => navigate(`/movie/${m.id}`)}
                      >
                        <i className="bi bi-play-fill" /> Watch Now
                      </button>
                      <button
                        className={`btn btn-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center ${isFavourite(m.id) ? "active" : ""}`}
                        onClick={() => {
                          toggleFavourite(m);
                          toast(isFavourite(m.id) ? "Removed from Favourites" : "Added to Favourites", {
                            description: m.title,
                            duration: 2200,
                          });
                        }}
                        aria-label={isFavourite(m.id) ? "Remove from favourites" : "Add to favourites"}
                      >
                        <i className={isFavourite(m.id) ? "bi bi-trash" : "bi bi-heart"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}