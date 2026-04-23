import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dispute.css";

const API_BASE_URL = "http://localhost:5002";

export default function Dispute() {
  const { orderId, sellerId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("FBM");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Please upload an image or document as evidence.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Dispute
      const disputeRes = await axios.post(
        `${API_BASE_URL}/raiseissue/raise`,
        {
          orderId,
          sellerId,
          buyerId: localStorage.getItem("userId") || "69cedfb339a7f19f6bf97cca", // Fallback buyer ID
          reason,
          fulfillmentType,
        },
        { withCredentials: true }
      );

      // Extract disputeId (assuming standard Mongoose returned structure: res.data.dispute._id or similar)
      const disputeId = disputeRes.data?.dispute?._id || disputeRes.data?._id || disputeRes.data?.id;

      if (!disputeId) {
        throw new Error("Could not retrieve dispute ID from response.");
      }

      // 2. Upload Evidence
      const formData = new FormData();
      formData.append("file", file);
      formData.append("disputeId", disputeId);

      await axios.post(
        `${API_BASE_URL}/evidence/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Dispute raised successfully along with evidence.");
      navigate("/orders");
    } catch (err) {
      console.error("Dispute error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to raise dispute"
      );
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

        <form onSubmit={handleSubmit} className="dispute__form">
          <div className="dispute__form-group">
            <label className="dispute__label">Reason for Dispute</label>
            <textarea
              className="dispute__textarea"
              placeholder="Describe the issue in detail..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="dispute__form-group">
            <label className="dispute__label">Fulfillment Type</label>
            <select
              className="dispute__select"
              value={fulfillmentType}
              onChange={(e) => setFulfillmentType(e.target.value)}
            >
              <option value="FBM">FBM (Fulfilled by Merchant)</option>
              <option value="FBA">FBA (Fulfilled by Admin)</option>
            </select>
          </div>

          <div className="dispute__form-group">
            <label className="dispute__label">Evidence (Image/PDF)</label>
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
                {file ? file.name : "Click to upload an image or PDF"}
              </label>
            </div>
          </div>

          <div className="dispute__actions">
            <button
              type="button"
              className="dispute__btn dispute__btn--secondary"
              onClick={() => navigate("/orders")}
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
