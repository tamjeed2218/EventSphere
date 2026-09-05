import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardRedirect() {
    const { user } = useAuth();

    switch (user?.role) {
        case "admin":
            return <Navigate to="/admin" replace />;

        case "organizer":
            return <Navigate to="/organizer" replace />;

        case "exhibitor":
            return <Navigate to="/exhibitor" replace />;

        case "attendee":
            return <Navigate to="/attendee" replace />;

        default:
            return <Navigate to="/login" replace />;
    }
}

export default DashboardRedirect;