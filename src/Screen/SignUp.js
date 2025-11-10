import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../Baseurl';

function SignUp() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeescode: '',
        department: '',
        managerId: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("username");
        if (auth) navigate("/");
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!form.employeescode.trim()) {
            newErrors.employeescode = 'Employee Code is required';
        }
        if (!form.department.trim()) {
            newErrors.department = 'Department is required';
        }
        if (form.role === 'employee' && !form.managerId.trim()) {
            newErrors.managerId = 'Manager ID is required for employees';
        }
        return newErrors;
    };


    const departmentMap = {
        "CEO": 1,
        "HR": 2,
        "IT": 3,
        "Solar": 4,
        "Meter": 5,
        "Finance": 6,
        "Sales": 7
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const department = form.department || localStorage.getItem("department");
                const managerId = form.managerId || localStorage.getItem("managerId");
                const departmentId = departmentMap[department];

                const payload = {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    employeescode: form.employeescode,
                    role: form.role,
                    department,
                    Department_Id: departmentId,
                    ...(form.role === 'employee' && { managerId })
                };

                const res = await fetch(`${url}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const result = await res.json();

                if (res.status === 201) {
                    localStorage.setItem("username", JSON.stringify(result));
                    navigate('/');
                } else {
                    alert(result.message || "Registration failed!");
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Server error. Try again.");
            }
        } else {
            setErrors(validationErrors);
        }
    };
    return (
        <div style={containerStyle}>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit} noValidate>
                <input
                    style={inputStyle}
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={form.name}
                    onChange={handleChange}
                />
                {errors.name && <div style={errorStyle}>{errors.name}</div>}

                <input
                    style={inputStyle}
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <div style={errorStyle}>{errors.email}</div>}

                <input
                    style={inputStyle}
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                />
                {errors.password && <div style={errorStyle}>{errors.password}</div>}

                <input
                    style={inputStyle}
                    type="text"
                    name="employeescode"
                    placeholder="Enter Employee Code"
                    value={form.employeescode}
                    onChange={handleChange}
                />
                {errors.employeescode && <div style={errorStyle}>{errors.employeescode}</div>}

                <select
                    style={inputStyle}
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="ceo">CEO</option>
                    {/* <option value="admin">Admin</option> */}
                </select>

                <select
                    style={inputStyle}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                >
                    <option value="">Select Department</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Meter">Meter</option>
                    <option value="Solar">Solar</option>
                    <option value="Sales">Sales</option>
                    <option value="CEO">CEO</option>
                </select>
                {errors.department && <div style={errorStyle}>{errors.department}</div>}

                {form.role === 'employee' && (
                    <>
                        <input
                            style={inputStyle}
                            type="text"
                            name="managerId"
                            placeholder="Enter Manager ID"
                            value={form.managerId}
                            onChange={handleChange}
                        />
                        {errors.managerId && <div style={errorStyle}>{errors.managerId}</div>}
                    </>
                )}

                <button
                    type="submit"
                    style={{
                        ...inputStyle,
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                        border: 'none'
                    }}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px'
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
};

export default SignUp;
