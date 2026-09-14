import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    Search,
    RefreshCw,
    Plus,
    Eye,
    Pencil,
    Trash2,
    X,
    Clock,
    CalendarDays,
    User,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    CircleDot
} from "lucide-react";

import "./Sessions.css";


function Sessions() {

    const [sessions, setSessions] = useState([]);
    const [expos, setExpos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [expoFilter, setExpoFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedSession, setSelectedSession] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        expo: "",
        speaker: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        capacity: "",
        status: "scheduled"
    });


    // =====================================================
    // FETCH SESSIONS
    // =====================================================

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/sessions");

            setSessions(
                response.data.sessions ||
                response.data ||
                []
            );

        } catch (err) {
            console.error("Fetch sessions error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load sessions."
            );

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // FETCH EXPOS
    // =====================================================

    const fetchExpos = async () => {
        try {

            const response = await api.get("/expos");

            setExpos(
                response.data.expos ||
                response.data ||
                []
            );

        } catch (err) {
            console.error("Fetch expos error:", err);
        }
    };


    useEffect(() => {
        fetchSessions();
        fetchExpos();
    }, []);


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setForm({
            title: "",
            description: "",
            expo: "",
            speaker: "",
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            capacity: "",
            status: "scheduled"
        });

        setEditingSession(null);
    };


    // =====================================================
    // CREATE FORM
    // =====================================================

    const openCreateForm = () => {

        resetForm();

        setShowForm(true);
    };


    // =====================================================
    // EDIT FORM
    // =====================================================

    const openEditForm = (session) => {

        setEditingSession(session);

        setForm({
            title: session.title || "",

            description:
                session.description || "",

            expo:
                session.expo?._id ||
                session.expo ||
                "",

            speaker:
                session.speaker || "",

            date: session.date
                ? new Date(session.date)
                    .toISOString()
                    .split("T")[0]
                : "",

            startTime:
                session.startTime || "",

            endTime:
                session.endTime || "",

            location:
                session.location || "",

            capacity:
                session.capacity || "",

            status:
                session.status || "scheduled"
        });

        setShowForm(true);
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.title.trim()) {
            alert("Session title is required.");
            return;
        }

        if (!form.description.trim()) {
            alert("Session description is required.");
            return;
        }

        if (!form.expo) {
            alert("Please select an expo.");
            return;
        }

        if (!form.speaker.trim()) {
            alert("Speaker name is required.");
            return;
        }

        if (!form.date) {
            alert("Please select a date.");
            return;
        }

        if (!form.startTime) {
            alert("Start time is required.");
            return;
        }

        if (!form.endTime) {
            alert("End time is required.");
            return;
        }

        if (!form.location.trim()) {
            alert("Location is required.");
            return;
        }

        if (!form.capacity || Number(form.capacity) < 1) {
            alert("Capacity must be at least 1.");
            return;
        }


        try {

            setSaving(true);

            const payload = {
                title: form.title.trim(),

                description:
                    form.description.trim(),

                expo: form.expo,

                speaker:
                    form.speaker.trim(),

                date: form.date,

                startTime:
                    form.startTime,

                endTime:
                    form.endTime,

                location:
                    form.location.trim(),

                capacity:
                    Number(form.capacity),

                status:
                    form.status
            };


            if (editingSession) {

                await api.put(
                    `/sessions/${editingSession._id}`,
                    payload
                );

            } else {

                await api.post(
                    "/sessions",
                    payload
                );
            }


            setShowForm(false);

            resetForm();

            await fetchSessions();

        } catch (err) {

            console.error("Save session error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to save session."
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this session?"
        );

        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/sessions/${id}`
            );

            setSessions((previous) =>
                previous.filter(
                    (session) =>
                        session._id !== id
                )
            );

            setSelectedSession(null);

        } catch (err) {

            console.error(
                "Delete session error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete session."
            );
        }
    };


    // =====================================================
    // STATUS UPDATE
    // =====================================================

    const handleStatusChange = async (
        session,
        status
    ) => {

        try {

            await api.put(
                `/sessions/${session._id}`,
                {
                    expo:
                        session.expo?._id ||
                        session.expo,

                    status
                }
            );

            await fetchSessions();

            setSelectedSession(
                (previous) =>
                    previous &&
                    previous._id === session._id
                        ? {
                            ...previous,
                            status
                        }
                        : previous
            );

        } catch (err) {

            console.error(
                "Status update error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update session status."
            );
        }
    };


    // =====================================================
    // EXPO NAME
    // =====================================================

    const getExpoName = (session) => {

        if (!session.expo) {
            return "—";
        }

        if (
            typeof session.expo === "object"
        ) {
            return (
                session.expo.title ||
                session.expo.name ||
                "Unknown Expo"
            );
        }

        const expo = expos.find(
            (item) =>
                item._id === session.expo
        );

        return (
            expo?.title ||
            expo?.name ||
            "Unknown Expo"
        );
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getStatusClass = (status) => {

        return `session-status session-status-${status}`;
    };


    const getStatusLabel = (status) => {

        if (!status) {
            return "Unknown";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };


    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    };


    // =====================================================
    // FILTER
    // =====================================================

    const filteredSessions =
        sessions.filter((session) => {

            const searchText =
                `${session.title || ""} ${
                    session.speaker || ""
                } ${
                    session.location || ""
                } ${
                    getExpoName(session)
                }`.toLowerCase();

            const matchesSearch =
                searchText.includes(
                    search.toLowerCase()
                );

            const sessionExpo =
                session.expo?._id ||
                session.expo;

            const matchesExpo =
                expoFilter === "all" ||
                sessionExpo === expoFilter;

            const matchesStatus =
                statusFilter === "all" ||
                session.status === statusFilter;

            return (
                matchesSearch &&
                matchesExpo &&
                matchesStatus
            );
        });


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalSessions =
        sessions.length;

    const scheduledSessions =
        sessions.filter(
            (session) =>
                session.status === "scheduled"
        ).length;

    const ongoingSessions =
        sessions.filter(
            (session) =>
                session.status === "ongoing"
        ).length;

    const completedSessions =
        sessions.filter(
            (session) =>
                session.status === "completed"
        ).length;


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="sessions-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="sessions-header">

                <div>

                    <div className="sessions-title-row">

                        <div className="sessions-title-icon">
                            <Clock size={24} />
                        </div>

                        <div>

                            <h1>Sessions</h1>

                            <p>
                                Manage event sessions,
                                speakers, schedules and
                                capacities.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="sessions-header-actions">

                    <button
                        className="sessions-refresh-btn"
                        onClick={fetchSessions}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>


                    <button
                        className="sessions-create-btn"
                        onClick={openCreateForm}
                    >
                        <Plus size={18} />

                        Add Session
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="sessions-error">

                    <XCircle size={20} />

                    <span>{error}</span>

                    <button
                        onClick={fetchSessions}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                STATS
            ================================================= */}

            <div className="sessions-stats">

                <div className="session-stat-card">

                    <div className="session-stat-icon total">
                        <Clock size={21} />
                    </div>

                    <div>
                        <span>Total Sessions</span>
                        <strong>
                            {totalSessions}
                        </strong>
                    </div>

                </div>


                <div className="session-stat-card">

                    <div className="session-stat-icon scheduled">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <span>Scheduled</span>
                        <strong>
                            {scheduledSessions}
                        </strong>
                    </div>

                </div>


                <div className="session-stat-card">

                    <div className="session-stat-icon ongoing">
                        <CircleDot size={21} />
                    </div>

                    <div>
                        <span>Ongoing</span>
                        <strong>
                            {ongoingSessions}
                        </strong>
                    </div>

                </div>


                <div className="session-stat-card">

                    <div className="session-stat-icon completed">
                        <CheckCircle size={21} />
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {completedSessions}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="sessions-toolbar">

                <div className="sessions-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search sessions, speakers or locations..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={expoFilter}
                    onChange={(event) =>
                        setExpoFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Expos
                    </option>

                    {expos.map((expo) => (

                        <option
                            key={expo._id}
                            value={expo._id}
                        >
                            {expo.title ||
                                expo.name}
                        </option>

                    ))}

                </select>


                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Statuses
                    </option>

                    <option value="scheduled">
                        Scheduled
                    </option>

                    <option value="ongoing">
                        Ongoing
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                </select>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="sessions-card">

                <div className="sessions-card-header">

                    <div>
                        <h2>All Sessions</h2>

                        <p>
                            Showing{" "}
                            <strong>
                                {filteredSessions.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {sessions.length}
                            </strong>{" "}
                            sessions
                        </p>
                    </div>

                </div>


                {loading ? (

                    <div className="sessions-loading">

                        <RefreshCw
                            size={28}
                            className="spin"
                        />

                        <p>
                            Loading sessions...
                        </p>

                    </div>

                ) : filteredSessions.length === 0 ? (

                    <div className="sessions-empty">

                        <Clock size={42} />

                        <h3>
                            No sessions found
                        </h3>

                        <p>
                            Create a session or
                            change your filters.
                        </p>

                        <button
                            onClick={openCreateForm}
                        >
                            <Plus size={17} />

                            Add Session
                        </button>

                    </div>

                ) : (

                    <div className="sessions-table-wrapper">

                        <table className="sessions-table">

                            <thead>

                                <tr>

                                    <th>Session</th>

                                    <th>Expo</th>

                                    <th>Speaker</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Capacity</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredSessions.map(
                                    (session) => (

                                        <tr
                                            key={
                                                session._id
                                            }
                                        >

                                            <td>

                                                <div className="session-name-cell">

                                                    <div className="session-row-icon">
                                                        <Clock
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                session.title
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                session.location
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="expo-name">
                                                    {
                                                        getExpoName(
                                                            session
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div className="speaker-cell">

                                                    <User
                                                        size={15}
                                                    />

                                                    {
                                                        session.speaker
                                                    }

                                                </div>

                                            </td>


                                            <td>

                                                <div className="date-cell">

                                                    <CalendarDays
                                                        size={15}
                                                    />

                                                    {
                                                        formatDate(
                                                            session.date
                                                        )
                                                    }

                                                </div>

                                            </td>


                                            <td>

                                                <div className="time-cell">

                                                    <Clock
                                                        size={15}
                                                    />

                                                    <span>
                                                        {
                                                            session.startTime
                                                        }
                                                    </span>

                                                    <span>
                                                        -
                                                    </span>

                                                    <span>
                                                        {
                                                            session.endTime
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="capacity-cell">

                                                    <Users
                                                        size={15}
                                                    />

                                                    {
                                                        session.capacity
                                                    }

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        session.status
                                                    )}
                                                >
                                                    {
                                                        getStatusLabel(
                                                            session.status
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div className="session-actions">

                                                    <button
                                                        className="session-action view"
                                                        title="View"
                                                        onClick={() =>
                                                            setSelectedSession(
                                                                session
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={16}
                                                        />
                                                    </button>


                                                    <button
                                                        className="session-action edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEditForm(
                                                                session
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>


                                                    <button
                                                        className="session-action delete"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                session._id
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {selectedSession && (

                <div
                    className="sessions-modal-overlay"
                    onClick={() =>
                        setSelectedSession(null)
                    }
                >

                    <div
                        className="sessions-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="sessions-modal-header">

                            <div>

                                <span className="modal-eyebrow">
                                    SESSION DETAILS
                                </span>

                                <h2>
                                    {
                                        selectedSession.title
                                    }
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedSession(
                                        null
                                    )
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <div className="session-detail-grid">

                            <div className="session-detail">

                                <span>Expo</span>

                                <strong>
                                    {
                                        getExpoName(
                                            selectedSession
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="session-detail">

                                <span>Speaker</span>

                                <strong>
                                    {
                                        selectedSession.speaker
                                    }
                                </strong>

                            </div>


                            <div className="session-detail">

                                <span>Date</span>

                                <strong>
                                    {
                                        formatDate(
                                            selectedSession.date
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="session-detail">

                                <span>Time</span>

                                <strong>
                                    {
                                        selectedSession.startTime
                                    }{" "}
                                    -{" "}
                                    {
                                        selectedSession.endTime
                                    }
                                </strong>

                            </div>


                            <div className="session-detail">

                                <span>Location</span>

                                <strong>
                                    {
                                        selectedSession.location
                                    }
                                </strong>

                            </div>


                            <div className="session-detail">

                                <span>Capacity</span>

                                <strong>
                                    {
                                        selectedSession.capacity
                                    }{" "}
                                    attendees
                                </strong>

                            </div>

                        </div>


                        <div className="session-description">

                            <h3>Description</h3>

                            <p>
                                {
                                    selectedSession.description
                                }
                            </p>

                        </div>


                        <div className="session-status-section">

                            <h3>Change Status</h3>

                            <div className="status-buttons">

                                <button
                                    className={
                                        selectedSession.status ===
                                        "scheduled"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedSession,
                                            "scheduled"
                                        )
                                    }
                                >
                                    <CalendarDays
                                        size={16}
                                    />
                                    Scheduled
                                </button>


                                <button
                                    className={
                                        selectedSession.status ===
                                        "ongoing"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedSession,
                                            "ongoing"
                                        )
                                    }
                                >
                                    <CircleDot
                                        size={16}
                                    />
                                    Ongoing
                                </button>


                                <button
                                    className={
                                        selectedSession.status ===
                                        "completed"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedSession,
                                            "completed"
                                        )
                                    }
                                >
                                    <CheckCircle
                                        size={16}
                                    />
                                    Completed
                                </button>


                                <button
                                    className={
                                        selectedSession.status ===
                                        "cancelled"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedSession,
                                            "cancelled"
                                        )
                                    }
                                >
                                    <XCircle
                                        size={16}
                                    />
                                    Cancelled
                                </button>

                            </div>

                        </div>


                        <div className="sessions-modal-footer">

                            <button
                                className="modal-edit-btn"
                                onClick={() => {

                                    openEditForm(
                                        selectedSession
                                    );

                                    setSelectedSession(
                                        null
                                    );

                                }}
                            >
                                <Pencil size={17} />

                                Edit Session
                            </button>


                            <button
                                className="modal-delete-btn"
                                onClick={() =>
                                    handleDelete(
                                        selectedSession._id
                                    )
                                }
                            >
                                <Trash2 size={17} />

                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            {showForm && (

                <div
                    className="sessions-modal-overlay"
                    onClick={() =>
                        !saving &&
                        setShowForm(false)
                    }
                >

                    <div
                        className="sessions-form-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="sessions-modal-header">

                            <div>

                                <span className="modal-eyebrow">
                                    {editingSession
                                        ? "EDIT SESSION"
                                        : "NEW SESSION"}
                                </span>

                                <h2>
                                    {editingSession
                                        ? "Edit Session"
                                        : "Create Session"}
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                disabled={saving}
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="session-form"
                        >

                            <div className="form-grid">

                                <div className="form-group full">

                                    <label>
                                        Session Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter session title"
                                        required
                                    />

                                </div>


                                <div className="form-group full">

                                    <label>
                                        Description *
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe the session..."
                                        rows="4"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Expo *
                                    </label>

                                    <select
                                        name="expo"
                                        value={form.expo}
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select an expo
                                        </option>

                                        {expos.map(
                                            (expo) => (

                                                <option
                                                    key={
                                                        expo._id
                                                    }
                                                    value={
                                                        expo._id
                                                    }
                                                >
                                                    {
                                                        expo.title ||
                                                        expo.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Speaker *
                                    </label>

                                    <input
                                        type="text"
                                        name="speaker"
                                        value={
                                            form.speaker
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Speaker name"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Capacity *
                                    </label>

                                    <input
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        value={
                                            form.capacity
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="100"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Start Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={
                                            form.startTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        End Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={
                                            form.endTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Location *
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Hall A / Room 101"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="scheduled">
                                            Scheduled
                                        </option>

                                        <option value="ongoing">
                                            Ongoing
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="session-form-footer">

                                <button
                                    type="button"
                                    className="form-cancel-btn"
                                    disabled={saving}
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="form-submit-btn"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <RefreshCw
                                                size={17}
                                                className="spin"
                                            />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                size={17}
                                            />

                                            {editingSession
                                                ? "Update Session"
                                                : "Create Session"}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Sessions;