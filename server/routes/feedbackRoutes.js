const express = require("express");

const {
    createFeedback,
    getMyFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// User submits feedback
router.post(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    createFeedback
);


// Logged-in user gets their feedback
router.get(
    "/my",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getMyFeedback
);


// Admin/Organizer gets all feedback
router.get(
    "/",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    getAllFeedback
);


// Get one feedback
router.get(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer",
        "exhibitor",
        "attendee"
    ),
    getFeedbackById
);


// Admin/Organizer update feedback
router.put(
    "/:id",
    protect,
    authorizeRoles(
        "admin",
        "organizer"
    ),
    updateFeedback
);


// Admin delete feedback
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteFeedback
);


module.exports = router;