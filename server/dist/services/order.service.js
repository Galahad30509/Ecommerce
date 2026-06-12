"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getMyOrders = exports.cancelStripeOrder = exports.markStripeOrderPaid = exports.createPendingOrderFromCart = void 0;
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const createPendingOrderFromCart = async (userId, payment) => {
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
                paymentStatus: 'PENDING',
                paymentProvider: 'stripe',
                stripeSessionId: payment.stripeSessionId,
                stripePaymentIntentId: payment.stripePaymentIntentId,
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
        }
        return order;
    });
};
exports.createPendingOrderFromCart = createPendingOrderFromCart;
const markStripeOrderPaid = async (stripeSessionId, stripePaymentIntentId) => {
    return db_1.default.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                stripeSessionId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new AppError_1.AppError('Order not found for Stripe session', 404);
        }
        if (order.paymentStatus === 'PAID') {
            return order;
        }
        for (const item of order.items) {
            const product = await tx.product.findFirst({
                where: {
                    id: item.productId,
                    isDeleted: false,
                },
            });
            if (!product) {
                throw new AppError_1.AppError('Product not found', 404);
            }
            if (item.quantity >
                product.stock) {
                throw new AppError_1.AppError(`${product.title} stock not enough`, 400);
            }
        }
        for (const item of order.items) {
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
                cart: {
                    userId: order.userId,
                },
            },
        });
        return tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentStatus: 'PAID',
                stripePaymentIntentId: stripePaymentIntentId ??
                    order.stripePaymentIntentId,
                paidAt: new Date(),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    });
};
exports.markStripeOrderPaid = markStripeOrderPaid;
const cancelStripeOrder = async (stripeSessionId) => {
    const order = await db_1.default.order.findUnique({
        where: {
            stripeSessionId,
        },
    });
    if (!order) {
        return null;
    }
    if (order.paymentStatus !== 'PENDING') {
        return order;
    }
    return db_1.default.order.update({
        where: {
            id: order.id,
        },
        data: {
            paymentStatus: 'CANCELED',
        },
    });
};
exports.cancelStripeOrder = cancelStripeOrder;
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
