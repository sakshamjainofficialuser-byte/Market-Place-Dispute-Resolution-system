import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const tabs = ["Overview", "Addresses", "Settings"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile");

      setUser(res.data.user || {});
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Loading state
  if (loading) {
    return <p style={{ color: "white", padding: "20px" }}>Loading profile...</p>;
  }

  return (
    <div className="profile">

      {/* Header */}
      <div className="profile__header">
        <div className="profile__avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="profile__header-info">
          <h2 className="profile__name">{user?.name || "User"}</h2>
          <p className="profile__email">{user?.email || "No Email"}</p>
          <p className="profile__member">
            Member since {user?.memberSince || "-"}
          </p>
        </div>

        <button className="profile__edit-btn">Edit Profile</button>
      </div>

      {/* Stats */}
      <div className="profile__stats">
        <div className="profile__stat">
          <span className="profile__stat-value">
            {user?.totalOrders || 0}
          </span>
          <span className="profile__stat-label">Total Orders</span>
        </div>

        <div className="profile__stat-divider" />

        <div className="profile__stat">
          <span className="profile__stat-value">
            ₹{user?.totalSpent?.toLocaleString() || 0}
          </span>
          <span className="profile__stat-label">Total Spent</span>
        </div>

        <div className="profile__stat-divider" />

        <div className="profile__stat">
          <span className="profile__stat-value">
            {user?.savedItems || 0}
          </span>
          <span className="profile__stat-label">Saved Items</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile__tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`profile__tab ${
              activeTab === t ? "profile__tab--active" : ""
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="profile__section">
          <h3 className="profile__section-title">Personal Information</h3>

          <div className="profile__info-grid">
            <div className="profile__info-item">
              <span className="profile__info-label">Full Name</span>
              <span className="profile__info-value">
                {user?.name || "-"}
              </span>
            </div>

            <div className="profile__info-item">
              <span className="profile__info-label">Email</span>
              <span className="profile__info-value">
                {user?.email || "-"}
              </span>
            </div>

            <div className="profile__info-item">
              <span className="profile__info-label">Phone</span>
              <span className="profile__info-value">
                {user?.phone || "-"}
              </span>
            </div>

            <div className="profile__info-item">
              <span className="profile__info-label">Member Since</span>
              <span className="profile__info-value">
                {user?.memberSince || "-"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Addresses */}
      {activeTab === "Addresses" && (
        <div className="profile__section">
          <div className="profile__section-header">
            <h3 className="profile__section-title">Saved Addresses</h3>
            <button className="profile__add-btn">+ Add New</button>
          </div>

          <div className="profile__addresses">
            {addresses.length === 0 ? (
              <p>No Addresses Found</p>
            ) : (
              addresses.map((addr) => (
                <div className="profile__address-card" key={addr._id}>
                  <div className="profile__address-top">
                    <span className="profile__address-label">
                      {addr.label}
                    </span>

                    {addr.default && (
                      <span className="profile__address-default">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="profile__address-text">
                    {addr.address}
                  </p>

                  <div className="profile__address-actions">
                    <button className="profile__action-btn">
                      Edit
                    </button>
                    <button className="profile__action-btn profile__action-btn--danger">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "Settings" && (
        <div className="profile__section">
          <h3 className="profile__section-title">Account Settings</h3>

          <div className="profile__settings-list">
            {[
              "Email Notifications",
              "SMS Alerts",
              "Order Updates",
              "Promotional Offers",
            ].map((setting) => (
              <div className="profile__setting-item" key={setting}>
                <span className="profile__setting-name">
                  {setting}
                </span>
                <div className="profile__toggle" />
              </div>
            ))}

            <div className="profile__setting-item profile__setting-item--danger">
              <span className="profile__setting-name">
                Delete Account
              </span>
              <button className="profile__action-btn profile__action-btn--danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}