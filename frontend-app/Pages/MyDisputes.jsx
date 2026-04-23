import { useState, useEffect } from "react";
import axios from "axios";
import "./MyDisputes.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const statusColor = {
  Pending: "dispute-badge--amber",
  "Under Review": "dispute-badge--blue",
  Resolved: "dispute-badge--green",
};

const decisionIcon = {
  Refund: "💰",
  Replacement: "🔄",
  Rejected: "❌",
};

export default function MyDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchMyDisputes();
  }, []);

  const fetchMyDisputes = async () => {
    try {
      console.log("DEBUG: Fetching disputes from:", `${API_BASE_URL}/raiseissue/my-disputes`);
      const res = await axios.get(`${API_BASE_URL}/raiseissue/my-disputes`, {
        withCredentials: true,
      });
      setDisputes(res.data.disputes || []);
    } catch (err) {
      console.error("DEBUG: MyDisputes fetch failed:", err);
      const serverMsg = err.response?.data?.message;
      const errorMsg = serverMsg || err.message || "Unknown Error";
      setError(`[FRONTEND_LATEST] Server Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  if (loading) return <div className="my-disputes__loading">Loading disputes...</div>;
  if (error) return <div className="my-disputes__error">{error}</div>;

  return (
    <div className="my-disputes">
      <div className="my-disputes__header">
        <h2 className="my-disputes__title">My Disputes</h2>
        <p className="my-disputes__subtitle">
          {disputes.length} dispute{disputes.length !== 1 ? "s" : ""} raised
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="my-disputes__empty">
          <span className="my-disputes__empty-icon">🕊️</span>
          <p>No disputes raised yet. Great!</p>
        </div>
      ) : (
        <div className="my-disputes__list">
          {disputes.map((d) => (
            <div className="my-disputes__card" key={d._id}>
              {/* Card Header */}
              <div
                className="my-disputes__card-top"
                onClick={() => toggleExpand(d._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="my-disputes__card-left">
                  <span className="my-disputes__icon">⚠️</span>
                  <div>
                    <p className="my-disputes__id">Dispute #{d._id.slice(-8).toUpperCase()}</p>
                    <p className="my-disputes__date">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="my-disputes__card-right">
                  <span className={`dispute-badge ${statusColor[d.status] || ""}`}>
                    {d.status}
                  </span>
                  <span className="my-disputes__type-badge">
                    {d.fulfillmentType}
                  </span>
                  <span className="my-disputes__chevron">
                    {expanded === d._id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === d._id && (
                <div className="my-disputes__details">
                  <div className="my-disputes__detail-grid">
                    <div className="my-disputes__detail-item">
                      <span className="my-disputes__detail-label">Seller</span>
                      <span className="my-disputes__detail-value">
                        {d.sellerId?.storeName || d.sellerId?.username || "N/A"}
                      </span>
                    </div>
                    <div className="my-disputes__detail-item">
                      <span className="my-disputes__detail-label">Order Total</span>
                      <span className="my-disputes__detail-value">
                        ₹{d.orderId?.totalAmount?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                    <div className="my-disputes__detail-item" style={{ gridColumn: "1 / -1" }}>
                      <span className="my-disputes__detail-label">Reason</span>
                      <span className="my-disputes__detail-value">{d.reason}</span>
                    </div>
                    {d.sellerResponse && (
                      <div className="my-disputes__detail-item" style={{ gridColumn: "1 / -1" }}>
                        <span className="my-disputes__detail-label">Seller Response</span>
                        <span className="my-disputes__detail-value">{d.sellerResponse}</span>
                      </div>
                    )}
                  </div>

                  {/* Resolution Block */}
                  {d.resolution ? (
                    <div className="my-disputes__resolution">
                      <h4 className="my-disputes__resolution-title">
                        {decisionIcon[d.resolution.decision]} Resolution
                      </h4>
                      <div className="my-disputes__resolution-grid">
                        <div>
                          <span className="my-disputes__detail-label">Decision</span>
                          <span
                            className="my-disputes__decision"
                            data-decision={d.resolution.decision}
                          >
                            {d.resolution.decision}
                          </span>
                        </div>
                        <div>
                          <span className="my-disputes__detail-label">Notes</span>
                          <span className="my-disputes__detail-value">{d.resolution.note}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="my-disputes__pending-msg">
                      ⏳ Your dispute is being reviewed. We'll update you soon.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
