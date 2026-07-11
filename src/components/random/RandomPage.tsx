import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Modal, Button } from "react-bootstrap";
import type { Genre, Movie, VideoResponse } from "@/lib/tmdb/types";
import { tmdbClient } from "@/lib/tmdb/client";
import { toast } from "sonner";
import { backdropUrl, formatRating, formatYear } from "@/lib/tmdb/images";
import DualRange from "@components/ui/DualRange";
import MultiSelect from "@components/ui/MultiSelect";
import { RandomResultSkeleton } from "@components/ui/Skeletons";
import { LANGUAGES, MOODS, MOOD_GENRE_MAP, type MoodId } from "@/lib/constants";
// Import the optimistic favourites hook
import { useOptimisticFavourites } from "@/features/favourites";

export default function RandomPage() {
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite: optimisticToggleFavourite } = useOptimisticFavourites();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState<number[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [moods, setMoods] = useState<MoodId[]>([]);

  const [ratingMin, setRatingMin] = useState(0);
  const [ratingMax, setRatingMax] = useState(100);
  const [yearMin, setYearMin] = useState(1970);
  const [yearMax, setYearMax] = useState(2026);
  const [runtimeMin, setRuntimeMin] = useState(10);
  const [runtimeMax, setRuntimeMax] = useState(242);

  const [spinning, setSpinning] = useState(false);
  const [pool, setPool] = useState<Movie[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    tmdbClient.genres().then((g) => setGenres(g.genres)).catch(() => {});
  }, []);

  const genreOptions = useMemo(
    () => genres.filter((g) => !selectedSubGenres.includes(g.id)),
    [genres, selectedSubGenres]
  );
  const subGenreOptions = useMemo(
    () => genres.filter((g) => !selectedGenres.includes(g.id)),
    [genres, selectedGenres]
  );

  function toggleMulti<T>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  async function spin() {
    setSpinning(true);
    setError(null);
    setDismissedIds(new Set());
    try {
      const genreIds = new Set<number>([...selectedGenres, ...selectedSubGenres]);
      moods.forEach((m) => MOOD_GENRE_MAP[m].forEach((g) => genreIds.add(g)));

      // TMDB's with_runtime filter is unreliable (many movies lack runtime metadata in the discover index).
      // We still send it to narrow the pool, then verify runtime client-side by fetching details for candidates.
      const runtimeConstrained = runtimeMin > 10 || runtimeMax < 242;

      const params = {
        with_genres: genreIds.size ? Array.from(genreIds).join("|") : undefined,
        with_original_language: selectedLangs.length === 1 ? selectedLangs[0] : undefined,
        "vote_average.gte": ratingMin / 10,
        "vote_average.lte": ratingMax / 10,
        "primary_release_date.gte": `${yearMin}-01-01`,
        "primary_release_date.lte": `${yearMax}-12-31`,
        "with_runtime.gte": runtimeMin,
        "with_runtime.lte": runtimeMax,
        sort_by: "popularity.desc",
        page: 1,
      };

      // Fetch 3 pages in parallel to build a large candidate pool (up to 60).
      const pages = await Promise.all([
        tmdbClient.discover(params),
        tmdbClient.discover({ ...params, page: 2 }).catch(() => null),
        tmdbClient.discover({ ...params, page: 3 }).catch(() => null),
      ]);
      let list: Movie[] = [];
      pages.forEach((p) => {
        if (p) list = list.concat(p.results.filter((m) => m.poster_path));
      });

      // Deduplicate by id
      const seen = new Set<number>();
      list = list.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));

      if (list.length === 0) {
        setPool([]);
        setCurrent(null);
        setError("No movies match those filters. Try loosening them up.");
        return;
      }

      // If runtime is constrained, verify by fetching details for candidates (up to 15) and keep only those within range.
      let verifiedPool = list;
      if (runtimeConstrained) {
        const sample = list.slice(0, 15);
        const detailed = await Promise.all(
          sample.map((m) => tmdbClient.movieDetails(m.id).catch(() => null))
        );
        verifiedPool = detailed.filter(
          (m): m is Movie =>
            m !== null &&
            m.runtime !== undefined &&
            m.runtime >= runtimeMin &&
            m.runtime <= runtimeMax
        );
        // Fall back to the original pool if TMDB runtime data is sparse
        if (verifiedPool.length === 0) verifiedPool = list;
      }

      // Shuffle the pool so randomize picks feel varied even from a small pool
      verifiedPool = [...verifiedPool].sort(() => Math.random() - 0.5);
      setPool(verifiedPool);
      setCurrent(verifiedPool[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSpinning(false);
    }
  }

  function randomizeAgain() {
    // Pick a random movie from the pool that hasn't been dismissed
    const available = pool.filter((m) => !dismissedIds.has(m.id) && m.id !== current?.id);
    if (available.length === 0) {
      // All dismissed — reset dismissed list and pick from full pool
      const remaining = pool.filter((m) => m.id !== current?.id);
      if (remaining.length === 0) return;
      setDismissedIds(new Set());
      setCurrent(remaining[Math.floor(Math.random() * remaining.length)]);
      return;
    }
    setCurrent(available[Math.floor(Math.random() * available.length)]);
  }

  function dismiss() {
    if (current) {
      setDismissedIds((prev) => new Set(prev).add(current.id));
      // Immediately show another from the pool (excluding dismissed + current)
      const available = pool.filter((m) => !dismissedIds.has(m.id) && m.id !== current.id);
      if (available.length > 0) {
        setCurrent(available[Math.floor(Math.random() * available.length)]);
      } else {
        setCurrent(null);
      }
    } else {
      setCurrent(null);
    }
  }

  async function watchTrailer(movieId: number) {
    try {
      const vids: VideoResponse = await tmdbClient.movieVideos(movieId);
      const results = vids.results || [];
      const officialTrailer = results.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official);
      const anyTrailer = results.find((v) => v.site === "YouTube" && v.type === "Trailer");
      const teaser = results.find((v) => v.site === "YouTube" && v.type === "Teaser");
      const key = (officialTrailer || anyTrailer || teaser)?.key ?? null;

      if (!key) {
        toast("No trailer available", { description: "TMDB doesn't have one listed for this title yet." });
        return;
      }
      setTrailerKey(key);
      setTrailerOpen(true);
    } catch {
      toast.error("Couldn't load the trailer. Try again in a moment.");
    }
  }

  return (
    <div className="random-page">
      <section className="random-section container mb-5 py-4">
        <Modal show={trailerOpen} onHide={() => setTrailerOpen(false)} centered size="lg">
          <Modal.Body className="p-0" style={{ background: "#000" }}>
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

        <div className="header my-4 text-center text-lg-start">
          <h2 className="title display-1">
            Cinematic
            <br />
            <span>Destiny.</span>
          </h2>
          <p className="subtitle fst-italic">Set the parameters for your next immersive movie search</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="random-form text-white p-3 rounded-4">
              {/* Genre */}
              <div className="my-2">
                <Form.Label className="d-flex align-items-center gap-1">
                  <i className="bi bi-puzzle-fill" /> Genre:
                </Form.Label>
                <MultiSelect
                  id="genre"
                  options={genreOptions.map((g) => ({ value: String(g.id), label: g.name }))}
                  selected={selectedGenres.map(String)}
                  onChange={(vals) => setSelectedGenres(vals.map(Number))}
                  placeholder="All genres"
                />
              </div>

              {/* Sub-genre */}
              <div className="my-2">
                <Form.Label className="d-flex align-items-center gap-1">
                  <i className="bi bi-puzzle-fill" /> Sub-Genre:
                </Form.Label>
                <MultiSelect
                  id="subgenre"
                  options={subGenreOptions.map((g) => ({ value: String(g.id), label: g.name }))}
                  selected={selectedSubGenres.map(String)}
                  onChange={(vals) => setSelectedSubGenres(vals.map(Number))}
                  placeholder="All sub-genres"
                />
              </div>

              {/* Language */}
              <div className="my-2">
                <Form.Label className="d-flex align-items-center gap-1">
                  <i className="bi bi-translate" /> Language:
                </Form.Label>
                <MultiSelect
                  id="language"
                  options={LANGUAGES.map((l) => ({ value: l.value, label: l.label }))}
                  selected={selectedLangs}
                  onChange={setSelectedLangs}
                  placeholder="All languages"
                />
              </div>

              {/* Mood */}
              <div className="my-2">
                <Form.Label className="d-flex align-items-center gap-1">
                  <i className="bi bi-emoji-laughing-fill" /> Mood:
                </Form.Label>
                <div className="mood-grid">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`mood-toggle ${moods.includes(m.id) ? "active" : ""}`}
                      onClick={() => setMoods((prev) => toggleMulti(prev, m.id))}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ranges */}
              <div className="my-3">
                <Form.Label>Rating: {ratingMin}–{ratingMax}</Form.Label>
                <DualRange
                  min={0}
                  max={100}
                  valueMin={ratingMin}
                  valueMax={ratingMax}
                  onChange={(a, b) => {
                    setRatingMin(a);
                    setRatingMax(b);
                  }}
                />
              </div>
              <div className="my-3">
                <Form.Label>Year: {yearMin}–{yearMax}</Form.Label>
                <DualRange
                  min={1970}
                  max={2026}
                  valueMin={yearMin}
                  valueMax={yearMax}
                  onChange={(a, b) => {
                    setYearMin(a);
                    setYearMax(b);
                  }}
                />
              </div>
              <div className="my-3">
                <Form.Label>Runtime: {runtimeMin}–{runtimeMax} min</Form.Label>
                <DualRange
                  min={10}
                  max={242}
                  valueMin={runtimeMin}
                  valueMax={runtimeMax}
                  onChange={(a, b) => {
                    setRuntimeMin(a);
                    setRuntimeMax(b);
                  }}
                />
              </div>

              <button
                type="button"
                className="spin-btn w-100 my-3 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3"
                onClick={spin}
                disabled={spinning}
              >
                <i className="bi bi-arrow-clockwise" />
                {spinning ? "Spinning…" : "Spin The Wheel"}
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-8 d-flex flex-column">
            {error && (
              <div className="glass-panel p-4 text-center mb-3" style={{ color: "var(--color-text-muted)" }}>
                {error}
              </div>
            )}

            {spinning && !current ? (
              <RandomResultSkeleton />
            ) : current ? (
              <>
                <div className="random-pool-info">
                  <i className="bi bi-collection-play" />
                  <span>
                    {Math.max(0, pool.filter((m) => !dismissedIds.has(m.id) && m.id !== current?.id).length)} more movies in your pool
                  </span>
                </div>
                <RandomResult
                  movie={current}
                  genres={genres}
                  onWatchTrailer={() => watchTrailer(current!.id)}
                  onViewDetails={() => navigate(`/movie/${current!.id}`)}
                  onRandomize={randomizeAgain}
                  onDismiss={dismiss}
                  onFavourite={() => {
                    optimisticToggleFavourite(current!);
                    toast(isFavourite(current!.id) ? "Removed from Favourites" : "Added to Favourites", {
                      description: current!.title,
                      duration: 2200,
                    });
                  }}
                  fav={isFavourite(current!.id)}
                />
              </>
            ) : (
              <div
                className="glass-panel p-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                <i className="bi bi-film" style={{ fontSize: "3rem", color: "var(--color-accent)" }} />
                <h3 className="mt-3" style={{ color: "var(--color-text-primary)" }}>Ready when you are</h3>
                <p>Set your filters and hit &ldquo;Spin The Wheel&rdquo; to discover a movie.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

interface ResultProps {
  movie: Movie;
  genres: Genre[];
  onWatchTrailer: () => void;
  onViewDetails: () => void;
  onRandomize: () => void;
  onDismiss: () => void;
  onFavourite: () => void;
  fav: boolean;
}

function RandomResult({
  movie,
  genres,
  onWatchTrailer,
  onViewDetails,
  onRandomize,
  onDismiss,
  onFavourite,
  fav,
}: ResultProps) {
  const movieGenres =
    (movie.genres ||
      movie.genre_ids?.map((id) => genres.find((g) => g.id === id)).filter(Boolean) ||
      []) as Genre[];
  const rating = formatRating(movie.vote_average);

  return (
    <div className="d-flex flex-column">
      {/* .carousel-item now ONLY contains the image + its overlay caption.
          Its height is fully determined by the image (aspect-ratio 16/9),
          and overflow:hidden clips any caption content that grows taller
          than that box — it can never push into what comes after it. */}
      <div className="carousel-item active">
        <img
          src={backdropUrl(movie.backdrop_path || movie.poster_path, "w1280")}
          alt={`${movie.title} backdrop`}
        />

        <div className="carousel-caption">
          <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
            {movieGenres.slice(0, 2).map((g) => (
              <span className="badge" key={g.id}>
                {g.name}
              </span>
            ))}
            <div className="movie-rating d-flex align-items-center gap-1">
              <i className="bi bi-star-fill" />
              <span className="movie-rating-value">{rating}</span>
            </div>
          </div>
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
          </div>
          <div className="d-flex gap-3 mt-4 justify-content-start flex-wrap">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2 px-4 py-2"
              onClick={onWatchTrailer}
            >
              <i className="bi bi-play-fill" /> Watch Trailer
            </Button>
            <Button
              variant="secondary"
              className="d-flex align-items-center gap-2 px-4 py-2"
              onClick={onViewDetails}
            >
              <i className="bi bi-eye" /> View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Moved out of .carousel-item — this is now a plain sibling that
          always renders directly below the image card, regardless of how
          tall the caption's content (title length, badge count, etc.) is
          for any given movie. No more fixed margin fighting a variable
          overlap. */}
      <div className="btns-resubmit">
        <button type="button" id="dismiss" className="resubmit-item" onClick={onDismiss}>
          <span className="circle small">
            <i className="bi bi-x-lg" />
          </span>
          <p>Dismiss</p>
        </button>
        <button type="button" id="randomize" className="resubmit-item" onClick={onRandomize}>
          <span className="circle big">
            <i className="bi bi-arrow-repeat" />
          </span>
          <p>Randomize</p>
        </button>
        <button
          type="button"
          id="favourite"
          className={`resubmit-item ${fav ? "active" : ""}`}
          onClick={onFavourite}
        >
          <span className="circle small">
            <i className={fav ? "bi bi-heart-fill" : "bi bi-heart"} />
          </span>
          <p>{fav ? "Favourited" : "Favourite"}</p>
        </button>
      </div>
    </div>
  );
}