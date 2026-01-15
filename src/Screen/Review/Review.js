import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../Baseurl";

const NA = (v) => (v === null || v === undefined || v === "" ? "N/A" : v);

export default function ReviewEditable() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");

    /* ================= AUTH ================= */
    useEffect(() => {
        const t = localStorage.getItem("U_Token");
        if (t) {
            setToken(t);
            const payload = JSON.parse(atob(t.split(".")[1]));
            setRole(payload.role);
        }
    }, []);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                const res = await axios.get(`${url}/show-ratings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(res.data || []);
            } catch (err) {
                console.error(err);
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
        } catch {
            alert("Update failed");
        }
    };

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
    if (!reviews.length) return <div style={{ padding: 20 }}>No ratings found.</div>;

    return (
        <div style={{ padding: 24, fontFamily: "Arial" }}>
            {reviews.map((r, ri) => (
                <div key={r._id} style={sheet}>
                    <h2 style={title}>PERFORMANCE APPRAISAL FORM</h2>

                    {/* ================= INFO ================= */}
                    <table style={infoTable}>
                        <tbody>
                            <tr>
                                <td>Name</td><td>{NA(r.employeeName)}</td>
                                <td>Employee Code</td><td>{NA(r.employeescode)}</td>
                            </tr>
                            <tr>
                                <td>Department</td><td>{NA(r.department)}</td>
                                <td>Review Period</td><td>{NA(r.reviewPeriod)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* ================= KPAs ================= */}
                    <Section title="B. KEY PERFORMANCE AREAS (KPAs)">
                        <table style={kpaTable}>
                            <thead>
                                <tr>
                                    <th>KPA</th>
                                    <th>Responsibility</th>
                                    <th>Emp</th>
                                    <th>Mgr</th>
                                    <th>Mgt</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {r.kpas.map((kpa, ki) => (
                                    <tr key={kpa.kpaId}>
                                        <td>{kpa.title}</td>
                                        <td>{kpa.responsibility}</td>

                                        <td>
                                            {role === "employee"
                                                ? <input type="number" value={kpa.employeeRating || ""}
                                                    onChange={e => update(d => d[ri].kpas[ki].employeeRating = +e.target.value)} />
                                                : NA(kpa.employeeRating)}
                                        </td>

                                        <td>
                                            {role === "manager"
                                                ? <input type="number" value={kpa.managerRating || ""}
                                                    onChange={e => update(d => d[ri].kpas[ki].managerRating = +e.target.value)} />
                                                : NA(kpa.managerRating)}
                                        </td>

                                        <td>
                                            {(role === "hradmin" || role === "ceo")
                                                ? <input type="number" value={kpa.managementRating || ""}
                                                    onChange={e => update(d => d[ri].kpas[ki].managementRating = +e.target.value)} />
                                                : NA(kpa.managementRating)}
                                        </td>

                                        <td>
                                            <input
                                                readOnly={!["employee", "manager", "hradmin", "ceo"].includes(role)}
                                                value={
                                                    role === "employee" ? kpa.employeeComment :
                                                        role === "manager" ? kpa.managerComment :
                                                            kpa.managementComment || ""
                                                }
                                                onChange={e =>
                                                    update(d => d[ri].kpas[ki][
                                                        role === "employee" ? "employeeComment" :
                                                            role === "manager" ? "managerComment" :
                                                                "managementComment"
                                                    ] = e.target.value)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Section>

                    {/* ================= SELF ================= */}
                    <Section title="A. SELF EVALUATION">
                        <table style={simpleTable}>
                            <tbody>
                                {["achievements", "challenges", "trainingNeeds"].map(f => (
                                    <tr key={f}>
                                        <td>{f.toUpperCase()}</td>
                                        <td>
                                            {role === "employee"
                                                ? <textarea value={r.selfEvaluation[f] || ""}
                                                    onChange={e => update(d => d[ri].selfEvaluation[f] = e.target.value)} />
                                                : NA(r.selfEvaluation[f])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Section>

                    {/* ================= HR ================= */}
                    <Section title="C. HR REVIEW">
                        <table style={simpleTable}>
                            <thead>
                                <tr>
                                    <th>HR Review</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["attendance", "discipline", "policyCompliance"].map(f => (
                                    <tr key={f}>
                                        <td>{f}</td>
                                        <td>{role === "hradmin"
                                            ? <input type="number" value={r.hrReview[f] || ""}
                                                onChange={e => update(d => d[ri].hrReview[f] = +e.target.value)} />
                                            : NA(r.hrReview[f])}
                                        </td>
                                        <td>
                                            {role === "hradmin"
                                                ? <input value={r.hrReview[`${f}Comment`] || ""}
                                                    onChange={e => update(d => d[ri].hrReview[`${f}Comment`] = e.target.value)} />
                                                : NA(r.hrReview[`${f}Comment`])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Section>

                    {/* ================= FINAL ================= */}
                    <Section title="D. FINAL SUMMARY">
                        <table style={simpleTable}>
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
                                        <td>{role === rRole
                                            ? <input type="number" value={r.finalSummary[field] || ""}
                                                onChange={e => update(d => d[ri].finalSummary[field] = +e.target.value)} />
                                            : NA(r.finalSummary[field])}
                                        </td>
                                        <td>
                                            {role === rRole
                                                ? <input value={r.finalSummary[`${field}Comment`] || ""}
                                                    onChange={e => update(d => d[ri].finalSummary[`${field}Comment`] = e.target.value)} />
                                                : NA(r.finalSummary[`${field}Comment`])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Section>

                    <button onClick={() => handleSubmit(ri)}>Submit All Ratings</button>
                </div>
            ))}
        </div>
    );
}

/* ================= UI ================= */
const Section = ({ title, children }) => (
    <>
        <h3 style={sectionTitle}>{title}</h3>
        {children}
    </>
);

const sheet = { border: "2px solid #000", padding: 20, marginBottom: 40 };
const title = { textAlign: "center", fontWeight: 900 };
const sectionTitle = { marginTop: 20, fontWeight: 800 };
const infoTable = { width: "100%", border: "1px solid #000" };
const kpaTable = infoTable;
const simpleTable = infoTable;
