import { useEffect, useState } from "react";
import api from "../../services/api";

function Expos() {
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchExpos = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/expos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setExpos(response.data.expos);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load expos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, []);

    if (loading) {
        return <p>Loading expos...</p>;
    }

    return (
        <div>
            <div className="page-header">
                <h1>Expos</h1>
                <p>Manage all EventSphere expos.</p>
            </div>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Registration Deadline</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expos.map((expo) => (
                            <tr key={expo._id}>
                                <td>{expo.title}</td>

                                <td>{expo.location}</td>

                                <td>
                                    {new Date(
                                        expo.startDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {new Date(
                                        expo.endDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {new Date(
                                        expo.registrationDeadline
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {expo.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {expos.length === 0 && (
                    <div className="empty-state">
                        <p>No expos found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Expos;