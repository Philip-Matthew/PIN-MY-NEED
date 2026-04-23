// components/Navbar.js
// NEW FILE — import and add <Navbar /> at the top of MapPage, Dashboard, Profile

import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="pmn-nav">
      <Link to="/map" className="pmn-logo">📌 PinMyNeed</Link>

      <div className="pmn-links">
        <Link to="/map" className={`pmn-link ${isActive("/map") ? "pmn-link--active" : ""}`}>
          🗺️ Map
        </Link>
        <Link to="/dashboard" className={`pmn-link ${isActive("/dashboard") ? "pmn-link--active" : ""}`}>
          📊 Dashboard
        </Link>
        <Link to="/profile" className={`pmn-link ${isActive("/profile") ? "pmn-link--active" : ""}`}>
          👤 Profile
        </Link>
        <Link to="/about" className={`pmn-link ${isActive("/about") ? "pmn-link--active" : ""}`}>
          ℹ️ About
        </Link>
      </div>

      <button className="pmn-logout" onClick={handleLogout}>
        Logout
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .pmn-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
          background: #111827;
          border-bottom: 1px solid rgba(251,191,36,0.12);
          font-family: 'DM Sans', sans-serif;
        }

        .pmn-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 17px;
          color: #fbbf24;
          text-decoration: none;
          letter-spacing: -0.3px;
        }

        .pmn-links {
          display: flex;
          gap: 4px;
        }

        .pmn-link {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #9ca3af;
          text-decoration: none;
          transition: all 0.2s;
        }

        .pmn-link:hover {
          color: #f9fafb;
          background: rgba(255,255,255,0.06);
        }

        .pmn-link--active {
          color: #fbbf24;
          background: rgba(251,191,36,0.1);
        }

        .pmn-logout {
          padding: 7px 16px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.3);
          background: transparent;
          color: #f87171;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .pmn-logout:hover {
          background: rgba(239,68,68,0.1);
          border-color: #f87171;
        }

        @media (max-width: 640px) {
          .pmn-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
