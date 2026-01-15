// src/components/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { url } from "../../Baseurl";

export default function ReviewForm() {
    const [employees, setEmployees] = useState([]);


    const [formData, setFormData] = useState({
        employeeId: "",
        reviewPeriodFrom: "",
        ratings: []
    });

    /* -------------------------------------------------------
       LOAD ROLE FROM TOKEN
    ------------------------------------------------------- */
    useEffect(() => {
        const token = localStorage.getItem("U_Token");
        if (token) {
            // const payload = JSON.parse(atob(token.split(".")[1]));
            // setRole(payload.role);
        }
    }, []);

    /* -------------------------------------------------------
       FETCH EMPLOYEES
    ------------------------------------------------------- */
    useEffect(() => {
        async function fetchEmployees() {
            const token = localStorage.getItem("U_Token");
            const res = await axios.get(`${url}/api/manager-employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data || []);
        }
        fetchEmployees();
    }, []);

    /* -------------------------------------------------------
       REVIEW PERIOD → "Nov 2025"
    ------------------------------------------------------- */
    function generateReviewPeriod() {
        if (!formData.reviewPeriodFrom) return "";
        const d = new Date(formData.reviewPeriodFrom + "-01");
        return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    }

    /* -------------------------------------------------------
       ADD KPA (MANUAL)
    ------------------------------------------------------- */
    function addKPA() {
        setFormData(prev => ({
            ...prev,
            ratings: [
                ...prev.ratings,
                {
                    kpaId: uuidv4(),
                    title: "",
                    responsibility: "",

                }
            ]
        }));
    }

    /* -------------------------------------------------------
       HANDLE INPUT CHANGE
    ------------------------------------------------------- */
    function handleChange(index, field, value) {
        setFormData(prev => {
            const updated = [...prev.ratings];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, ratings: updated };
        });
    }

    /* -------------------------------------------------------
       REMOVE KPA
    ------------------------------------------------------- */
    function removeKPA(index) {
        setFormData(prev => ({
            ...prev,
            ratings: prev.ratings.filter((_, i) => i !== index)
        }));
    }

    /* -------------------------------------------------------
       SUBMIT
    ------------------------------------------------------- */
    async function handleSubmit() {
        if (!formData.employeeId) return alert("Select employee");
        if (!formData.reviewPeriodFrom) return alert("Select review period");
        if (formData.ratings.length === 0) return alert("Add at least one KPA");

        const token = localStorage.getItem("U_Token");
        const reviewPeriod = generateReviewPeriod();

        for (const r of formData.ratings) {

            await axios.put(
                `${url}/assign-ratings`,
                {
                    employeeId: formData.employeeId,
                    reviewPeriod,
                    kpaId: r.kpaId,
                    title: r.title,
                    responsibility: r.responsibility,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }

        alert("Ratings saved successfully");
    }

    /* -------------------------------------------------------
       UI
    ------------------------------------------------------- */
    return (
        <div style={styles.container}>
            <h2>Monthly Performance Review</h2>

            {/* HEADER */}
            <div style={styles.row}>
                <select
                    style={styles.input}
                    value={formData.employeeId}
                    onChange={e =>
                        setFormData(prev => ({ ...prev, employeeId: e.target.value }))
                    }
                >
                    <option value="">-- Select Employee --</option>
                    {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>
                            {emp.name}
                        </option>
                    ))}
                </select>

                <input
                    type="month"
                    style={styles.input}
                    value={formData.reviewPeriodFrom}
                    onChange={e =>
                        setFormData(prev => ({
                            ...prev,
                            reviewPeriodFrom: e.target.value
                        }))
                    }
                />

                <button style={styles.addBtn} onClick={addKPA}>
                    ➕ Add KPA
                </button>
            </div>

            {/* KPA LIST */}
            {formData.ratings.map((kpa, index) => (
                <div key={kpa.kpaId} style={styles.kpaBox}>
                    <input
                        placeholder="KPA Title"
                        style={styles.input}
                        value={kpa.title}
                        onChange={e =>
                            handleChange(index, "title", e.target.value)
                        }
                    />

                    <input
                        placeholder="Responsibility"
                        style={styles.input}
                        value={kpa.responsibility}
                        onChange={e =>
                            handleChange(index, "responsibility", e.target.value)
                        }
                    />



                    <button
                        style={styles.removeBtn}
                        onClick={() => removeKPA(index)}
                    >
                        ✖
                    </button>
                </div>
            ))}

            <button style={styles.submitBtn} onClick={handleSubmit}>
                Submit Review
            </button>
        </div>
    );
}

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */
const styles = {
    container: {
        maxWidth: 1000,
        margin: "20px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    },
    row: {
        display: "flex",
        gap: 10,
        marginBottom: 15
    },
    input: {
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ccc",
        flex: 1
    },
    addBtn: {
        padding: "8px 12px",
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
    },
    kpaBox: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr 120px 1fr 40px",
        gap: 10,
        marginBottom: 10,
        alignItems: "center",
        background: "#f9f9f9",
        padding: 10,
        borderRadius: 8
    },
    removeBtn: {
        background: "#e53935",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
    },
    submitBtn: {
        marginTop: 20,
        padding: "10px 16px",
        background: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer"
    }
};
