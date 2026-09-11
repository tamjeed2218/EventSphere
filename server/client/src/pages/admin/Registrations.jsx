import { useEffect, useState } from "react";
import api from "../../services/api";

function Registrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/registrations",
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
                "Fetch registrations error:",
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

    const updateStatus = async (
        registrationId,
        status
    ) => {
        try {
            setMessage("");
            setError("");

            const token = localStorage.getItem("token");

            await api.put(
                `/registrations/${registrationId}/status`,
                {
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                `Registration ${status} successfully`
            );

            fetchRegistrations();

        } catch (error) {
            console.error(
                "Update registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update registration"
            );
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "approved":
                return "registration-status approved";

            case "rejected":
                return "registration-status rejected";

            case "cancelled":
                return "registration-status cancelled";

            default:
                return "registration-status pending";
        }
    };

    const filteredRegistrations =
        registrations.filter((registration) => {
            const userName =
                registration.user?.name?.toLowerCase() || "";

            const userEmail =
                registration.user?.email?.toLowerCase() || "";

            const expoTitle =
                registration.expo?.title?.toLowerCase() || "";

            const sessionTitle =
                registration.session?.title?.toLowerCase() || "";

            const searchValue =
                search.toLowerCase();

            const matchesSearch =
                userName.includes(searchValue) ||
                userEmail.includes(searchValue) ||
                expoTitle.includes(searchValue) ||
                sessionTitle.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                registration.status === statusFilter;

            const matchesType =
                typeFilter === "all" ||
                registration.registrationType === typeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );
        });

    return (
        <div className="registrations-page">

            <div className="registrations-header">
                <div>
                    <h1>Registrations</h1>

                    <p>
                        Manage expo and session registrations
                    </p>
                </div>

                <div className="registration-count">
                    {filteredRegistrations.length}
                    {" "}
                    Registrations
                </div>
            </div>

            {message && (
                <div className="registration-message success">
                    {message}
                </div>
            )}

            {error && (
                <div className="registration-message error">
                    {error}
                </div>
            )}

            <div className="registration-filters">

                <input
                    type="text"
                    placeholder="Search by user, email, expo or session..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={typeFilter}
                    onChange={(e) =>
                        setTypeFilter(e.target.value)
                    }
                >
                    <option value="all">
                        All Types
                    </option>

                    <option value="expo">
                        Expo
                    </option>

                    <option value="session">
                        Session
                    </option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="all">
                        All Statuses
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="approved">
                        Approved
                    </option>

                    <option value="rejected">
                        Rejected
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>

            </div>

            {loading ? (
                <div className="registration-empty">
                    Loading registrations...
                </div>
            ) : filteredRegistrations.length === 0 ? (
                <div className="registration-empty">
                    No registrations found.
                </div>
            ) : (
                <div className="registrations-table-wrapper">

                    <table className="registrations-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Expo</th>
                                <th>Session</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRegistrations.map(
                                (registration) => (
                                    <tr
                                        key={
                                            registration._id
                                        }
                                    >

                                        <td>
                                            <strong>
                                                {
                                                    registration
                                                        .user
                                                        ?.name ||
                                                    "N/A"
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                registration
                                                    .user
                                                    ?.email ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                registration
                                                    .expo
                                                    ?.title ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                registration
                                                    .session
                                                    ?.title ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            <span className="registration-type">
                                                {
                                                    registration
                                                        .registrationType
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={getStatusClass(
                                                    registration.status
                                                )}
                                            >
                                                {
                                                    registration
                                                        .status
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            {registration.createdAt
                                                ? new Date(
                                                      registration.createdAt
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td>
                                            <div className="registration-actions">

                                                {registration.status !==
                                                    "approved" &&
                                                    registration.status !==
                                                        "cancelled" && (
                                                        <button
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    registration._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                {registration.status !==
                                                    "rejected" &&
                                                    registration.status !==
                                                        "cancelled" && (
                                                        <button
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    registration._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    )}

                                            </div>
                                        </td>

                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default Registrations;