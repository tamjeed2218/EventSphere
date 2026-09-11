const Registration = require("../models/Registration");
const Expo = require("../models/Expo");
const Session = require("../models/Session");

// Register for Expo
const registerForExpo = async (req, res) => {
    try {
        const { expo } = req.body;

        if (!expo) {
            return res.status(400).json({
                message: "Expo ID is required"
            });
        }

        const existingExpo = await Expo.findById(expo);

        if (!existingExpo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        if (
            existingExpo.registrationDeadline &&
            new Date() > new Date(existingExpo.registrationDeadline)
        ) {
            return res.status(400).json({
                message: "Registration deadline has passed"
            });
        }

        const existingRegistration =
            await Registration.findOne({
                user: req.user.userId,
                expo,
                session: null
            });

        if (existingRegistration) {
            return res.status(400).json({
                message: "You are already registered for this expo"
            });
        }

        const registration = await Registration.create({
            user: req.user.userId,
            expo,
            session: null,
            registrationType: "expo",
            status: "pending"
        });

        const populatedRegistration =
            await Registration.findById(
                registration._id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title location startDate endDate"
                );

        res.status(201).json({
            message: "Expo registration submitted successfully",
            registration: populatedRegistration
        });

    } catch (error) {
        console.error(
            "Register for expo error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while registering for expo"
        });
    }
};

// Register for Session
const registerForSession = async (req, res) => {
    try {
        const { session } = req.body;

        if (!session) {
            return res.status(400).json({
                message: "Session ID is required"
            });
        }

        const existingSession =
            await Session.findById(session);

        if (!existingSession) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const existingRegistration =
            await Registration.findOne({
                user: req.user.userId,
                expo: existingSession.expo,
                session
            });

        if (existingRegistration) {
            return res.status(400).json({
                message: "You are already registered for this session"
            });
        }

        const registration = await Registration.create({
            user: req.user.userId,
            expo: existingSession.expo,
            session,
            registrationType: "session",
            status: "pending"
        });

        const populatedRegistration =
            await Registration.findById(
                registration._id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title location startDate endDate"
                )
                .populate(
                    "session"
                );

        res.status(201).json({
            message: "Session registration submitted successfully",
            registration: populatedRegistration
        });

    } catch (error) {
        console.error(
            "Register for session error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while registering for session"
        });
    }
};

// Get My Registrations
const getMyRegistrations = async (req, res) => {
    try {
        const registrations =
            await Registration.find({
                user: req.user.userId
            })
                .populate(
                    "expo",
                    "title location startDate endDate"
                )
                .populate(
                    "session"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            registrations
        });

    } catch (error) {
        console.error(
            "Get my registrations error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching registrations"
        });
    }
};

// Get All Registrations
const getRegistrations = async (req, res) => {
    try {
        const registrations =
            await Registration.find()
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title location startDate endDate"
                )
                .populate(
                    "session"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            registrations
        });

    } catch (error) {
        console.error(
            "Get registrations error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching registrations"
        });
    }
};

// Get Single Registration
const getRegistrationById = async (req, res) => {
    try {
        const registration =
            await Registration.findById(
                req.params.id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title location startDate endDate"
                )
                .populate(
                    "session"
                );

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        res.status(200).json({
            registration
        });

    } catch (error) {
        console.error(
            "Get registration error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching registration"
        });
    }
};

// Update Registration Status
const updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "approved",
            "rejected",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid registration status"
            });
        }

        const registration =
            await Registration.findById(
                req.params.id
            );

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        registration.status = status;

        await registration.save();

        const updatedRegistration =
            await Registration.findById(
                registration._id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title location startDate endDate"
                )
                .populate(
                    "session"
                );

        res.status(200).json({
            message: "Registration status updated successfully",
            registration: updatedRegistration
        });

    } catch (error) {
        console.error(
            "Update registration status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while updating registration"
        });
    }
};

// Cancel My Registration
const cancelMyRegistration = async (req, res) => {
    try {
        const registration =
            await Registration.findOne({
                _id: req.params.id,
                user: req.user.userId
            });

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                message: "Registration is already cancelled"
            });
        }

        registration.status = "cancelled";

        await registration.save();

        res.status(200).json({
            message: "Registration cancelled successfully",
            registration
        });

    } catch (error) {
        console.error(
            "Cancel registration error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while cancelling registration"
        });
    }
};

module.exports = {
    registerForExpo,
    registerForSession,
    getMyRegistrations,
    getRegistrations,
    getRegistrationById,
    updateRegistrationStatus,
    cancelMyRegistration
};