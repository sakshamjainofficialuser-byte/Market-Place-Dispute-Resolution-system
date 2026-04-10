import React, { useState } from "react";
import "./LoginRegister.css";
import Login from "./Login";
import Register from "./Register";

const LoginRegister = () => {

    const [action, setAction] = useState("");

    return (
    <div className="login-register-container">
        <div className={`wrapper ${action}`}>
            <Login registerLink={() => setAction("active")} />
            <Register loginLink={() => setAction("")} />
        </div>
    </div>
);
};

export default LoginRegister;

