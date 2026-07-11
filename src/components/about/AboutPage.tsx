import { useNavigate } from "react-router-dom";


export const STATS = [
  { value: "12k+", label: "Movies & Series", icon: "bi-film" },
  { value: "18", label: "Genres", icon: "bi-grid" },
  { value: "6", label: "Mood Shortcuts", icon: "bi-emoji-laughing" },
  { value: "1 tap", label: "To Discover", icon: "bi-hand-index" },
];

export const STEPS = [
  {
    num: "01",
    title: "Set Your Filters",
    desc: "Pick genres, languages, moods, and dial in the rating, year, and runtime ranges that match your vibe tonight.",
    icon: "bi-sliders2",
  },
  {
    num: "02",
    title: "Spin The Wheel",
    desc: "Our engine pulls from TMDB's catalog of thousands of titles, filters them to your specs, and hands you one perfect pick.",
    icon: "bi-shuffle",
  },
  {
    num: "03",
    title: "Watch or Randomize",
    desc: "Love it? Hit Watch Trailer. Not feeling it? Tap Randomize for another pick or Dismiss to skip — no repeats until the pool runs out.",
    icon: "bi-play-circle",
  },
  {
    num: "04",
    title: "Save Your Favourites",
    desc: "Tap the heart on any movie to build your personal gallery. Sign in to get recommendations based on your taste.",
    icon: "bi-heart",
  },
];

export const FEATURES = [
  {
    title: "Random Movie Generator",
    desc: "The headline feature. Stop scrolling for hours — set your preferences and get one curated pick in seconds.",
    icon: "bi-shuffle",
    color: "tomato",
  },
  {
    title: "Advanced Filters",
    desc: "Genre, sub-genre, language, mood, rating range, release year, runtime. Fine-tune discovery to exactly what you want.",
    icon: "bi-funnel",
    color: "blueviolet",
  },
  {
    title: "Trending & Top Rated",
    desc: "Browse what's hot this week or the highest-rated films of all time, refreshed live from TMDB.",
    icon: "bi-graph-up-arrow",
    color: "#22c55e",
  },
  {
    title: "Favourites Gallery",
    desc: "Build a personal collection of movies you love. Saved in your browser, always one click away.",
    icon: "bi-heart-fill",
    color: "#ec4899",
  },
  {
    title: "Personalized Profile",
    desc: "Sign in to save your favourites and get TMDB-powered recommendations based on the genres you love.",
    icon: "bi-person-circle",
    color: "#06b6d4",
  },
  {
    title: "Series Discovery",
    desc: "Not in a movie mood? Browse TV series with the same powerful filters, powered by TMDB's TV catalog.",
    icon: "bi-tv",
    color: "#f59e0b",
  },
];


export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero-new">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <span className="about-eyebrow">
                <i className="bi bi-stars" /> Welcome to MovieRoulette
              </span>
              <h1 className="about-hero-title">
                Simplify movie
                <br />
                <span className="gradient">discovery.</span>
              </h1>
              <p className="about-hero-desc">
                MovieRoulette was born from the endless scroll. We believe the magic of
                cinema shouldn&apos;t be buried under algorithmic fatigue. We return the art
                of choice to the viewer through cinematic curation and digital serendipity.
              </p>
              <div className="about-hero-actions">
                <button className="hero-btn" onClick={() => navigate("/random")}>
                  <i className="bi bi-shuffle" /> Try the Randomizer
                </button>
                <button className="ghost-btn" onClick={() => navigate("/movies")}>
                  <i className="bi bi-film" /> Browse Movies
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-5 text-center">
              <div className="about-hero-logo-wrap">
                <img src="/brandLogo.png" alt="MovieRoulette logo" className="about-hero-logo-img" />
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="about-stats">
            {STATS.map((s) => (
              <div className="about-stat" key={s.label}>
                <i className={`bi ${s.icon}`} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-eyebrow">How It Works</span>
            <h2 className="about-section-title">From endless scroll to perfect pick</h2>
            <p className="about-section-subtitle">
              Four simple steps to go from &ldquo;I don&apos;t know what to watch&rdquo; to
              &ldquo;press play.&rdquo;
            </p>
          </div>
          <div className="about-steps">
            {STEPS.map((step) => (
              <div className="about-step glass-panel" key={step.num}>
                <div className="about-step-num">{step.num}</div>
                <i className={`bi ${step.icon} about-step-icon`} />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-eyebrow">The Cinematic Suite</span>
            <h2 className="about-section-title">Everything you need to find your next film</h2>
            <p className="about-section-subtitle">
              Tools designed for the digital auteur — powered by The Movie Database (TMDB).
            </p>
          </div>
          <div className="about-features-grid">
            {FEATURES.map((f) => (
              <div className="about-feature-card glass-panel" key={f.title}>
                <div className="about-feature-icon" style={{ color: f.color }}>
                  <i className={`bi ${f.icon}`} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="container">
          <div className="about-mission glass-panel">
            <div className="about-mission-content">
              <span className="about-section-eyebrow">Our Mission</span>
              <h2 className="about-section-title">We value your time as much as the films you watch</h2>
              <p>
                Modern streaming gave us more movies than ever — and made choosing harder than
                ever. MovieRoulette cuts through the decision paralysis. No more 45-minute
                scrolls that end in &ldquo;I&apos;ll just watch something I&apos;ve seen
                before.&rdquo;
              </p>
              <p>
                We combine the depth of TMDB&apos;s catalog with a simple, mood-first
                interface. Whether you want a 90-minute comedy, a Korean thriller from 2023,
                or a chaotic action flick — one spin and you&apos;re watching.
              </p>
              <div className="about-mission-quote">
                <i className="bi bi-quote" />
                <p>The best movie for you isn&apos;t on page 47 of a catalog. It&apos;s one spin away.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section">
        <div className="container">
          <div className="about-cta">
            <h1 className="about-cta-title">Ready to stop scrolling?</h1>
            <p className="about-cta-desc">
              Experience the platform that values your time as much as the films you watch.
            </p>
            <div className="about-cta-actions">
              <button className="hero-btn" onClick={() => navigate("/random")}>
                <i className="bi bi-shuffle" /> Spin the Wheel
              </button>
              <button className="ghost-btn" onClick={() => navigate("/movies")}>
                <i className="bi bi-film" /> Explore Movies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TMDB Attribution — kept exactly as-is */}
      <div className="container mb-5">
        <div className="tmdb-attribution glass-panel">
          <div className="tmdb-attribution-content">
            <div className="tmdb-attribution-logo">
              <img
                src="/tmdb_logo.svg"
                alt="The Movie Database (TMDB)"
                className="tmdb-logo"
              />
            </div>
            <div className="tmdb-attribution-text">
              <p>
                This product uses the TMDB API but is not endorsed or certified by TMDB.
                All movie, series, and cast data — including posters, backdrops, and
                ratings — is provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tmdb-link"
                >
                  The Movie Database (TMDB)
                </a>
                .
              </p>
              <p className="tmdb-copyright">
                &copy; {new Date().getFullYear()} MovieRoulette. All movie and series
                artwork, trailers, and metadata are property of their respective owners.
              </p>
              <a
                href="https://developer.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="tmdb-api-docs-btn"
              >
                <i className="bi bi-book" /> TMDB API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
