import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mr-footer">
      <div className="container-fluid px-3 px-lg-4">
        <div className="row gy-4 justify-content-center text-center text-sm-start mb-4 mb-lg-5">
          <div className="col-12 col-sm-6 col-lg-6">
            <p className="footer-col-title">Explore our movie collection!</p>
            <ul className="navbar-nav d-flex flex-column gap-1">
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/movies")}>Top Rated</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/movies")}>New Releases</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/movies")}>Genres</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/random")}>Random Pick</button></li>
            </ul>
          </div>

          <div className="col-12 col-sm-6 col-lg-6">
            <p className="footer-col-title">Explore our series collection!</p>
            <ul className="navbar-nav d-flex flex-column gap-1">
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/series")}>Top Rated</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/series")}>New Releases</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/series")}>Genres</button></li>
              <li><button className="footer-link btn btn-link p-0 text-start" onClick={() => navigate("/series")}>Actors</button></li>
            </ul>
          </div>
        </div>

        <div className="row gy-2 align-items-center text-center text-md-start">
          <div className="col-12 col-md-6">
            <p className="mb-0 text-secondary" style={{ fontSize: "0.85rem" }}>
              &copy; {new Date().getFullYear()} MovieRoulette. All rights reserved.
            </p>
            <p className="mb-0 mt-1" style={{ fontSize: "0.78rem", color: "var(--color-text-subtle)" }}>
              Powered by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#01b4c4", fontWeight: 600 }}
              >
                TMDB
              </a>
              {" "}&middot;{" "}
              <a
                href="https://developer.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#01b4c4", fontWeight: 600 }}
              >
                API Docs
              </a>
            </p>
          </div>
          <div className="col-12 col-md-6 d-flex flex-wrap justify-content-center justify-content-md-end gap-3">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a
              href="https://developer.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              TMDB API Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
