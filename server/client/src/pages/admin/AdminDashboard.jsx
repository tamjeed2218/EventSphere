import {
    Users,
    CalendarDays,
    Store,
    UserRoundCheck
} from "lucide-react";

function AdminDashboard() {

    const stats = [
        {
            title: "Total Users",
            value: "0",
            icon: <Users size={28} />
        },
        {
            title: "Total Expos",
            value: "0",
            icon: <CalendarDays size={28} />
        },
        {
            title: "Exhibitors",
            value: "0",
            icon: <Store size={28} />
        },
        {
            title: "Attendees",
            value: "0",
            icon: <UserRoundCheck size={28} />
        }
    ];

    return (
        <div>

            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your EventSphere system.</p>
            </div>

            <div className="stats-grid">

                {stats.map((stat) => (
                    <div
                        className="stat-card"
                        key={stat.title}
                    >
                        <div className="stat-icon">
                            {stat.icon}
                        </div>

                        <div>
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}

            </div>

            <div className="dashboard-section">

                <h2>Recent Activity</h2>

                <div className="empty-state">
                    <p>
                        No recent activity available.
                    </p>
                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;