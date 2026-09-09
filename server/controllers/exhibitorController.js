const Exhibitor = require("../models/Exhibitor");

// Create Exhibitor Profile
const createExhibitor = async (req, res) => {
    try {
        const {
            companyName,
            companyDescription,
            industry,
            contactPerson,
            phone,
            website,
            productsServices,
            address
        } = req.body;

        if (
            !companyName ||
            !companyDescription ||
            !industry ||
            !contactPerson ||
            !phone ||
            !productsServices ||
            !address
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const existingExhibitor = await Exhibitor.findOne({
            user: req.user.userId
        });

        if (existingExhibitor) {
            return res.status(400).json({
                message: "Exhibitor profile already exists"
            });
        }

        const exhibitor = await Exhibitor.create({
            user: req.user.userId,
            companyName,
            companyDescription,
            industry,
            contactPerson,
            phone,
            website: website || "",
            productsServices,
            address
        });

        res.status(201).json({
            message: "Exhibitor profile created successfully",
            exhibitor
        });

    } catch (error) {
        console.error(
            "Create exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating exhibitor"
        });
    }
};


// Get All Exhibitors
const getExhibitors = async (req, res) => {
    try {
        const exhibitors = await Exhibitor.find()
            .populate(
                "user",
                "name email role"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            exhibitors
        });

    } catch (error) {
        console.error(
            "Get exhibitors error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching exhibitors"
        });
    }
};


// Get Single Exhibitor
const getExhibitorById = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(
            req.params.id
        ).populate(
            "user",
            "name email role"
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            exhibitor
        });

    } catch (error) {
        console.error(
            "Get exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching exhibitor"
        });
    }
};


// Update Exhibitor
const updateExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(
            req.params.id
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        // Exhibitors can update only their own profile
        if (
            req.user.role === "exhibitor" &&
            exhibitor.user.toString() !== req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You can only update your own exhibitor profile"
            });
        }

        const {
            companyName,
            companyDescription,
            industry,
            contactPerson,
            phone,
            website,
            productsServices,
            address
        } = req.body;

        exhibitor.companyName =
            companyName ?? exhibitor.companyName;

        exhibitor.companyDescription =
            companyDescription ??
            exhibitor.companyDescription;

        exhibitor.industry =
            industry ?? exhibitor.industry;

        exhibitor.contactPerson =
            contactPerson ?? exhibitor.contactPerson;

        exhibitor.phone =
            phone ?? exhibitor.phone;

        exhibitor.website =
            website ?? exhibitor.website;

        exhibitor.productsServices =
            productsServices ??
            exhibitor.productsServices;

        exhibitor.address =
            address ?? exhibitor.address;

        await exhibitor.save();

        res.status(200).json({
            message: "Exhibitor updated successfully",
            exhibitor
        });

    } catch (error) {
        console.error(
            "Update exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating exhibitor"
        });
    }
};


// Delete Exhibitor
const deleteExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(
            req.params.id
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        await Exhibitor.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Exhibitor deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while deleting exhibitor"
        });
    }
};


// Approve Exhibitor
const approveExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(
            req.params.id
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        if (exhibitor.status === "approved") {
            return res.status(400).json({
                message: "Exhibitor is already approved"
            });
        }

        exhibitor.status = "approved";

        await exhibitor.save();

        res.status(200).json({
            message: "Exhibitor approved successfully",
            exhibitor
        });

    } catch (error) {
        console.error(
            "Approve exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while approving exhibitor"
        });
    }
};


// Reject Exhibitor
const rejectExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(
            req.params.id
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        if (exhibitor.status === "rejected") {
            return res.status(400).json({
                message: "Exhibitor is already rejected"
            });
        }

        exhibitor.status = "rejected";

        await exhibitor.save();

        res.status(200).json({
            message: "Exhibitor rejected successfully",
            exhibitor
        });

    } catch (error) {
        console.error(
            "Reject exhibitor error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while rejecting exhibitor"
        });
    }
};


module.exports = {
    createExhibitor,
    getExhibitors,
    getExhibitorById,
    updateExhibitor,
    deleteExhibitor,
    approveExhibitor,
    rejectExhibitor
};