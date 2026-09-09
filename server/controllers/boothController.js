const Booth = require("../models/Booth");
const Expo = require("../models/Expo");
const Exhibitor = require("../models/Exhibitor");


// Create Booth
const createBooth = async (req, res) => {
    try {
        const {
            expo,
            boothNumber,
            size,
            price,
            location,
            description
        } = req.body;

        if (
            !expo ||
            !boothNumber ||
            price === undefined ||
            !location
        ) {
            return res.status(400).json({
                message: "Expo, booth number, price and location are required"
            });
        }

        const existingExpo = await Expo.findById(expo);

        if (!existingExpo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        const existingBooth = await Booth.findOne({
            expo,
            boothNumber
        });

        if (existingBooth) {
            return res.status(400).json({
                message: "This booth number already exists for this expo"
            });
        }

        const booth = await Booth.create({
            expo,
            boothNumber,
            size: size || "medium",
            price,
            location,
            description: description || "",
            status: "available"
        });

        const populatedBooth = await Booth.findById(
            booth._id
        ).populate(
            "expo",
            "title location startDate endDate"
        );

        res.status(201).json({
            message: "Booth created successfully",
            booth: populatedBooth
        });

    } catch (error) {
        console.error(
            "Create booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating booth"
        });
    }
};


// Get All Booths
const getBooths = async (req, res) => {
    try {
        const booths = await Booth.find()
            .populate(
                "expo",
                "title location startDate endDate"
            )
            .populate(
                {
                    path: "exhibitor",
                    populate: {
                        path: "user",
                        select: "name email role"
                    }
                }
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            booths
        });

    } catch (error) {
        console.error(
            "Get booths error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching booths"
        });
    }
};


// Get Booths by Expo
const getBoothsByExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(
            req.params.expoId
        );

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        const booths = await Booth.find({
            expo: req.params.expoId
        })
            .populate(
                "expo",
                "title location startDate endDate"
            )
            .populate(
                {
                    path: "exhibitor",
                    populate: {
                        path: "user",
                        select: "name email role"
                    }
                }
            )
            .sort({
                boothNumber: 1
            });

        res.status(200).json({
            booths
        });

    } catch (error) {
        console.error(
            "Get expo booths error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching expo booths"
        });
    }
};


// Get Single Booth
const getBoothById = async (req, res) => {
    try {
        const booth = await Booth.findById(
            req.params.id
        )
            .populate(
                "expo",
                "title location startDate endDate"
            )
            .populate(
                {
                    path: "exhibitor",
                    populate: {
                        path: "user",
                        select: "name email role"
                    }
                }
            );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        res.status(200).json({
            booth
        });

    } catch (error) {
        console.error(
            "Get booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching booth"
        });
    }
};


// Update Booth
const updateBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(
            req.params.id
        );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        const {
            boothNumber,
            size,
            price,
            location,
            description
        } = req.body;

        if (
            boothNumber &&
            boothNumber !== booth.boothNumber
        ) {
            const duplicateBooth = await Booth.findOne({
                expo: booth.expo,
                boothNumber,
                _id: {
                    $ne: booth._id
                }
            });

            if (duplicateBooth) {
                return res.status(400).json({
                    message: "This booth number already exists for this expo"
                });
            }
        }

        booth.boothNumber =
            boothNumber ?? booth.boothNumber;

        booth.size =
            size ?? booth.size;

        booth.price =
            price ?? booth.price;

        booth.location =
            location ?? booth.location;

        booth.description =
            description ?? booth.description;

        await booth.save();

        const updatedBooth = await Booth.findById(
            booth._id
        ).populate(
            "expo",
            "title location startDate endDate"
        );

        res.status(200).json({
            message: "Booth updated successfully",
            booth: updatedBooth
        });

    } catch (error) {
        console.error(
            "Update booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating booth"
        });
    }
};


// Delete Booth
const deleteBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(
            req.params.id
        );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        if (booth.status !== "available") {
            return res.status(400).json({
                message: "Only available booths can be deleted"
            });
        }

        await Booth.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Booth deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while deleting booth"
        });
    }
};


// Reserve Booth
const reserveBooth = async (req, res) => {
    try {
        const {
            exhibitor
        } = req.body;

        if (!exhibitor) {
            return res.status(400).json({
                message: "Exhibitor ID is required"
            });
        }

        const booth = await Booth.findById(
            req.params.id
        );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        if (booth.status !== "available") {
            return res.status(400).json({
                message: "Booth is not available"
            });
        }

        const existingExhibitor =
            await Exhibitor.findById(exhibitor);

        if (!existingExhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        const existingReservation =
            await Booth.findOne({
                expo: booth.expo,
                exhibitor,
                status: {
                    $in: [
                        "reserved",
                        "occupied"
                    ]
                }
            });

        if (existingReservation) {
            return res.status(400).json({
                message: "This exhibitor already has a booth in this expo"
            });
        }

        booth.exhibitor = exhibitor;
        booth.status = "reserved";

        await booth.save();

        const updatedBooth = await Booth.findById(
            booth._id
        )
            .populate(
                "expo",
                "title location startDate endDate"
            )
            .populate(
                {
                    path: "exhibitor",
                    populate: {
                        path: "user",
                        select: "name email role"
                    }
                }
            );

        res.status(200).json({
            message: "Booth reserved successfully",
            booth: updatedBooth
        });

    } catch (error) {
        console.error(
            "Reserve booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while reserving booth"
        });
    }
};


// Mark Booth as Occupied
const occupyBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(
            req.params.id
        );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        if (booth.status !== "reserved") {
            return res.status(400).json({
                message: "Only reserved booths can be marked as occupied"
            });
        }

        booth.status = "occupied";

        await booth.save();

        res.status(200).json({
            message: "Booth marked as occupied",
            booth
        });

    } catch (error) {
        console.error(
            "Occupy booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while occupying booth"
        });
    }
};


// Release Booth
const releaseBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(
            req.params.id
        );

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        booth.status = "available";
        booth.exhibitor = null;

        await booth.save();

        res.status(200).json({
            message: "Booth released successfully",
            booth
        });

    } catch (error) {
        console.error(
            "Release booth error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while releasing booth"
        });
    }
};


module.exports = {
    createBooth,
    getBooths,
    getBoothsByExpo,
    getBoothById,
    updateBooth,
    deleteBooth,
    reserveBooth,
    occupyBooth,
    releaseBooth
};