import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../Baseurl";
import ReviewFormModal from "../../Component/ReviewFormModal";
import "../../Css/ReviewEditable.css";
const NA = (v) => (v === null || v === undefined || v === "" ? "N/A" : v);

export default function ReviewEditable() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    /* ================= AUTH ================= */
    useEffect(() => {
        const t = localStorage.getItem("U_Token");
        if (t) {
            setToken(t);
            try {
                const payload = JSON.parse(atob(t.split(".")[1]));
                setRole(payload.role);
            } catch {
                setRole("");
            }
        }
    }, []);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        if (!token) return;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${url}/show-ratings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(res.data || []);
                console.log(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load ratings. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    /* ================= HELPERS ================= */
    const update = (cb) => {
        const copy = structuredClone(reviews);
        cb(copy);
        setReviews(copy);
    };

    const handleSubmit = async (i) => {
        const r = reviews[i];
        try {
            await axios.put(
                `${url}/assign-ratings/bulk`,
                {
                    employeeId: r.employeeId,
                    reviewPeriod: r.reviewPeriod,
                    selfEvaluation: r.selfEvaluation,
                    kpas: r.kpas,
                    hrReview: r.hrReview,
                    finalSummary: r.finalSummary,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Ratings updated successfully");
        } catch (err) {
            console.error(err);
            alert("Update failed. Check console for details.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="review-editable-container">
            {error && <div className="error-box">{error}</div>}

            <div className="modal-btn-row">
                <button className="create-review-btn" onClick={() => setOpen(true)}>
                    Create Monthly Review
                </button>

                <ReviewFormModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            </div>

            {reviews.length === 0 ? (
                <div className="no-ratings">No ratings found.</div>
            ) : (
                reviews.map((r, ri) => (
                    <div key={r._id} className="review-card">
                        <h2 className="review-title">PERFORMANCE APPRAISAL FORM</h2>

                        {/* ================= INFO ================= */}
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>{NA(r.employeeName)}</td>
                                    <td>Employee Code</td>
                                    <td>{NA(r.employeescode)}</td>
                                </tr>
                                <tr>
                                    <td>Department</td>
                                    <td>{NA(r.department)}</td>
                                    <td>Review Period</td>
                                    <td>{NA(r.reviewPeriod)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ================= KPAs ================= */}
                        <Section title="B. KEY PERFORMANCE AREAS (KPAs)">
                            <table className="kpa-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>KPA</th>
                                        <th>Responsibility</th>
                                        <th>Employee</th>
                                        <th>Manager</th>
                                        <th>Management</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {r.kpas.map((kpa, ki) => (
                                        <tr key={kpa.kpaId || ki}>
                                            <td>{ki + 1}</td>
                                            <td>{kpa.title}</td>
                                            <td>{kpa.responsibility}</td>

                                            <td>
                                                {role === "employee" ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={kpa.employeeRating || ""}
                                                        onChange={(e) =>
                                                            update(
                                                                (d) =>
                                                                    (d[ri].kpas[ki].employeeRating = +e.target.value)
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    NA(kpa.employeeRating)
                                                )}
                                            </td>

                                            <td>
                                                {role === "manager" ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={kpa.managerRating || ""}
                                                        onChange={(e) =>
                                                            update(
                                                                (d) =>
                                                                    (d[ri].kpas[ki].managerRating = +e.target.value)
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    NA(kpa.managerRating)
                                                )}
                                            </td>

                                            <td>
                                                {["hradmin", "ceo"].includes(role) ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={kpa.managementRating || ""}
                                                        onChange={(e) =>
                                                            update(
                                                                (d) =>
                                                                (d[ri].kpas[ki].managementRating =
                                                                    +e.target.value)
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    NA(kpa.managementRating)
                                                )}
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="Remark"
                                                    value={
                                                        role === "employee"
                                                            ? kpa.employeeComment
                                                            : role === "manager"
                                                                ? kpa.managerComment
                                                                : kpa.managementComment || ""
                                                    }
                                                    readOnly={
                                                        !["employee", "manager", "hradmin", "ceo"].includes(role)
                                                    }
                                                    onChange={(e) =>
                                                        update(
                                                            (d) =>
                                                            (d[ri].kpas[ki][
                                                                role === "employee"
                                                                    ? "employeeComment"
                                                                    : role === "manager"
                                                                        ? "managerComment"
                                                                        : "managementComment"
                                                            ] = e.target.value)
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        {/* ================= SELF EVALUATION ================= */}
                        <Section title="A. SELF EVALUATION">
                            <table className="simple-table">
                                <tbody>
                                    {["achievements", "challenges", "trainingNeeds"].map((f) => (
                                        <tr key={f}>
                                            <td>{f.toUpperCase()}</td>
                                            <td>
                                                {role === "employee" ? (
                                                    <textarea
                                                        value={r.selfEvaluation[f] || ""}
                                                        onChange={(e) =>
                                                            update((d) => (d[ri].selfEvaluation[f] = e.target.value))
                                                        }
                                                    />
                                                ) : (
                                                    NA(r.selfEvaluation[f])
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        {/* ================= HR REVIEW ================= */}
                        <Section title="C. HR REVIEW">
                            <table className="simple-table">
                                <thead>
                                    <tr>
                                        <th>HR Review</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {["attendance", "discipline", "policyCompliance"].map((f) => (
                                        <tr key={f}>
                                            <td>{f}</td>
                                            <td>
                                                {role === "hradmin" ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={r.hrReview[f] || ""}
                                                        onChange={(e) =>
                                                            update((d) => (d[ri].hrReview[f] = +e.target.value))
                                                        }
                                                    />
                                                ) : (
                                                    NA(r.hrReview[f])
                                                )}
                                            </td>
                                            <td>
                                                {role === "hradmin" ? (
                                                    <input
                                                        value={r.hrReview[`${f}Comment`] || ""}
                                                        onChange={(e) =>
                                                            update((d) => (d[ri].hrReview[`${f}Comment`] = e.target.value))
                                                        }
                                                    />
                                                ) : (
                                                    NA(r.hrReview[`${f}Comment`])
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        {/* ================= FINAL SUMMARY ================= */}
                        <Section title="D. FINAL SUMMARY">
                            <table className="simple-table">
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["manager", "FinalManagerRating"],
                                        ["hradmin", "FinalHrRating"],
                                        ["ceo", "FinalManagementRating"],
                                    ].map(([rRole, field]) => (
                                        <tr key={field}>
                                            <td>{field}</td>
                                            <td>
                                                {role === rRole ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={5}
                                                        value={r.finalSummary[field] || ""}
                                                        onChange={(e) =>
                                                            update((d) => (d[ri].finalSummary[field] = +e.target.value))
                                                        }
                                                    />
                                                ) : (
                                                    NA(r.finalSummary[field])
                                                )}
                                            </td>
                                            <td>
                                                {role === rRole ? (
                                                    <input
                                                        value={r.finalSummary[`${field}Comment`] || ""}
                                                        onChange={(e) =>
                                                            update(
                                                                (d) => (d[ri].finalSummary[`${field}Comment`] = e.target.value)
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    NA(r.finalSummary[`${field}Comment`])
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        <div className="submit-row">
                            <button className="submit-btn" onClick={() => handleSubmit(ri)}>
                                Submit All Ratings
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/* ================= UI ================= */
const Section = ({ title, children }) => (
    <>
        <h3 className="section-title">{title}</h3>
        {children}
    </>
);
