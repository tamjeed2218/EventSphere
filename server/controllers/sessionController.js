const Session = require("../models/Session");
const Expo = require("../models/Expo");

// =====================================================
// CREATE SESSION
// =====================================================

const createSession = async (req, res) => {
    try {
        const {
            expo,
            title,
            description,
            speaker,
            date,
            startTime,
            endTime,
            location,
            capacity,
            status
        } = req.body;

        if (
            !expo ||
            !title ||
            !description ||
            !speaker ||
            !date ||
            !startTime ||
            !endTime ||
            !location ||
            !capacity
        ) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        const expoExists = await Expo.findById(expo);

        if (!expoExists) {
            return res.status(404).json({
                message: "Expo not found."
            });
        }

        const session = await Session.create({
            expo,
            title,
            description,
            speaker,
            date,
            startTime,
            endTime,
            location,
            capacity: Number(capacity),
            status: status || "scheduled"
        });

        const populatedSession = await Session.findById(session._id)
            .populate("expo", "title location startDate endDate");

        return res.status(201).json({
            message: "Session created successfully.",
            session: populatedSession
        });

    } catch (error) {
        console.error("Create session error:", error);

        return res.status(500).json({
            message: "Server error while creating session."
        });
    }
};


// =====================================================
// GET ALL SESSIONS
// =====================================================

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate(
                "expo",
                "title location startDate endDate status"
            )
            .sort({
                date: 1,
                startTime: 1
            });

        return res.status(200).json({
            sessions
        });

    } catch (error) {
        console.error("Get sessions error:", error);

        return res.status(500).json({
            message: "Server error while fetching sessions."
        });
    }
};


// =====================================================
// GET SINGLE SESSION
// =====================================================

const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate(
                "expo",
                "title location startDate endDate status"
            );

        if (!session) {
            return res.status(404).json({
                message: "Session not found."
            });
        }

        return res.status(200).json({
            session
        });

    } catch (error) {
        console.error("Get session error:", error);

        return res.status(500).json({
            message: "Server error while fetching session."
        });
    }
};


// =====================================================
// UPDATE SESSION
// =====================================================

const updateSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found."
            });
        }

        const {
            expo,
            title,
            description,
            speaker,
            date,
            startTime,
            endTime,
            location,
            capacity,
            status
        } = req.body;

        if (expo) {
            const expoExists = await Expo.findById(expo);

            if (!expoExists) {
                return res.status(404).json({
                    message: "Expo not found."
                });
            }

            session.expo = expo;
        }

        if (title !== undefined) {
            session.title = title;
        }

        if (description !== undefined) {
            session.description = description;
        }

        if (speaker !== undefined) {
            session.speaker = speaker;
        }

        if (date !== undefined) {
            session.date = date;
        }

        if (startTime !== undefined) {
            session.startTime = startTime;
        }

        if (endTime !== undefined) {
            session.endTime = endTime;
        }

        if (location !== undefined) {
            session.location = location;
        }

        if (capacity !== undefined) {
            session.capacity = Number(capacity);
        }

        if (status !== undefined) {
            session.status = status;
        }

        await session.save();

        const updatedSession = await Session.findById(session._id)
            .populate(
                "expo",
                "title location startDate endDate status"
            );

        return res.status(200).json({
            message: "Session updated successfully.",
            session: updatedSession
        });

    } catch (error) {
        console.error("Update session error:", error);

        return res.status(500).json({
            message: "Server error while updating session."
        });
    }
};


// =====================================================
// DELETE SESSION
// =====================================================

const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found."
            });
        }

        await Session.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Session deleted successfully."
        });

    } catch (error) {
        console.error("Delete session error:", error);

        return res.status(500).json({
            message: "Server error while deleting session."
        });
    }
};


module.exports = {
    createSession,
    getSessions,
    getSessionById,
    updateSession,
    deleteSession
};