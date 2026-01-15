import React from "react";
import "../Css/TaskList.css";

export default function TaskItem({ task, onClick }) {
    const { title, description, assignedTo, deadline, status, assignedBy } = task;

    const formattedDate = new Date(deadline).toLocaleDateString();
    const formattedTime = new Date(deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="task-card" onClick={onClick}>
            <h3 className="task-title">{title}</h3>
            <p className="task-desc">{description}</p>
            <div className="task-footer">
                <span className="task-assigned">Assigned To -: {assignedTo?.name || assignedTo}</span>
                <span className="task-deadline">{formattedDate} {formattedTime}</span>
            </div>
            <span className={`task-status ${status}`}>{status}</span>
            <span className="task-assigned">Assigned By -: {assignedBy?.name || assignedBy}</span>
        </div>
    );
}
