const Notification = require("../models/Notification");


// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {
    try {
        const {
            title,
            message,
            type,
            audience,
            priority,
            scheduledFor,
            expiresAt,
            isPublished
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Notification title is required."
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Notification message is required."
            });
        }

        const notification = await Notification.create({
            title: title.trim(),
            message: message.trim(),
            type: type || "general",
            audience: audience || "all",
            priority: priority || "normal",
            scheduledFor: scheduledFor || null,
            expiresAt: expiresAt || null,
            isPublished:
                isPublished !== undefined
                    ? isPublished
                    : true,
            createdBy: req.user?._id || req.user?.id
        });

        const populatedNotification =
            await Notification.findById(
                notification._id
            ).populate(
                "createdBy",
                "name email"
            );

        return res.status(201).json({
            message:
                "Notification created successfully.",
            notification: populatedNotification
        });

    } catch (error) {
        console.error(
            "Create notification error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while creating notification."
        });
    }
};


// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {
    try {
        const notifications =
            await Notification.find()
                .populate(
                    "createdBy",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            notifications
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while fetching notifications."
        });
    }
};


// =====================================================
// GET SINGLE NOTIFICATION
// =====================================================

const getNotificationById = async (req, res) => {
    try {
        const notification =
            await Notification.findById(
                req.params.id
            ).populate(
                "createdBy",
                "name email"
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found."
            });
        }

        return res.status(200).json({
            notification
        });

    } catch (error) {
        console.error(
            "Get notification error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while fetching notification."
        });
    }
};


// =====================================================
// UPDATE NOTIFICATION
// =====================================================

const updateNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found."
            });
        }

        const {
            title,
            message,
            type,
            audience,
            priority,
            scheduledFor,
            expiresAt,
            isPublished
        } = req.body;

        if (title !== undefined) {
            notification.title =
                title.trim();
        }

        if (message !== undefined) {
            notification.message =
                message.trim();
        }

        if (type !== undefined) {
            notification.type = type;
        }

        if (audience !== undefined) {
            notification.audience =
                audience;
        }

        if (priority !== undefined) {
            notification.priority =
                priority;
        }

        if (scheduledFor !== undefined) {
            notification.scheduledFor =
                scheduledFor || null;
        }

        if (expiresAt !== undefined) {
            notification.expiresAt =
                expiresAt || null;
        }

        if (isPublished !== undefined) {
            notification.isPublished =
                isPublished;
        }

        await notification.save();

        const updatedNotification =
            await Notification.findById(
                notification._id
            ).populate(
                "createdBy",
                "name email"
            );

        return res.status(200).json({
            message:
                "Notification updated successfully.",
            notification:
                updatedNotification
        });

    } catch (error) {
        console.error(
            "Update notification error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while updating notification."
        });
    }
};


// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found."
            });
        }

        await Notification.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            message:
                "Notification deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete notification error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while deleting notification."
        });
    }
};


// =====================================================
// TOGGLE PUBLISHED STATUS
// =====================================================

const toggleNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found."
            });
        }

        notification.isPublished =
            !notification.isPublished;

        await notification.save();

        return res.status(200).json({
            message:
                notification.isPublished
                    ? "Notification published."
                    : "Notification unpublished.",
            notification
        });

    } catch (error) {
        console.error(
            "Toggle notification error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while changing notification status."
        });
    }
};


module.exports = {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    toggleNotification
};