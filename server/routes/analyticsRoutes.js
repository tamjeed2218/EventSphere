const express = require("express");

const {
    getAnalyticsOverview
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/overview",
    protect,
    authorizeRoles("admin"),
    getAnalyticsOverview
);

module.exports = router;