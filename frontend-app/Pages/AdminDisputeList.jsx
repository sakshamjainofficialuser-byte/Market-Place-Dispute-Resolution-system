import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import { MdOutlineGavel, MdArrowBack, MdCalendarToday, MdOutlinePerson, MdChevronRight, MdOutlineFilterList } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const statusColor = {
  Pending: "admin-badge--amber",
  "Under Review": "admin-badge--blue",
  Resolved: "admin-badge--green",
};

export default function AdminDisputeList() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

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

      await axios.get(`${API_BASE_URL}/admin/verify`, {
        withCredentials: true,
      });

      fetchAllDisputes();
    } catch (err) {
      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    }
  };

  const fetchAllDisputes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/raiseissue/all`, {
        withCredentials: true,
      });
      setDisputes(res.data.disputes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load disputes. Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filterStatus === "All"
      ? disputes
      : disputes.filter((d) => d.status === filterStatus);

  if (loading) return <div className="admin-portal-loading">Fetching Dispute Records...</div>;
  if (error) return <div className="admin-dashboard__error">{error}</div>;

  return (
    <div className="admin-dispute-list-page">
      <div className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div className="header-left">
            <button className="back-to-portal" onClick={() => navigate("/admin")}>
              <MdArrowBack /> Back to Portal
            </button>
            <div className="title-section">
              <h2 className="admin-dashboard__title">⚖️ Dispute Management</h2>
              <p className="admin-dashboard__subtitle">
                Review and resolve {disputes.length} active case records
              </p>
            </div>
          </div>

          <div className="admin-dashboard__stats">
            <div className="admin-stat admin-stat--amber">
              <span>{disputes.filter((d) => d.status === "Pending").length}</span>
              <label>Pending</label>
            </div>
            <div className="admin-stat admin-stat--blue">
              <span>{disputes.filter((d) => d.status === "Under Review").length}</span>
              <label>In Review</label>
            </div>
            <div className="admin-stat admin-stat--green">
              <span>{disputes.filter((d) => d.status === "Resolved").length}</span>
              <label>Resolved</label>
            </div>
          </div>
        </header>

        <div className="admin-dashboard__filters">
          <div className="filter-label"><MdOutlineFilterList /> Filter Cases:</div>
          {["All", "Pending", "Under Review", "Resolved"].map((s) => (
            <button
              key={s}
              className={`admin-filter-btn ${filterStatus === s ? "admin-filter-btn--active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="admin-dashboard__empty">
            <MdOutlineGavel className="empty-icon" />
            <p>No disputes found in this category.</p>
          </div>
        ) : (
          <div className="admin-dashboard__list">
            {filtered.map((d) => (
              <div 
                className={`admin-case-card ${d.status === "Resolved" ? "case-resolved" : ""}`} 
                key={d._id}
                onClick={() => navigate(`/admin/dispute/${d._id}`)}
              >
                <div className="case-card__header">
                  <div className="case-id">
                    <span className="case-label">CASE ID</span>
                    <span className="case-value">#{d._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="case-status">
                    <span className={`admin-badge ${statusColor[d.status]}`}>{d.status}</span>
                    <span className="fulfillment-badge">{d.fulfillmentType}</span>
                  </div>
                </div>

                <div className="case-card__body">
                  <div className="case-participants">
                    <div className="participant">
                      <MdOutlinePerson className="icon" />
                      <div>
                        <span className="p-label">Buyer</span>
                        <span className="p-name">{d.buyerId?.username}</span>
                      </div>
                    </div>
                    <div className="participant-arrow"><MdChevronRight /></div>
                    <div className="participant">
                      <MdOutlinePerson className="icon" />
                      <div>
                        <span className="p-label">Seller</span>
                        <span className="p-name">{d.sellerId?.storeName || d.sellerId?.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="case-meta">
                    <div className="meta-item">
                      <MdCalendarToday /> {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <div className="case-preview-reason">
                      <strong>Issue:</strong> {d.reason.length > 80 ? d.reason.substring(0, 80) + "..." : d.reason}
                    </div>
                  </div>
                </div>

                <div className="case-card__footer">
                  <span className="view-details-link">
                    {d.status === "Resolved" ? "View Archive Details" : "Inspect Evidence & Resolve"}
                    <MdChevronRight />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
