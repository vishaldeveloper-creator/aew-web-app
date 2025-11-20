import React from 'react';
import { url } from '../Baseurl';

const LeaveCard = ({ leave, onUpdateStatus, admin }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'green';
            case 'Rejected': return 'red';
            default: return 'orange';
        }
    };

    const handleUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem("U_Token");
            const res = await fetch(`${url}/update-status/${leave._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');
            await res.json();
            onUpdateStatus();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.contentRow}>
                <div style={styles.left}>

                    <h3 style={styles.title}>{leave.name} ({leave.employeescode})</h3>
                    <span style={{ ...styles.badge, backgroundColor: getStatusColor(leave.status) }}> {leave.status} </span>

                    <p>{leave.designation} - {leave.department}</p>
                    <p>Leave Type: {leave.leavetype}</p>
                    <p>{leave.fromdate} to {leave.todate}</p>
                    <p>Duration: {leave.duration}</p>
                    <p>Purpose: {leave.purpose}</p>


                    {admin === "manager" && (
                        <div style={styles.buttonRow}>
                            <button
                                style={{ ...styles.button, backgroundColor: 'green' }}
                                onClick={() => handleUpdate('Approved')}
                            >
                                Approve
                            </button>
                            <button
                                style={{ ...styles.button, backgroundColor: 'red' }}
                                onClick={() => handleUpdate('Rejected')}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>

                {leave.leaveimage && (
                    <div style={styles.right}>
                        <img
                            src={leave.leaveimage}
                            alt="Leave"
                            style={styles.image}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    contentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        flexWrap: 'wrap',
    },
    left: { flex: '1 1 60%' },
    right: { flex: '0 0 120px', textAlign: 'right' },
    title: { margin: '0 0 8px 0' },
    badge: {
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'inline-block',
        marginTop: '8px',
    },
    buttonRow: {
        marginTop: '12px',
        display: 'flex',
        gap: '10px',
    },
    button: {
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    // image: {
    //     width: '430px',
    //     height: '298px',
    //     objectFit: 'cover',
    //     borderRadius: '8px',
    //     border: '1px solid #ddd',
    // },

    image: {
        width: "100%",          // Full width of the card
        height: "auto",         // Auto height to maintain aspect ratio
        maxHeight: "300px",     // Prevent too tall images
        objectFit: "cover",     // Crop nicely
        borderRadius: "8px",
    },
};

export default LeaveCard;
