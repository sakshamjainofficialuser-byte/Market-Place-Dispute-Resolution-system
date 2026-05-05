import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SellerDashboard.css"
import { getImageUrl } from "../src/utils/imageUrl";
import { MdAdd, MdAssignment, MdNotifications, MdInventory, MdCheckCircle, MdPendingActions, MdLocalShipping } from "react-icons/md";

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
      <div className="seller-dashboard__header">
        <div>
          <h1 className="seller-dashboard__title">🏪 Seller Dashboard</h1>
          <p className="seller-dashboard__subtitle">
            Welcome back! Monitor your business performance and customer requests.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="seller-dashboard__handoff-btn"
            onClick={() => navigate('/seller/handoff')}
          >
            <MdAssignment /> My Handoffs
          </button>
          <button
            className="seller-dashboard__add-btn"
            onClick={() => navigate('/seller/add-product')}
          >
            <MdAdd /> List Product
          </button>
        </div>
      </div>

      <div className="seller-dashboard__stats">
        <div className="seller-stat-card seller-stat-card--orange">
          <div className="seller-stat-card__icon"><MdNotifications /></div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">{pendingDisputes.length}</p>
            <p className="seller-stat-card__label">Pending Disputes</p>
          </div>
        </div>

        <div className="seller-stat-card seller-stat-card--blue">
          <div className="seller-stat-card__icon"><MdPendingActions /></div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">
              {orders.filter(o => o.status === "pending").length}
            </p>
            <p className="seller-stat-card__label">Active Orders</p>
          </div>
        </div>

        <div className="seller-stat-card seller-stat-card--green">
          <div className="seller-stat-card__icon"><MdInventory /></div>
          <div className="seller-stat-card__content">
            <p className="seller-stat-card__value">
              {products.filter(p => p.status === "active").length}
            </p>
            <p className="seller-stat-card__label">Live Products</p>
          </div>
        </div>
      </div>

      <div className="seller-dashboard__tabs">
        <button
          className={`seller-tab ${activeTab === "disputes" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("disputes")}
        >
          Disputes
        </button>
        <button
          className={`seller-tab ${activeTab === "orders" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`seller-tab ${activeTab === "products" ? "seller-tab--active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Inventory
        </button>
      </div>

      <div className="seller-dashboard__content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading metrics...</div>
        ) : (
          <>
            {activeTab === "disputes" && (
              <div className="seller-disputes">
                <h3 className="seller-section__title">
                  <MdNotifications style={{ color: '#f59e0b' }} /> Action Required
                </h3>
                {pendingDisputes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', color: '#64748b' }}>
                    Great job! You have no pending disputes to resolve.
                  </div>
                ) : (
                  pendingDisputes.map(dispute => (
                    <div className="seller-dispute-card seller-dispute-card--urgent" key={dispute._id}>
                      <div className="seller-dispute-card__header">
                        <div>
                          <p className="seller-dispute-card__id">CASE #{dispute._id.slice(-8).toUpperCase()}</p>
                          <p className="seller-dispute-card__date">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="seller-badge seller-badge--urgent">Awaiting Response</span>
                      </div>
                      <div className="seller-dispute-card__reason">
                        <strong>Reason:</strong> {dispute.reason}
                      </div>
                      {responding === dispute._id ? (
                        <div className="seller-respond-form">
                          <textarea
                            className="seller-respond-textarea"
                            placeholder="Provide your evidence or response to the buyer's claim..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={4}
                          />
                          <div className="seller-respond-actions">
                            <button className="seller-btn seller-btn--secondary" onClick={() => { setResponding(null); setResponseText(""); }}>Cancel</button>
                            <button className="seller-btn seller-btn--primary" onClick={() => handleRespond(dispute._id)}>Submit Response</button>
                          </div>
                        </div>
                      ) : (
                        <button className="seller-btn seller-btn--primary" onClick={() => setResponding(dispute._id)}>✍️ Write Response</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="seller-orders">
                <h3 className="seller-section__title"><MdLocalShipping style={{ color: '#3b82f6' }} /> Recent Sales</h3>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b' }}>No orders recorded yet.</p>
                ) : (
                  orders.map(order => (
                    <div className="seller-order-card" key={order._id}>
                      <div className="seller-order-card__header">
                        <p className="seller-order-card__id">ORDER #{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`seller-status-badge seller-status-badge--${order.status}`}>{order.status}</span>
                      </div>
                      <div className="seller-order-card__details">
                        <p><strong>Customer</strong> {order.buyerId?.username}</p>
                        <p><strong>Revenue</strong> ₹{order.totalAmount.toLocaleString()}</p>
                        <p><strong>Date</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "products" && (
              <div className="seller-products">
                <h3 className="seller-section__title"><MdInventory style={{ color: '#10b981' }} /> Catalog Management</h3>
                {products.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b' }}>Your catalog is empty. Start by adding a product!</p>
                ) : (
                  <div className="seller-products-grid">
                    {products.map(product => (
                      <div className="seller-product-card" key={product._id}>
                        <img src={getImageUrl(product.images[0])} alt={product.title} className="seller-product-card__image" />
                        <div className="seller-product-card__info">
                          <h4>{product.title}</h4>
                          <p className="seller-product-card__price">₹{product.price.toLocaleString()}</p>
                          <p className="seller-product-card__stock">Available: {product.stock} units</p>
                          <span className={`seller-product-status seller-product-status--${product.status || 'active'}`}>{product.status || 'active'}</span>
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