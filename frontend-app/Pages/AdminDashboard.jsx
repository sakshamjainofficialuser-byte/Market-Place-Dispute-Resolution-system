import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import { MdOutlineGavel, MdOutlineDeliveryDining, MdLogout, MdShield } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem("adminUser"));
      if (!adminUser || adminUser.role !== "admin") {
        navigate("/admin-login");
        return;
      }
      setAdminData(adminUser);

      await axios.get(`${API_BASE_URL}/admin/verify`, {
        withCredentials: true,
      });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  if (loading) return <div className="admin-portal-loading">Verifying Administrative Access...</div>;

  return (
    <div className="admin-portal">
      <nav className="admin-portal__nav">
        <div className="admin-brand">
          <MdShield className="brand-icon" />
          <span>Admin Command Center</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <MdLogout /> Logout
        </button>
      </nav>

      <main className="admin-portal__content">
        <header className="portal-header">
          <h1>Welcome back, {adminData?.username}</h1>
          <p>What would you like to manage today?</p>
        </header>

        <div className="portal-grid">
          {/* Option 1: Dispute Resolution */}
          <div className="portal-card" onClick={() => navigate("/admin/disputes")}>
            <div className="card-icon-wrapper dispute-icon">
              <MdOutlineGavel />
            </div>
            <div className="card-body">
              <h3>Dispute Resolution</h3>
              <p>Review customer claims, inspect evidence, and finalize case outcomes.</p>
              <span className="card-action">Manage Disputes →</span>
            </div>
          </div>

          {/* Option 2: Delivery Management */}
          <div className="portal-card" onClick={() => navigate("/admin/assign-delivery")}>
            <div className="card-icon-wrapper delivery-icon">
              <MdOutlineDeliveryDining />
            </div>
            <div className="card-body">
              <h3>Delivery Logistics</h3>
              <p>Assign delivery personnel to pending orders and monitor fulfillment.</p>
              <span className="card-action">Assign Delivery Boys →</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-portal__footer">
        {/* <p>&copy; 2026 MarketPlace Dispute Resolution System | Administrative Panel</p> */}
      </footer>
    </div>
  );
}
