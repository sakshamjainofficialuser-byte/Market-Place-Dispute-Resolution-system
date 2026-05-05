import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";
const API_BASE_URL = import.meta.env.VITE_API_URL

const statusColor = {
  Delivered: "status--green",
  Shipped: "status--blue",
  Processing: "status--amber",
  Cancelled: "status--red",
};

import Toast from "../Components/Toast"
import { getImageUrl } from "../src/utils/imageUrl";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
  }


  const filters = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/order/my-orders`, {
        withCredentials: true
      });
      setOrders(res.data);
      console.log(res.data)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);
  const filtered =
    filter === "All"
      ? ordersList
      : ordersList.filter((o) => o.status === filter || (o.status && o.status.toLowerCase() === filter.toLowerCase()));

  console.log(filtered)

  return (
    <div className="orders">
      <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ ...notification, message: "" })} 
      />
      <h2 className="orders__title">My Orders</h2>

      {/* Filters */}
      <div className="orders__filters">
        {filters.map((f) => (
          <button
            key={f}
            className={`orders__filter-btn ${filter === f ? "orders__filter-btn--active" : ""
              }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders__list">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No Orders Found</p>
        ) : (
          filtered.map((order) => (
            <div className="orders__card" key={order._id}>

              {/* Top */}
              <div className="orders__card-top">
                <div className="orders__item-info">
                  <span className="orders__item-emoji">
                    {order.emoji || "📦"}
                  </span>
                  <div>
                    <p className="orders__item-name">
                      Order ID: {order._id}
                    </p>
                    <p className="orders__item-meta">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || "N/A")}
                    </p>
                  </div>
                </div>

                <div className="orders__card-right">
                  <p className="orders__item-price" style={{ marginBottom: "5px" }}>
                    Total: ₹{order.totalAmount?.toLocaleString() || 0}
                  </p>
                  <span
                    className={`orders__status ${statusColor[order.status] || ""
                      }`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="orders__items-list" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {order.items?.map((item) => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "rgba(255,255,255,0.5)", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      {item.productId?.images?.[0] ? (
                        <img src={getImageUrl(item.productId.images[0])} alt={item.productId?.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      ) : (
                        <div style={{ width: "50px", height: "50px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛒</div>
                      )}
                      <div>
                        <p style={{ fontWeight: "600", fontSize: "14px" }}>{item.productId?.title || "Product Name"}</p>
                        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Qty: {item.quantity} · ₹{item.productId?.price}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {(item.deliveryStatus === "in_transit" || item.deliveryStatus === "delivered") && (
                        <button 
                          className="orders__action-btn orders__action-btn--primary"
                          onClick={() => setSelectedItem({ ...item, orderId: order })}
                          disabled={item.deliveryStatus === "delivered"}
                        >
                          {item.deliveryStatus === "delivered" ? "✅ Received" : "📦 Confirm Receipt"}
                        </button>
                      )}
                      <button 
                        className={`orders__action-btn ${item.disputeRaised ? "orders__action-btn--disabled" : "orders__action-btn--danger"}`}
                        onClick={() => !item.disputeRaised && navigate(`/raise-dispute/${order._id}/${item._id}`)}
                        disabled={item.disputeRaised}
                        title={item.disputeRaised ? "A dispute has already been raised for this item" : ""}
                      >
                        {item.disputeRaised ? "⚠️ Dispute Raised" : "Raise Dispute"}
                      </button>
                    </div>


                  </div>
                ))}
              </div>

              {/* Tracker */}
              {order.status !== "Cancelled" && order.steps?.length > 0 && (
                <div className="orders__tracker">
                  {order.steps.map((step, i) => (
                    <div className="orders__step" key={i}>
                      <div
                        className={`orders__step-dot ${i < order.currentStep
                          ? "orders__step-dot--done"
                          : i === order.currentStep - 1
                            ? "orders__step-dot--active"
                            : ""
                          }`}
                      >
                        {i < order.currentStep ? "✓" : i + 1}
                      </div>

                      <p className="orders__step-label">{step}</p>

                      {i < order.steps.length - 1 && (
                        <div
                          className={`orders__step-line ${i < order.currentStep - 1
                            ? "orders__step-line--done"
                            : ""
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="orders__card-actions">

                {order.status === "Delivered" && (
                  <button className="orders__action-btn orders__action-btn--primary">
                    Rate & Review
                  </button>
                )}

                {order.status === "Processing" && (
                  <button className="orders__action-btn orders__action-btn--danger">
                    Cancel Order
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
      {selectedItem && (
        <ScanQRModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRefresh={fetchOrders}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function ScanQRModal({ item, onClose, onRefresh, showToast }) {
    const [qrData, setQrData] = useState("")
    const [photos, setPhotos] = useState([])
    const [notes, setNotes] = useState("")

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
            showToast("⚠️ Please upload a photo of the received product.", "error")
            return
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            
            const formData = new FormData();
            formData.append("qrData", qrData);
            formData.append("notes", notes || "Product received successfully");
            
            photos.forEach(file => {
                formData.append("photos", file);
            });

            await axios.post(`${API_BASE_URL}/qr/scan`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            showToast(`✅ Delivery Confirmed!`)
            onRefresh()
            onClose()
        } catch (err) {
            console.log(err)
            showToast(err.response?.data?.message || "QR scan failed", "error")
        }
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files)
        setPhotos(files)
    }

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                background: '#1a1a1a', padding: '30px', borderRadius: '20px',
                width: '90%', maxWidth: '500px', border: '1px solid #333'
            }}>
                <h3 style={{ color: 'white', marginBottom: '20px' }}>Confirm Delivery Receipt</h3>

                <div className="qr-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ color: '#ccc', fontSize: '14px' }}>Scan the QR code on the package or from the delivery person's device.</p>
                    
                    <div className="qr-input">
                        <label style={{ color: '#777', fontSize: '12px' }}>QR Payload (Demo - Auto-filled):</label>
                        <textarea
                            value={qrData}
                            readOnly
                            style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#555', borderRadius: '8px', fontSize: '11px', height: '60px' }}
                        />
                    </div>

                    <div className="photo-upload">
                        <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '10px' }}>📸 Take a photo of the product you received:</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ color: '#777' }}
                        />
                        {photos.length > 0 && (
                            <p style={{ color: '#10b981', marginTop: '10px' }}>✅ {photos.length} photos ready</p>
                        )}
                    </div>

                    <button onClick={handleScan} style={{
                        background: '#10b981', color: 'white', border: 'none',
                        padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        Confirm & Complete Order
                    </button>
                </div>

                <button onClick={onClose} style={{
                    background: 'transparent', border: '1px solid #333', color: '#777',
                    padding: '12px', borderRadius: '10px', width: '100%', marginTop: '12px', cursor: 'pointer'
                }}>Cancel</button>
            </div>
        </div>
    )
}

