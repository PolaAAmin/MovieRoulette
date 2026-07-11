import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Form, Dropdown } from "react-bootstrap";
import { useSearchStore } from "@/store";
import { useAuth } from "../auth/AuthProvider";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "Series", path: "/series" },
  { label: "Random", path: "/random" },
  { label: "About", path: "/about" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const { user } = useAuth();
  const [localSearch, setLocalSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate("/movies");
    setExpanded(false);
  }

  function navigate_to(path: string) {
    navigate(path);
    setExpanded(false);
  }

  function isActive(path: string) {
    return path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  }

  const initials = user ? (user.name || user.username).slice(0, 2).toUpperCase() : "";

  return (
    <Navbar
      expanded={expanded}
      onToggle={(v) => setExpanded(v)}
      expand="lg"
      variant="dark"
      className="mr-navbar py-2"
    >
      <div className="container-fluid px-3 px-lg-4">
        {/* Brand */}
        <Navbar.Brand
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate_to("/");
          }}
          className="d-flex align-items-center me-auto"
        >
          <img src="/brandLogo.png" alt="MovieRoulette logo" className="brand-logo" />
          <h1 className="brand-name">MovieRoulette</h1>
        </Navbar.Brand>

        {/* Inline actions — always visible (mobile + desktop): search icon, user */}
        <div className="d-flex align-items-center gap-1 gap-sm-2 ms-auto ms-lg-0 order-lg-last">
          {/* Search — inline icon button on mobile, full input on desktop */}
          <Form onSubmit={submitSearch} className="d-flex mr-search-form-desktop" role="search">
            <Form.Control
              type="search"
              placeholder="Search movies…"
              aria-label="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="mr-search"
            />
          </Form>

          {/* Mobile search toggle */}
          <Dropdown align="end" className="mr-search-mobile-dropdown">
            <Dropdown.Toggle as="button" className="mr-icon-btn border-0" id="dd-search-mobile" aria-label="Search">
              <i className="bi bi-search" style={{ fontSize: "1.1rem" }} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mr-dropdown mr-search-mobile-menu">
              <Form onSubmit={submitSearch} className="p-2" role="search">
                <Form.Control
                  type="search"
                  placeholder="Search movies…"
                  aria-label="Search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="mr-search"
                  autoFocus
                />
              </Form>
            </Dropdown.Menu>
          </Dropdown>

          {/* User dropdown — changes based on auth state */}
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="mr-icon-btn border-0" id="dd-user" aria-label="Account">
              {user && user.avatar ? (
                <img src={user.avatar} alt="" className="nav-avatar-img" />
              ) : user ? (
                <span className="nav-avatar-initials">{initials}</span>
              ) : (
                <i className="bi bi-person-circle" style={{ fontSize: "1.15rem" }} />
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="mr-dropdown">
              {user ? (
                <>
                  <Dropdown.Header>
                    <div className="dropdown-user-info">
                      <strong>{user.name || "Member"}</strong>
                      <small>@{user.username}</small>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate_to("/profile")}>
                    <i className="bi bi-person me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate_to("/favourites")}>
                    <i className="bi bi-heart me-2" /> Favourites
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate_to("/random")}>
                    <i className="bi bi-shuffle me-2" /> Random Pick
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate_to("/about")}>
                    <i className="bi bi-info-circle me-2" /> About
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="dropdown-signout" onClick={() => navigate_to("/signin")}>
                    <i className="bi bi-box-arrow-right me-2" /> Sign Out
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item onClick={() => navigate_to("/signin")}>
                    <i className="bi bi-box-arrow-in-right me-2" /> Sign In
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate_to("/signup")}>
                    <i className="bi bi-person-plus me-2" /> Sign Up
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate_to("/profile")}>
                    <i className="bi bi-person me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate_to("/about")}>
                    <i className="bi bi-info-circle me-2" /> About
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Hamburger toggler — only on mobile/tablet */}
          <Navbar.Toggle aria-controls="main-nav" className="ms-1" />
        </div>

        {/* Collapsible nav links — hidden on mobile until toggled */}
        <Navbar.Collapse id="main-nav" className="mr-nav-collapse">
          <Nav className="mx-auto d-flex gap-1 gap-lg-3 my-2 my-lg-0">
            {LINKS.map((l) => (
              <Nav.Link
                key={l.path}
                active={isActive(l.path)}
                onClick={() => navigate_to(l.path)}
              >
                {l.label}
              </Nav.Link>
            ))}
            <Nav.Link
              active={isActive("/favourites")}
              onClick={() => navigate_to("/favourites")}
            >
              <i className="bi bi-heart me-1" />
              Favourites
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}