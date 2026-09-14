import { useEffect, useState } from "react";
import {
    RefreshCw,
    Users as UsersIcon,
    ShieldCheck,
    Trash2
} from "lucide-react";
import api from "../../services/api";
import "./Users.css";
import { useAuth } from "../../context/AuthContext";

function Users() {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    /*
     * Check whether the listed user is the currently
     * logged-in admin.
     */
    const isCurrentUser = (user) => {
        if (!currentUser || !user) {
            return false;
        }

        const currentId = currentUser._id || currentUser.id;
        const userId = user._id || user.id;

        return String(currentId) === String(userId);
    };

    /*
     * Fetch all users
     */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Authentication token not found.");
                return;
            }

            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.users || []);

        } catch (error) {
            console.error("Fetch users error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load users. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Update user role
     */
    const handleRoleChange = async (userId, newRole) => {
        const selectedUser = users.find(
            (user) => String(user._id) === String(userId)
        );

        /*
         * Extra frontend protection:
         * Admin users cannot have their roles changed.
         */
        if (selectedUser?.role === "admin") {
            setError("Admin user roles cannot be changed.");
            return;
        }

        /*
         * Prevent the logged-in admin from changing
         * their own account.
         */
        if (selectedUser && isCurrentUser(selectedUser)) {
            setError("You cannot change your own admin role.");
            return;
        }

        try {
            setUpdatingUserId(userId);
            setError("");

            const token = localStorage.getItem("token");

            await api.put(
                `/users/${userId}/role`,
                {
                    role: newRole
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchUsers();

        } catch (error) {
            console.error("Update user role error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update user role."
            );
        } finally {
            setUpdatingUserId(null);
        }
    };

    /*
     * Delete user
     */
    const handleDeleteUser = async (userId) => {
        const selectedUser = users.find(
            (user) => String(user._id) === String(userId)
        );

        /*
         * Never allow admin accounts to be deleted.
         */
        if (selectedUser?.role === "admin") {
            setError("Admin users cannot be deleted.");
            return;
        }

        /*
         * Never allow the currently logged-in user
         * to delete themselves.
         */
        if (selectedUser && isCurrentUser(selectedUser)) {
            setError("You cannot delete your own account.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${
                selectedUser?.name || "this user"
            }? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingUserId(userId);
            setError("");

            const token = localStorage.getItem("token");

            await api.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await fetchUsers();

        } catch (error) {
            console.error("Delete user error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete user."
            );
        } finally {
            setDeletingUserId(null);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /*
     * Loading state
     */
    if (loading) {
        return (
            <div className="users-page">
                <div className="users-loading">
                    <RefreshCw
                        className="loading-spinner"
                        size={22}
                    />
                    <span>Loading users...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="users-page">

            {/* Page Header */}
            <div className="page-header users-page-header">
                <div>
                    <h1>Users</h1>
                    <p>
                        Manage EventSphere users and their account roles.
                    </p>
                </div>

                <button
                    className="users-refresh-button"
                    onClick={fetchUsers}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "loading-spinner" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="users-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Summary */}
            <div className="users-summary">

                <div className="users-summary-icon">
                    <UsersIcon size={24} />
                </div>

                <div className="users-summary-content">
                    <strong>{users.length}</strong>
                    <span>Total Users</span>
                </div>

                <div className="users-summary-divider" />

                <div className="users-summary-info">
                    <ShieldCheck size={18} />
                    <span>
                        Admin accounts are protected
                    </span>
                </div>

            </div>

            {/* Users Table */}
            <div className="users-table-container">

                {users.length > 0 ? (

                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => {

                                    const currentUserRow =
                                        isCurrentUser(user);

                                    const adminUser =
                                        user.role === "admin";

                                    return (
                                        <tr
                                            key={user._id}
                                            className={
                                                currentUserRow
                                                    ? "current-user-row"
                                                    : ""
                                            }
                                        >

                                            {/* Name */}
                                            <td>
                                                <div className="user-name-cell">

                                                    <div className="user-avatar">
                                                        {user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>

                                                    <div className="user-name-content">

                                                        <div className="user-name-line">
                                                            <span className="user-name">
                                                                {user.name ||
                                                                    "Unknown User"}
                                                            </span>

                                                            {currentUserRow && (
                                                                <span className="you-badge">
                                                                    You
                                                                </span>
                                                            )}

                                                        </div>

                                                        {currentUserRow && (
                                                            <span className="current-user-label">
                                                                Logged-in administrator
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td>
                                                <span className="user-email">
                                                    {user.email || "N/A"}
                                                </span>
                                            </td>

                                            {/* Role */}
                                            <td>

                                                <div className="role-cell">

                                                    <select
                                                        className={`user-role-select role-${user.role}`}
                                                        value={user.role}
                                                        disabled={
                                                            adminUser ||
                                                            currentUserRow ||
                                                            updatingUserId ===
                                                                user._id
                                                        }
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                user._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="attendee">
                                                            Attendee
                                                        </option>

                                                        <option value="exhibitor">
                                                            Exhibitor
                                                        </option>

                                                        <option value="organizer">
                                                            Organizer
                                                        </option>

                                                        <option value="admin">
                                                            Admin
                                                        </option>

                                                    </select>

                                                    {adminUser && (
                                                        <span className="protected-label">
                                                            <ShieldCheck
                                                                size={14}
                                                            />
                                                            Protected
                                                        </span>
                                                    )}

                                                </div>

                                            </td>

                                            {/* Created */}
                                            <td>
                                                <span className="user-created-date">
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString(
                                                              undefined,
                                                              {
                                                                  year: "numeric",
                                                                  month: "short",
                                                                  day: "numeric"
                                                              }
                                                          )
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td>

                                                <div className="user-actions">

                                                    {currentUserRow && (
                                                        <span className="current-user-indicator">
                                                            <span className="pointer-icon">
                                                                <i class="fa fa-hand-o-left" aria-hidden="true"></i>
                                                            </span>

                                                            <span>
                                                                You
                                                            </span>
                                                        </span>
                                                    )}

                                                    {adminUser ? (
                                                        <button
                                                            type="button"
                                                            className="protected-button"
                                                            disabled
                                                            title="Admin accounts are protected"
                                                        >
                                                            <ShieldCheck
                                                                size={15}
                                                            />
                                                            Protected
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user._id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingUserId ===
                                                                    user._id ||
                                                                currentUserRow
                                                            }
                                                            title={
                                                                currentUserRow
                                                                    ? "You cannot delete your own account"
                                                                    : "Delete user"
                                                            }
                                                        >
                                                            <Trash2 size={15} />

                                                            {deletingUserId ===
                                                            user._id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="users-empty-state">

                        <div className="users-empty-icon">
                            <UsersIcon size={32} />
                        </div>

                        <h3>No users found</h3>

                        <p>
                            There are currently no users in the
                            EventSphere system.
                        </p>

                        <button
                            className="users-empty-refresh"
                            onClick={fetchUsers}
                        >
                            <RefreshCw size={16} />
                            Refresh Users
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Users;