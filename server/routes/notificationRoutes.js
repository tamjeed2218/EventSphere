const express = require("express");

const {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    toggleNotification
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    getNotifications
);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    createNotification
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    getNotificationById
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    updateNotification
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    deleteNotification
);


// =====================================================
// TOGGLE PUBLISHED
// =====================================================

router.patch(
    "/:id/toggle",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    toggleNotification
);


module.exports = router;