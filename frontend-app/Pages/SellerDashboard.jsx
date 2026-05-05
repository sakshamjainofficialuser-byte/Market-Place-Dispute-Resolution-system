import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SellerDashboard.css"
import { getImageUrl } from "../src/utils/imageUrl";

const API_BASE_URL = import.meta.env.VITE_API_URL

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("disputes")
  const [disputes, setDisputes] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(null)
  const [responseText, setResponseText] = useState("")
  const navigate = useNavigate()

  console.log("hell0")
  useEffect(() => {
    verifySeller()
  }, [])

  useEffect(() => {
    if (activeTab === "disputes") fetchDisputes()
    else if (activeTab === "orders") fetchOrders()
    else if (activeTab === "products") fetchProducts()
  }, [activeTab])

  const verifySeller = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user || user.role !== "seller") {
        navigate("/")
        return
      }
      fetchDisputes()
    } catch (err) {
      navigate("/")
    }
  }

  const fetchDisputes = async () => {
    try {
      // Fetch disputes where current user is the seller
      const res = await axios.get(`${API_BASE_URL}/raiseissue/seller-disputes`, {
        withCredentials: true
      })
      setDisputes(res.data.disputes || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/order/seller-orders`, {
        withCredentials: true
      })
      setOrders(res.data.orders || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/my-products`, {
        withCredentials: true
      })
      setProducts(res.data.products || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (disputeId) => {
    if (!responseText.trim()) {
      alert("Please enter your response")
      return
    }

    try {
      await axios.post(
        `${API_BASE_URL}/raiseissue/${disputeId}/respond`,
        { response: responseText },
        { withCredentials: true }
      )

      alert("Response submitted successfully!")
      setResponding(null)
      setResponseText("")
      fetchDisputes()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit response")
    }
  }

  const pendingDisputes = disputes.filter(d =>
    d.fulfillmentType === "FBM" &&
    !d.sellerResponse &&
    d.status === "Pending"
  )

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <div className="seller-dashboard__header">
        <div>
          <h1 className="seller-dashboard__title">🏪 Seller Dashboard</h1>
          <p className="seller-dashboard__subtitle">
            Manage your products, orders, and disputes
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="seller-dashboard__handoff-btn"
            onClick={() => navigate('/seller/handoff')}
          >
            📋 My Sales (Handoff)
          </button>
          <button
            className="seller-dashboard__add-btn"
            onClick={() => navigate('/seller/add-product')}
          >
            + Add Product
          </button>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="seller-dashboard__stats">
        <div className="seller-stat-card seller-stat-card--orange">
          <div className="seller-stat-card__icon">🔔</div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">{pendingDisputes.length}</p>
            <p className="seller-stat-card__label">Disputes Need Response</p>
          </div>
        </div>

        <div className="seller-stat-card seller-stat-card--blue">
          <div className="seller-stat-card__icon">📦</div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">
              {orders.filter(o => o.status === "pending").length}
            </p>
            <p className="seller-stat-card__label">Pending Orders</p>
          </div>
        </div>

        <div className="seller-stat-card seller-stat-card--green">
          <div className="seller-stat-card__icon">✅</div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">
              {products.filter(p => p.status === "active").length}
            </p>
            <p className="seller-stat-card__label">Active Products</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="seller-dashboard__tabs">
        <button
          className={`seller-tab ${activeTab === "disputes" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("disputes")}
        >
          🔔 Disputes ({disputes.length})
        </button>
        <button
          className={`seller-tab ${activeTab === "orders" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders ({orders.length})
        </button>
        <button
          className={`seller-tab ${activeTab === "products" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📋 My Products ({products.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="seller-dashboard__content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Disputes Tab */}
            {activeTab === "disputes" && (
              <div className="seller-disputes">
                {pendingDisputes.length > 0 && (
                  <div className="seller-section">
                    <h3 className="seller-section__title">
                      🔴 Action Required ({pendingDisputes.length})
                    </h3>

                    {pendingDisputes.map(dispute => (
                      <div className="seller-dispute-card seller-dispute-card--urgent" key={dispute._id}>
                        <div className="seller-dispute-card__header">
                          <div>
                            <p className="seller-dispute-card__id">
                              Dispute #{dispute._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="seller-dispute-card__date">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="seller-badge seller-badge--urgent">
                            Response Needed
                          </span>
                        </div>

                        <div className="seller-dispute-card__buyer">
                          <strong>Buyer:</strong> {dispute.buyerId?.username}
                        </div>

                        <div className="seller-dispute-card__reason">
                          <strong>Complaint:</strong> {dispute.reason}
                        </div>

                        {responding === dispute._id ? (
                          <div className="seller-respond-form">
                            <textarea
                              className="seller-respond-textarea"
                              placeholder="Explain your side of the situation..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={4}
                            />
                            <div className="seller-respond-actions">
                              <button
                                className="seller-btn seller-btn--secondary"
                                onClick={() => {
                                  setResponding(null)
                                  setResponseText("")
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="seller-btn seller-btn--primary"
                                onClick={() => handleRespond(dispute._id)}
                              >
                                Submit Response
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="seller-btn seller-btn--primary"
                            onClick={() => setResponding(dispute._id)}
                          >
                            ✍️ Write Response
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="seller-section">
                  <h3 className="seller-section__title">
                    📋 All Disputes ({disputes.length})
                  </h3>

                  {disputes.length === 0 ? (
                    <p>No disputes yet</p>
                  ) : (
                    disputes.map(dispute => (
                      <div className="seller-dispute-card" key={dispute._id}>
                        <div className="seller-dispute-card__header">
                          <div>
                            <p className="seller-dispute-card__id">
                              #{dispute._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="seller-dispute-card__date">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <span className="seller-badge">{dispute.status}</span>
                            <span className="seller-type-badge">{dispute.fulfillmentType}</span>
                          </div>
                        </div>

                        <div className="seller-dispute-card__reason">
                          <strong>Reason:</strong> {dispute.reason}
                        </div>

                        {dispute.sellerResponse && (
                          <div className="seller-dispute-card__response">
                            <strong>Your Response:</strong> {dispute.sellerResponse}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="seller-orders">
                {orders.length === 0 ? (
                  <p>No orders yet</p>
                ) : (
                  orders.map(order => (
                    <div className="seller-order-card" key={order._id}>
                      <div className="seller-order-card__header">
                        <p className="seller-order-card__id">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <span className={`seller-status-badge seller-status-badge--${order.status}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="seller-order-card__details">
                        <p><strong>Buyer:</strong> {order.buyerId?.username}</p>
                        <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="seller-products">
                {products.length === 0 ? (
                  <p>No products listed yet</p>
                ) : (
                  <div className="seller-products-grid">
                    {products.map(product => (
                      <div className="seller-product-card" key={product._id}>
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.title}
                          className="seller-product-card__image"
                        />
                        <div className="seller-product-card__info">
                          <h4>{product.title}</h4>
                          <p className="seller-product-card__price">
                            ₹{product.price}
                          </p>
                          <p className="seller-product-card__stock">
                            Stock: {product.stock}
                          </p>
                          <span className={`seller-product-status seller-product-status--${product.status}`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}