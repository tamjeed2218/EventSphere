const express = require("express");

const {
    registerForExpo,
    registerForSession,
    getMyRegistrations,
    getRegistrations,
    getRegistrationById,
    updateRegistrationStatus,
    cancelMyRegistration
} = require("../controllers/registrationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Attendee - Register for Expo
router.post(
    "/expo",
    protect,
    authorizeRoles("attendee"),
    registerForExpo
);

// Attendee - Register for Session
router.post(
    "/session",
    protect,
    authorizeRoles("attendee"),
    registerForSession
);

// Current user's registrations
router.get(
    "/my",
    protect,
    authorizeRoles(
        "attendee",
        "exhibitor"
    ),
    getMyRegistrations
);

// Admin/Organizer - Get all registrations
router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    getRegistrations
);

// Get single registration
router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "attendee",
        "exhibitor"
    ),
    getRegistrationById
);

// Admin/Organizer - Update status
router.put(
    "/:id/status",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    updateRegistrationStatus
);

// Attendee - Cancel own registration
router.put(
    "/:id/cancel",
    protect,
    authorizeRoles(
        "attendee"
    ),
    cancelMyRegistration
);

module.exports = router;