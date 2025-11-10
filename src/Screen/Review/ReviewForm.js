import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../Baseurl";

const predefinedKPAs = [
    {
        kpa: "Project Execution & Timelines",
        responsibility: "Complete meter installations as per defined scope and timeline",
    },
    {
        kpa: "Team Management",
        responsibility: "Lead, supervise and support field teams for day-to-day activities",
    },
    {
        kpa: "Material & Inventory Control",
        responsibility: "Ensure proper stock of meters, tools, etc at each site",
    },
    {
        kpa: "Safety & Compliance",
        responsibility: "Ensure field team uses proper PPE, and safety SOPs are followed",
    },
    {
        kpa: "DISCOM liasioning ,MIS & Coordination",
        responsibility:
            "Maintain regular liasioning with DISCOM for NOCs, updates, Deposit ,etc approvals",
    },
    {
        kpa: "QC & Serve",
        responsibility: "Ensure QC complete and CI / MI updates",
    },
];

const ReviewForm = () => {
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employeeId: "",
        employeeName: "",
        employeescode: "",
        project: "",
        designation: "",
        department: "",
        location: "",
        reviewPeriod: { from: "", to: "" },
        ratings: [], // start empty
    });
    console.log({ formData })

    const [kpaIndex, setKpaIndex] = useState(0); // track which KPA to add next

    // 🧠 Fetch employees for manager
    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("U_Token");
            const res = await axios.get(`${url}/api/manager-employees`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleSelectEmployee = (id) => {
        const emp = employees.find((e) => e._id === id);
        if (emp) {
            setFormData({
                ...formData,
                employeeId: emp._id,
                employeeName: emp.name,
                employeescode: emp.employeescode,
                department: emp.department,
                location: emp.location,
                project: emp.project,
                designation: emp.designation,
            });
        }
    };

    const handleRatingChange = (index, field, value) => {
        const updated = [...formData.ratings];
        updated[index][field] = value;
        setFormData({ ...formData, ratings: updated });
    };

    // ➕ Add KPA sequentially
    const addKPA = () => {
        if (kpaIndex < predefinedKPAs.length) {
            const nextKPA = predefinedKPAs[kpaIndex];
            setFormData({
                ...formData,
                ratings: [
                    ...formData.ratings,
                    {
                        ...nextKPA,
                        employeeRating: "",
                        managerRating: "",
                        managementRating: "",
                        comment: "",
                    },
                ],
            });
            setKpaIndex(kpaIndex + 1); // move to next KPA
        } else {
            alert("All KPAs have been added!");
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("U_Token");
            console.log("Submitting:", formData);
            await axios.post(`${url}/assign-ratings`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Review submitted successfully!");
            // Reset form
            setFormData({
                employeeId: "",
                employeeName: "",
                employeescode: "",
                project: "",
                designation: "",
                department: "",
                location: "",
                reviewPeriod: { from: "", to: "" },
                ratings: [],
            });
            setKpaIndex(0);
        } catch (error) {
            console.error(error);
            alert("Error submitting review.");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Monthly Performance Review</h2>

            <label>Select Employee:</label>
            <select
                value={formData.employeeId}
                onChange={(e) => handleSelectEmployee(e.target.value)}
            >
                <option value="">-- Select --</option>
                {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeescode})
                    </option>
                ))}
            </select>

            <div style={{ marginTop: 20 }}>
                <input value={formData.employeeName} placeholder="Name" disabled />
                <input value={formData.employeescode} placeholder="Code" disabled />
                <input value={formData.project} placeholder="Project" disabled />
                <input value={formData.designation} placeholder="Designation" disabled />
                <input value={formData.department} placeholder="Department" disabled />
                <input value={formData.location} placeholder="Location" disabled />
            </div>

            <h3>Review Period</h3>
            <input
                type="date"
                value={formData.reviewPeriod.from}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        reviewPeriod: { ...formData.reviewPeriod, from: e.target.value },
                    })
                }
            />
            <input
                type="date"
                value={formData.reviewPeriod.to}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        reviewPeriod: { ...formData.reviewPeriod, to: e.target.value },
                    })
                }
            />

            <h3>KPAs</h3>
            <button
                onClick={addKPA}
                style={{
                    marginBottom: "10px",
                    padding: "6px 12px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                + Add KPA
            </button>

            {formData.ratings.length > 0 && (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "10px",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#f1f5f9" }}>
                            <th style={th}>KPA</th>
                            <th style={th}>Responsibility</th>
                            <th style={th}>Employee Rating</th>
                            <th style={th}>Manager Rating</th>
                            <th style={th}>Management Rating</th>
                            <th style={th}>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.ratings.map((r, index) => (
                            <tr key={index}>
                                <td style={td}>{r.kpa}</td>
                                <td style={td}>{r.responsibility}</td>
                                <td style={td}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={r.employeeRating}
                                        onChange={(e) =>
                                            handleRatingChange(index, "employeeRating", e.target.value)
                                        }
                                        placeholder="1-5"
                                    />
                                </td>
                                <td style={td}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={r.managerRating}
                                        onChange={(e) =>
                                            handleRatingChange(index, "managerRating", e.target.value)
                                        }
                                        placeholder="1-5"
                                    />
                                </td>
                                <td style={td}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={r.managementRating}
                                        onChange={(e) =>
                                            handleRatingChange(index, "managementRating", e.target.value)
                                        }
                                        placeholder="1-5"
                                    />
                                </td>
                                <td style={td}>
                                    <input
                                        type="text"
                                        value={r.comment}
                                        onChange={(e) =>
                                            handleRatingChange(index, "comment", e.target.value)
                                        }
                                        placeholder="Comment"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                onClick={handleSubmit}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Submit Review
            </button>
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                AAD Button
            </button>
        </div>
    );
};

// styles for table cells
const th = {
    textAlign: "left",
    padding: "10px",
    fontSize: "13px",
    fontWeight: "800",
    border: "1px solid #e2e8f0",
};

const td = {
    padding: "8px",
    fontSize: "13px",
    border: "1px solid #e2e8f0",
};

export default ReviewForm;
