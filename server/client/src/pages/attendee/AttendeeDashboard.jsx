import { MessageSquare } from "lucide-react";
function AttendeeDashboard() {
    return (
        <div>
            <h1>Attendee Dashboard</h1>
            <p>Welcome to the EventSphere Attendee Panel.</p>
        <div
    className="dashboard-card"
    onClick={() => navigate("/attendee/feedback")}
>
    <MessageSquare size={24} />
    <h3>Feedback & Support</h3>
    <p>
        Share feedback or contact support.
    </p>
</div>
        </div>
    );
}

export default AttendeeDashboard;