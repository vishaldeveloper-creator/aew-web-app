import React, { useCallback, useEffect, useState } from "react";
import { url } from "../Baseurl";
import { useNavigate } from "react-router-dom";
import "../Css/DashboardScreen.css";

export default function DashboardScreen() {
    const navigate = useNavigate();

    // ✅ Declare all states that you’re updating
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin] = useState("");
    const [leaves, setLeaves] = useState([]);
    const [departmentUser, setDepartmentUser] = useState([]);

    // ✅ Fetch Leaves
    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const username = localStorage.getItem("role");
            setAdmin(username);

            const token = localStorage.getItem("U_Token");
            const response = await fetch(`${url}/assigned-leaves`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("Leaves:", data);
            setLeaves(data);
        } catch (err) {
            console.error("Failed to fetch leaves:", err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Fetch Department Users
    const userDepartment = async () => {
        try {
            const username = localStorage.getItem("role");
            const managerId = localStorage.getItem("managerId");

            const res = await fetch(
                `${url}/employee?role=${username}&managerId=${managerId}`
            );
            const result = await res.json();
            console.log("Department users:", result);
            setDepartmentUser(result);
        } catch (error) {
            console.error("Error fetching department users:", error);
            setDepartmentUser([]);
        }
    };

    useEffect(() => {
        fetchLeaves();
        userDepartment();
    }, [fetchLeaves]);

    // ✅ Return UI
    return (
        <div className="user-card-container">
            <div className="user-card" onClick={() => navigate("/Leave")}>
                <p className="user-name">Leave</p>
                <p className="user-info">📧 item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
            </div>

            <div className="user-card" onClick={() => navigate("/AssinnAssest")}>
                <p className="user-name">Asset</p>
                <p className="user-info">📧 item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
            </div>

            <div className="user-card" onClick={() => navigate("/ReviewForm")}>
                <p className="user-name">Review</p>
                <p className="user-info">📧 item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
            </div>

            {loading && <p>Loading data...</p>}
        </div>
    );
}
