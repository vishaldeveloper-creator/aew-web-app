import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../Baseurl";
import "./Dashboard.css";

export default function DashBoard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        leaves: 0,
        assets: 0,
        reviews: 0,
        tasks: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("U_Token");

            const res = await fetch(`${url}/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            setStats({
                leaves: data.leaves || 0,
                assets: data.assets || 0,
                reviews: data.reviews || 0,
                tasks: data.tasks || 0,
            });
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">

            {/* ===== STATS ===== */}
            <div className="stats-grid">
                <StatCard title="Leaves" count={stats.leaves} />
                <StatCard title="Assets" count={stats.assets} />
                <StatCard title="Reviews" count={stats.reviews} />
                <StatCard title="Tasks" count={stats.tasks} />
            </div>

            {/* ===== QUICK ACTIONS ===== */}
            <h3 className="section-title">Quick Actions</h3>

            <div className="action-grid">
                <ActionCard title="Leave Management" onClick={() => navigate("/leave")} />
                <ActionCard title="Asset Management" onClick={() => navigate("/assets/assign")} />
                <ActionCard title="Performance Review" onClick={() => navigate("/review")} />
                <ActionCard title="Tasks" onClick={() => navigate("/tasks")} />
            </div>
        </div>
    );
}

/* ===== Reusable Components ===== */

function StatCard({ title, count }) {
    return (
        <div className="stat-card">
            <h4>{title}</h4>
            <p>{count}</p>
        </div>
    );
}

function ActionCard({ title, onClick }) {
    return (
        <div className="action-card" onClick={onClick}>
            <h4>{title}</h4>
            <span>View</span>
        </div>
    );
}
