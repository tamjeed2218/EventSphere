const User = require("../models/User");
const Expo = require("../models/Expo");
const Exhibitor = require("../models/Exhibitor");
const Booth = require("../models/Booth");
const Registration = require("../models/Registration");

const getAnalyticsOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            totalExhibitors,
            totalExpos,
            totalBooths,
            totalRegistrations,

            usersByRole,
            exposByStatus,
            exhibitorsByStatus,
            boothsByStatus,
            registrationsByStatus,

            expoRegistrations
        ] = await Promise.all([
            User.countDocuments(),

            Exhibitor.countDocuments(),

            Expo.countDocuments(),

            Booth.countDocuments(),

            Registration.countDocuments(),

            User.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]),

            Expo.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]),

            Exhibitor.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]),

            Booth.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]),

            Registration.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]),

            Registration.aggregate([
                {
                    $group: {
                        _id: "$expo",
                        registrations: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "expos",
                        localField: "_id",
                        foreignField: "_id",
                        as: "expo"
                    }
                },
                {
                    $unwind: {
                        path: "$expo",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        registrations: 1,
                        expoTitle: "$expo.title"
                    }
                },
                {
                    $sort: {
                        registrations: -1
                    }
                }
            ])
        ]);

        const availableBooths = await Booth.countDocuments({
            status: "available"
        });

        const reservedBooths = await Booth.countDocuments({
            status: "reserved"
        });

        const occupiedBooths = await Booth.countDocuments({
            status: "occupied"
        });

        const approvedRegistrations =
            await Registration.countDocuments({
                status: "approved"
            });

        const pendingRegistrations =
            await Registration.countDocuments({
                status: "pending"
            });

        const rejectedRegistrations =
            await Registration.countDocuments({
                status: "rejected"
            });

        const cancelledRegistrations =
            await Registration.countDocuments({
                status: "cancelled"
            });

        res.status(200).json({
            success: true,

            overview: {
                totalUsers,
                totalExhibitors,
                totalExpos,
                totalBooths,
                totalRegistrations
            },

            users: {
                byRole: usersByRole
            },

            expos: {
                byStatus: exposByStatus
            },

            exhibitors: {
                total: totalExhibitors,
                byStatus: exhibitorsByStatus
            },

            booths: {
                total: totalBooths,
                available: availableBooths,
                reserved: reservedBooths,
                occupied: occupiedBooths,
                byStatus: boothsByStatus
            },

            registrations: {
                total: totalRegistrations,
                approved: approvedRegistrations,
                pending: pendingRegistrations,
                rejected: rejectedRegistrations,
                cancelled: cancelledRegistrations,
                byStatus: registrationsByStatus
            },

            expoRegistrations
        });

    } catch (error) {
        console.error(
            "Analytics error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics.",
            error: error.message
        });
    }
};

module.exports = {
    getAnalyticsOverview
};