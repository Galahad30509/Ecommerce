"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async () => {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders,] = await Promise.all([
        db_1.default.user.count(),
        db_1.default.product.count({
            where: {
                isDeleted: false,
            },
        }),
        db_1.default.order.count(),
        db_1.default.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        }),
        db_1.default.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
    ]);
    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(revenueResult._sum.totalPrice || 0),
        recentOrders,
    };
};
exports.getDashboardStats = getDashboardStats;
