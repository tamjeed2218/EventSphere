const express = require("express");

const {
    createExhibitor,
    getExhibitors,
    getExhibitorById,
    updateExhibitor,
    deleteExhibitor,
    approveExhibitor,
    rejectExhibitor
} = require("../controllers/exhibitorController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Create Exhibitor Profile
router.post(
    "/",
    protect,
    authorizeRoles("exhibitor"),
    createExhibitor
);


// Get All Exhibitors
router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getExhibitors
);


// Get Single Exhibitor
router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getExhibitorById
);


// Update Exhibitor
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "exhibitor"),
    updateExhibitor
);


// Delete Exhibitor
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteExhibitor
);


// Approve Exhibitor
router.put(
    "/:id/approve",
    protect,
    authorizeRoles("admin"),
    approveExhibitor
);


// Reject Exhibitor
router.put(
    "/:id/reject",
    protect,
    authorizeRoles("admin"),
    rejectExhibitor
);


module.exports = router;