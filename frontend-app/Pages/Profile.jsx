import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const tabs = ["Overview", "Settings"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Now actually calls the backend!
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/me`, {
        withCredentials: true,   // sends the JWT cookie
      });
      setUser(res.data.user);
      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
      setError("Could not load profile. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear cookie by setting expired token (simplest approach)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <p style={{ color: "white", padding: "20px" }}>Loading profile...</p>;
  }

  if (error) {
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
  }

  return (
    <div className="profile">
      {/* Header */}
      <div className="profile__header">
        <div className="profile__avatar">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="profile__header-info">
          <h2 className="profile__name">{user?.username || "User"}</h2>
          <p className="profile__email">{user?.email || "No Email"}</p>
          <p className="profile__member">
            Member since {user?.memberSince || "-"}
          </p>
        </div>

        <button className="profile__edit-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="profile__stats">
        <div className="profile__stat">
          <span className="profile__stat-value">{stats.totalOrders}</span>
          <span className="profile__stat-label">Total Orders</span>
        </div>

        <div className="profile__stat-divider" />

        <div className="profile__stat">
          <span className="profile__stat-value">
            ₹{stats.totalSpent?.toLocaleString()}
          </span>
          <span className="profile__stat-label">Total Spent</span>
        </div>

        <div className="profile__stat-divider" />

        <div className="profile__stat">
          <span className="profile__stat-value">{user?.role || "-"}</span>
          <span className="profile__stat-label">Account Type</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile__tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`profile__tab ${activeTab === t ? "profile__tab--active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="profile__section">
          <h3 className="profile__section-title">Personal Information</h3>
          <div className="profile__info-grid">
            <div className="profile__info-item">
              <span className="profile__info-label">Username</span>
              <span className="profile__info-value">{user?.username || "-"}</span>
            </div>
            <div className="profile__info-item">
              <span className="profile__info-label">Email</span>
              <span className="profile__info-value">{user?.email || "-"}</span>
            </div>
            <div className="profile__info-item">
              <span className="profile__info-label">Role</span>
              <span className="profile__info-value">{user?.role || "-"}</span>
            </div>
            <div className="profile__info-item">
              <span className="profile__info-label">Member Since</span>
              <span className="profile__info-value">{user?.memberSince || "-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "Settings" && (
        <div className="profile__section">
          <h3 className="profile__section-title">Account Settings</h3>
          <div className="profile__settings-list">
            {["Email Notifications", "SMS Alerts", "Order Updates", "Promotional Offers"].map(
              (setting) => (
                <div className="profile__setting-item" key={setting}>
                  <span className="profile__setting-name">{setting}</span>
                  <div className="profile__toggle" />
                </div>
              )
            )}
            <div className="profile__setting-item profile__setting-item--danger">
              <span className="profile__setting-name">Logout</span>
              <button
                className="profile__action-btn profile__action-btn--danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}