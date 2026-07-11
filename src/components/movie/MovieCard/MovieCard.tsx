import { useNavigate } from "react-router-dom";
import type { Movie } from "@/lib/tmdb/types";
import { toast } from "sonner";
import { posterUrl, formatRating, formatYear } from "@/lib/tmdb/images";
import { useOptimisticFavourites } from "@/features/favourites";

interface Props {
  movie: Movie;
  genreName?: string;
}

export default function MovieCard({ movie, genreName }: Props) {
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite: optimisticToggleFavourite } = useOptimisticFavourites();

  const rating = formatRating(movie.vote_average);
  const year = formatYear(movie.release_date);
  const fav = isFavourite(movie.id);

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    optimisticToggleFavourite(movie);
    toast(fav ? "Removed from Favourites" : "Added to Favourites", {
      description: movie.title,
      duration: 2200,
    });
  }

  return (
    <article
      className="movie-card glass-panel"
      onClick={() => navigate(`/movie/${movie.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/movie/${movie.id}`);
      }}
    >
      <div className="movie-card-poster-wrap">
        <img src={posterUrl(movie.poster_path)} alt={`${movie.title} poster`} loading="lazy" />
        <div className="movie-card-overlay">
          <span className="movie-card-rating">
            <i className="bi bi-star-fill" /> {rating}
          </span>
        </div>
        <button
          className={`movie-card-fav ${fav ? "active" : ""}`}
          onClick={handleFav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          title={fav ? "Remove from favourites" : "Add to favourites"}
        >
          <i className={fav ? "bi bi-heart-fill" : "bi bi-heart"} />
        </button>
      </div>
      <div className="movie-card-body">
        <span className="movie-card-genre">{genreName || "Movie"}</span>
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span>{year}</span>
          <span className="movie-meta-dot">•</span>
          <span>{movie.original_language?.toUpperCase()}</span>
        </div>
      </div>
    </article>
  );
}