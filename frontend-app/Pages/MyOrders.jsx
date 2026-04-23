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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
                        <img src={item.productId.images[0]} alt={item.productId?.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      ) : (
                        <div style={{ width: "50px", height: "50px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛒</div>
                      )}
                      <div>
                        <p style={{ fontWeight: "600", fontSize: "14px" }}>{item.productId?.title || "Product Name"}</p>
                        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Qty: {item.quantity} · ₹{item.productId?.price}</p>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="orders__action-btn orders__action-btn--danger"
                        onClick={() => navigate(`/raise-dispute/${order._id}/${item._id}`)}
                      >
                        Raise Dispute
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
                <button className="orders__action-btn">
                  View Details
                </button>

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
    </div>
  );
}

