const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "reviewed",
                "resolved"
            ],
            default: "pending"
        },

        adminResponse: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Feedback",
    feedbackSchema
);