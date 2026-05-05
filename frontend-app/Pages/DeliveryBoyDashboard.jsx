import { useState, useEffect } from "react"
import axios from "axios"
import "./DeliveryBoyDashboard.css"
import Toast from "../Components/Toast"
import { getImageUrl } from "../src/utils/imageUrl";

export default function DeliveryBoyDashboard() {
    const [deliveryItems, setDeliveryItems] = useState([])
    const [profile, setProfile] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [notification, setNotification] = useState({ message: "", type: "success" });

    const [loading, setLoading] = useState(true)

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
    }

    useEffect(() => {
        fetchDeliveries()
    }, [])

    const fetchDeliveries = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            const res = await axios.get(`${API_BASE_URL}/delivery-boy/my-deliveries`, {
                withCredentials: true
            })
            setDeliveryItems(res.data.deliveryItems)
            setProfile(res.data.profile)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="delivery-dashboard">
            <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ ...notification, message: "" })} 
            />
            <div className="delivery-dashboard__header">
                <h2>📦 My Delivery Dashboard</h2>
                {profile && (
                    <div className="delivery-stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{profile.stats?.rating} ⭐</span>
                            <span className="stat-label">Rating</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{profile.stats?.totalDeliveries}</span>
                            <span className="stat-label">Total Deliveries</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{profile.vehicleType?.toUpperCase()}</span>
                            <span className="stat-label">Vehicle</span>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="section-title">Active Tasks</h3>


            {loading ? (
                <p>Loading...</p>
            ) : deliveryItems.length === 0 ? (
                <p>No active deliveries</p>
            ) : (
                <div className="delivery-list">
                    {deliveryItems.map(item => (
                        <div className="delivery-card" key={item._id}>
                            <div className="delivery-card__header">
                                <img 
                                    src={getImageUrl(item.productId.images[0])} 
                                    alt={item.productId.title}
                                    width="80"
                                />
                                <div>
                                    <h3>{item.productId.title}</h3>
                                    <p className="order-id">Order #{item.orderId._id.slice(-6)}</p>
                                </div>
                            </div>

                            <div className="delivery-card__info">
                                <div className="location-block">
                                    <h4>📍 Pickup From:</h4>
                                    <p>{item.sellerId.username}</p>
                                    <p>{item.sellerId?.campusProfile?.hostel}</p>
                                    <p>📞 {item.sellerId.phoneNumber}</p>
                                </div>

                                <div className="location-block">
                                    <h4>🎯 Deliver To:</h4>
                                    <p>{item.buyerInfo.username}</p>
                                    <p>{item.buyerInfo?.campusProfile?.hostel}</p>
                                    <p>📞 {item.buyerInfo.phoneNumber}</p>
                                </div>
                            </div>

                            <div className="delivery-card__status">
                                <span className={`status status--${item.deliveryStatus}`}>
                                    {item.deliveryStatus.replace('_', ' ')}
                                </span>
                            </div>

                            <button 
                                className="delivery-card__btn"
                                onClick={() => setSelectedItem(item)}
                            >
                                Scan QR & Update
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedItem && (
                <ScanQRModal 
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onRefresh={fetchDeliveries}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

function ScanQRModal({ item, onClose, onRefresh, showToast }) {
    const [qrData, setQrData] = useState("")
    const [photos, setPhotos] = useState([])
    const [notes, setNotes] = useState("")

    // For demo purposes, we auto-fill the QR data since we don't have a camera library active
    useEffect(() => {
        const qrPayload = {
            orderItemId: item._id,
            orderId: item.orderId._id,
            productId: item.productId._id,
            timestamp: Date.now()
        }
        setQrData(JSON.stringify(qrPayload))
    }, [item])

    const handleScan = async () => {
        if (photos.length === 0) {
            showToast("⚠️ Please upload at least one photo as evidence.", "error")
            return
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            
            const formData = new FormData();
            formData.append("qrData", qrData);
            formData.append("notes", notes || "Product received in good condition");
            
            // Append each file to the "photos" field
            photos.forEach(file => {
                formData.append("photos", file);
            });

            const res = await axios.post(`${API_BASE_URL}/qr/scan`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            showToast(`✅ QR Scanned! Stage updated to: ${res.data.stage}`)
            onRefresh()
            onClose()
        } catch (err) {
            console.log(err)
            showToast("QR scan failed: " + (err.response?.data?.message || err.message), "error")
        }
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files)
        setPhotos(files) // Store actual File objects, not blob URLs
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Scan QR Code</h3>

                <div className="qr-section">
                    <p>Show QR code from seller's phone or paper</p>
                    
                    <div className="qr-input">
                        <label>QR Data (for demo - auto-filled):</label>
                        <textarea
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            placeholder="Scan QR or paste data here"
                            readOnly
                        />
                    </div>

                    <div className="photo-upload">
                        <label>Upload Product Condition Photos:</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                        {photos.length > 0 && (
                            <p>✅ {photos.length} photos selected</p>
                        )}
                    </div>

                    <div className="notes-input">
                        <label>Notes (optional):</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any observations about product condition"
                        />
                    </div>

                    <button onClick={handleScan} className="scan-btn">
                        Submit Scan
                    </button>
                </div>

                <button onClick={onClose} className="close-btn">Cancel</button>
            </div>
        </div>
    )
}
