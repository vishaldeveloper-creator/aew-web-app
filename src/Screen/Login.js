import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../Baseurl'; // Adjust if needed
import '../Css/Login.css'; // Your existing CSS

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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

        try {
            const res = await fetch(`${url}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await res.json();
            if (res.ok) {
                const { user, token } = result;
                console.log(user)

                // ✅ Store securely
                localStorage.setItem("U_Token", token);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("username", user.name);
                localStorage.setItem("email", user.email);
                localStorage.setItem("role", user.role);
                localStorage.setItem("userCode", user.employeescode);
                localStorage.setItem("managerId", user.managerId || "");
                localStorage.setItem("department", user.department);
                if (user.role === "manager") {
                    localStorage.setItem("managerId", user.id); // manager's own ID
                } else if (user.role === "employee") {
                    localStorage.setItem("managerId", user.managerId); // employee's manager ID
                }
                navigate("/");
            } else {
                setError(result.message || "Invalid login credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className='form-container'>
            <h1>Login</h1>

            <input
                type='email'
                className='inputBox'
                placeholder='Enter Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type='password'
                className='inputBox'
                placeholder='Enter Your Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className='error-msg'>{error}</div>}

            <button onClick={handleLogin} className='AppButton'>
                Login
            </button>
        </div>
    );
}

export default Login;
