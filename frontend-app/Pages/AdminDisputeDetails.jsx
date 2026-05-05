import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDisputeDetails.css";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineGavel, MdOutlineDescription, MdOutlinePhotoLibrary, MdOutlineHistory } from "react-icons/md";
import Toast from "../Components/Toast";
import { getImageUrl } from "../src/utils/imageUrl";

const AdminDisputeDetails = () => {
    const { disputeId } = useParams();
    const navigate = useNavigate();
    const [dispute, setDispute] = useState(null);
    const [evidence, setEvidence] = useState([]);
    const [resolution, setResolution] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [form, setForm] = useState({ decision: "Refund", note: "" });
    const [resolving, setResolving] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "success" });

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
    };

    useEffect(() => {
        fetchDetails();
    }, [disputeId]);

    const fetchDetails = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/raiseissue/${disputeId}`, {
                withCredentials: true,
            });
            setDispute(res.data.dispute);
            setEvidence(res.data.evidence || []);
            setResolution(res.data.resolution);
            setTracking(res.data.tracking);


            // If it's currently Pending, move it to Under Review automatically
            if (res.data.dispute.status === "Pending") {
                startReview();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dispute details.");
        } finally {
            setLoading(false);
        }
    };

    const startReview = async () => {
        try {
            const res = await axios.put(
                `${API_BASE_URL}/raiseissue/${disputeId}/review`,
                {},
                { withCredentials: true }
            );
            // Update local state to show the new status
            setDispute(prev => ({ ...prev, status: "Under Review" }));
        } catch (err) {
            console.error("Failed to update status to Under Review:", err);
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!form.note.trim()) {
            showToast("Please enter resolution notes.", "error");
            return;
        }
        setResolving(true);
        try {
            await axios.post(
                `${API_BASE_URL}/raiseissue/${disputeId}/resolve`,
                { decision: form.decision, note: form.note },
                { withCredentials: true }
            );
            showToast("Dispute resolved successfully!");
            fetchDetails(); // refresh to show resolution
        } catch (err) {
            showToast(err.response?.data?.message || "Could not resolve dispute.", "error");
        } finally {
            setResolving(false);
        }
    };

    if (loading) return <div className="details-loading">Loading dispute details...</div>;
    if (error) return <div className="details-error">{error}</div>;
    if (!dispute) return <div className="details-error">Dispute not found.</div>;

    const statusColor = {
        Pending: "badge-amber",
        "Under Review": "badge-blue",
        Resolved: "badge-green",
    };

    return (
        <div className="admin-details-container">
            <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ ...notification, message: "" })} 
            />
            <header className="details-header">
                <button className="back-btn" onClick={() => navigate("/admin")}>
                    <IoArrowBack /> Back to Dashboard
                </button>
                <div className="header-info">
                    <h1>Dispute #{dispute._id.slice(-8).toUpperCase()}</h1>
                    <span className={`status-badge ${statusColor[dispute.status]}`}>
                        {dispute.status}
                    </span>
                </div>
            </header>

            <div className="details-grid">
                {/* Left Column: Dispute Info */}
                <section className="details-card info-section">
                    <h2 className="section-title"><MdOutlineDescription /> Case Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Reason</label>
                            <p>🔍 {dispute.reason}</p>
                        </div>
                        <div className="info-item">
                            <label>Fulfillment</label>
                            <p>📦 {dispute.fulfillmentType}</p>
                        </div>
                        <div className="info-item">
                            <label>Buyer</label>
                            <p>👤 {dispute.buyerId?.username} ({dispute.buyerId?.email})</p>
                        </div>
                        <div className="info-item">
                            <label>Seller</label>
                            <p>🏪 {dispute.sellerId?.storeName || dispute.sellerId?.username}</p>
                        </div>
                        <div className="info-item">
                            <label>Date Raised</label>
                            <p>📅 {new Date(dispute.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {dispute.sellerResponse && (
                        <div className="seller-response-box">
                            <label>Seller Response (FBM)</label>
                            <p>{dispute.sellerResponse}</p>
                        </div>
                    )}
                </section>

                {/* Right Column: Evidence Photos */}
                <section className="details-card evidence-section">

                    <h2 className="section-title"><MdOutlinePhotoLibrary /> Evidence Photos</h2>
                    {evidence.length === 0 ? (
                        <p className="no-evidence">No evidence photos uploaded for this dispute.</p>
                    ) : (
                        <div className="evidence-gallery">
                            {evidence.map((ev, index) => {
                                const fullUrl = getImageUrl(ev.fileUrl);
                                
                                return (
                                    <div key={ev._id} className="evidence-item">
                                        <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                                            <img 
                                                src={fullUrl} 
                                                alt={`Evidence ${index + 1}`} 
                                                className="evidence-img"
                                            />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* New Section: Delivery Tracking Timeline */}
                <section className="details-card tracking-section">
                    <h2 className="section-title"><MdOutlineHistory /> Delivery Tracking Timeline</h2>

                    {!tracking ? (
                        <p className="no-tracking">No delivery tracking data available for this item.</p>
                    ) : (
                        <div className="admin-timeline">
                            {tracking.timeline.map((step, idx) => (
                                <div key={idx} className="admin-timeline-step">
                                    <div className="step-info">
                                        <div className="step-main">
                                            <span className="step-stage">{step.stage.replace(/_/g, ' ').toUpperCase()}</span>
                                            <span className="step-date">{new Date(step.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="step-by">Performed by: <strong>{step.scannedBy?.username}</strong> ({step.scannedBy?.role})</p>
                                        {step.notes && <p className="step-notes">"{step.notes}"</p>}
                                    </div>
                                    
                                    {step.photos && step.photos.length > 0 && (
                                        <div className="step-evidence">
                                            {step.photos.map((photo, pIdx) => {
                                                const fullUrl = getImageUrl(photo.url);
                                                
                                                return (
                                                    <a 
                                                        key={pIdx} 
                                                        href={fullUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        <div className="timeline-photo-container">
                                                            {fullUrl.startsWith('blob:') ? (
                                                                <div className="photo-error">
                                                                    <span>⚠️ Image Expired</span>
                                                                    <small>(Local Preview Only)</small>
                                                                </div>
                                                            ) : (
                                                                <img 
                                                                    src={fullUrl} 
                                                                    alt="Handoff Proof" 
                                                                    className="timeline-photo" 
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://via.placeholder.com/150?text=Image+Missing';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                {/* Bottom: Resolution */}
                <section className="details-card resolution-section">
                    <h2 className="section-title"><MdOutlineGavel /> Resolution</h2>
                    
                    {dispute.status === "Resolved" && resolution ? (
                        <div className="resolution-details">
                            <div className="res-item">
                                <label>Decision</label>
                                <p className="res-decision">⚖️ {resolution.decision}</p>
                            </div>
                            <div className="res-item">
                                <label>Notes</label>
                                <p>📝 {resolution.note}</p>
                            </div>
                            <div className="res-item">
                                <label>Resolved By</label>
                                <p>👮 {resolution.resolvedBy?.username} on {new Date(resolution.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleResolve} className="resolve-form">
                            <div className="form-group">
                                <label>Select Decision</label>
                                <select 
                                    value={form.decision} 
                                    onChange={(e) => setForm({...form, decision: e.target.value})}
                                >
                                    <option value="Refund">💰 Refund</option>
                                    <option value="Replacement">🔄 Replacement</option>
                                    <option value="Rejected">❌ Rejected</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Internal Notes</label>
                                <textarea 
                                    placeholder="Explain the reason for this decision..."
                                    value={form.note}
                                    onChange={(e) => setForm({...form, note: e.target.value})}
                                    rows={4}
                                />
                            </div>
                            <button type="submit" className="confirm-btn" disabled={resolving}>
                                {resolving ? "Processing..." : "Finalize Resolution"}
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminDisputeDetails;
