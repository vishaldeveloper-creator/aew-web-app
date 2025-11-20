import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../Baseurl";

// helper for ⭐ and ⏱️
function Stars({ rating = 0 }) {
    const full = Math.max(0, Math.min(5, Number(rating) || 0));
    const stars = "⭐".repeat(full);
    const delays = "☆".repeat(5 - full);
    return (
        <span style={{ fontSize: "15px", fontWeight: "900", color: "#f6c900" }}>
            {stars}
            <span style={{ marginLeft: "4px", color: "#555" }}>{delays}</span>
        </span>
    );
}

const ReviewTable = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const token = localStorage.getItem("U_Token");
                const res = await axios.get(`${url}/show-ratings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRatings(res.data);
            } catch (err) {
                console.error("Error fetching ratings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, []);

    if (loading) {
        return <div style={{ padding: 20 }}>Loading Ratings...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2
                style={{
                    fontSize: "20px",
                    fontWeight: "900",
                    color: "#2d3748",
                    marginBottom: "16px",
                }}
            >
                ⭐ Ratings
            </h2>

            {ratings.map((entry, idx) => (
                <div
                    key={idx}
                    style={{
                        marginBottom: "30px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "16px",
                        background: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    {/* Employee Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: "900", fontSize: "14px" }}>
                                {entry.employeeName}{" "}
                                <span style={{ color: "#718096" }}>({entry.employeescode})</span>
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginTop: "4px",
                                    fontWeight: "700",
                                }}
                            >
                                {entry.project} • {entry.location} • {entry.designation}
                            </div>
                        </div>
                        <img
                            src={`https://i.pravatar.cc/72?img=${(idx % 70) + 1}`}
                            alt="Profile"
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    {/* Ratings Table */}
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "800px",
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    <th style={th}>KPA</th>
                                    <th style={th}>Responsibility</th>
                                    <th style={th}>Employee Rating</th>
                                    <th style={th}>Manager Rating</th>
                                    <th style={th}>Management Rating</th>
                                    <th style={th}>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entry.ratings.map((r, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #edf2f7" }}>
                                        <td style={td}>{r.kpaTitle}</td>
                                        <td style={{ ...td, color: "#374151" }}>{r.kpaResponsibility}</td>
                                        <td style={td}>
                                            <Stars rating={r.employeeRating} />
                                        </td>
                                        <td style={td}>
                                            <Stars rating={r.managerRating} />
                                        </td>
                                        <td style={td}>
                                            <Stars rating={r.managementRating} />
                                        </td>
                                        <td style={{ ...td, color: "#111827" }}>{r.comment || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div
                style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "20px",
                    fontSize: "13px",
                    color: "#555",
                }}
            >
                <div>
                    <span style={{ fontSize: "16px" }}>⭐</span> Performance (1–5)
                </div>
                <div>
                    <span style={{ fontSize: "16px" }}>☆</span> Delay flags
                </div>
            </div>
        </div>
    );
};

// table header + cell styles
const th = {
    textAlign: "left",
    padding: "10px",
    fontSize: "12px",
    fontWeight: "800",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
};

const td = {
    padding: "10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#2d3748",
    verticalAlign: "top",
};

export default ReviewTable;
