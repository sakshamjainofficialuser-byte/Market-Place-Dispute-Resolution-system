import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Login = ({ registerLink }) => {

    const [role, setRole] = useState("buyer");

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...loginData, role })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Login Successful");
            } else {
                alert(data.message || "Login Failed");
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form-box login">
            <form onSubmit={handleLogin}>

                <div className="role-switch">
                    <button type="button" onClick={() => setRole("buyer")}>Buyer</button>
                    <button type="button" onClick={() => setRole("seller")}>Seller</button>
                </div>

                <h1>{role === "seller" ? "Seller Login" : "Buyer Login"}</h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>
                        Don't have an account?{" "}
                        <button type="button" onClick={registerLink}>Register</button>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default Login;