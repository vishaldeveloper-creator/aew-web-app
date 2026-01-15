import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Css/Nav.css";

export default function Nav() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const [auth, setAuth] = useState({
        username: null,
        role: null,
    });

    /* 🔁 Sync auth on load & login/logout */
    useEffect(() => {
        setAuth({
            username: localStorage.getItem("username"),
            role: localStorage.getItem("role"),
        });
    }, []);

    const logout = () => {
        localStorage.clear();
        setAuth({ username: null, role: null });
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    /* 🔒 Hide Nav if not logged in */
    if (!auth.username) return null;

    return (
        <header className="nav-header">
            {/* LOGO */}
            <div className="nav-left">
                <img
                    src="/Applogcurcle.jpg"
                    alt="Logo"
                    className="nav-logo rotate-logo"
                />
                <span className="brand">Smart HR</span>
            </div>

            {/* HAMBURGER */}
            <div
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span /><span /><span />
            </div>

            {/* MENU */}
            <nav className={`nav-menu ${menuOpen ? "show" : ""}`}>
                <ul>
                    <li><NavLink to="/" className={linkClass}>Dashboard</NavLink></li>

                    <li><NavLink to="/leave" className={linkClass}>Leave</NavLink></li>
                    <li><NavLink to="/leave/add" className={linkClass}>Add Leave</NavLink></li>

                    <li><NavLink to="/profile" className={linkClass}>Profile</NavLink></li>

                    <li><NavLink to="/assets/assign" className={linkClass}>Assets</NavLink></li>

                    {auth.role !== "employee" && (
                        <li><NavLink to="/assets/add" className={linkClass}>Add Asset</NavLink></li>
                    )}

                    <li><NavLink to="/review" className={linkClass}>Review</NavLink></li>
                    <li><NavLink to="/review/form" className={linkClass}>Review Form</NavLink></li>

                    <li><NavLink to="/tasks" className={linkClass}>Tasks</NavLink></li>
                    <li><NavLink to="/tasks/create" className={linkClass}>Create Task</NavLink></li>

                    <li>
                        <button onClick={logout} className="logout-btn">
                            Logout ({auth.username})
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
