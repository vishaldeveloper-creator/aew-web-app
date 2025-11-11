import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const authData = localStorage.getItem("username");
    const role = localStorage.getItem('role');
    const logoutmethod = () => {
        localStorage.clear();
        navigate('/SignUp');
    };

    const getActiveClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

    return (
        <div className="nav_Header">
            <img
                src="/Applogcurcle.jpg"
                alt="React Logo"
                className="App-logo"
            />

            {authData ? (
                <ul className="nav-ul">
                    <li><NavLink to="/" className={getActiveClass}>Dashboard</NavLink></li>
                    <li><NavLink to="/Leave" className={getActiveClass}>Leave</NavLink></li>
                    {role !== "manager" && (<li><NavLink to="/Add" className={getActiveClass}>Add Leave</NavLink></li>)}

                    <li><NavLink to="/Profile" className={getActiveClass}>Profile</NavLink></li>
                    <li><NavLink to="/AssinnAssest" className={getActiveClass}>AssinnAssest</NavLink></li>
                    {role !== "employee" && (<li><NavLink to="/AddAssest" className={getActiveClass}>AddAssest</NavLink></li>)}
                    <li><NavLink to="/Review" className={getActiveClass}>Review</NavLink></li>
                    <li><NavLink to="/ReviewForm" className={getActiveClass}>ReviewForm</NavLink></li>
                    <li>
                        <NavLink onClick={logoutmethod} to="/SignUp" className="nav-link">
                            LogOut ({authData})
                        </NavLink>
                    </li>
                </ul>
            ) : (
                <div className="nav-right">
                    <NavLink to="/SignUp" className={getActiveClass}>SignUp</NavLink>
                    <NavLink to="/Login" className={getActiveClass}>Login</NavLink>
                </div>
            )}
        </div>
    );
}

export default Nav;
