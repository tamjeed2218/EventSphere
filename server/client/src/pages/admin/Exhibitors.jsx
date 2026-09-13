import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Search,
    RefreshCw,
    Eye,
    CheckCircle,
    XCircle,
    Trash2,
    X,
    Building2,
    User,
    Mail,
    Phone,
    Globe,
    MapPin,
    Briefcase,
    FileText
} from "lucide-react";

const Exhibitors = () => {
    const [exhibitors, setExhibitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedExhibitor, setSelectedExhibitor] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchExhibitors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/exhibitors");

            setExhibitors(response.data.exhibitors || response.data || []);
        } catch (err) {
            console.error("Error fetching exhibitors:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load exhibitors."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibitors();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(true);

            await api.put(`/exhibitors/${id}/approve`);

            await fetchExhibitors();

            if (selectedExhibitor?._id === id) {
                setSelectedExhibitor(null);
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to approve exhibitor."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        try {
            setActionLoading(true);

            await api.put(`/exhibitors/${id}/reject`);

            await fetchExhibitors();

            if (selectedExhibitor?._id === id) {
                setSelectedExhibitor(null);
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to reject exhibitor."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exhibitor?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);

            await api.delete(`/exhibitors/${id}`);

            setExhibitors((prev) =>
                prev.filter((exhibitor) => exhibitor._id !== id)
            );

            setSelectedExhibitor(null);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to delete exhibitor."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const filteredExhibitors = exhibitors.filter((exhibitor) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            exhibitor.companyName
                ?.toLowerCase()
                .includes(searchText) ||
            exhibitor.contactPerson
                ?.toLowerCase()
                .includes(searchText) ||
            exhibitor.industry
                ?.toLowerCase()
                .includes(searchText) ||
            exhibitor.phone
                ?.toLowerCase()
                .includes(searchText) ||
            exhibitor.user?.email
                ?.toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "all" ||
            exhibitor.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        return `exhibitor-status exhibitor-status-${status}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="exhibitors-page">

            {/* Header */}
            <div className="exhibitors-header">
                <div>
                    <div className="exhibitors-title-row">
                        <div className="exhibitors-title-icon">
                            <Building2 size={24} />
                        </div>

                        <div>
                            <h1>Exhibitors</h1>
                            <p>
                                Manage exhibitor profiles, approvals and
                                registrations.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="exhibitors-refresh-btn"
                    onClick={fetchExhibitors}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="exhibitor-stats">

                <div className="exhibitor-stat-card">
                    <div className="exhibitor-stat-icon total">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <span>Total Exhibitors</span>
                        <strong>{exhibitors.length}</strong>
                    </div>
                </div>

                <div className="exhibitor-stat-card">
                    <div className="exhibitor-stat-icon pending">
                        <RefreshCw size={21} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>
                            {
                                exhibitors.filter(
                                    (item) =>
                                        item.status === "pending"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="exhibitor-stat-card">
                    <div className="exhibitor-stat-icon approved">
                        <CheckCircle size={21} />
                    </div>

                    <div>
                        <span>Approved</span>
                        <strong>
                            {
                                exhibitors.filter(
                                    (item) =>
                                        item.status === "approved"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="exhibitor-stat-card">
                    <div className="exhibitor-stat-icon rejected">
                        <XCircle size={21} />
                    </div>

                    <div>
                        <span>Rejected</span>
                        <strong>
                            {
                                exhibitors.filter(
                                    (item) =>
                                        item.status === "rejected"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <div className="exhibitors-toolbar">

                <div className="exhibitors-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search company, contact, industry or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="exhibixr-status-filter"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

            </div>

            {/* Error */}
            {error && (
                <div className="exhibitors-error">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="exhibitors-table-card">

                <div className="exhibitors-table-wrapper">

                    <table className="exhibitors-table">

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Contact Person</th>
                                <th>Industry</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="exhibitors-empty"
                                    >
                                        <RefreshCw
                                            size={24}
                                            className="spin"
                                        />
                                        <span>
                                            Loading exhibitors...
                                        </span>
                                    </td>
                                </tr>
                            ) : filteredExhibitors.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="exhibitors-empty"
                                    >
                                        <Building2 size={32} />
                                        <span>
                                            No exhibitors found.
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                filteredExhibitors.map(
                                    (exhibitor) => (
                                        <tr key={exhibitor._id}>

                                            <td>
                                                <div className="exhibitor-company">
                                                    <div className="exhibitor-avatar">
                                                        {getInitials(
                                                            exhibitor.companyName
                                                        )}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                exhibitor.companyName
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                exhibitor.address ||
                                                                "No address"
                                                            }
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {exhibitor.contactPerson ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <span className="industry-badge">
                                                    {exhibitor.industry ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                {exhibitor.user?.email ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {exhibitor.phone || "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        exhibitor.status
                                                    )}
                                                >
                                                    {exhibitor.status}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    exhibitor.createdAt
                                                )}
                                            </td>

                                            <td>
                                                <div className="exhibitor-actions">

                                                    <button
                                                        className="exhibitor-action view"
                                                        title="View Details"
                                                        onClick={() =>
                                                            setSelectedExhibitor(
                                                                exhibitor
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {exhibitor.status ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                className="exhibitor-action approve"
                                                                title="Approve"
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        exhibitor._id
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle
                                                                    size={16}
                                                                />
                                                            </button>

                                                            <button
                                                                className="exhibitor-action reject"
                                                                title="Reject"
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                onClick={() =>
                                                                    handleReject(
                                                                        exhibitor._id
                                                                    )
                                                                }
                                                            >
                                                                <XCircle
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        className="exhibitor-action delete"
                                                        title="Delete"
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                exhibitor._id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {!loading && (
                    <div className="exhibitors-table-footer">
                        Showing{" "}
                        <strong>
                            {filteredExhibitors.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {exhibitors.length}
                        </strong>{" "}
                        exhibitors
                    </div>
                )}

            </div>

            {/* Details Modal */}
            {selectedExhibitor && (
                <div
                    className="exhibitor-modal-overlay"
                    onClick={() =>
                        setSelectedExhibitor(null)
                    }
                >
                    <div
                        className="exhibitor-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="exhibitor-modal-header">

                            <div>
                                <h2>Exhibitor Details</h2>
                                <p>
                                    Complete exhibitor information
                                </p>
                            </div>

                            <button
                                className="exhibitor-modal-close"
                                onClick={() =>
                                    setSelectedExhibitor(null)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="exhibitor-modal-company">

                            <div className="exhibitor-modal-avatar">
                                {getInitials(
                                    selectedExhibitor.companyName
                                )}
                            </div>

                            <div>
                                <h3>
                                    {
                                        selectedExhibitor.companyName
                                    }
                                </h3>

                                <span
                                    className={getStatusClass(
                                        selectedExhibitor.status
                                    )}
                                >
                                    {selectedExhibitor.status}
                                </span>
                            </div>

                        </div>

                        <div className="exhibitor-details-grid">

                            <div className="exhibitor-detail">
                                <User size={17} />
                                <div>
                                    <span>Contact Person</span>
                                    <strong>
                                        {
                                            selectedExhibitor.contactPerson ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="exhibitor-detail">
                                <Mail size={17} />
                                <div>
                                    <span>Email</span>
                                    <strong>
                                        {
                                            selectedExhibitor.user?.email ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="exhibitor-detail">
                                <Phone size={17} />
                                <div>
                                    <span>Phone</span>
                                    <strong>
                                        {
                                            selectedExhibitor.phone ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="exhibitor-detail">
                                <Briefcase size={17} />
                                <div>
                                    <span>Industry</span>
                                    <strong>
                                        {
                                            selectedExhibitor.industry ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="exhibitor-detail">
                                <Globe size={17} />
                                <div>
                                    <span>Website</span>
                                    <strong>
                                        {
                                            selectedExhibitor.website ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                            <div className="exhibitor-detail">
                                <MapPin size={17} />
                                <div>
                                    <span>Address</span>
                                    <strong>
                                        {
                                            selectedExhibitor.address ||
                                            "—"
                                        }
                                    </strong>
                                </div>
                            </div>

                        </div>

                        <div className="exhibitor-description">

                            <div className="exhibitor-section-title">
                                <FileText size={17} />
                                <h4>Company Description</h4>
                            </div>

                            <p>
                                {
                                    selectedExhibitor.companyDescription ||
                                    "No description provided."
                                }
                            </p>

                        </div>

                        <div className="exhibitor-description">

                            <div className="exhibitor-section-title">
                                <Briefcase size={17} />
                                <h4>Products & Services</h4>
                            </div>

                            <p>
                                {
                                    selectedExhibitor.productsServices ||
                                    "No products or services provided."
                                }
                            </p>

                        </div>

                        {selectedExhibitor.documents?.length > 0 && (
                            <div className="exhibitor-description">

                                <div className="exhibitor-section-title">
                                    <FileText size={17} />
                                    <h4>Documents</h4>
                                </div>

                                <div className="exhibitor-documents">

                                    {selectedExhibitor.documents.map(
                                        (document, index) => (
                                            <div
                                                key={index}
                                                className="exhibitor-document"
                                            >
                                                {document}
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                        <div className="exhibitor-modal-actions">

                            {selectedExhibitor.status ===
                                "pending" && (
                                <>
                                    <button
                                        className="exhibitor-modal-btn approve"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleApprove(
                                                selectedExhibitor._id
                                            )
                                        }
                                    >
                                        <CheckCircle size={17} />
                                        Approve
                                    </button>

                                    <button
                                        className="exhibitor-modal-btn reject"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleReject(
                                                selectedExhibitor._id
                                            )
                                        }
                                    >
                                        <XCircle size={17} />
                                        Reject
                                    </button>
                                </>
                            )}

                            <button
                                className="exhibitor-modal-btn delete"
                                disabled={actionLoading}
                                onClick={() =>
                                    handleDelete(
                                        selectedExhibitor._id
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

        </div>
    );
};

export default Exhibitors;