import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import "./MyOrders.css";

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

  const filters = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="orders">
      <h2 className="orders__title">My Orders</h2>

      {/* Filters */}
      <div className="orders__filters">
        {filters.map((f) => (
          <button
            key={f}
            className={`orders__filter-btn ${
              filter === f ? "orders__filter-btn--active" : ""
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
                      {order.item || "Product"}
                    </p>
                    <p className="orders__item-meta">
                      {order.id || order._id} · {order.date || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="orders__card-right">
                  <p className="orders__item-price">
                    ₹{order.price?.toLocaleString() || 0}
                  </p>
                  <span
                    className={`orders__status ${
                      statusColor[order.status] || ""
                    }`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Tracker */}
              {order.status !== "Cancelled" && order.steps?.length > 0 && (
                <div className="orders__tracker">
                  {order.steps.map((step, i) => (
                    <div className="orders__step" key={i}>
                      <div
                        className={`orders__step-dot ${
                          i < order.currentStep
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
                          className={`orders__step-line ${
                            i < order.currentStep - 1
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
