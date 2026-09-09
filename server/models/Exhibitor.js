const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyDescription: {
            type: String,
            required: true,
            trim: true
        },

        industry: {
            type: String,
            required: true,
            trim: true
        },

        contactPerson: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            trim: true,
            default: ""
        },

        productsServices: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        documents: [
            {
                type: String
            }
        ],

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Exhibitor",
    exhibitorSchema
);