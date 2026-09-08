import Users from "./pages/admin/Users";
import Expos from "./pages/admin/Expos";
import AdminLayout from "./layouts/AdminLayout";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import DashboardRedirect from "./pages/DashboardRedirect";

import AdminDashboard from "./pages/admin/AdminDashboard";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import ExhibitorDashboard from "./pages/exhibitor/ExhibitorDashboard";
import AttendeeDashboard from "./pages/attendee/AttendeeDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Logged-in Dashboard Redirect */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardRedirect />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}

<Route
    path="/admin"
    element={
        <RoleRoute allowedRoles={["admin"]}>
            <AdminLayout />
        </RoleRoute>
    }
>
    <Route
        index
        element={<AdminDashboard />}
    />

    <Route
        path="users"
        element={<Users />}
    />
    <Route
        path="expos"
        element={<Expos />}
    />
</Route>
                {/* Organizer */}

                <Route
                    path="/organizer"
                    element={
                        <RoleRoute allowedRoles={["organizer"]}>
                            <OrganizerDashboard />
                        </RoleRoute>
                    }
                />

                {/* Exhibitor */}

                <Route
                    path="/exhibitor"
                    element={
                        <RoleRoute allowedRoles={["exhibitor"]}>
                            <ExhibitorDashboard />
                        </RoleRoute>
                    }
                />

                {/* Attendee */}

                <Route
                    path="/attendee"
                    element={
                        <RoleRoute allowedRoles={["attendee"]}>
                            <AttendeeDashboard />
                        </RoleRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;