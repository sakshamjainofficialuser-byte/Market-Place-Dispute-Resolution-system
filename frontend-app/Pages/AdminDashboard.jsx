import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const statusColor = {
  Pending: "admin-badge--amber",
  "Under Review": "admin-badge--blue",
  Resolved: "admin-badge--green",
};

export default function AdminDashboard() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState(null); // disputeId being resolved
  const [form, setForm] = useState({ decision: "Refund", note: "" });
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAllDisputes();
  }, []);

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

  const handleResolve = async (disputeId) => {
    if (!form.note.trim()) {
      alert("Please enter resolution notes.");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/raiseissue/${disputeId}/resolve`,
        { decision: form.decision, note: form.note },
        { withCredentials: true }
      );
      setResolving(null);
      setForm({ decision: "Refund", note: "" });
      fetchAllDisputes(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Could not resolve dispute.");
    }
  };

  const filtered =
    filterStatus === "All"
      ? disputes
      : disputes.filter((d) => d.status === filterStatus);

  if (loading) return <div className="admin-dashboard__loading">Loading disputes...</div>;
  if (error) return <div className="admin-dashboard__error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h2 className="admin-dashboard__title">⚖️ Admin Dashboard</h2>
          <p className="admin-dashboard__subtitle">
            {disputes.length} total dispute{disputes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats pills */}
        <div className="admin-dashboard__stats">
          <div className="admin-stat admin-stat--amber">
            <span>{disputes.filter((d) => d.status === "Pending").length}</span>
            <label>Pending</label>
          </div>
          <div className="admin-stat admin-stat--blue">
            <span>{disputes.filter((d) => d.status === "Under Review").length}</span>
            <label>Under Review</label>
          </div>
          <div className="admin-stat admin-stat--green">
            <span>{disputes.filter((d) => d.status === "Resolved").length}</span>
            <label>Resolved</label>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-dashboard__filters">
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

      {/* Disputes Table */}
      {filtered.length === 0 ? (
        <div className="admin-dashboard__empty">No disputes in this category.</div>
      ) : (
        <div className="admin-dashboard__list">
          {filtered.map((d) => (
            <div className="admin-card" key={d._id}>
              <div className="admin-card__top">
                <div className="admin-card__info">
                  <p className="admin-card__id">#{d._id.slice(-8).toUpperCase()}</p>
                  <p className="admin-card__date">
                    {new Date(d.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="admin-card__people">
                  <div>
                    <span className="admin-card__label">Buyer</span>
                    <span className="admin-card__value">{d.buyerId?.username}</span>
                  </div>
                  <span className="admin-card__arrow">→</span>
                  <div>
                    <span className="admin-card__label">Seller</span>
                    <span className="admin-card__value">
                      {d.sellerId?.storeName || d.sellerId?.username}
                    </span>
                  </div>
                </div>

                <div className="admin-card__badges">
                  <span className={`admin-badge ${statusColor[d.status]}`}>{d.status}</span>
                  <span className="admin-type-badge">{d.fulfillmentType}</span>
                </div>
              </div>

              <div className="admin-card__reason">
                <span className="admin-card__label">Reason:</span> {d.reason}
              </div>

              {d.sellerResponse && (
                <div className="admin-card__seller-response">
                  <span className="admin-card__label">Seller Response:</span> {d.sellerResponse}
                </div>
              )}

              {/* Resolve Form */}
              {d.status !== "Resolved" && (
                <>
                  {resolving === d._id ? (
                    <div className="admin-card__resolve-form">
                      <select
                        value={form.decision}
                        onChange={(e) => setForm({ ...form, decision: e.target.value })}
                        className="admin-resolve-select"
                      >
                        <option value="Refund">💰 Refund</option>
                        <option value="Replacement">🔄 Replacement</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                      <textarea
                        className="admin-resolve-notes"
                        placeholder="Resolution notes (required)..."
                        value={form.note}
                        rows={3}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                      <div className="admin-resolve-actions">
                        <button
                          className="admin-btn admin-btn--secondary"
                          onClick={() => setResolving(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="admin-btn admin-btn--primary"
                          onClick={() => handleResolve(d._id)}
                        >
                          Confirm Resolution
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="admin-btn admin-btn--resolve"
                      onClick={() => setResolving(d._id)}
                    >
                      ⚖️ Resolve This Dispute
                    </button>
                  )}
                </>
              )}

              {d.status === "Resolved" && (
                <div className="admin-card__resolved-tag">✅ Already Resolved</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
