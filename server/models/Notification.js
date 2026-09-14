const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "general",
                "event",
                "session",
                "registration",
                "booth",
                "system"
            ],
            default: "general"
        },

        audience: {
            type: String,
            enum: [
                "all",
                "attendee",
                "exhibitor",
                "organizer",
                "admin"
            ],
            default: "all"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "normal",
                "high",
                "urgent"
            ],
            default: "normal"
        },

        scheduledFor: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            default: null
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);