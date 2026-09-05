const User = require("../models/User");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            users
        });

    } catch (error) {
        console.error("Get users error:", error.message);

        res.status(500).json({
            message: "Server error while fetching users"
        });
    }
};


// Get single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get user error:", error.message);

        res.status(500).json({
            message: "Server error while fetching user"
        });
    }
};


// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        const allowedRoles = [
            "admin",
            "organizer",
            "exhibitor",
            "attendee"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Update user role error:", error.message);

        res.status(500).json({
            message: "Server error while updating user role"
        });
    }
};


// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (user._id.toString() === req.user.userId.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error.message);

        res.status(500).json({
            message: "Server error while deleting user"
        });
    }
};


module.exports = {
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
};