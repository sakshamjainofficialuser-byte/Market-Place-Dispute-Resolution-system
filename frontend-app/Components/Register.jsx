import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios"
const API_BASE_URL = import.meta.env.VITE_API_URL

const Register = ({ loginLink }) => {

    const [role, setRole] = useState("user");

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: ""
    });
    console.log(role)
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // const res = await fetch(`http://localhost:5000/register/${role}`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ ...registerData, role })
            // });
            console.log({...registerData,role})
            const res = await axios.post(`${API_BASE_URL}/register/${role}`,{...registerData,role})
            // const data = await res.json();
            console.log(res)

            if (res.ok) {
                alert("Register Successful");
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form-box register">
            <form onSubmit={handleRegister}>

                <div className="role-switch">
                    <button type="button" onClick={() => setRole("user")}>Buyer</button>
                    <button type="button" onClick={() => setRole("seller")}>Seller</button>
                </div>

                <h1>{role === "seller" ? "Seller Registration" : "Buyer Registration"}</h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                    />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <button type="submit">Register</button>

                <div className="register-link">
                    <p>
                        Already have an account?{" "}
                        <button type="button" onClick={loginLink}>Login</button>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default Register;