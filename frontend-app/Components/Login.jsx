import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

import Toast from "./Toast";


const Login = ({ registerLink }) => {

    console.log(API_BASE_URL)
    const [role, setRole] = useState("user");
    const [notification, setNotification] = useState({ message: "", type: "success" });

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_BASE_URL}/login/${role}`, { ...loginData, role }, {
                withCredentials: true
            })
            console.log(res)
            const data = await res.data;

            if (res.status === 201) {
                setNotification({ message: "Login Successful! Redirecting...", type: "success" });
                setTimeout(() => {
                    if (role === "seller") {
                        localStorage.setItem("user", JSON.stringify({ role: data.role || "seller", username: data.name }));
                        navigate('/seller')
                    } else if (role === "delivery_boy") {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate('/delivery-dashboard')
                    } else {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        navigate('/homepage')
                    }
                }, 1500);

            } else {
                setNotification({ message: data.message || "Login Failed", type: "error" });
            }

        } catch (err) {
            console.log(err);
            setNotification({ message: err.response?.data?.message || "An error occurred during login", type: "error" });
        }
    };

    return (
        <>
            <Toast
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, message: "" })}
            />
            <div className="form-box login">
            <form onSubmit={handleLogin}>

                <div className="role-switch">
                    <button type="button" className={role === "user" ? "active" : ""} onClick={() => setRole("user")}>Buyer</button>
                    <button type="button" className={role === "seller" ? "active" : ""} onClick={() => setRole("seller")}>Seller</button>
                    <button type="button" className={role === "delivery_boy" ? "active" : ""} onClick={() => setRole("delivery_boy")}>Delivery</button>
                </div>


                <h1>
                    {role === "seller" ? "Seller Login" : role === "delivery_boy" ? "Delivery Login" : "Buyer Login"}
                </h1>


                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required={true}
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required={true}
                    />
                    <FaLock className="icon" />
                </div>

                {/* <Link to="/homepage">
                    <button type="submit">Login</button>
                </Link> */}

                <button type="submit">Login</button>


                <div className="register-link">
                    <p>
                        Don't have an account?{" "}
                        <button type="button" onClick={registerLink}>Register</button>
                    </p>
                </div>

            </form>
        </div>
        </>
    );
};

export default Login;