import React, { useEffect, useState } from "react";
import { api } from "../../Component/Api/api";
import { useNavigate } from "react-router-dom";
import "../../Css/TaskItem.css";
import { url } from "../../Baseurl";

export default function TaskForm() {
    const navigate = useNavigate();

    /* ================= STATE ================= */
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    // NEW
    const [priority, setPriority] = useState("medium");
    const [reminderType, setReminderType] = useState("end");

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= LOAD USERS ================= */
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const role = localStorage.getItem("role");
                const managerId = localStorage.getItem("managerId");

                const res = await fetch(
                    `${url}/employee?role=${role}&managerId=${managerId}`
                );
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("User Load Error:", err);
            }
        };
        loadUsers();
    }, []);

    /* ================= SUBMIT ================= */
    const submit = async () => {
        if (!title || !desc || !assignedTo || !date || !time) {
            alert("Please fill all fields");
            return;
        }

        const deadline = `${date}T${time}:00`;

        setLoading(true);

        try {
            await api.post("/tasks", {
                title,
                description: desc,
                assignedTo,
                deadline,
                reminderType,
                meta: {
                    priority,
                },
            });

            alert("✅ Task Created Successfully!");
            navigate("/tasks");
        } catch (err) {
            console.error(err);
            alert("❌ Unable to create task");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="task-form-container">
            <div className="task-card">
                <h1>Create New Task</h1>

                {/* TITLE */}
                <label>Title</label>
                <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                />

                {/* DESCRIPTION */}
                <label>Description</label>
                <textarea
                    className="textarea"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Enter task description"
                />

                {/* ASSIGN USER */}
                <label>Assign To</label>
                <select
                    className="input"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                >
                    <option value="">-- Select User --</option>
                    {users.map((u) => (
                        <option key={u._id} value={u._id}>
                            {u.name}
                        </option>
                    ))}
                </select>

                {/* DEADLINE DATE */}
                <label>Deadline Date</label>
                <input
                    type="date"
                    className="input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* DEADLINE TIME */}
                <label>Deadline Time</label>
                <input
                    type="time"
                    className="input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                {/* PRIORITY */}
                <label>Priority</label>
                <select
                    className="input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                {/* REMINDER TYPE */}
                <label>Reminder Type</label>
                <select
                    className="input"
                    value={reminderType}
                    onChange={(e) => setReminderType(e.target.value)}
                >
                    <option value="end">End Day</option>
                    <option value="daily">Daily</option>
                </select>

                {/* SUBMIT */}
                <button
                    className="btn-submit"
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Create Task"}
                </button>

                <button className="btn-back" onClick={() => navigate("/tasks")}>
                    Back
                </button>
            </div>
        </div>
    );
}
