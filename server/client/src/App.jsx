import Users from "./pages/admin/Users";
import Expos from "./pages/admin/Expos";
import Booths from "./pages/admin/Booths";
import Registrations from "./pages/admin/Registrations";
import MyRegistrations from "./pages/attendee/MyRegistrations";
import AdminLayout from "./layouts/AdminLayout";
import AttendeeFeedback from "./pages/attendee/Feedback";
import AdminFeedback from "./pages/admin/Feedback";

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
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="expos" element={<Expos />} />
    <Route path="booths" element={<Booths />} />
    <Route path="registrations" element={<Registrations />} />
    <Route path="feedback" element={<AdminFeedback />} />
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

 {/* Attendee Dashboard */}

<Route
    path="/attendee"
    element={
        <RoleRoute allowedRoles={["attendee"]}>
            <AttendeeDashboard />
        </RoleRoute>
    }
/>

{/* Attendee Registrations */}

<Route
    path="/attendee/registrations"
    element={
        <RoleRoute allowedRoles={["attendee"]}>
            <MyRegistrations />
        </RoleRoute>
    }
/>
<Route
    path="/attendee/feedback"
    element={
        <RoleRoute allowedRoles={["attendee"]}>
            <AttendeeFeedback />
        </RoleRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;