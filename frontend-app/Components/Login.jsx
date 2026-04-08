import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";

const Login = ({ registerLink }) => {

    const [role, setRole] = useState("user");

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // const res = await fetch(`http://localhost:5000/login/${role}`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ ...loginData, role })
            // });
        
            const res = await axios.post(`http://localhost:5000/login/${role}`,{...loginData,role})
            
            console.log(res)
            const data = await res.data;

            if (res.status === 201) {
                // alert(data.message || "Login Successful")
                navigate('/homepage')
            } else {
                alert(data.message || "Login Failed");
                navigate('/')
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form-box login">
            <form onSubmit={handleLogin}>

                <div className="role-switch">
                    <button type="button" onClick={() => setRole("user")}>Buyer</button>
                    <button type="button" onClick={() => setRole("seller")}>Seller</button>
                </div>

                <h1>{role === "seller" ? "Seller Login" : "Buyer Login"}</h1>

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
    );
};

export default Login;