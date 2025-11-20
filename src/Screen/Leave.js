import React, { useCallback, useEffect, useState } from 'react';
import LeaveCard from '../Component/LeaveCard';
import { url } from '../Baseurl';
import { useNavigate } from 'react-router-dom';
import '../Css/DashboardScreen.css';

export default function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState('');
    const navigate = useNavigate();

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const role = localStorage.getItem('role');
            setAdmin(role);

            const token = localStorage.getItem('U_Token');
            const response = await fetch(`${url}/assigned-leaves`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch leaves');

            const data = await response.json();
            setLeaves(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching leaves:", err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    return (
        <div style={styles.pageWrapper}>
            {/* Heading */}
            <h1 style={styles.title}>Leave Dashboard</h1>

            {/* Add Button */}
            {admin !== 'manager' && (
                <div style={styles.addBtnRow}>
                    <button style={styles.addBtn} onClick={() => navigate('/Add')}>
                        ➕ Add New Leave
                    </button>
                </div>
            )}

            {/* Main Content */}
            {loading ? (
                <div style={styles.loadingWrapper}>
                    <div className="spinner"></div>
                    <p>Loading leaves...</p>
                </div>
            ) : (
                <div style={styles.gridWrapper}>
                    {leaves.length > 0 ? (
                        leaves.map((item) => (
                            <LeaveCard
                                key={item._id}
                                leave={item}
                                onUpdateStatus={fetchLeaves}
                                admin={admin}
                            />
                        ))
                    ) : (
                        <p style={styles.noData}>No leave records found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------- */
/*              PROFESSIONAL STYLE       */
/* ------------------------------------- */

const styles = {
    pageWrapper: {
        padding: '20px',
        fontFamily: "Inter, Arial, sans-serif",
        maxWidth: '1200px',
        margin: '0 auto',
    },

    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#222',
        textAlign: 'left',
    },

    addBtnRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
    },

    addBtn: {
        padding: '12px 22px',
        background: '#0078FF',
        color: 'white',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: '0.2s',
        fontWeight: '600',
    },

    gridWrapper: {
        display: 'grid',
        gap: '18px',

        /* Fully Responsive Grid */
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },

    loadingWrapper: {
        textAlign: 'center',
        marginTop: '30px',
    },

    noData: {
        textAlign: 'center',
        color: '#777',
        fontSize: '16px',
        marginTop: '25px',
    },
};

