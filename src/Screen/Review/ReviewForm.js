// src/components/ReviewForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../Baseurl';
import { v4 as uuidv4 } from 'uuid';

const predefinedKPAs = [
    { title: "Project Execution & Timelines", responsibility: "Complete meter installations as per defined scope and timeline" },
    { title: "Team Management", responsibility: "Lead, supervise and support field teams for day-to-day activities" },
    { title: "Material & Inventory Control", responsibility: "Ensure proper stock of meters, tools, etc at each site" },
    { title: "Safety & Compliance", responsibility: "Ensure field team uses proper PPE, and safety SOPs are followed" },
    { title: "DISCOM Liasioning, MIS & Coordination", responsibility: "Maintain regular liasioning with DISCOM for NOCs, updates etc" },
    { title: "QC & Serve", responsibility: "Ensure QC complete and CI / MI updates" },
];

export default function ReviewForm() {
    const [employees, setEmployees] = useState([]);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        employeescode: '',
        project: '',
        designation: '',
        department: '',
        location: '',
        reviewPeriodFrom: '',
        ratings: []
    });


    // -------------------------------------------------------
    // Load Token Role
    // -------------------------------------------------------
    useEffect(() => {
        const token = localStorage.getItem("U_Token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setRole(payload.role || "");
            } catch (e) { }
        }
    }, []);

    // -------------------------------------------------------
    // Fetch Employees
    // -------------------------------------------------------
    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            const token = localStorage.getItem('U_Token');
            const res = await axios.get(`${url}/api/manager-employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }

    // -------------------------------------------------------
    // Handle Employee Select
    // -------------------------------------------------------
    function handleSelectEmployee(id) {
        const selected = employees.find(e => e._id === id);

        if (!selected) return;

        setFormData(prev => ({
            ...prev,
            employeeId: id,
            employeeName: selected.name || "",
            employeescode: selected.employeescode || "",
            project: selected.project || "",
            designation: selected.designation || "",
            department: selected.department || "",
            location: selected.location || ""
        }));
    }

    // -------------------------------------------------------
    // Convert Date → "Nov 2025"
    // -------------------------------------------------------
    function generateReviewPeriod() {
        if (!formData.reviewPeriodFrom) return "";
        const d = new Date(formData.reviewPeriodFrom + "-01");
        return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    }

    // -------------------------------------------------------
    // Add KPA
    // -------------------------------------------------------
    function addKPA() {
        if (formData.ratings.length >= predefinedKPAs.length) {
            alert("All KPAs added");
            return;
        }

        const next = predefinedKPAs[formData.ratings.length];

        setFormData(prev => ({
            ...prev,
            ratings: [
                ...prev.ratings,
                {
                    kpaId: uuidv4(),
                    kpaTitle: next.title,
                    kpaResponsibility: next.responsibility,
                    employeeRating: "",
                    managerRating: "",
                    managementRating: "",
                    comment: ""
                }
            ]
        }));
    }

    // -------------------------------------------------------
    // Rating Change
    // -------------------------------------------------------
    function handleRatingChange(index, field, value) {
        setFormData(prev => {
            const updated = [...prev.ratings];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, ratings: updated };
        });
    }

    // -------------------------------------------------------
    // Load existing ratings
    // -------------------------------------------------------
    async function loadExistingRatings() {
        if (!formData.employeeId) return alert("Select employee");
        if (!formData.reviewPeriodFrom) return alert("Select review period");

        setLoading(true);

        try {
            const reviewPeriod = generateReviewPeriod();
            const token = localStorage.getItem("U_Token");

            const res = await axios.get(`${url}/show-ratings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const docs = res.data || [];

            const match = docs.find(
                d => d.userId === formData.employeeId && d.reviewPeriod === reviewPeriod
            );

            if (!match) {
                alert("No existing ratings found.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                ratings: match.ratings.map(k => ({
                    kpaId: k.kpaId,
                    kpaTitle: k.kpaTitle,
                    kpaResponsibility: k.kpaResponsibility,
                    employeeRating: k.employeeRating || "",
                    managerRating: k.managerRating || "",
                    managementRating: k.managementRating || "",
                    comment:
                        k.employeeRatingComment ||
                        k.managerRatingComment ||
                        k.managementRatingComment ||
                        ""
                }))
            }));
        } finally {
            setLoading(false);
        }
    }

    // -------------------------------------------------------
    // Submit Ratings
    // -------------------------------------------------------
    async function handleSubmit() {
        if (!formData.employeeId) return alert("Select employee");
        if (!formData.reviewPeriodFrom) return alert("Select review period");

        const reviewPeriod = generateReviewPeriod();
        const token = localStorage.getItem("U_Token");

        try {
            for (const r of formData.ratings) {
                const ratingValue =
                    role === "employee"
                        ? r.employeeRating
                        : role === "manager"
                            ? r.managerRating
                            : r.managementRating;

                await axios.put(
                    `${url}/assign-ratings`,
                    {
                        employeeId: formData.employeeId,
                        reviewPeriod,
                        kpaId: r.kpaId,
                        kpaTitle: r.kpaTitle,
                        kpaResponsibility: r.kpaResponsibility,
                        ratingValue,
                        comment: r.comment
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            alert("Ratings saved successfully!");
        } catch (err) {
            alert("Error submitting ratings");
        }
    }

    // -------------------------------------------------------
    // UI
    // -------------------------------------------------------
    return (
        <div style={styles.container}>
            <h2>Monthly Performance Review</h2>

            {/* Row 1 */}
            <div style={styles.row}>
                <div style={{ flex: 1 }}>
                    <label>Select Employee:</label>
                    <select
                        value={formData.employeeId}
                        onChange={e => handleSelectEmployee(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name} ({emp.employeescode})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ width: 220 }}>
                    <label>Review Period</label>
                    <input
                        type="month"
                        style={styles.input}
                        value={formData.reviewPeriodFrom}
                        onChange={e => setFormData(prev => ({ ...prev, reviewPeriodFrom: e.target.value }))}
                    />
                </div>

                <div style={{ display: "flex", gap: 8, marginLeft: 12, justifyContent: 'center' }}>
                    <button style={styles.btn} onClick={addKPA}>
                        + Add KPA
                    </button>
                    <button style={styles.btn} onClick={loadExistingRatings}>
                        {loading ? "Loading..." : "Load Existing"}
                    </button>
                </div>
            </div>

            {/* Employee Info */}
            {formData.employeeId && (
                <div style={styles.employeeInfo}>
                    <input style={styles.input} disabled value={formData.employeeName} />
                    <input style={styles.input} disabled value={formData.employeescode} />
                    <input style={styles.input} disabled value={formData.project} />
                    <input style={styles.input} disabled value={formData.designation} />
                    <input style={styles.input} disabled value={formData.department} />
                    <input style={styles.input} disabled value={formData.location} />
                </div>
            )}

            {/* KPAs */}
            {formData.ratings.map((r, i) => (
                <div key={r.kpaId} style={styles.kpaRow}>
                    <div style={styles.kpaTitle}>{r.kpaTitle}</div>
                    <div style={styles.kpaResp}>{r.kpaResponsibility}</div>

                    <div style={styles.ratingBox}>
                        {role === "employee" && (
                            <input
                                type="number"
                                min="1"
                                max="5"
                                style={styles.input}
                                value={r.employeeRating}
                                onChange={e =>
                                    handleRatingChange(i, "employeeRating", e.target.value)
                                }
                            />
                        )}
                        {role === "manager" && (
                            <input
                                type="number"
                                min="1"
                                max="5"
                                style={styles.input}
                                value={r.managerRating}
                                onChange={e =>
                                    handleRatingChange(i, "managerRating", e.target.value)
                                }
                            />
                        )}
                        {(role === "hradmin" || role === "ceo") && (
                            <input
                                type="number"
                                min="1"
                                max="5"
                                style={styles.input}
                                value={r.managementRating}
                                onChange={e =>
                                    handleRatingChange(i, "managementRating", e.target.value)
                                }
                            />
                        )}
                    </div>

                    <div style={styles.commentBox}>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="Comment"
                            value={r.comment}
                            onChange={e =>
                                handleRatingChange(i, "comment", e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}

            {/* Submit */}
            <button style={styles.submitBtn} onClick={handleSubmit}>
                Submit Ratings
            </button>
        </div>
    );
}

// -------------------------------------------------------
// INLINE STYLES (All CSS moved here)
// -------------------------------------------------------
const styles = {
    container: {
        maxWidth: "1100px",
        margin: "18px auto",
        padding: "18px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
        fontFamily: "Arial, sans-serif"
    },
    row: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",

    },
    input: {
        width: "100%",
        padding: "8px 10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxSizing: "border-box"
    },
    employeeInfo: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
        gap: "10px",
        marginTop: "12px"
    },
    btn: {
        padding: "10px 10px",
        background: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    kpaRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #eee",
        marginTop: "10px",
        background: "#fafafa"
    },
    kpaTitle: {
        flex: "1 1 180px",
        fontWeight: "600",
        minWidth: "160px"
    },
    kpaResp: {
        flex: "2 1 300px",
        minWidth: "200px",
        color: "#444",
        fontSize: "13px"
    },
    ratingBox: {
        flex: "0 0 120px",
        minWidth: "120px"
    },
    commentBox: {
        flex: "1 1 240px",
        minWidth: "180px"
    },
    submitBtn: {
        padding: "10px 14px",
        background: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "12px"
    }
};
