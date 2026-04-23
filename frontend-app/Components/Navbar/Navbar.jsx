import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBell, FiMoon, FiSun, FiAlertTriangle } from "react-icons/fi";
import "./Navbar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Navbar({ activePage, setActivePage }) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Fixed: was calling wrong port (5002) and wrong endpoint
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      // Not logged in — that's fine, just don't show user info
      console.log("Not logged in or failed to fetch user");
    }
  };

  // Live search with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        axios
          .get(`${API_BASE_URL}/homepage/users?search=${search}`)
          .then((res) => console.log("Search Results:", res.data))
          .catch((err) => console.log(err));
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // Role-based navigation links
  const getNavLinks = () => {
    const base = ["Home", "Categories", "My Orders", "Profile"];
    if (user?.role === "admin") return [...base, "Admin"];
    if (user?.role === "seller") return [...base, "Seller"];
    return [...base, "My Disputes"];
  };

  const handleNavClick = (link) => {
    setActivePage(link);
    const routes = {
      Home: "/homepage",
      Categories: "/categories",
      "My Orders": "/orders",
      Profile: "/profile",
      "My Disputes": "/my-disputes",
      Admin: "/admin",
      Seller: "/seller",
    };
    if (routes[link]) navigate(routes[link]);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      {/* Top Row */}
      <div className="navbar__top">
        {/* Logo */}
        <div className="navbar__brand" onClick={() => navigate("/homepage")}>
          <span className="navbar__diamond">◆</span>
          <span className="navbar__brand-name">ShopEase</span>
        </div>

        {/* Search */}
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="navbar__search-input"
          />
        </div>

        {/* Right Icons */}
        <div className="navbar__icons">
          <div className="navbar__icon">
            <FiBell />
          </div>

          {/* My Disputes shortcut (buyers only) */}
          {user && user.role === "user" && (
            <div className="navbar__icon" onClick={() => navigate("/my-disputes")} title="My Disputes">
              <FiAlertTriangle />
            </div>
          )}

          {/* Dark Mode */}
          <div className="navbar__icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </div>

          {/* User avatar */}
          <div className="navbar__user" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
            <div className="navbar__avatar">
              {user?.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__welcome">
                {user?.role === "admin" ? "🛡️ Admin" : user?.role === "seller" ? "🏪 Seller" : "👤 Buyer"}
              </span>
              <span className="navbar__username" style={{ marginLeft: "8px" }}>{user?.username || "Login"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links Row */}
      <div className="navbar__links">
        {getNavLinks().map((link) => (
          <button
            key={link}
            className={`navbar__link ${activePage === link ? "navbar__link--active" : ""}`}
            onClick={() => handleNavClick(link)}
          >
            {link === "Admin" && "⚖️ "}
            {link === "Seller" && "🏪 "}
            {link === "My Disputes" && "⚠️ "}
            {link}
          </button>
        ))}
      </div>
    </nav>
  );
}
