import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../Baseurl";
import "../Css/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("U_Token");
        if (token) navigate("/");
    }, [navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await res.json();

            if (res.ok) {
                const { user, token } = result;

                localStorage.setItem("U_Token", token);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("username", user.name);
                localStorage.setItem("email", user.email);
                localStorage.setItem("role", user.role);
                localStorage.setItem("userCode", user.employeescode);
                localStorage.setItem("department", user.department);
                localStorage.setItem(
                    "managerId",
                    user.role === "manager" ? user.id : user.managerId || ""
                );

                navigate("/");
            } else {
                setError(result.message || "Invalid login credentials");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* 🔵 HEADER */}
            <div className="login-header">
                <img src="/Applogcurcle.jpg" alt="AEW Logo" />
                <h2>AEW Services</h2>
            </div>

            {/* 🔄 Loader */}
            {loading && (
                <div className="modal-overlay">
                    <div className="loader"></div>
                </div>
            )}

            {/* 🧾 LOGIN CARD */}
            <div className="login-card">
                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-msg">{error}</p>}

                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="register-text">
                    Don’t have an account?
                    <span onClick={() => navigate("/signup")}> Register</span>
                </p>
            </div>
        </div>
    );
}

export default Login;
