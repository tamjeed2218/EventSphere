const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
    {
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },

        boothNumber: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: String,
            enum: [
                "small",
                "medium",
                "large"
            ],
            default: "medium"
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "available",
                "reserved",
                "occupied"
            ],
            default: "available"
        },

        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor",
            default: null
        },

        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

boothSchema.index(
    {
        expo: 1,
        boothNumber: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Booth", boothSchema);