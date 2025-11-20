import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../Baseurl";
import "../Css/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // 👈 loading state
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

        setLoading(true); // start loader
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
                localStorage.setItem("managerId", user.role === "manager" ? user.id : user.managerId || "");

                navigate("/");
            } else {
                setError(result.message || "Invalid login credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false); // stop loader
        }
    };

    return (
        <div className="login-page">
            {/* Modal Loader */}
            {loading && (
                <div className="modal-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <div className="form-container">
                <h1 className="login-title">Login</h1>

                <input
                    type="email"
                    className="inputBox"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="inputBox"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="error-msg">{error}</div>}

                <button
                    onClick={handleLogin}
                    className="AppButton"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}

export default Login;
