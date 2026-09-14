import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    Bell,
    RefreshCw,
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    X,
    Send,
    BellOff,
    Users,
    AlertTriangle,
    CalendarDays,
    CheckCircle,
    XCircle
} from "lucide-react";

import "./Notifications.css";


function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const [audienceFilter, setAudienceFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    const [editingNotification, setEditingNotification] =
        useState(null);

    const [form, setForm] = useState({
        title: "",
        message: "",
        type: "general",
        audience: "all",
        priority: "normal",
        scheduledFor: "",
        expiresAt: "",
        isPublished: true
    });


    // =====================================================
    // FETCH
    // =====================================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/notifications"
                );

            setNotifications(
                response.data.notifications ||
                response.data ||
                []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load notifications."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);


    // =====================================================
    // FORM
    // =====================================================

    const resetForm = () => {

        setForm({
            title: "",
            message: "",
            type: "general",
            audience: "all",
            priority: "normal",
            scheduledFor: "",
            expiresAt: "",
            isPublished: true
        });

        setEditingNotification(null);
    };


    const openCreateForm = () => {

        resetForm();
        setShowForm(true);
    };


    const formatInputDate = (date) => {

        if (!date) {
            return "";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "";
        }

        return parsed
            .toISOString()
            .slice(0, 16);
    };


    const openEditForm = (
        notification
    ) => {

        setEditingNotification(
            notification
        );

        setForm({
            title:
                notification.title || "",

            message:
                notification.message || "",

            type:
                notification.type ||
                "general",

            audience:
                notification.audience ||
                "all",

            priority:
                notification.priority ||
                "normal",

            scheduledFor:
                formatInputDate(
                    notification.scheduledFor
                ),

            expiresAt:
                formatInputDate(
                    notification.expiresAt
                ),

            isPublished:
                notification.isPublished !==
                false
        });

        setShowForm(true);
    };


    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!form.title.trim()) {
            alert(
                "Notification title is required."
            );
            return;
        }

        if (!form.message.trim()) {
            alert(
                "Notification message is required."
            );
            return;
        }


        try {

            setSaving(true);

            const payload = {
                title:
                    form.title.trim(),

                message:
                    form.message.trim(),

                type:
                    form.type,

                audience:
                    form.audience,

                priority:
                    form.priority,

                scheduledFor:
                    form.scheduledFor ||
                    null,

                expiresAt:
                    form.expiresAt ||
                    null,

                isPublished:
                    form.isPublished
            };


            if (editingNotification) {

                await api.put(
                    `/notifications/${editingNotification._id}`,
                    payload
                );

            } else {

                await api.post(
                    "/notifications",
                    payload
                );
            }


            setShowForm(false);

            resetForm();

            await fetchNotifications();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to save notification."
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this notification?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/notifications/${id}`
            );

            setNotifications(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !== id
                    )
            );

            setSelectedNotification(
                null
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to delete notification."
            );
        }
    };


    // =====================================================
    // TOGGLE
    // =====================================================

    const togglePublished = async (
        notification
    ) => {

        try {

            const response =
                await api.patch(
                    `/notifications/${notification._id}/toggle`
                );

            const updated =
                response.data.notification;

            setNotifications(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id ===
                            notification._id
                                ? {
                                    ...item,
                                    isPublished:
                                        updated.isPublished
                                }
                                : item
                    )
            );

            setSelectedNotification(
                (previous) =>
                    previous &&
                    previous._id ===
                    notification._id
                        ? {
                            ...previous,
                            isPublished:
                                updated.isPublished
                        }
                        : previous
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to update notification."
            );
        }
    };


    // =====================================================
    // FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "—";
        }

        return parsed.toLocaleString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };


    const getLabel = (value) => {

        if (!value) {
            return "—";
        }

        return value
            .charAt(0)
            .toUpperCase() +
            value.slice(1);
    };


    const getTypeClass = (
        type
    ) => {

        return `notification-type notification-type-${type}`;
    };


    const getPriorityClass = (
        priority
    ) => {

        return `notification-priority notification-priority-${priority}`;
    };


    // =====================================================
    // FILTER
    // =====================================================

    const filteredNotifications =
        notifications.filter(
            (notification) => {

                const text =
                    `${notification.title || ""} ${
                        notification.message || ""
                    } ${
                        notification.type || ""
                    } ${
                        notification.audience || ""
                    }`.toLowerCase();

                const matchesSearch =
                    text.includes(
                        search.toLowerCase()
                    );

                const matchesType =
                    typeFilter === "all" ||
                    notification.type ===
                        typeFilter;

                const matchesAudience =
                    audienceFilter ===
                        "all" ||
                    notification.audience ===
                        audienceFilter;

                const matchesStatus =
                    statusFilter === "all" ||
                    (
                        statusFilter ===
                            "published" &&
                        notification.isPublished
                    ) ||
                    (
                        statusFilter ===
                            "draft" &&
                        !notification.isPublished
                    );

                return (
                    matchesSearch &&
                    matchesType &&
                    matchesAudience &&
                    matchesStatus
                );
            }
        );


    // =====================================================
    // STATS
    // =====================================================

    const total =
        notifications.length;

    const published =
        notifications.filter(
            (item) =>
                item.isPublished
        ).length;

    const drafts =
        notifications.filter(
            (item) =>
                !item.isPublished
        ).length;

    const urgent =
        notifications.filter(
            (item) =>
                item.priority ===
                "urgent"
        ).length;


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="notifications-page">

            {/* HEADER */}

            <div className="notifications-header">

                <div className="notifications-title-row">

                    <div className="notifications-title-icon">
                        <Bell size={24} />
                    </div>

                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Create and manage
                            notifications sent to
                            EventSphere users.
                        </p>

                    </div>

                </div>


                <div className="notifications-header-actions">

                    <button
                        className="notifications-refresh-btn"
                        onClick={
                            fetchNotifications
                        }
                        disabled={loading}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "notification-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>


                    <button
                        className="notifications-create-btn"
                        onClick={
                            openCreateForm
                        }
                    >
                        <Plus size={18} />

                        New Notification
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="notifications-error">

                    <XCircle size={19} />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={
                            fetchNotifications
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* STATS */}

            <div className="notifications-stats">

                <div className="notification-stat-card">

                    <div className="notification-stat-icon total">
                        <Bell size={21} />
                    </div>

                    <div>
                        <span>
                            Total
                        </span>

                        <strong>
                            {total}
                        </strong>
                    </div>

                </div>


                <div className="notification-stat-card">

                    <div className="notification-stat-icon published">
                        <Send size={21} />
                    </div>

                    <div>
                        <span>
                            Published
                        </span>

                        <strong>
                            {published}
                        </strong>
                    </div>

                </div>


                <div className="notification-stat-card">

                    <div className="notification-stat-icon drafts">
                        <BellOff size={21} />
                    </div>

                    <div>
                        <span>
                            Drafts
                        </span>

                        <strong>
                            {drafts}
                        </strong>
                    </div>

                </div>


                <div className="notification-stat-card">

                    <div className="notification-stat-icon urgent">
                        <AlertTriangle
                            size={21}
                        />
                    </div>

                    <div>
                        <span>
                            Urgent
                        </span>

                        <strong>
                            {urgent}
                        </strong>
                    </div>

                </div>

            </div>


            {/* FILTERS */}

            <div className="notifications-toolbar">

                <div className="notifications-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={typeFilter}
                    onChange={(event) =>
                        setTypeFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Types
                    </option>

                    <option value="general">
                        General
                    </option>

                    <option value="event">
                        Event
                    </option>

                    <option value="session">
                        Session
                    </option>

                    <option value="registration">
                        Registration
                    </option>

                    <option value="booth">
                        Booth
                    </option>

                    <option value="system">
                        System
                    </option>

                </select>


                <select
                    value={audienceFilter}
                    onChange={(event) =>
                        setAudienceFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        All Audiences
                    </option>

                    <option value="attendee">
                        Attendees
                    </option>

                    <option value="exhibitor">
                        Exhibitors
                    </option>

                    <option value="organizer">
                        Organizers
                    </option>

                    <option value="admin">
                        Admins
                    </option>

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

                    <option value="published">
                        Published
                    </option>

                    <option value="draft">
                        Draft
                    </option>

                </select>

            </div>


            {/* TABLE */}

            <div className="notifications-card">

                <div className="notifications-card-header">

                    <div>

                        <h2>
                            Notification Center
                        </h2>

                        <p>
                            Showing{" "}
                            <strong>
                                {
                                    filteredNotifications.length
                                }
                            </strong>{" "}
                            notifications
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="notifications-loading">

                        <RefreshCw
                            size={28}
                            className="notification-spin"
                        />

                        <p>
                            Loading notifications...
                        </p>

                    </div>

                ) : filteredNotifications.length === 0 ? (

                    <div className="notifications-empty">

                        <Bell size={43} />

                        <h3>
                            No notifications found
                        </h3>

                        <p>
                            Create a notification
                            or change your filters.
                        </p>

                        <button
                            onClick={
                                openCreateForm
                            }
                        >
                            <Plus size={17} />

                            New Notification
                        </button>

                    </div>

                ) : (

                    <div className="notifications-table-wrapper">

                        <table className="notifications-table">

                            <thead>

                                <tr>

                                    <th>
                                        Notification
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Audience
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredNotifications.map(
                                    (notification) => (

                                        <tr
                                            key={
                                                notification._id
                                            }
                                        >

                                            <td>

                                                <div className="notification-name-cell">

                                                    <div className="notification-row-icon">
                                                        <Bell
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                notification.title
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                notification.message
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={getTypeClass(
                                                        notification.type
                                                    )}
                                                >
                                                    {
                                                        getLabel(
                                                            notification.type
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div className="notification-audience">

                                                    <Users
                                                        size={15}
                                                    />

                                                    {
                                                        getLabel(
                                                            notification.audience
                                                        )
                                                    }

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={getPriorityClass(
                                                        notification.priority
                                                    )}
                                                >
                                                    {
                                                        getLabel(
                                                            notification.priority
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div className="notification-date">

                                                    <CalendarDays
                                                        size={15}
                                                    />

                                                    {
                                                        formatDate(
                                                            notification.createdAt
                                                        )
                                                    }

                                                </div>

                                            </td>


                                            <td>

                                                <button
                                                    className={
                                                        notification.isPublished
                                                            ? "notification-status published"
                                                            : "notification-status draft"
                                                    }
                                                    onClick={() =>
                                                        togglePublished(
                                                            notification
                                                        )
                                                    }
                                                >

                                                    {notification.isPublished ? (
                                                        <>
                                                            <CheckCircle
                                                                size={14}
                                                            />

                                                            Published
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BellOff
                                                                size={14}
                                                            />

                                                            Draft
                                                        </>
                                                    )}

                                                </button>

                                            </td>


                                            <td>

                                                <div className="notification-actions">

                                                    <button
                                                        className="notification-action view"
                                                        onClick={() =>
                                                            setSelectedNotification(
                                                                notification
                                                            )
                                                        }
                                                        title="View"
                                                    >
                                                        <Eye
                                                            size={16}
                                                        />
                                                    </button>


                                                    <button
                                                        className="notification-action edit"
                                                        onClick={() =>
                                                            openEditForm(
                                                                notification
                                                            )
                                                        }
                                                        title="Edit"
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </button>


                                                    <button
                                                        className="notification-action delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notification._id
                                                            )
                                                        }
                                                        title="Delete"
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


            {/* VIEW MODAL */}

            {selectedNotification && (

                <div
                    className="notifications-modal-overlay"
                    onClick={() =>
                        setSelectedNotification(
                            null
                        )
                    }
                >

                    <div
                        className="notifications-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="notifications-modal-header">

                            <div>

                                <span className="notification-modal-eyebrow">
                                    NOTIFICATION
                                </span>

                                <h2>
                                    {
                                        selectedNotification.title
                                    }
                                </h2>

                            </div>

                            <button
                                className="notification-modal-close"
                                onClick={() =>
                                    setSelectedNotification(
                                        null
                                    )
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <div className="notification-detail-content">

                            <div className="notification-detail-message">

                                {
                                    selectedNotification.message
                                }

                            </div>


                            <div className="notification-detail-grid">

                                <div>

                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        {
                                            getLabel(
                                                selectedNotification.type
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Audience
                                    </span>

                                    <strong>
                                        {
                                            getLabel(
                                                selectedNotification.audience
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Priority
                                    </span>

                                    <strong>
                                        {
                                            getLabel(
                                                selectedNotification.priority
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {
                                            selectedNotification.isPublished
                                                ? "Published"
                                                : "Draft"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Scheduled For
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                selectedNotification.scheduledFor
                                            )
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Expires At
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                selectedNotification.expiresAt
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="notifications-modal-footer">

                            <button
                                className="notification-edit-btn"
                                onClick={() => {

                                    openEditForm(
                                        selectedNotification
                                    );

                                    setSelectedNotification(
                                        null
                                    );

                                }}
                            >
                                <Pencil size={17} />

                                Edit
                            </button>


                            <button
                                className="notification-toggle-btn"
                                onClick={() =>
                                    togglePublished(
                                        selectedNotification
                                    )
                                }
                            >

                                {selectedNotification.isPublished ? (
                                    <>
                                        <BellOff
                                            size={17}
                                        />

                                        Unpublish
                                    </>
                                ) : (
                                    <>
                                        <Send
                                            size={17}
                                        />

                                        Publish
                                    </>
                                )}

                            </button>


                            <button
                                className="notification-delete-btn"
                                onClick={() =>
                                    handleDelete(
                                        selectedNotification._id
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


            {/* CREATE / EDIT MODAL */}

            {showForm && (

                <div
                    className="notifications-modal-overlay"
                    onClick={() =>
                        !saving &&
                        setShowForm(false)
                    }
                >

                    <div
                        className="notifications-form-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="notifications-modal-header">

                            <div>

                                <span className="notification-modal-eyebrow">
                                    {editingNotification
                                        ? "EDIT NOTIFICATION"
                                        : "NEW NOTIFICATION"}
                                </span>

                                <h2>
                                    {editingNotification
                                        ? "Edit Notification"
                                        : "Create Notification"}
                                </h2>

                            </div>


                            <button
                                className="notification-modal-close"
                                onClick={() =>
                                    setShowForm(false)
                                }
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            className="notification-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="notification-form-grid">

                                <div className="notification-form-group full">

                                    <label>
                                        Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            form.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter notification title"
                                        required
                                    />

                                </div>


                                <div className="notification-form-group full">

                                    <label>
                                        Message *
                                    </label>

                                    <textarea
                                        name="message"
                                        value={
                                            form.message
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Write your notification message..."
                                        rows="5"
                                        required
                                    />

                                </div>


                                <div className="notification-form-group">

                                    <label>
                                        Type
                                    </label>

                                    <select
                                        name="type"
                                        value={
                                            form.type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="general">
                                            General
                                        </option>

                                        <option value="event">
                                            Event
                                        </option>

                                        <option value="session">
                                            Session
                                        </option>

                                        <option value="registration">
                                            Registration
                                        </option>

                                        <option value="booth">
                                            Booth
                                        </option>

                                        <option value="system">
                                            System
                                        </option>

                                    </select>

                                </div>


                                <div className="notification-form-group">

                                    <label>
                                        Audience
                                    </label>

                                    <select
                                        name="audience"
                                        value={
                                            form.audience
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="all">
                                            Everyone
                                        </option>

                                        <option value="attendee">
                                            Attendees
                                        </option>

                                        <option value="exhibitor">
                                            Exhibitors
                                        </option>

                                        <option value="organizer">
                                            Organizers
                                        </option>

                                        <option value="admin">
                                            Admins
                                        </option>

                                    </select>

                                </div>


                                <div className="notification-form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            form.priority
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="normal">
                                            Normal
                                        </option>

                                        <option value="high">
                                            High
                                        </option>

                                        <option value="urgent">
                                            Urgent
                                        </option>

                                    </select>

                                </div>


                                <div className="notification-form-group">

                                    <label>
                                        Scheduled For
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="scheduledFor"
                                        value={
                                            form.scheduledFor
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="notification-form-group">

                                    <label>
                                        Expires At
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="expiresAt"
                                        value={
                                            form.expiresAt
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="notification-publish-control">

                                    <label>

                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            checked={
                                                form.isPublished
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            Publish notification immediately
                                        </span>

                                    </label>

                                </div>

                            </div>


                            <div className="notification-form-footer">

                                <button
                                    type="button"
                                    className="notification-cancel-btn"
                                    onClick={() =>
                                        setShowForm(
                                            false
                                        )
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="notification-submit-btn"
                                    disabled={saving}
                                >

                                    {saving ? (
                                        <>
                                            <RefreshCw
                                                size={17}
                                                className="notification-spin"
                                            />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                size={17}
                                            />

                                            {editingNotification
                                                ? "Update Notification"
                                                : "Create Notification"}
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

export default Notifications;