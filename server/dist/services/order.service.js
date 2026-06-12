"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getMyOrders = exports.checkout = void 0;
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const checkout = async (userId) => {
    return db_1.default.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart ||
            cart.items.length === 0) {
            throw new AppError_1.AppError('Cart is empty', 400);
        }
        let totalPrice = 0;
        for (const item of cart.items) {
            if (item.quantity >
                item.product.stock) {
                throw new AppError_1.AppError(`${item.product.title} stock not enough`, 400);
            }
            totalPrice +=
                Number(item.product.price) *
                    item.quantity;
        }
        const order = await tx.order.create({
            data: {
                userId,
                totalPrice,
            },
        });
        for (const item of cart.items) {
            await tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                },
            });
            await tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        return order;
    });
};
exports.checkout = checkout;
const getMyOrders = async (userId) => {
    return db_1.default.order.findMany({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (id, userId) => {
    return db_1.default.order.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
};
exports.getOrderById = getOrderById;
