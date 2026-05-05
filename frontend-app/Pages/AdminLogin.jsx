import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { RiAdminFill } from "react-icons/ri";
import { MdLockOutline, MdOutlineAlternateEmail } from "react-icons/md";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/login/admin`,
                { username, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Success - the cookie is set by backend
                // We can also store user info in localStorage if needed for UI
                localStorage.setItem("adminUser", JSON.stringify(response.data.user));
                navigate("/admin");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-glass-card">
                <div className="admin-login-header">
                    <div className="admin-icon-wrapper">
                        <RiAdminFill className="admin-icon" />
                    </div>
                    <h1>Admin Gateway</h1>
                    <p>Enter your credentials to access the control center</p>
                </div>

                <form onSubmit={handleLogin} className="admin-login-form">
                    <div className="input-group">
                        <MdOutlineAlternateEmail className="input-icon" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <MdLockOutline className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Sign In to Dashboard"}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>© 2026 MarketPlace Resolution System</p>
                </div>
            </div>
            
            {/* Animated background elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>
        </div>
    );
};

export default AdminLogin;
