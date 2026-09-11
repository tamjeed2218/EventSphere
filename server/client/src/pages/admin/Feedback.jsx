import { useEffect, useState } from "react";
import {
    MessageSquare,
    Search,
    CheckCircle2,
    Clock3,
    Trash2,
    X
} from "lucide-react";
import api from "../../services/api";

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState("pending");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchFeedback = async () => {
        try {
            setLoading(true);

            const result = await api.get("/feedback", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFeedback(result.data.feedback || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load feedback."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    useEffect(() => {
        let result = [...feedback];

        if (search.trim()) {
            const searchValue = search.toLowerCase();

            result = result.filter((item) =>
                item.subject.toLowerCase().includes(searchValue) ||
                item.message.toLowerCase().includes(searchValue) ||
                item.user?.name?.toLowerCase().includes(searchValue) ||
                item.user?.email?.toLowerCase().includes(searchValue)
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(
                (item) => item.status === statusFilter
            );
        }

        setFilteredFeedback(result);
    }, [feedback, search, statusFilter]);

    const openFeedback = (item) => {
        setSelectedFeedback(item);
        setResponse(item.adminResponse || "");
        setStatus(item.status);
        setMessage("");
        setError("");
    };

    const closeModal = () => {
        setSelectedFeedback(null);
        setResponse("");
        setStatus("pending");
    };

    const updateFeedback = async () => {
        try {
            setMessage("");
            setError("");

            await api.put(
                `/feedback/${selectedFeedback._id}`,
                {
                    status,
                    adminResponse: response
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Feedback updated successfully.");

            await fetchFeedback();

            setTimeout(() => {
                closeModal();
                setMessage("");
            }, 700);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update feedback."
            );
        }
    };

    const deleteFeedback = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this feedback?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/feedback/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Feedback deleted successfully.");

            fetchFeedback();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete feedback."
            );
        }
    };

    const getStatusClass = (status) => {
        if (status === "resolved") {
            return "feedback-status resolved";
        }

        if (status === "reviewed") {
            return "feedback-status reviewed";
        }

        return "feedback-status pending";
    };

    return (
        <div className="admin-feedback-page">

            <div className="admin-feedback-header">

                <div>
                    <h1>Feedback & Support</h1>
                    <p>
                        Review user feedback and manage support requests.
                    </p>
                </div>

                <div className="admin-feedback-icon">
                    <MessageSquare size={28} />
                </div>

            </div>

            {message && (
                <div className="feedback-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="feedback-error">
                    {error}
                </div>
            )}

            <div className="feedback-filters">

                <div className="feedback-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search feedback..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="all">
                        All Status
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="reviewed">
                        Reviewed
                    </option>

                    <option value="resolved">
                        Resolved
                    </option>
                </select>

            </div>


            <div className="feedback-table-card">

                {loading ? (
                    <div className="feedback-loading">
                        Loading feedback...
                    </div>
                ) : filteredFeedback.length === 0 ? (
                    <div className="feedback-empty">
                        <MessageSquare size={40} />
                        <h3>No feedback found</h3>
                        <p>
                            There are no feedback records matching
                            your search.
                        </p>
                    </div>
                ) : (
                    <div className="feedback-table-wrapper">

                        <table className="feedback-table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Subject</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredFeedback.map((item) => (
                                    <tr key={item._id}>

                                        <td>
                                            <div className="feedback-user">
                                                <strong>
                                                    {item.user?.name ||
                                                        "Unknown User"}
                                                </strong>

                                                <span>
                                                    {item.user?.email ||
                                                        "No email"}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <strong>
                                                {item.subject}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="table-rating">
                                                {item.rating}/5
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={getStatusClass(
                                                    item.status
                                                )}
                                            >
                                                {item.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.status.slice(1)}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>

                                            <div className="feedback-actions">

                                                <button
                                                    className="feedback-view-btn"
                                                    onClick={() =>
                                                        openFeedback(item)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="feedback-delete-btn"
                                                    onClick={() =>
                                                        deleteFeedback(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>


            {/* Feedback Modal */}
            {selectedFeedback && (
                <div className="feedback-modal-overlay">

                    <div className="feedback-modal">

                        <div className="feedback-modal-header">

                            <div>
                                <h2>
                                    Feedback Details
                                </h2>

                                <p>
                                    Review and respond to this feedback.
                                </p>
                            </div>

                            <button
                                className="feedback-close-btn"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <div className="feedback-detail-user">

                            <strong>
                                {selectedFeedback.user?.name}
                            </strong>

                            <span>
                                {selectedFeedback.user?.email}
                            </span>

                        </div>


                        <div className="feedback-detail-section">

                            <label>Subject</label>

                            <div className="feedback-detail-box">
                                {selectedFeedback.subject}
                            </div>

                        </div>


                        <div className="feedback-detail-section">

                            <label>Rating</label>

                            <div className="feedback-detail-rating">

                                {[
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map((star) => (
                                    <span key={star}>
                                        {star <=
                                        selectedFeedback.rating
                                            ? "★"
                                            : "☆"}
                                    </span>
                                ))}

                                <strong>
                                    {selectedFeedback.rating}/5
                                </strong>

                            </div>

                        </div>


                        <div className="feedback-detail-section">

                            <label>Message</label>

                            <div className="feedback-detail-message">
                                {selectedFeedback.message}
                            </div>

                        </div>


                        <div className="feedback-detail-section">

                            <label>Status</label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                            >
                                <option value="pending">
                                    Pending
                                </option>

                                <option value="reviewed">
                                    Reviewed
                                </option>

                                <option value="resolved">
                                    Resolved
                                </option>
                            </select>

                        </div>


                        <div className="feedback-detail-section">

                            <label>
                                Admin Response
                            </label>

                            <textarea
                                rows="5"
                                value={response}
                                onChange={(e) =>
                                    setResponse(e.target.value)
                                }
                                placeholder="Write your response..."
                            />

                        </div>


                        <div className="feedback-modal-footer">

                            <button
                                className="feedback-cancel-btn"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                className="feedback-update-btn"
                                onClick={updateFeedback}
                            >
                                <CheckCircle2 size={17} />
                                Update Feedback
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Feedback;