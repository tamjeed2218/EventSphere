import { useEffect, useState } from "react";
import api from "../../services/api";

function Expos() {
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingExpo, setEditingExpo] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        status: "draft"
    });

    const fetchExpos = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/expos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setExpos(response.data.expos);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load expos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (editingExpo) {
            await api.put(
                `/expos/${editingExpo._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Expo updated successfully!");
        } else {
            await api.post(
                "/expos",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Expo created successfully!");
        }

        setFormData({
            title: "",
            description: "",
            location: "",
            startDate: "",
            endDate: "",
            registrationDeadline: "",
            status: "draft"
        });

        setEditingExpo(null);
        setShowForm(false);

        fetchExpos();

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to save expo"
        );
    }
};

const handleEdit = (expo) => {
    setEditingExpo(expo);

    setFormData({
        title: expo.title,
        description: expo.description,
        location: expo.location,
        startDate: expo.startDate
            ? expo.startDate.substring(0, 10)
            : "",
        endDate: expo.endDate
            ? expo.endDate.substring(0, 10)
            : "",
        registrationDeadline: expo.registrationDeadline
            ? expo.registrationDeadline.substring(0, 10)
            : "",
        status: expo.status
    });

    setShowForm(true);
    setError("");
    setSuccess("");
};

const handleDelete = async (expoId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this expo?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        await api.delete(`/expos/${expoId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setSuccess("Expo deleted successfully!");

        fetchExpos();

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to delete expo"
        );
    }
};

    if (loading) {
        return <p>Loading expos...</p>;
    }

    return (
        <div>

            {/* Page Header */}

            <div>
                <div>
                    <h1>Expos</h1>
                    <p>Manage all EventSphere expos.</p>
                </div>

                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setError("");
                        setSuccess("");
                    }}
                className=""
                >
                    {showForm ? "Cancel" : "+ Create Expo"}
                </button>
            </div>


            {/* Messages */}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}


            {/* Create Expo Form */}

            {showForm && (
                <div className="">

                    <h2>
    {editingExpo ? "Edit Expo" : "Create New Expo"}
</h2>

                    <form className="" onSubmit={handleSubmit}>

                        <div >
                            <label>Title</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter expo title"
                                required
                            />
                        </div>


                        <div >
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter expo description"
                                rows="4"
                                required
                            />
                        </div>


                        <div >
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter expo location"
                                required
                            />
                        </div>


                        <div >
                            <label>Start Date</label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div >
                            <label>End Date</label>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div >
                            <label>Registration Deadline</label>

                            <input
                                type="date"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div >
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="published">
                                    Published
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


<button type="submit">
    {editingExpo ? "Update Expo" : "Create Expo"}
</button>

                    </form>

                </div>
            )}


            {/* Expo List Table */}

            <div >

                <table>

                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Registration Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {expos.map((expo) => (
                            <tr key={expo._id}>

                                <td>
                                    {expo.title}
                                </td>

                                <td>
                                    {expo.location}
                                </td>

                                <td>
                                    {new Date(
                                        expo.startDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {new Date(
                                        expo.endDate
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {new Date(
                                        expo.registrationDeadline
                                    ).toLocaleDateString()}
                                </td>

                                <td>
<td>
    {expo.status}
</td>
    </td>
                                <td>
    <button
        onClick={() => handleEdit(expo)}
    >
        Edit
    </button>

    <button
        onClick={() => handleDelete(expo._id)}
    >
        Delete
    </button>
</td>

                            </tr>
                        ))}

                    </tbody>

                </table>


                {expos.length === 0 && (
                    <div className="empty-state">
                        <p>No expos found.</p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Expos;