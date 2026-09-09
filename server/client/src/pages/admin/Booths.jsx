import { useEffect, useState } from "react";
import api from "../../services/api";

function Booths() {
    const [booths, setBooths] = useState([]);
    const [expos, setExpos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingBooth, setEditingBooth] = useState(null);

    const [expoFilter, setExpoFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [formData, setFormData] = useState({
        expo: "",
        boothNumber: "",
        size: "medium",
        price: "",
        location: "",
        description: ""
    });

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchExpos = async () => {
        try {
            const response = await api.get("/expos", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setExpos(response.data.expos);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load expos"
            );
        }
    };

    const fetchBooths = async () => {
        try {
            setLoading(true);
            setError("");

            let response;

            if (expoFilter) {
                response = await api.get(
                    `/booths/expo/${expoFilter}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    }
                );
            } else {
                response = await api.get(
                    "/booths",
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    }
                );
            }

            setBooths(response.data.booths);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load booths"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, []);

    useEffect(() => {
        fetchBooths();
    }, [expoFilter]);

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            expo: "",
            boothNumber: "",
            size: "medium",
            price: "",
            location: "",
            description: ""
        });

        setEditingBooth(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        setEditingBooth(null);

        setFormData({
            expo: expoFilter || "",
            boothNumber: "",
            size: "medium",
            price: "",
            location: "",
            description: ""
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            const token = getToken();

            if (editingBooth) {
                await api.put(
                    `/booths/${editingBooth._id}`,
                    {
                        boothNumber: formData.boothNumber,
                        size: formData.size,
                        price: Number(formData.price),
                        location: formData.location,
                        description: formData.description
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSuccess(
                    "Booth updated successfully!"
                );
            } else {
                await api.post(
                    "/booths",
                    {
                        expo: formData.expo,
                        boothNumber: formData.boothNumber,
                        size: formData.size,
                        price: Number(formData.price),
                        location: formData.location,
                        description: formData.description
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSuccess(
                    "Booth created successfully!"
                );
            }

            resetForm();
            fetchBooths();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save booth"
            );
        }
    };

    const handleEdit = (booth) => {
        setEditingBooth(booth);

        setFormData({
            expo: booth.expo?._id || booth.expo || "",
            boothNumber: booth.boothNumber || "",
            size: booth.size || "medium",
            price: booth.price ?? "",
            location: booth.location || "",
            description: booth.description || ""
        });

        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (boothId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this booth?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/booths/${boothId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setSuccess(
                "Booth deleted successfully!"
            );

            fetchBooths();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete booth"
            );
        }
    };

    const handleRelease = async (boothId) => {
        const confirmed = window.confirm(
            "Are you sure you want to release this booth?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(
                `/booths/${boothId}/release`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setSuccess(
                "Booth released successfully!"
            );

            fetchBooths();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to release booth"
            );
        }
    };

    const handleOccupy = async (boothId) => {
        try {
            setError("");
            setSuccess("");

            await api.put(
                `/booths/${boothId}/occupy`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setSuccess(
                "Booth marked as occupied!"
            );

            fetchBooths();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to occupy booth"
            );
        }
    };

    const filteredBooths = booths.filter((booth) => {
        if (
            statusFilter &&
            booth.status !== statusFilter
        ) {
            return false;
        }

        return true;
    });

    if (loading) {
        return (
            <div className="booth-loading">
                Loading booths...
            </div>
        );
    }

    return (
        <div>

            <div className="booth-page-header">

                <div>
                    <h1>Booths</h1>

                    <p>
                        Manage expo booths and reservations.
                    </p>
                </div>

                <button
                    className="booth-create-button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            openCreateForm();
                        }
                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "+ Create Booth"}
                </button>

            </div>


            {error && (
                <div className="booth-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="booth-success">
                    {success}
                </div>
            )}


            <div className="booth-filters">

                <div className="booth-filter-group">

                    <label>
                        Filter by Expo
                    </label>

                    <select
                        value={expoFilter}
                        onChange={(e) =>
                            setExpoFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Expos
                        </option>

                        {expos.map((expo) => (
                            <option
                                key={expo._id}
                                value={expo._id}
                            >
                                {expo.title}
                            </option>
                        ))}
                    </select>

                </div>


                <div className="booth-filter-group">

                    <label>
                        Filter by Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="">
                            All Statuses
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="reserved">
                            Reserved
                        </option>

                        <option value="occupied">
                            Occupied
                        </option>
                    </select>

                </div>

            </div>


            {showForm && (
                <div className="booth-form-container">

                    <h2>
                        {editingBooth
                            ? "Edit Booth"
                            : "Create New Booth"}
                    </h2>

                    <form
                        className="booth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="booth-form-group">

                            <label>
                                Expo
                            </label>

                            <select
                                name="expo"
                                value={formData.expo}
                                onChange={handleChange}
                                required
                                disabled={!!editingBooth}
                            >
                                <option value="">
                                    Select Expo
                                </option>

                                {expos.map((expo) => (
                                    <option
                                        key={expo._id}
                                        value={expo._id}
                                    >
                                        {expo.title}
                                    </option>
                                ))}
                            </select>

                        </div>


                        <div className="booth-form-group">

                            <label>
                                Booth Number
                            </label>

                            <input
                                type="text"
                                name="boothNumber"
                                value={formData.boothNumber}
                                onChange={handleChange}
                                placeholder="Example: A-101"
                                required
                            />

                        </div>


                        <div className="booth-form-group">

                            <label>
                                Size
                            </label>

                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                            >
                                <option value="small">
                                    Small
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="large">
                                    Large
                                </option>
                            </select>

                        </div>


                        <div className="booth-form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter booth price"
                                min="0"
                                required
                            />

                        </div>


                        <div className="booth-form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Example: Hall A - Row 1"
                                required
                            />

                        </div>


                        <div className="booth-form-group booth-full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter booth description"
                                rows="4"
                            />

                        </div>


                        <div className="booth-form-group">

                            <button
                                type="submit"
                                className="booth-submit-button"
                            >
                                {editingBooth
                                    ? "Update Booth"
                                    : "Create Booth"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            <div className="booth-table-container">

                <table className="booth-table">

                    <thead>

                        <tr>
                            <th>Booth</th>
                            <th>Expo</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Exhibitor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredBooths.map((booth) => {

                            const exhibitorName =
                                booth.exhibitor?.companyName ||
                                booth.exhibitor?.user?.name ||
                                "Not Assigned";

                            return (
                                <tr key={booth._id}>

                                    <td>
                                        <strong>
                                            {booth.boothNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {booth.expo?.title ||
                                            "Unknown Expo"}
                                    </td>

                                    <td>
                                        {booth.size}
                                    </td>

                                    <td>
                                        Rs.{" "}
                                        {Number(
                                            booth.price
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        {booth.location}
                                    </td>

                                    <td>
                                        {exhibitorName}
                                    </td>

                                    <td>

                                        <span
                                            className={`booth-status ${booth.status}`}
                                        >
                                            {booth.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="booth-action-buttons">

                                            {booth.status ===
                                                "available" && (
                                                <>
                                                    <button
                                                        className="booth-edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                booth
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="booth-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                booth._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                            {booth.status ===
                                                "reserved" && (
                                                <>
                                                    <button
                                                        className="booth-occupy-button"
                                                        onClick={() =>
                                                            handleOccupy(
                                                                booth._id
                                                            )
                                                        }
                                                    >
                                                        Occupy
                                                    </button>

                                                    <button
                                                        className="booth-release-button"
                                                        onClick={() =>
                                                            handleRelease(
                                                                booth._id
                                                            )
                                                        }
                                                    >
                                                        Release
                                                    </button>
                                                </>
                                            )}

                                            {booth.status ===
                                                "occupied" && (
                                                <button
                                                    className="booth-release-button"
                                                    onClick={() =>
                                                        handleRelease(
                                                            booth._id
                                                        )
                                                    }
                                                >
                                                    Release
                                                </button>
                                            )}

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>


                {filteredBooths.length === 0 && (
                    <div className="booth-empty-state">
                        <p>
                            No booths found.
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Booths;