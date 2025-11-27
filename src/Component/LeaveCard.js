import React from 'react';
import { url } from '../Baseurl';

const LeaveCard = ({ leave, onUpdateStatus, admin }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved": return "green";
            case "Rejected": return "red";
            default: return "orange"; // Pending
        }
    };

    const handleUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem("U_Token");
            const res = await fetch(`${url}/update-status/${leave._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");
            await res.json();
            onUpdateStatus();

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <>
            {/* 🔥 CSS FOR BLINK TEXT + RED DOT */}
            <style>
                {`
                @keyframes blinkText {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }

                @keyframes blinkDot {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.3); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .pending-blink {
                    animation: blinkText 1s infinite;
                }

                .red-dot {
                    width: 12px;
                    height: 12px;
                    background: red;
                    border-radius: 50%;
                    display: inline-block;
                    margin-left: 10px;
                    animation: blinkDot 1s infinite;
                }

                /* MOBILE FRIENDLY IMAGE */
                @media (max-width: 768px) {
                    .leave-image {
                        max-height: 200px !important;
                    }
                }
                `}
            </style>

            <div style={styles.card}>

                <div style={styles.contentRow}>

                    <div style={styles.left}>

                        <h3 style={styles.title}>
                            {leave.name} ({leave.employeescode})
                        </h3>

                        {/* STATUS BADGE */}
                        <span
                            style={{
                                ...styles.badge,
                                backgroundColor: getStatusColor(leave.status)
                            }}
                            className={leave.status === "Pending" ? "pending-blink" : ""}
                        >
                            {leave.status}
                        </span>

                        {/* 🔴 RED DOT BLINK WHEN PENDING */}
                        {leave.status === "Pending" && (
                            <span className="red-dot"></span>
                        )}

                        <p>{leave.designation} - {leave.department}</p>
                        <p>Leave Type: {leave.leavetype}</p>
                        <p>{leave.fromdate} to {leave.todate}</p>
                        <p>Duration: {leave.duration}</p>
                        <p>Purpose: {leave.purpose}</p>

                        {/* APPROVE / REJECT BUTTONS */}
                        {admin === "manager" && (
                            <div style={styles.buttonRow}>
                                <button
                                    style={{ ...styles.button, backgroundColor: "green" }}
                                    onClick={() => handleUpdate("Approved")}
                                >
                                    Approve
                                </button>

                                <button
                                    style={{ ...styles.button, backgroundColor: "red" }}
                                    onClick={() => handleUpdate("Rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                    </div>

                    {/* IMAGE SECTION */}
                    {leave.leaveimage && (
                        <div style={styles.right}>
                            <img
                                src={leave.leaveimage}
                                alt="Leave"
                                style={styles.image}
                                className="leave-image"
                            />
                        </div>
                    )}

                </div>

            </div>
        </>
    );
};


// RESPONSIVE STYLES
const styles = {
    card: {
        // background: "#fff",
        // padding: "15px",
        // borderRadius: "10px",
        // boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        // display: "flex",
        // flexDirection: "column",
        // gap: "15px",
        // width: "100%",

        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    contentRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "space-between",
    },

    left: {
        flex: "1 1 60%",
        minWidth: "250px",
    },

    right: {
        flex: "1 1 35%",
        minWidth: "200px",
        textAlign: "right",
    },

    title: { margin: "0 0 8px 0" },

    badge: {
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        display: "inline-block",
        marginTop: "6px",
    },

    buttonRow: {
        marginTop: "15px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },

    button: {
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },

    image: {
        width: "100%",          // Full width of the card
        height: "auto",         // Auto height to maintain aspect ratio
        maxHeight: "300px",     // Prevent too tall images
        objectFit: "cover",     // Crop nicely
        borderRadius: "8px",
    },
};

export default LeaveCard;
