import { useEffect, useState } from "react";

import {
    Users,
    CalendarDays,
    Store,
    UserRoundCheck,
    UserPlus,
    Building2,
    ClipboardList,
    RefreshCw,
    Activity
} from "lucide-react";

import api from "../../services/api";

function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await api.get(
                "/analytics/overview",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setAnalytics(response.data);

        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "user":
                return <UserPlus size={20} />;

            case "expo":
                return <CalendarDays size={20} />;

            case "exhibitor":
                return <Building2 size={20} />;

            case "registration":
                return <ClipboardList size={20} />;

            default:
                return <Activity size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <RefreshCw
                    size={22}
                    className="dashboard-spin"
                />
                <span>
                    Loading dashboard...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="page-header">
                    <h1>Dashboard</h1>
                    <p>
                        Overview of your EventSphere
                        system.
                    </p>
                </div>

                <div className="dashboard-error">
                    <h3>
                        Unable to load dashboard
                    </h3>

                    <p>{error}</p>

                    <button
                        className="dashboard-retry-btn"
                        onClick={fetchDashboard}
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const overview =
        analytics?.overview || {};

    const stats = [
        {
            title: "Total Users",
            value: overview.totalUsers || 0,
            icon: <Users size={26} />,
            className: "users"
        },
        {
            title: "Total Expos",
            value: overview.totalExpos || 0,
            icon: <CalendarDays size={26} />,
            className: "expos"
        },
        {
            title: "Exhibitors",
            value: overview.totalExhibitors || 0,
            icon: <Store size={26} />,
            className: "exhibitors"
        },
        {
            title: "Attendees",
            value: overview.totalAttendees || 0,
            icon: <UserRoundCheck size={26} />,
            className: "attendees"
        }
    ];

    const activities =
        analytics?.recentActivities || [];

    return (
        <div className="admin-dashboard">

            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Overview of your EventSphere
                        system.
                    </p>
                </div>

                <button
                    className="dashboard-refresh-btn"
                    onClick={fetchDashboard}
                    title="Refresh dashboard"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            <div className="stats-grid">

                {stats.map((stat) => (
                    <div
                        className="stat-card"
                        key={stat.title}
                    >
                        <div
                            className={`stat-icon ${stat.className}`}
                        >
                            {stat.icon}
                        </div>

                        <div className="stat-content">
                            <h3>
                                {stat.value}
                            </h3>

                            <p>
                                {stat.title}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            <div className="dashboard-section">

                <div className="dashboard-section-header">
                    <div>
                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Latest activity across
                            the EventSphere system.
                        </p>
                    </div>

                    <Activity size={21} />
                </div>

                {activities.length === 0 ? (
                    <div className="empty-state">
                        <Activity size={30} />

                        <h3>
                            No recent activity
                        </h3>

                        <p>
                            Activity will appear here
                            when users, expos,
                            exhibitors, or
                            registrations are added.
                        </p>
                    </div>
                ) : (
                    <div className="activity-list">

                        {activities.map(
                            (activity, index) => (
                                <div
                                    className="activity-item"
                                    key={`${activity.type}-${activity.date}-${index}`}
                                >
                                    <div
                                        className={`activity-icon ${activity.type}`}
                                    >
                                        {getActivityIcon(
                                            activity.type
                                        )}
                                    </div>

                                    <div className="activity-content">
                                        <h3>
                                            {
                                                activity.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                activity.description
                                            }
                                        </p>
                                    </div>

                                    <time>
                                        {formatDate(
                                            activity.date
                                        )}
                                    </time>
                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminDashboard;