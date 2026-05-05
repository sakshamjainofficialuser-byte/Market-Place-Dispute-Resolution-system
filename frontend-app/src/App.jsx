import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Homepage from "../Pages/Homepage";
import LoginRegister from "../Components/LoginRegister";
import Navbar from "../Components/Navbar/Navbar";
import Categories from "../Pages/Categories";
import MyOrders from "../Pages/MyOrders";
import Profile from "../Pages/Profile";
import ProductPage from "../Pages/ProductPage";
import Dispute from "../Pages/Dispute";
import MyDisputes from "../Pages/MyDisputes";         // ✅ new
import AdminDashboard from "../Pages/AdminDashboard";
import AdminDisputeList from "../Pages/AdminDisputeList";
import SellerDashboard from "../Pages/SellerDashboard";
import AdminLogin from "../Pages/AdminLogin";
import AdminDisputeDetails from "../Pages/AdminDisputeDetails";
import AddProduct from "../Pages/AddProduct";
import DeliveryBoyDashboard from "../Pages/DeliveryBoyDashboard";
import SellerHandoff from "../Pages/SellerHandoff";
import AdminAssignDelivery from "../Pages/AdminAssignDelivery";
import OrderTracking from "../Pages/OrderTracking";


function App() {
  const [activePage, setActivePage] = useState("Home");
  const location = useLocation();

  useEffect(() => {
    const routes = {
      "/homepage":    "Home",
      "/categories":  "Categories",
      "/orders":      "My Orders",
      "/profile":     "Profile",
      "/my-disputes": "My Disputes",
      "/admin":       "Admin",
      "/seller":      "Seller",
      "/admin-login": "Admin Login",
      "/admin/dispute": "Dispute Details",
    };
    if (routes[location.pathname] || location.pathname.startsWith("/admin/dispute")) {
      setActivePage(routes[location.pathname] || "Dispute Details");
    }
  }, [location.pathname]);

  const hideNavbar = 
    location.pathname === "/" || 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/seller");

  return (
    <>
      {!hideNavbar && (
        <Navbar activePage={activePage} setActivePage={setActivePage} />
      )}

      <Routes>
        <Route path="/"           element={<LoginRegister />} />
        <Route path="/homepage"   element={<Homepage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders"     element={<MyOrders />} />
        <Route path="/profile"    element={<Profile />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* ✅ Fixed: now passes orderItemId (not sellerId) — matches Dispute.jsx */}
        <Route path="/raise-dispute/:orderId/:orderItemId" element={<Dispute />} />

        {/* ✅ New pages */}
        <Route path="/my-disputes" element={<MyDisputes />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin"       element={<AdminDashboard />} />
        <Route path="/admin/disputes" element={<AdminDisputeList />} />
        <Route path="/admin/dispute/:disputeId" element={<AdminDisputeDetails />} />
        <Route path="/admin/assign-delivery" element={<AdminAssignDelivery />} />
        
        <Route path="/seller"      element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/handoff" element={<SellerHandoff />} />
        
        <Route path="/delivery-dashboard" element={<DeliveryBoyDashboard />} />
        <Route path="/order-tracking/:orderItemId" element={<OrderTracking />} />
      </Routes>

    </>
  );
}

export default App;
