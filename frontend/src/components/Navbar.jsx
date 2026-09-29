import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Brand from "./ui/Brand";
import Icon from "./ui/Icon";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    function escape(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  useEffect(() => {
    if (!user || user.role === "admin") {
      setUnread(0);
      return;
    }
    const fetchUnread = async () => {
      try {
        const res = await API.get("/conversations");
        setUnread(
          (res.data || []).reduce((sum, c) => sum + (c.unread_count || 0), 0),
        );
      } catch {
        setUnread(0);
      }
    };
    fetchUnread();
    const timer = setInterval(fetchUnread, 15000);
    window.addEventListener("messages-read", fetchUnread);
    return () => { clearInterval(timer); window.removeEventListener("messages-read", fetchUnread); };
  }, [user]);
  const messagesPath = user?.role === "admin" ? "/admin?tab=messages" : "/messages";
  const dashboard =
    user?.role === "tutor"
      ? "/tutor/dashboard"
      : user?.role === "admin"
        ? "/admin"
        : "/parent/dashboard";
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  }
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className="design-container main-nav" aria-label="Main navigation">
        <Brand />
        <div className="desktop-navigation">
          {(!user || user.role === "parent") && <NavLink to="/find-tutors">Find a Teacher</NavLink>}
          <NavLink to="/subjects">Subjects</NavLink>
          <Link to="/#how-it-works">How it works</Link>
          <NavLink to="/about-us">About us</NavLink>
        </div>
        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/login" className="nav-signin">
                Sign in
              </Link>
              <Link to="/register" className="design-button primary nav-start">
                Get started <Icon name="arrow" size={15} />
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboard} className="nav-dashboard">
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </Link>
              {user.role === "parent" && <Link
                to="/favorites"
                className="nav-icon"
                aria-label="Saved tutors"
              >
                <Icon name="heart" size={19} />
              </Link>}
              <Link
                to={messagesPath}
                className="nav-icon"
                aria-label={`Messages${unread ? `, ${unread} unread` : ""}`}
              >
                <Icon name="message" size={19} />
                {unread > 0 && (
                  <span className="unread-count">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
              <div className="account-menu">
                <button
                  className="nav-avatar"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="account-links"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user.email?.[0]?.toUpperCase() || "U"}
                </button>
                {dropdownOpen && (
                  <>
                    <button
                      className="menu-backdrop"
                      aria-label="Close account menu"
                      tabIndex={-1}
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="account-dropdown" id="account-links">
                      <p>
                        {user.email}
                        <small>{user.role}</small>
                      </p>
                      <Link to={dashboard}>Your dashboard</Link>
                      {user.role !== "admin" && <Link to="/learning">Learning progress</Link>}
                      {user.role === "parent" && <Link to="/favorites">Saved tutors</Link>}
                      <Link to={messagesPath}>
                        Messages {unread > 0 && `(${unread})`}
                      </Link>
                      <button onClick={handleLogout}>Sign out</button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
          onClick={event => { if (event.target.closest("a")) setMenuOpen(false); }}
        >
          {(!user || user.role === "parent") && <NavLink to="/find-tutors">Find a Teacher</NavLink>}
          <NavLink to="/subjects">Subjects</NavLink>
          <Link to="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </Link>
          <NavLink to="/about-us">About us</NavLink>
          {user ? (
            <>
              <Link to={dashboard}>Dashboard</Link>
              {user.role !== "admin" && <Link to="/learning">Learning progress</Link>}
              {user.role === "parent" && <Link to="/favorites">Saved tutors</Link>}
              <Link to={messagesPath}>Messages {unread > 0 && `(${unread})`}</Link>
              <button onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register" className="design-button primary">
                Get started <Icon name="arrow" size={16} />
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
