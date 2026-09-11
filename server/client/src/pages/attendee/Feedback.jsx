import { useEffect, useState } from "react";
import { MessageSquare, Star, Send, Clock3, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

const Feedback = () => {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        rating: 5
    });

    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchFeedback = async () => {
        try {
            setFetching(true);

            const response = await api.get("/feedback/my", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFeedback(response.data.feedback || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load feedback."
            );
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRating = (rating) => {
        setFormData({
            ...formData,
            rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.subject.trim()) {
            setError("Please enter a subject.");
            return;
        }

        if (!formData.message.trim()) {
            setError("Please enter your feedback.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/feedback",
                {
                    subject: formData.subject,
                    message: formData.message,
                    rating: Number(formData.rating)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                "Your feedback has been submitted successfully."
            );

            setFormData({
                subject: "",
                message: "",
                rating: 5
            });

            fetchFeedback();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit feedback."
            );
        } finally {
            setLoading(false);
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

    const getStatusIcon = (status) => {
        if (status === "resolved") {
            return <CheckCircle2 size={15} />;
        }

        return <Clock3 size={15} />;
    };

    return (
        <div className="feedback-page">

            <div className="feedback-header">
                <div>
                    <h1>Feedback & Support</h1>
                    <p>
                        Share your experience, suggestions, or issues
                        with the EventSphere team.
                    </p>
                </div>

                <div className="feedback-header-icon">
                    <MessageSquare size={28} />
                </div>
            </div>

            <div className="feedback-grid">

                {/* Submit Feedback */}
                <div className="feedback-form-card">

                    <div className="feedback-card-title">
                        <MessageSquare size={20} />
                        <h2>Send Feedback</h2>
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

                    <form onSubmit={handleSubmit}>

                        <div className="feedback-form-group">
                            <label>Subject</label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Enter feedback subject"
                            />
                        </div>

                        <div className="feedback-form-group">
                            <label>Rating</label>

                            <div className="feedback-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={
                                            star <= formData.rating
                                                ? "rating-star active"
                                                : "rating-star"
                                        }
                                        onClick={() =>
                                            handleRating(star)
                                        }
                                    >
                                        <Star
                                            size={28}
                                            fill={
                                                star <= formData.rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>

                            <span className="rating-label">
                                {formData.rating} / 5
                            </span>
                        </div>

                        <div className="feedback-form-group">
                            <label>Message</label>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your feedback or support request..."
                                rows="7"
                            />
                        </div>

                        <button
                            type="submit"
                            className="feedback-submit-btn"
                            disabled={loading}
                        >
                            <Send size={17} />

                            {loading
                                ? "Submitting..."
                                : "Submit Feedback"}
                        </button>

                    </form>
                </div>


                {/* Previous Feedback */}
                <div className="my-feedback-card">

                    <div className="feedback-card-title">
                        <Clock3 size={20} />
                        <h2>My Feedback</h2>
                    </div>

                    {fetching ? (
                        <div className="feedback-empty">
                            Loading feedback...
                        </div>
                    ) : feedback.length === 0 ? (
                        <div className="feedback-empty">
                            <MessageSquare size={35} />
                            <h3>No feedback yet</h3>
                            <p>
                                Your submitted feedback will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="feedback-list">

                            {feedback.map((item) => (
                                <div
                                    className="feedback-item"
                                    key={item._id}
                                >

                                    <div className="feedback-item-top">

                                        <h3>
                                            {item.subject}
                                        </h3>

                                        <span
                                            className={getStatusClass(
                                                item.status
                                            )}
                                        >
                                            {getStatusIcon(
                                                item.status
                                            )}

                                            {item.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                item.status.slice(1)}
                                        </span>

                                    </div>

                                    <div className="feedback-item-rating">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (
                                                <Star
                                                    key={star}
                                                    size={15}
                                                    fill={
                                                        star <=
                                                        item.rating
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            )
                                        )}

                                    </div>

                                    <p className="feedback-item-message">
                                        {item.message}
                                    </p>

                                    {item.adminResponse && (
                                        <div className="admin-response">
                                            <strong>
                                                Admin Response
                                            </strong>

                                            <p>
                                                {item.adminResponse}
                                            </p>
                                        </div>
                                    )}

                                    <small>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </small>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Feedback;