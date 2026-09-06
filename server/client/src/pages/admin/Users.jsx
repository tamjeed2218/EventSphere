import { useEffect, useState } from "react";
import api from "../../services/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.users);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>

            <div className="page-header">
                <h1>Users</h1>
                <p>Manage all EventSphere users.</p>
            </div>

            {error && (
                <p>{error}</p>
            )}

            <div className="users-table-container">

                <table className="users-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => (
                            <tr key={user._id}>

                                <td>
                                    {user.name}
                                </td>

                                <td>
                                    {user.email}
                                </td>

                                <td>
                                    {user.role}
                                </td>

                                <td>
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

                {users.length === 0 && (
                    <div className="empty-state">
                        <p>No users found.</p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Users;