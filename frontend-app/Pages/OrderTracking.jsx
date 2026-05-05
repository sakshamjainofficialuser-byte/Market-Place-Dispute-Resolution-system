import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./OrderTracking.css"
import { getImageUrl } from "../src/utils/imageUrl";

import Toast from "../Components/Toast"
import QRScanner from "../Components/QRScanner"

export default function OrderTracking() {
    const { orderItemId } = useParams()
    const navigate = useNavigate()
    const [tracking, setTracking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showScanModal, setShowScanModal] = useState(false)
    const [notification, setNotification] = useState({ message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
    }

    useEffect(() => {
        fetchTimeline()
    }, [orderItemId])

    const fetchTimeline = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            const res = await axios.get(`${API_BASE_URL}/qr/timeline/${orderItemId}`, {
                withCredentials: true
            })
            setTracking(res.data.tracking)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="tracking-page">Loading...</div>

    return (
        <div className="tracking-page">
            <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ ...notification, message: "" })} 
            />
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            
            <div className="tracking-header">
                <div>
                    <h2>📦 Order Tracking</h2>
                    <p>Item ID: {orderItemId?.slice(-6).toUpperCase()}</p>
                </div>
                <div className={`status-pill status--${tracking?.currentStatus}`}>
                    {tracking?.currentStatus?.replace(/_/g, ' ')}
                </div>
            </div>

            {tracking?.currentStatus === "in_transit" && (
                <div className="buyer-action-card">
                    <h3>Confirm Delivery</h3>
                    <p>Has the delivery boy arrived? Scan the QR code to confirm receipt and verify product condition.</p>
                    <button className="confirm-delivery-btn" onClick={() => setShowScanModal(true)}>
                        🎁 Receive Product
                    </button>
                </div>
            )}

            <div className="timeline-container">
                {tracking?.timeline.map((step, index) => (
                    <div className="timeline-step" key={index}>
                        <div className="step-marker"></div>
                        <div className="step-content">
                            <div className="step-header">
                                <span className="step-stage">{step.stage.replace(/_/g, ' ')}</span>
                                <span className="step-time">{new Date(step.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="step-actor">By: {step.scannedBy?.username} ({step.scannedBy?.role})</p>
                            {step.notes && <p className="step-notes">"{step.notes}"</p>}
                            
                            {step.photos && step.photos.length > 0 && (
                                <div className="step-photos">
                                    {step.photos.map((photo, pIdx) => (
                                        <img key={pIdx} src={getImageUrl(photo.url)} alt="Proof" className="step-photo" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showScanModal && (
                <BuyerScanModal 
                    orderItemId={orderItemId}
                    onClose={() => setShowScanModal(false)}
                    onRefresh={fetchTimeline}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

function BuyerScanModal({ orderItemId, onClose, onRefresh, showToast }) {
    const [qrData, setQrData] = useState("")
    const [photos, setPhotos] = useState([])
    const [notes, setNotes] = useState("")
    const [isScanning, setIsScanning] = useState(false)

    const onScanSuccess = (decodedText) => {
        setQrData(decodedText);
        setIsScanning(false);
        showToast("✅ QR Code Captured!", "success");
    };

    const handleScan = async () => {
        if (!qrData) return showToast("⚠️ Please scan the QR code first.", "error")
        if (photos.length === 0) return showToast("⚠️ Please upload product photos for your protection.", "error")

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            const formData = new FormData();
            formData.append("qrData", qrData);
            formData.append("notes", notes || "Received by buyer");
            photos.forEach(file => formData.append("photos", file));

            await axios.post(`${API_BASE_URL}/qr/scan`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })

            showToast("✅ Delivery confirmed! Enjoy your product.")
            onRefresh()
            onClose()
        } catch (err) {
            showToast("Confirmation failed: " + (err.response?.data?.message || err.message), "error")
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Confirm Receipt</h3>
                <div className="qr-section">
                    <div className="qr-input">
                        {isScanning ? (
                            <div className="scanner-container">
                                <QRScanner onScanSuccess={onScanSuccess} onScanError={() => {}} />
                                <button className="cancel-scan-btn" onClick={() => setIsScanning(false)}>Stop Scanner</button>
                            </div>
                        ) : qrData ? (
                            <div className="qr-result-preview">
                                <p>✅ Package Verified</p>
                                <button className="rescan-btn" onClick={() => setIsScanning(true)}>Scan Again</button>
                            </div>
                        ) : (
                            <button className="start-scan-btn" onClick={() => setIsScanning(true)}>
                                📷 Scan Delivery QR
                            </button>
                        )}
                    </div>
                    <div className="photo-upload">
                        <label>Verify Condition (Photos Required):</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(Array.from(e.target.files))} />
                    </div>
                    <div className="notes-input">
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about the delivery?" />
                    </div>
                    <button onClick={handleScan} className="scan-btn">Finalize Delivery</button>
                </div>
                <button onClick={onClose} className="close-btn">Cancel</button>
            </div>
        </div>
    )
}
