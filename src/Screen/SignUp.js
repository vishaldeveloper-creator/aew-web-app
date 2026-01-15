import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../Baseurl";
import "../Css/SignUp.css";

function SignUp() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
        employeescode: "",
        department: "",
        managerId: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("U_Token")) {
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const err = {};
        if (!form.name.trim()) err.name = "Name is required";
        if (!form.email) err.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";

        if (!form.password) err.password = "Password is required";
        else if (form.password.length < 6) err.password = "Min 6 characters";

        if (!form.employeescode) err.employeescode = "Employee code required";
        if (!form.department) err.department = "Department required";

        if (form.role === "employee" && !form.managerId) {
            err.managerId = "Manager ID required";
        }
        return err;
    };

    const departmentMap = {
        CEO: 1, HR: 2, IT: 3, Solar: 4, Meter: 5, Finance: 6, Sales: 7
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                Department_Id: departmentMap[form.department]
            };

            const res = await fetch(`${url}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                navigate("/login");
            } else {
                alert(result.message || "Registration failed");
            }
        } catch {
            alert("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-wrapper">
            {/* 🔵 HEADER */}
            <div className="signup-header">
                <img src="/Applogcurcle.jpg" alt="AEW Logo" />
                <h2>AEW Services</h2>
            </div>

            {loading && (
                <div className="modal-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <form className="signup-card" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                <input name="name" placeholder="Full Name" onChange={handleChange} />
                {errors.name && <p className="error">{errors.name}</p>}

                <input name="email" placeholder="Email" onChange={handleChange} />
                {errors.email && <p className="error">{errors.email}</p>}

                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                {errors.password && <p className="error">{errors.password}</p>}

                <input name="employeescode" placeholder="Employee Code" onChange={handleChange} />
                {errors.employeescode && <p className="error">{errors.employeescode}</p>}

                <select name="role" onChange={handleChange}>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="ceo">CEO</option>
                </select>

                <select name="department" onChange={handleChange}>
                    <option value="">Select Department</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Meter">Meter</option>
                    <option value="Solar">Solar</option>
                    <option value="Sales">Sales</option>
                    <option value="CEO">CEO</option>
                </select>
                {errors.department && <p className="error">{errors.department}</p>}

                {form.role === "employee" && (
                    <>
                        <input name="managerId" placeholder="Manager ID" onChange={handleChange} />
                        {errors.managerId && <p className="error">{errors.managerId}</p>}
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Sign Up"}
                </button>

                <p className="login-link">
                    Already have an account?
                    <span onClick={() => navigate("/login")}> Login</span>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
