import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAssignDelivery.css";
import { MdArrowBack, MdOutlineDeliveryDining, MdOutlineInventory2, MdLocationOn } from "react-icons/md";

import Toast from "../Components/Toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminAssignDelivery() {
    const [pendingItems, setPendingItems] = useState([]);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "success" });
    const navigate = useNavigate();

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
    };

    useEffect(() => {
        verifyAndFetch();
    }, []);

    const verifyAndFetch = async () => {
        try {
            const adminUser = JSON.parse(localStorage.getItem("adminUser"));
            if (!adminUser || adminUser.role !== "admin") {
                navigate("/admin-login");
                return;
            }

            await axios.get(`${API_BASE_URL}/admin/verify`, {
                withCredentials: true,
            });

            fetchData();
        } catch (err) {
            localStorage.removeItem("adminUser");
            navigate("/admin-login");
        }
    };

    const fetchData = async () => {
        try {
            const [itemsRes, boysRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/admin/pending-deliveries`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/admin/delivery-boys`, { withCredentials: true })
            ]);

            setPendingItems(itemsRes.data.items || []);
            setDeliveryBoys(boysRes.data.deliveryBoys || []);
        } catch (err) {
            setError("Failed to load delivery data.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (orderItemId, deliveryBoyId) => {
        if (!deliveryBoyId) return;
        try {
            await axios.post(`${API_BASE_URL}/admin/assign-delivery`, {
                orderItemId,
                deliveryBoyId
            }, { withCredentials: true });

            showToast("✅ Delivery personnel assigned successfully!");
            fetchData();
        } catch (err) {
            console.log(err);
            showToast("Assignment failed. Please try again.", "error");
        }
    };

    if (loading) return <div className="admin-assign-loading">Initializing Logistics Module...</div>;

    return (
        <div className="admin-assign-container">
            <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ ...notification, message: "" })} 
            />
            <header className="admin-assign-header">
                <button className="back-btn" onClick={() => navigate("/admin")}>
                    <MdArrowBack /> Back to Portal
                </button>
                <div className="title-section">
                    <h1><MdOutlineDeliveryDining /> Logistics Management</h1>
                    <p>Assign delivery partners to pending fulfillment requests</p>
                </div>
            </header>

            {error && <div className="error-alert">{error}</div>}

            {pendingItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><MdOutlineInventory2 /></div>
                    <h3>No Pending Deliveries</h3>
                    <p>All current orders have been assigned or fulfilled.</p>
                </div>
            ) : (
                <div className="assign-table-wrapper">
                    <table className="assign-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th><MdLocationOn /> Pickup Node</th>
                                <th><MdLocationOn /> Destination</th>
                                <th>Assignment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingItems.map(item => (
                                <tr key={item._id}>
                                    <td className="product-td">
                                        <div className="item-cell">
                                            <div className="img-wrapper">
                                                <img src={item.productId.images[0]} alt="product" />
                                            </div>
                                            <div className="item-info">
                                                <strong>{item.productId.title}</strong>
                                                <span>Item ID: #{item._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="location-td">
                                        <div className="loc-info">
                                            <span className="user-name">{item.sellerId.username}</span>
                                            <span className="hostel-tag">{item.sellerId?.campusProfile?.hostel || "Main Campus"}</span>
                                            <span className="phone-tag">📞 {item.sellerId.phoneNumber || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="location-td">
                                        <div className="loc-info">
                                            <span className="user-name">{item.buyerInfo.username}</span>
                                            <span className="hostel-tag">{item.buyerInfo?.campusProfile?.hostel || "Main Campus"}</span>
                                            <span className="phone-tag">📞 {item.buyerInfo.phoneNumber || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="action-td">
                                        <select 
                                            className="assign-select"
                                            onChange={(e) => handleAssign(item._id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Choose Delivery Partner</option>
                                            {deliveryBoys.map(boy => (
                                                <option key={boy._id} value={boy._id}>
                                                    {boy.username} ({boy.deliveryProfile?.activeOrders?.length || 0} active loads)
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
