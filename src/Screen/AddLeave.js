import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { url } from "../Baseurl";
import { useNavigate } from "react-router-dom";
import "../Css/AddLeave.css";

const LEAVE_TYPES = ["Earn Leave", "Current Leave", "Half Day"];
const DESIGNATIONS = ["Employee", "Manager", "CEO", "Admin"];
const DEPARTMENTS = ["Finance", "HR", "IT", "Meter", "Solar", "Sales", "CEO"];

export default function AddLeave() {
    const navigate = useNavigate();

    // form data
    const [leaveType, setLeaveType] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [purpose, setPurpose] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [attachedImage, setAttachedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // UI / validation
    const [errors, setErrors] = useState({});

    // -------------- AUTO FILL FROM LOCAL STORAGE -------------- //
    useEffect(() => {
        const userCode = localStorage.getItem("userCode") || "";
        const username = localStorage.getItem("username") || "";
        let storedDesignation = localStorage.getItem("role") || "";
        const storedDepartment = localStorage.getItem("department") || "";

        if (storedDesignation) {
            storedDesignation =
                storedDesignation.charAt(0).toUpperCase() +
                storedDesignation.slice(1).toLowerCase();
        }

        setEmployeeCode(userCode);
        setEmployeeName(username);
        if (storedDesignation) setDesignation(storedDesignation);
        if (storedDepartment) setDepartment(storedDepartment);
    }, []);

    // Half day logic
    useEffect(() => {
        if (leaveType === "Half Day") setToDate(fromDate);
    }, [leaveType, fromDate]);

    // duration calculation
    const durationText = useMemo(() => {
        if (!fromDate) return "0 day";
        if (leaveType === "Half Day") return "Half Day";

        if (!toDate) return "0 day";

        const start = new Date(fromDate);
        const end = new Date(toDate);

        const diff =
            Math.round(
                (end.setHours(0, 0, 0, 0) -
                    start.setHours(0, 0, 0, 0)) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        return diff > 0 ? `${diff} day(s)` : "0 day";
    }, [fromDate, toDate, leaveType]);

    // convert date
    const formatForBackend = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const aspectRatio = width / height;
                    if (aspectRatio > 1) {
                        width = MAX_WIDTH;
                        height = MAX_WIDTH / aspectRatio;
                    } else {
                        height = MAX_HEIGHT;
                        width = MAX_HEIGHT * aspectRatio;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.9;
                let base64 = canvas.toDataURL('image/jpeg', quality);

                const TARGET_SIZE = 80 * 1024;
                while (base64.length > TARGET_SIZE && quality > 0.3) {
                    quality -= 0.05;
                    base64 = canvas.toDataURL('image/jpeg', quality);
                }

                setAttachedImage(base64);
            };
        };
    };


    // ------------------ INPUT VALIDATION ------------------ //
    const validateFields = () => {
        let newErrors = {};

        if (!leaveType) newErrors.leaveType = "Please select leave type.";
        if (!employeeCode) newErrors.employeeCode = "Employee code is required.";
        if (!employeeName) newErrors.employeeName = "Employee name is required.";
        if (!designation) newErrors.designation = "Designation is required.";
        if (!department) newErrors.department = "Department is required.";
        if (!purpose) newErrors.purpose = "Purpose is required.";
        if (!fromDate) newErrors.fromDate = "From date is required.";
        if (leaveType !== "Half Day" && !toDate)
            newErrors.toDate = "To date is required.";

        if (fromDate && toDate && new Date(fromDate) > new Date(toDate))
            newErrors.toDate = "To date cannot be earlier than From date.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ------------------ SUBMIT HANDLER ------------------ //
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        const payload = {
            leavetype: leaveType,
            name: employeeName,
            employeescode: employeeCode,
            designation,
            department,
            purpose,
            leaveimage: attachedImage || "",
            fromdate: formatForBackend(fromDate),
            todate: leaveType === "Half Day" ? "" : formatForBackend(toDate),
            duration: durationText
        };

        try {
            setLoading(true);
            const token = localStorage.getItem("U_Token");

            await axios.post(`${url}/submit`, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                }
            });

            alert("Leave submitted successfully.");
            navigate("/");

        } catch (err) {
            alert(err.response?.data?.error || "Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    // ------------------ UI ------------------ //
    return (
        <div className="addleave-page">
            <form className="addleave-card" onSubmit={onSubmit} noValidate>
                <h1 className="al-title">Leave Request</h1>

                {/* LEAVE TYPE */}
                <label className="al-label">Leave Type *</label>
                <select
                    className={`al-input ${errors.leaveType ? "al-error" : ""}`}
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                >
                    <option value="">Select leave type</option>
                    {LEAVE_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                {errors.leaveType && <p className="al-err-text">{errors.leaveType}</p>}

                {/* EMPLOYEE DETAILS */}
                <div className="al-row">
                    <div className="al-col">
                        <label className="al-label">Employee Code *</label>
                        <input
                            className={`al-input ${errors.employeeCode ? "al-error" : ""}`}
                            value={employeeCode}
                            onChange={(e) => setEmployeeCode(e.target.value)}
                        />
                        {errors.employeeCode && (
                            <p className="al-err-text">{errors.employeeCode}</p>
                        )}
                    </div>

                    <div className="al-col">
                        <label className="al-label">Employee Name *</label>
                        <input
                            className={`al-input ${errors.employeeName ? "al-error" : ""}`}
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                        />
                        {errors.employeeName && (
                            <p className="al-err-text">{errors.employeeName}</p>
                        )}
                    </div>
                </div>

                {/* DESIGNATION + DEPARTMENT */}
                <div className="al-row">
                    <div className="al-col">
                        <label className="al-label">Designation *</label>
                        <select
                            className={`al-input ${errors.designation ? "al-error" : ""}`}
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        >
                            <option value="">Select designation</option>
                            {DESIGNATIONS.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        {errors.designation && (
                            <p className="al-err-text">{errors.designation}</p>
                        )}
                    </div>

                    <div className="al-col">
                        <label className="al-label">Department *</label>
                        <select
                            className={`al-input ${errors.department ? "al-error" : ""}`}
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="al-err-text">{errors.department}</p>
                        )}
                    </div>
                </div>

                {/* PURPOSE */}
                <label className="al-label">Purpose *</label>
                <input
                    className={`al-input ${errors.purpose ? "al-error" : ""}`}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Reason for leave"
                />
                {errors.purpose && <p className="al-err-text">{errors.purpose}</p>}

                {/* DATES */}
                <div className="al-row">
                    <div className="al-col">
                        <label className="al-label">From Date *</label>
                        <input
                            type="date"
                            className={`al-input ${errors.fromDate ? "al-error" : ""}`}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        {errors.fromDate && (
                            <p className="al-err-text">{errors.fromDate}</p>
                        )}
                    </div>

                    {leaveType !== "Half Day" && (
                        <div className="al-col">
                            <label className="al-label">To Date *</label>
                            <input
                                type="date"
                                className={`al-input ${errors.toDate ? "al-error" : ""}`}
                                value={toDate}
                                min={fromDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                            {errors.toDate && (
                                <p className="al-err-text">{errors.toDate}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="al-meta">
                    <strong>Duration:</strong> {durationText}
                </div>

                {/* FILE UPLOAD */}
                <label className="al-label">File Attachment (optional)</label>
                {/* <input className="al-input" type="file" accept="image/*" /> */}
                <input className="al-input" type="file" accept="image/*" onChange={handleFileChange} />

                {/* SUBMIT */}
                <button className="al-submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Leave"}
                </button>
            </form>
        </div>
    );
}
