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
            totalAttendees,

            usersByRole,
            exposByStatus,
            exhibitorsByStatus,
            boothsByStatus,
            registrationsByStatus,

            expoRegistrations,

            recentUsers,
            recentExpos,
            recentExhibitors,
            recentRegistrations
        ] = await Promise.all([
            User.countDocuments(),

            Exhibitor.countDocuments(),

            Expo.countDocuments(),

            Booth.countDocuments(),

            Registration.countDocuments(),

            User.countDocuments({
                role: "attendee"
            }),

            User.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: {
                            $sum: 1
                        }
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
                        count: {
                            $sum: 1
                        }
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
                        count: {
                            $sum: 1
                        }
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
                        count: {
                            $sum: 1
                        }
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
                        count: {
                            $sum: 1
                        }
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
            ]),

            // Recent users
            User.find()
                .select("name email role createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .lean(),

            // Recent expos
            Expo.find()
                .select("title status createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .lean(),

            // Recent exhibitor profiles
            Exhibitor.find()
                .select("companyName status createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .lean(),

            // Recent registrations
            Registration.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "expo",
                    "title"
                )
                .select("user expo registrationType status createdAt")
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .lean()
        ]);

        const availableBooths =
            await Booth.countDocuments({
                status: "available"
            });

        const reservedBooths =
            await Booth.countDocuments({
                status: "reserved"
            });

        const occupiedBooths =
            await Booth.countDocuments({
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

        // Convert all recent records into one activity list.
        const recentActivities = [
            ...recentUsers.map((user) => ({
                type: "user",
                title: "New user registered",
                description: `${user.name} joined as ${user.role}`,
                date: user.createdAt,
                icon: "user"
            })),

            ...recentExpos.map((expo) => ({
                type: "expo",
                title: "Expo created",
                description: expo.title,
                date: expo.createdAt,
                icon: "expo"
            })),

            ...recentExhibitors.map((exhibitor) => ({
                type: "exhibitor",
                title: "Exhibitor profile created",
                description: `${exhibitor.companyName} - ${exhibitor.status}`,
                date: exhibitor.createdAt,
                icon: "exhibitor"
            })),

            ...recentRegistrations.map((registration) => ({
                type: "registration",
                title: "New registration",
                description:
                    `${registration.user?.name || "User"} registered for ` +
                    `${registration.expo?.title || "an expo"}`,
                date: registration.createdAt,
                icon: "registration"
            }))
        ]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 8);

        res.status(200).json({
            success: true,

            overview: {
                totalUsers,
                totalExhibitors,
                totalExpos,
                totalBooths,
                totalRegistrations,
                totalAttendees
            },

            users: {
                total: totalUsers,
                attendees: totalAttendees,
                byRole: usersByRole
            },

            expos: {
                total: totalExpos,
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

            expoRegistrations,

            recentActivities
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