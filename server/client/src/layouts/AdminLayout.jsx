import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Store,
    Grid3X3,
    Clock,
    ClipboardList,
    Bell,
    MessageSquare,
    BarChart3,
    LogOut
} from "lucide-react";

function AdminLayout() {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <LayoutDashboard size={20} />
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <Users size={20} />
        },
        {
            name: "Expos",
            path: "/admin/expos",
            icon: <CalendarDays size={20} />
        },
        {
            name: "Exhibitors",
            path: "/admin/exhibitors",
            icon: <Store size={20} />
        },
        {
            name: "Booths",
            path: "/admin/booths",
            icon: <Grid3X3 size={20} />
        },
        {
            name: "Sessions",
            path: "/admin/sessions",
            icon: <Clock size={20} />
        },
        {
            name: "Registrations",
            path: "/admin/registrations",
            icon: <ClipboardList size={20} />
        },
        {
            name: "Notifications",
            path: "/admin/notifications",
            icon: <Bell size={20} />
        },
        {
            name: "Feedback",
            path: "/admin/feedback",
            icon: <MessageSquare size={20} />
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: <BarChart3 size={20} />
        }
    ];

    return (
        <div className="admin-layout">

            {/* Sidebar */}

            <aside className="admin-sidebar">

                <div className="sidebar-logo">
                    <h2>EventSphere</h2>
                    <span>Management System</span>
                </div>

                <nav className="sidebar-menu">

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                </nav>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>

            </aside>

            {/* Main Area */}

            <div className="admin-main">

                {/* Top Navbar */}

                <header className="admin-navbar">

                    <div>
                        <h3>Admin Panel</h3>
                    </div>

                    <div className="admin-profile">

                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-info">
                            <strong>{user?.name}</strong>
                            <span>{user?.role}</span>
                        </div>

                    </div>

                </header>

                {/* Page Content */}

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;