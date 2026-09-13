import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    CalendarDays,
    Grid3X3,
    ClipboardList,
    RefreshCw
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import api from "../../services/api";

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

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
            setError(
                error.response?.data?.message ||
                "Failed to load analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-loading">
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-error">
                    <h2>Unable to load analytics</h2>
                    <p>{error}</p>

                    <button
                        onClick={fetchAnalytics}
                        className="analytics-refresh-btn"
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const overview = analytics.overview;

    const boothData = [
        {
            name: "Available",
            value: analytics.booths.available
        },
        {
            name: "Reserved",
            value: analytics.booths.reserved
        },
        {
            name: "Occupied",
            value: analytics.booths.occupied
        }
    ];

    const registrationData = [
        {
            name: "Approved",
            value: analytics.registrations.approved
        },
        {
            name: "Pending",
            value: analytics.registrations.pending
        },
        {
            name: "Rejected",
            value: analytics.registrations.rejected
        },
        {
            name: "Cancelled",
            value: analytics.registrations.cancelled
        }
    ];

    const roleData =
        analytics.users.byRole.map((item) => ({
            name:
                item._id
                    .charAt(0)
                    .toUpperCase() +
                item._id.slice(1),
            value: item.count
        }));

    const expoRegistrationData =
        analytics.expoRegistrations
            .slice(0, 8)
            .map((item) => ({
                name:
                    item.expoTitle ||
                    "Unknown Expo",
                registrations:
                    item.registrations
            }));

    return (
        <div className="analytics-page">

            {/* Header */}

            <div className="analytics-header">

                <div>
                    <h1>Analytics & Reporting</h1>

                    <p>
                        Monitor EventSphere performance,
                        registrations and platform activity.
                    </p>
                </div>

                <button
                    className="analytics-refresh-btn"
                    onClick={fetchAnalytics}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* KPI Cards */}

            <div className="analytics-kpi-grid">

                <div className="analytics-kpi-card">

                    <div className="analytics-kpi-icon">
                        <Users size={23} />
                    </div>

                    <div>
                        <span>Total Users</span>
                        <strong>
                            {overview.totalUsers}
                        </strong>
                    </div>

                </div>


                <div className="analytics-kpi-card">

                    <div className="analytics-kpi-icon">
                        <CalendarDays size={23} />
                    </div>

                    <div>
                        <span>Total Expos</span>
                        <strong>
                            {overview.totalExpos}
                        </strong>
                    </div>

                </div>


                <div className="analytics-kpi-card">

                    <div className="analytics-kpi-icon">
                        <Building2 size={23} />
                    </div>

                    <div>
                        <span>Exhibitors</span>
                        <strong>
                            {overview.totalExhibitors}
                        </strong>
                    </div>

                </div>


                <div className="analytics-kpi-card">

                    <div className="analytics-kpi-icon">
                        <Grid3X3 size={23} />
                    </div>

                    <div>
                        <span>Total Booths</span>
                        <strong>
                            {overview.totalBooths}
                        </strong>
                    </div>

                </div>


                <div className="analytics-kpi-card">

                    <div className="analytics-kpi-icon">
                        <ClipboardList size={23} />
                    </div>

                    <div>
                        <span>Registrations</span>
                        <strong>
                            {overview.totalRegistrations}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Charts */}

            <div className="analytics-chart-grid">

                {/* Registration Status */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">
                        <div>
                            <h2>
                                Registration Status
                            </h2>

                            <p>
                                Registration breakdown
                            </p>
                        </div>
                    </div>

                    <div className="analytics-chart">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>

                                <Pie
                                    data={registrationData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {registrationData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={
                                                    `registration-${index}`
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />
                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>


                {/* Booth Status */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">
                        <div>
                            <h2>
                                Booth Occupancy
                            </h2>

                            <p>
                                Current booth availability
                            </p>
                        </div>
                    </div>

                    <div className="analytics-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>

                                <Pie
                                    data={boothData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {boothData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={
                                                    `booth-${index}`
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />
                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Users by Role */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">
                        <div>
                            <h2>
                                Users by Role
                            </h2>

                            <p>
                                Platform user distribution
                            </p>
                        </div>
                    </div>

                    <div className="analytics-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart data={roleData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    name="Users"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Expo Registrations */}

                <div className="analytics-chart-card">

                    <div className="analytics-chart-header">
                        <div>
                            <h2>
                                Expo Registrations
                            </h2>

                            <p>
                                Registrations by expo
                            </p>
                        </div>
                    </div>

                    <div className="analytics-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart
                                data={
                                    expoRegistrationData
                                }
                                layout="vertical"
                                margin={{
                                    left: 20,
                                    right: 20
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    type="number"
                                />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={120}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="registrations"
                                    name="Registrations"
                                    radius={[
                                        0,
                                        6,
                                        6,
                                        0
                                    ]}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

            </div>


            {/* Summary */}

            <div className="analytics-summary-card">

                <h2>Platform Summary</h2>

                <div className="analytics-summary-grid">

                    <div>
                        <span>
                            Available Booths
                        </span>

                        <strong>
                            {analytics.booths.available}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Reserved Booths
                        </span>

                        <strong>
                            {analytics.booths.reserved}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Occupied Booths
                        </span>

                        <strong>
                            {analytics.booths.occupied}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Approved Registrations
                        </span>

                        <strong>
                            {analytics.registrations.approved}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Pending Registrations
                        </span>

                        <strong>
                            {analytics.registrations.pending}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Rejected Registrations
                        </span>

                        <strong>
                            {analytics.registrations.rejected}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Analytics;