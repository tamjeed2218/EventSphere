const express = require("express");

const {
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Get all users
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getUsers
);


// Get single user
router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getUserById
);


// Update user role
router.put(
    "/:id/role",
    protect,
    authorizeRoles("admin"),
    updateUserRole
);


// Delete user
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteUser
);


module.exports = router;