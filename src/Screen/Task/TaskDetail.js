// TaskDetail.js
import React, { useEffect, useState } from "react";
import { api } from "../../Component/Api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    // Load task from API
    const loadTask = async () => {
        try {
            const res = await api.get(`/tasks/${id}`);
            setTask(res.data.data);
            setEditTitle(res.data.data.title);
        } catch (err) {
            console.error(err);
            alert("Unable to load task details");
        }
    };

    useEffect(() => {
        loadTask();
    }, []);

    if (!task) return <p>Loading...</p>;

    // Update title or status
    const updateTask = async (status = null) => {
        if (!editTitle.trim()) {
            alert("Title cannot be empty!");
            return;
        }
        try {
            const body = { title: editTitle };
            if (status) body.status = status;

            await api.put(`/tasks/${id}`, body);
            await loadTask();

            alert(status ? "Status Updated" : "Title Updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update task");
        }
    };

    return (
        <div style={styles.page}>
            {/* BACK BUTTON */}
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div style={styles.card}>
              

                {/* TITLE */}
                <div style={styles.fieldBox}>
                    <label style={styles.label}>Title:</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={styles.input}
                    />
                    <button style={styles.primaryBtn} onClick={() => updateTask()}>
                        Update Title
                    </button>
                </div>

                {/* DESCRIPTION */}
                <p><b>Description:</b> {task.description || "No description"}</p>

                {/* ASSIGNED INFO */}
                <p><b>Assigned To:</b> {task.assignedTo?.name} ({task.assignedTo?.role})</p>
                <p><b>Assigned By:</b> {task.assignedBy?.name} ({task.assignedBy?.role})</p>

                {/* DEADLINE */}
                <p><b>Deadline:</b> {new Date(task.deadline).toLocaleString()}</p>

                {/* META */}
                <p><b>Priority:</b> {task.meta?.priority || "N/A"}</p>
                <p><b>Tags:</b> {task.meta?.tags?.length > 0 ? task.meta.tags.join(", ") : "None"}</p>
                <p><b>Reminder Type:</b> {task.reminderType}</p>

                {/* CREATED / UPDATED */}
                <p><b>Created At:</b> {new Date(task.createdAt).toLocaleString()}</p>
                <p><b>Updated At:</b> {new Date(task.updatedAt).toLocaleString()}</p>

                {/* STATUS */}
                <p>
                    <b>Status:</b>{" "}
                    <span style={styles.status(task.status)}>{task.status}</span>
                </p>

                {/* STATUS BUTTONS */}
                <div style={styles.buttonRow}>
                    <button
                        style={styles.secondaryBtn}
                        onClick={() => updateTask("in-progress")}
                    >
                        Mark In-Progress
                    </button>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => updateTask("completed")}
                    >
                        Mark Completed
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===========================
        STYLES
=========================== */
const styles = {
    page: {
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
    },

    backBtn: {
        padding: "8px 14px",
        background: "#ddd",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "20px",
    },

    card: {
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },

    heading: {
        marginBottom: "20px",
    },

    fieldBox: {
        marginBottom: "20px",
    },

    label: {
        fontWeight: "bold",
        display: "block",
        marginBottom: "6px",
    },

    input: {
        padding: "10px",
        width: "70%",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #aaa",
    },

    primaryBtn: {
        padding: "10px 18px",
        marginLeft: "10px",
        background: "#0ea5e9",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },

    secondaryBtn: {
        padding: "10px 18px",
        background: "#f59e0b",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },

    buttonRow: {
        marginTop: "25px",
        display: "flex",
        gap: "15px",
    },

    status: (status) => ({
        padding: "5px 10px",
        borderRadius: "8px",
        color: "#fff",
        background:
            status === "completed"
                ? "#10b981"
                : status === "in-progress"
                    ? "#0ea5e9"
                    : "#f59e0b",
    }),
};
