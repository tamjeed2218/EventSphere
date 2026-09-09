const express = require("express");

const {
    createBooth,
    getBooths,
    getBoothsByExpo,
    getBoothById,
    updateBooth,
    deleteBooth,
    reserveBooth,
    occupyBooth,
    releaseBooth
} = require("../controllers/boothController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Create Booth
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createBooth
);


// Get All Booths
router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getBooths
);


// Get Booths by Expo
router.get(
    "/expo/:expoId",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getBoothsByExpo
);


// Get Single Booth
router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getBoothById
);


// Update Booth
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateBooth
);


// Delete Booth
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteBooth
);


// Reserve Booth
router.put(
    "/:id/reserve",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor"
    ),
    reserveBooth
);


// Mark Booth Occupied
router.put(
    "/:id/occupy",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    occupyBooth
);


// Release Booth
router.put(
    "/:id/release",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    releaseBooth
);


module.exports = router;