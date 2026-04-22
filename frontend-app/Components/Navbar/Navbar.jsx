import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBell, FiShoppingCart, FiMoon, FiSun } from "react-icons/fi";
import "./Navbar.css";

const navLinks = ["Home", "Categories", "My Orders", "Profile"];

function NavLinks({ activePage, setActivePage, navigate }) {
  return (
    <div className="navbar__links">
      {navLinks.map((link) => (
        <button
          key={link}
          className={`navbar__link ${activePage === link ? "navbar__link--active" : ""
            }`}
          onClick={() => {
            setActivePage(link);

            if (link === "Home") navigate("/homepage");
            if (link === "Categories") navigate("/categories");
            if (link === "My Orders") navigate("/orders");
            if (link === "Profile") navigate("/profile");
          }}
        >
          {link}
        </button>
      ))}
    </div>
  );
}

export default function Navbar({ activePage, setActivePage }) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(3); // 🔥 dummy
  const navigate = useNavigate();

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    } else {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5002/profile");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 Live Search API call
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        axios
          .get(`http://localhost:5002/products?search=${search}`)
          .then((res) => {
            console.log("Search Results:", res.data);
          })
          .catch((err) => console.log(err));
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>

      {/* Top */}
      <div className="navbar__top">

        {/* Logo */}
        <div
          className="navbar__brand"
          onClick={() => navigate("/homepage")}
        >
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

          {/* Notification */}
          <div className="navbar__icon">
            <FiBell />
          </div>

          {/* Cart */}
          <div className="navbar__icon" onClick={() => navigate("/cart")}>
            <FiShoppingCart />
            <span className="navbar__badge">{cartCount}</span>
          </div>

          {/* Dark Mode */}
          <div
            className="navbar__icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </div>

          {/* User */}
          <div className="navbar__user">
            <div className="navbar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="navbar__user-info">
              <span className="navbar__welcome">Welcome</span>
              <span className="navbar__username">
                {user?.name || "User"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Links */}
      <NavLinks
        activePage={activePage}
        setActivePage={setActivePage}
        navigate={navigate}
      />
    </nav>
  );
}
