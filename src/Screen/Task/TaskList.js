import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../Component/Api/api";
import TaskItem from "../../Component/TaskItem";
import "../../Css/TaskList.css";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ pages: 1 });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const navigate = useNavigate();

    const fetchTasks = async (p = 1, replace = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.get("/tasks", {
                params: { page: p, limit: 12, sortBy: "deadline" },
            });
            const data = res.data.data;
            setMeta(res.data.meta || {});
            setTasks(prev => (replace ? data : [...prev, ...data]));
        } catch (error) {
            console.error("fetch tasks error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        fetchTasks(1, true);
    }, []);

    const loadMore = () => {
        if (loading) return;
        if (page < meta.pages) {
            const next = page + 1;
            setPage(next);
            fetchTasks(next);
        }
    };

    const openTask = (task) => {
        navigate(`/tasks/${task._id}`);
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>Task List</h2>
                <button className="btn-refresh" onClick={onRefresh}>
                    Refresh
                </button>
            </div>

            <div className="task-grid">
                {tasks.length === 0 && !loading && (
                    <p className="no-tasks">No tasks found.</p>
                )}
                {tasks.map((task) => (
                    <TaskItem key={task._id} task={task} onClick={() => openTask(task)} />
                ))}
            </div>

            {loading && <p className="loading-text">Loading...</p>}

            {page < meta.pages && !loading && (
                <button className="btn-load-more" onClick={loadMore}>
                    Load More
                </button>
            )}

            <button
                className="btn-add-task"
                onClick={() => navigate("/tasks/create")}
                title="Add New Task"
            >
                +
            </button>
        </div>
    );
}
