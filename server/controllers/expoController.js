const Expo = require("../models/Expo");

// Create Expo
const createExpo = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            startDate,
            endDate,
            registrationDeadline,
            status
        } = req.body;

        if (
            !title ||
            !description ||
            !location ||
            !startDate ||
            !endDate ||
            !registrationDeadline
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const expo = await Expo.create({
            title,
            description,
            location,
            startDate,
            endDate,
            registrationDeadline,
            status: status || "draft",
            createdBy: req.user.userId
        });

        res.status(201).json({
            message: "Expo created successfully",
            expo
        });

    } catch (error) {
        console.error("Create expo error:", error.message);

        res.status(500).json({
            message: "Server error while creating expo"
        });
    }
};


// Get all Expos
const getExpos = async (req, res) => {
    try {
        const expos = await Expo.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            expos
        });

    } catch (error) {
        console.error("Get expos error:", error.message);

        res.status(500).json({
            message: "Server error while fetching expos"
        });
    }
};


// Get single Expo
const getExpoById = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id)
            .populate("createdBy", "name email role");

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        res.status(200).json({
            expo
        });

    } catch (error) {
        console.error("Get expo error:", error.message);

        res.status(500).json({
            message: "Server error while fetching expo"
        });
    }
};


// Update Expo
const updateExpo = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            startDate,
            endDate,
            registrationDeadline,
            status
        } = req.body;

        const expo = await Expo.findById(req.params.id);

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        expo.title = title ?? expo.title;
        expo.description = description ?? expo.description;
        expo.location = location ?? expo.location;
        expo.startDate = startDate ?? expo.startDate;
        expo.endDate = endDate ?? expo.endDate;
        expo.registrationDeadline =
            registrationDeadline ?? expo.registrationDeadline;
        expo.status = status ?? expo.status;

        await expo.save();

        res.status(200).json({
            message: "Expo updated successfully",
            expo
        });

    } catch (error) {
        console.error("Update expo error:", error.message);

        res.status(500).json({
            message: "Server error while updating expo"
        });
    }
};


// Delete Expo
const deleteExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        await Expo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Expo deleted successfully"
        });

    } catch (error) {
        console.error("Delete expo error:", error.message);

        res.status(500).json({
            message: "Server error while deleting expo"
        });
    }
};


module.exports = {
    createExpo,
    getExpos,
    getExpoById,
    updateExpo,
    deleteExpo
};