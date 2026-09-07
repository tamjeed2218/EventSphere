const express = require("express");

const {
    createExpo,
    getExpos,
    getExpoById,
    updateExpo,
    deleteExpo
} = require("../controllers/expoController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Create Expo
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createExpo
);


// Get all Expos
router.get(
    "/",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor", "attendee"),
    getExpos
);


// Get single Expo
router.get(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor", "attendee"),
    getExpoById
);


// Update Expo
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateExpo
);


// Delete Expo
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteExpo
);


module.exports = router;