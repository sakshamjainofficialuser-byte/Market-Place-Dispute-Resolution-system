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
import QRScanner from "../Components/QRScanner";


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
  const [isScanning, setIsScanning] = useState(false)

  const onScanSuccess = (decodedText) => {
    setQrData(decodedText)
    setIsScanning(false)
    showToast("✅ QR Code scanned!", "success")
  }

  const handleScan = async () => {
    if (!qrData) {
      showToast("⚠️ Please scan the delivery QR code first.", "error")
      return
    }
    if (photos.length === 0) {
      showToast("⚠️ Please upload a photo of the received product.", "error")
      return
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

      const formData = new FormData();
      formData.append("qrData", qrData);
      formData.append("notes", notes || "Product received successfully");
      photos.forEach(file => formData.append("photos", file));

      await axios.post(`${API_BASE_URL}/qr/scan`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })

      showToast("✅ Delivery Confirmed!")
      onRefresh()
      onClose()
    } catch (err) {
      console.log(err)
      showToast(err.response?.data?.message || "QR scan failed", "error")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)',
        padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '520px',
        border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '8px', fontSize: '22px', fontWeight: 800 }}>Confirm Delivery Receipt</h3>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', marginTop: 0 }}>
          Scan the QR code from the delivery person's device to confirm receipt.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* QR Scanner Section */}
          <div>
            {isScanning ? (
              <div>
                <QRScanner onScanSuccess={onScanSuccess} onScanError={() => {}} />
                <button
                  onClick={() => setIsScanning(false)}
                  style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                >Stop Scanner</button>
              </div>
            ) : qrData ? (
              <div style={{ background: 'rgba(16,185,129,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                <p style={{ color: '#34d399', fontWeight: 700, fontSize: '16px', margin: '0 0 10px 0' }}>✅ QR Code Scanned</p>
                <button onClick={() => { setQrData(""); setIsScanning(true); }} style={{ background: 'transparent', color: '#818cf8', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Scan Again</button>
              </div>
            ) : (
              <button
                onClick={() => setIsScanning(true)}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}
              >
                📷 Scan Delivery QR Code
              </button>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📸 Product Condition Photo (Required)</label>
            <input
              type="file" multiple accept="image/*"
              onChange={(e) => setPhotos(Array.from(e.target.files))}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', color: '#94a3b8', cursor: 'pointer', boxSizing: 'border-box' }}
            />
            {photos.length > 0 && <p style={{ color: '#34d399', marginTop: '8px', fontSize: '14px' }}>✅ {photos.length} photo(s) selected</p>}
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about the delivery? (optional)"
            style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />

          <button onClick={handleScan} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
            Confirm & Complete Order
          </button>

          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', padding: '13px', borderRadius: '14px', width: '100%', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
