import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./Css/Nav.css";   // ⬅️ NEW CSS FILE

function Nav() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const logoutmethod = () => {
        localStorage.clear();
        navigate('/SignUp');
    };

    const getActive = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    return (
        <header className="nav-header">
            {/* Logo */}
            <div className="nav-left">
                <img
                    src="/Applogcurcle.jpg"
                    alt="App Logo"
                    className="nav-logo"
                />
                <span className="brand">Smart HR</span>
            </div>

            {/* Hamburger for Mobile */}
            <div
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* MENU */}
            <nav className={`nav-menu ${menuOpen ? "show" : ""}`}>
                {username ? (
                    <ul>
                        <li><NavLink to="/" className={getActive}>Dashboard</NavLink></li>
                        <li><NavLink to="/Leave" className={getActive}>Leave</NavLink></li>

                        {role !== "manager" && (
                            <li><NavLink to="/Add" className={getActive}>Add Leave</NavLink></li>
                        )}

                        <li><NavLink to="/Profile" className={getActive}>Profile</NavLink></li>
                        <li><NavLink to="/AssinnAssest" className={getActive}>Assigned Assets</NavLink></li>

                        {role !== "employee" && (
                            <li><NavLink to="/AddAssest" className={getActive}>Add Asset</NavLink></li>
                        )}

                        <li><NavLink to="/Review" className={getActive}>Review</NavLink></li>
                        <li><NavLink to="/ReviewForm" className={getActive}>Review Form</NavLink></li>

                        <li>
                            <button onClick={logoutmethod} className="logout-btn">
                                Logout ({username})
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li><NavLink to="/SignUp" className={getActive}>SignUp</NavLink></li>
                        <li><NavLink to="/Login" className={getActive}>Login</NavLink></li>
                    </ul>
                )}
            </nav>
        </header>
    );
}

export default Nav;
