const authorizeRoles = require("../middleware/roleMiddleware");
const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
    "/profile",
    protect,
    authorizeRoles("attendee"),
    (req, res) => {
        res.status(200).json({
            message: "You are an authorized attendee",
            user: req.user
        });
    }
);

module.exports = router;