import React, { useCallback, useEffect, useState } from 'react';
import LeaveCard from '../Component/LeaveCard';
import { url } from '../Baseurl';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../Css/DashboardScreen.css';

export default function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState("");


    const navigate = useNavigate(); // ✅ Initialize navigate here

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            // const userCode = localStorage.getItem("userCode");
            const username = localStorage.getItem("role");

            setAdmin(username);

            const token = localStorage.getItem("U_Token");
            const response = await fetch(`${url}/assigned-leaves`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log(data)
            setLeaves(data); // Assuming you maintain a leaves state
        } catch (err) {
            console.error('Failed to fetch leaves:', err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchLeaves();
        // userdeparment();
        // uerAll();
    }, [fetchLeaves]);



    return (
        <div style={styles.container}>

            {admin !== "manager" && (
                <div style={styles.buttonRow}>
                    <button
                        style={{ ...styles.updateBtn, backgroundColor: 'green' }}
                        onClick={() => navigate('/Add')} // ✅ No error now
                    >
                        Add Leave
                    </button>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {Array.isArray(leaves) && leaves.length > 0 ? (
                        leaves.map((item) => (
                            <LeaveCard
                                key={item._id}
                                leave={item}
                                onUpdateStatus={fetchLeaves}
                                admin={admin}
                            />
                        ))
                    ) : (
                        <p>No leave records found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '12px',
    },
    updateBtn: {
        padding: '10px 15px',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
    },
    contentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        flexWrap: 'wrap',
        backgroundColor: 'red'
    },
};
