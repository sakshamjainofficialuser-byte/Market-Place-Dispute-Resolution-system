import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Homepage from "../Pages/Homepage";
import LoginRegister from "../Components/LoginRegister";
import Navbar from "../Components/Navbar/Navbar";
import Categories from "../Pages/Categories";
import MyOrders from "../Pages/MyOrders";
import Profile from "../Pages/Profile";
import ProductPage from "../Pages/ProductPage";

function App() {
  const [activePage, setActivePage] = useState("Home");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/homepage") setActivePage("Home");
    if (location.pathname === "/categories") setActivePage("Categories");
    if (location.pathname === "/orders") setActivePage("My Orders");
    if (location.pathname === "/profile") setActivePage("Profile");
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== "/" && (
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}

      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
