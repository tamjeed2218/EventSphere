const express = require("express");

const {
    createSession,
    getSessions,
    getSessionById,
    updateSession,
    deleteSession
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// CREATE SESSION
// ADMIN / ORGANIZER
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createSession
);


// =====================================================
// GET ALL SESSIONS
// ALL LOGGED-IN ROLES
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getSessions
);


// =====================================================
// GET SINGLE SESSION
// ALL LOGGED-IN ROLES
// =====================================================

router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getSessionById
);


// =====================================================
// UPDATE SESSION
// ADMIN / ORGANIZER
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateSession
);


// =====================================================
// DELETE SESSION
// ADMIN / ORGANIZER
// =====================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteSession
);


module.exports = router;