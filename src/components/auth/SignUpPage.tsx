import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card glass-panel">
          <div className="auth-brand">
            <img src="/brandLogo.png" alt="MovieRoulette" className="auth-brand-logo" />
          </div>
          <h1 className="auth-title">Create your TMDB account</h1>
          <p className="auth-subtitle">
            MovieRoulette signs you in with your existing{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient"
            >
              The Movie Database (TMDB)
            </a>{" "}
            account. TMDB doesn't let apps create accounts on your behalf, so you'll create
            yours directly on their site — it only takes a minute, and it's free.
          </p>

          <a
            href="https://www.themoviedb.org/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="auth-submit-btn"
            style={{ textDecoration: "none" }}
          >
            <i className="bi bi-box-arrow-up-right" /> Create account on TMDB
          </a>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" className="auth-switch-link" onClick={() => navigate("/signin")}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}