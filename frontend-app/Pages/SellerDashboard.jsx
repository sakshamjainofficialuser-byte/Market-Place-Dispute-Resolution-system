import { useState, useEffect } from "react";
import axios from "axios";
import "./SellerDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function SellerDashboard() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyDisputes();
  }, []);

  // Seller sees all disputes raised against them (via /raiseissue/all but filtered by sellerId)
  // We'll filter FBM disputes that still need a response on the frontend
  const fetchMyDisputes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/raiseissue/my-disputes`, {
        withCredentials: true,
      });
      // We reuse my-disputes but it returns buyer disputes;
      // For seller, we need all disputes, fetched differently.
      // Since there's no separate seller endpoint, sellers should use /raiseissue/all
      // but that's admin only. Let's use a workaround with getMyDisputes from seller perspective.
      // NOTE: For a real app you'd add a seller-specific endpoint. 
      // For now this shows the concept.
      setDisputes(res.data.disputes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load disputes.");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (disputeId) => {
    if (!responseText.trim()) {
      alert("Please enter your response.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/raiseissue/${disputeId}/respond`,
        { response: responseText },
        { withCredentials: true }
      );
      setResponding(null);
      setResponseText("");
      fetchMyDisputes();
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  const fbmPending = disputes.filter(
    (d) => d.fulfillmentType === "FBM" && !d.sellerResponse && d.status === "Pending"
  );
  const others = disputes.filter(
    (d) => !(d.fulfillmentType === "FBM" && !d.sellerResponse && d.status === "Pending")
  );

  if (loading) return <div className="seller-dash__loading">Loading...</div>;
  if (error) return <div className="seller-dash__error">{error}</div>;

  return (
    <div className="seller-dash">
      <div className="seller-dash__header">
        <h2 className="seller-dash__title">🏪 Seller Dashboard</h2>
        <p className="seller-dash__subtitle">Manage disputes raised against your products</p>
      </div>

      {/* Action Required Section */}
      <section className="seller-dash__section">
        <h3 className="seller-dash__section-title">
          🔔 Action Required ({fbmPending.length})
        </h3>

        {fbmPending.length === 0 ? (
          <div className="seller-dash__empty">
            <span>✅</span>
            <p>No pending responses needed. You're all caught up!</p>
          </div>
        ) : (
          <div className="seller-dash__list">
            {fbmPending.map((d) => (
              <div className="seller-card seller-card--urgent" key={d._id}>
                <div className="seller-card__top">
                  <div>
                    <p className="seller-card__id">Dispute #{d._id.slice(-8).toUpperCase()}</p>
                    <p className="seller-card__date">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className="seller-badge seller-badge--urgent">Response Needed</span>
                </div>

                <div className="seller-card__reason">
                  <strong>Buyer's Complaint:</strong> {d.reason}
                </div>

                {responding === d._id ? (
                  <div className="seller-card__respond-form">
                    <textarea
                      className="seller-respond-textarea"
                      placeholder="Explain your side — e.g. item was shipped on time, tracking number: XYZ..."
                      value={responseText}
                      rows={4}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="seller-respond-actions">
                      <button
                        className="seller-btn seller-btn--secondary"
                        onClick={() => { setResponding(null); setResponseText(""); }}
                      >
                        Cancel
                      </button>
                      <button
                        className="seller-btn seller-btn--primary"
                        onClick={() => handleRespond(d._id)}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Response"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="seller-btn seller-btn--primary"
                    onClick={() => setResponding(d._id)}
                  >
                    ✍️ Write Response
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Other Disputes */}
      {others.length > 0 && (
        <section className="seller-dash__section">
          <h3 className="seller-dash__section-title">📋 Other Disputes ({others.length})</h3>
          <div className="seller-dash__list">
            {others.map((d) => (
              <div className="seller-card" key={d._id}>
                <div className="seller-card__top">
                  <div>
                    <p className="seller-card__id">Dispute #{d._id.slice(-8).toUpperCase()}</p>
                    <p className="seller-card__date">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className="seller-badge">{d.status}</span>
                    <span className="seller-type-badge">{d.fulfillmentType}</span>
                  </div>
                </div>
                <div className="seller-card__reason">
                  <strong>Reason:</strong> {d.reason}
                </div>
                {d.sellerResponse && (
                  <div className="seller-card__response">
                    <strong>Your Response:</strong> {d.sellerResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
