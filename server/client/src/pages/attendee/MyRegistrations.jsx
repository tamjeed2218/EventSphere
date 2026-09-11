import { useEffect, useState } from "react";
import api from "../../services/api";

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/registrations/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRegistrations(
                response.data.registrations || []
            );
        } catch (error) {
            console.error(
                "Fetch my registrations error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load registrations"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const cancelRegistration = async (id) => {
        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            await api.put(
                `/registrations/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                "Registration cancelled successfully"
            );

            fetchRegistrations();
        } catch (error) {
            console.error(
                "Cancel registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to cancel registration"
            );
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "approved":
                return "my-registration-status approved";

            case "rejected":
                return "my-registration-status rejected";

            case "cancelled":
                return "my-registration-status cancelled";

            default:
                return "my-registration-status pending";
        }
    };

    return (
        <div className="my-registrations-page">

            <div className="my-registrations-header">
                <div>
                    <h1>My Registrations</h1>

                    <p>
                        View and manage your expo and session registrations.
                    </p>
                </div>

                <div className="my-registration-count">
                    {registrations.length} Registrations
                </div>
            </div>

            {message && (
                <div className="my-registration-message success">
                    {message}
                </div>
            )}

            {error && (
                <div className="my-registration-message error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="my-registration-empty">
                    Loading registrations...
                </div>
            ) : registrations.length === 0 ? (
                <div className="my-registration-empty">
                    <h3>No registrations yet</h3>

                    <p>
                        You have not registered for any expo or session.
                    </p>
                </div>
            ) : (
                <div className="my-registrations-grid">

                    {registrations.map((registration) => (
                        <div
                            className="my-registration-card"
                            key={registration._id}
                        >

                            <div className="my-registration-card-header">
                                <span className="my-registration-type">
                                    {registration.registrationType}
                                </span>

                                <span
                                    className={getStatusClass(
                                        registration.status
                                    )}
                                >
                                    {registration.status}
                                </span>
                            </div>

                            <div className="my-registration-card-body">

                                <h2>
                                    {registration.expo?.title ||
                                        "Expo"}
                                </h2>

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {registration.expo?.location ||
                                        "N/A"}
                                </p>

                                {registration.expo?.startDate && (
                                    <p>
                                        <strong>Start Date:</strong>{" "}
                                        {new Date(
                                            registration.expo.startDate
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                                {registration.expo?.endDate && (
                                    <p>
                                        <strong>End Date:</strong>{" "}
                                        {new Date(
                                            registration.expo.endDate
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                                {registration.session && (
                                    <div className="my-registration-session">

                                        <h3>
                                            Session
                                        </h3>

                                        <p>
                                            <strong>
                                                Title:
                                            </strong>{" "}
                                            {registration.session.title}
                                        </p>

                                        {registration.session.speaker && (
                                            <p>
                                                <strong>
                                                    Speaker:
                                                </strong>{" "}
                                                {
                                                    registration.session
                                                        .speaker
                                                }
                                            </p>
                                        )}

                                        {registration.session.location && (
                                            <p>
                                                <strong>
                                                    Location:
                                                </strong>{" "}
                                                {
                                                    registration.session
                                                        .location
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                <p className="my-registration-date">
                                    Registered on{" "}
                                    {registration.createdAt
                                        ? new Date(
                                              registration.createdAt
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>

                            </div>

                            {registration.status !==
                                "cancelled" &&
                                registration.status !==
                                    "rejected" && (
                                    <div className="my-registration-card-footer">

                                        <button
                                            className="cancel-registration-btn"
                                            onClick={() =>
                                                cancelRegistration(
                                                    registration._id
                                                )
                                            }
                                        >
                                            Cancel Registration
                                        </button>

                                    </div>
                                )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyRegistrations;