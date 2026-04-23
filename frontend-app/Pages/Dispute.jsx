import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dispute.css";

// ✅ Fixed: was hardcoded to http://localhost:5002
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Dispute() {
  // ✅ Fixed: route now includes orderItemId (see App.jsx)
  const { orderId, orderItemId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for the dispute.");
      return;
    }
    if (!file) {
      setError("Please upload an image or PDF as evidence.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1 — Create the Dispute
      // ✅ Fixed: now sends orderItemId (not orderId) — backend needs it to find sellerId & fulfillmentType
      const disputeRes = await axios.post(
        `${API_BASE_URL}/raiseissue/raise`,
        {
          orderItemId,   // ✅ the key fix
          reason,
        },
        { withCredentials: true }
      );

      const disputeId = disputeRes.data?.dispute?._id;
      if (!disputeId) throw new Error("Could not retrieve dispute ID from response.");

      // Step 2 — Upload Evidence
      const formData = new FormData();
      formData.append("file", file);
      formData.append("disputeId", disputeId);

      await axios.post(`${API_BASE_URL}/evidence/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("✅ Dispute raised successfully! Redirecting...");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      console.error("Dispute error:", err);
      setError(err.response?.data?.message || err.message || "Failed to raise dispute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dispute">
      <div className="dispute__card">
        <h2 className="dispute__title">Raise a Dispute</h2>
        <p className="dispute__subtitle">Order ID: {orderId}</p>

        {error && <div className="dispute__error">{error}</div>}
        {success && (
          <div className="dispute__error" style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dispute__form">
          <div className="dispute__form-group">
            <label className="dispute__label">Reason for Dispute</label>
            <textarea
              className="dispute__textarea"
              placeholder="Describe the issue in detail — e.g. item not received, wrong item delivered, damaged product..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="dispute__form-group">
            <label className="dispute__label">Evidence (Image / PDF)</label>
            <div className="dispute__file-upload">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                required
                id="file-upload"
                className="dispute__file-input"
              />
              <label htmlFor="file-upload" className="dispute__file-label">
                {file ? `📎 ${file.name}` : "📁 Click to upload an image or PDF"}
              </label>
            </div>
          </div>

          <div className="dispute__actions">
            <button
              type="button"
              className="dispute__btn dispute__btn--secondary"
              onClick={() => navigate("/orders")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dispute__btn dispute__btn--primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
