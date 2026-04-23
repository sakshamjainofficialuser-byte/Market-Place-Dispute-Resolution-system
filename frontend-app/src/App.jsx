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
import AdminDashboard from "../Pages/AdminDashboard"; // ✅ new
import SellerDashboard from "../Pages/SellerDashboard"; // ✅ new

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
    };
    if (routes[location.pathname]) {
      setActivePage(routes[location.pathname]);
    }
  }, [location.pathname]);

  const hideNavbar = location.pathname === "/";

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
        <Route path="/admin"       element={<AdminDashboard />} />
        <Route path="/seller"      element={<SellerDashboard />} />
      </Routes>
    </>
  );
}

export default App;
