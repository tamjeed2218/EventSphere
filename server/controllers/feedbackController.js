const Feedback = require("../models/Feedback");

// Submit feedback
const createFeedback = async (req, res) => {
    try {
        const {
            subject,
            message,
            rating
        } = req.body;

        if (!subject || !message || !rating) {
            return res.status(400).json({
                message:
                    "Subject, message and rating are required."
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message:
                    "Rating must be between 1 and 5."
            });
        }

        const feedback = await Feedback.create({
            user: req.user.userId,
            subject,
            message,
            rating
        });

        const populatedFeedback =
            await Feedback.findById(feedback._id)
                .populate(
                    "user",
                    "name email role"
                );

        res.status(201).json({
            message:
                "Feedback submitted successfully.",
            feedback: populatedFeedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit feedback.",
            error: error.message
        });
    }
};


// Get logged-in user's feedback
const getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({
            user: req.user.userId
        })
            .populate(
                "user",
                "name email role"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: feedback.length,
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch your feedback.",
            error: error.message
        });
    }
};


// Admin/Organizer get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate(
                "user",
                "name email role"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: feedback.length,
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch feedback.",
            error: error.message
        });
    }
};


// Get single feedback
const getFeedbackById = async (req, res) => {
    try {
        const feedback =
            await Feedback.findById(req.params.id)
                .populate(
                    "user",
                    "name email role"
                );

        if (!feedback) {
            return res.status(404).json({
                message:
                    "Feedback not found."
            });
        }

        res.status(200).json({
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch feedback.",
            error: error.message
        });
    }
};


// Admin/Organizer update feedback
const updateFeedback = async (req, res) => {
    try {
        const {
            status,
            adminResponse
        } = req.body;

        const feedback =
            await Feedback.findById(
                req.params.id
            );

        if (!feedback) {
            return res.status(404).json({
                message:
                    "Feedback not found."
            });
        }

        if (status) {
            if (
                ![
                    "pending",
                    "reviewed",
                    "resolved"
                ].includes(status)
            ) {
                return res.status(400).json({
                    message:
                        "Invalid feedback status."
                });
            }

            feedback.status = status;
        }

        if (adminResponse !== undefined) {
            feedback.adminResponse =
                adminResponse.trim();
        }

        await feedback.save();

        const updatedFeedback =
            await Feedback.findById(
                feedback._id
            ).populate(
                "user",
                "name email role"
            );

        res.status(200).json({
            message:
                "Feedback updated successfully.",
            feedback: updatedFeedback
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to update feedback.",
            error: error.message
        });
    }
};


// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const feedback =
            await Feedback.findById(
                req.params.id
            );

        if (!feedback) {
            return res.status(404).json({
                message:
                    "Feedback not found."
            });
        }

        await Feedback.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Feedback deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to delete feedback.",
            error: error.message
        });
    }
};


module.exports = {
    createFeedback,
    getMyFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};