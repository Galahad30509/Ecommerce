"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCartByUserId = void 0;
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const getCartByUserId = async (userId) => {
    return db_1.default.cart.findUnique({
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
};
exports.getCartByUserId = getCartByUserId;
const addToCart = async (userId, productId, quantity) => {
    const product = await db_1.default.product.findFirst({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    let cart = await db_1.default.cart.findUnique({
        where: {
            userId,
        },
    });
    if (!cart) {
        cart = await db_1.default.cart.create({
            data: {
                userId,
            },
        });
    }
    const existingItem = await db_1.default.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });
    if (existingItem) {
        const nextQuantity = existingItem.quantity +
            quantity;
        if (nextQuantity > product.stock) {
            throw new AppError_1.AppError('Quantity exceeds available stock', 400);
        }
        return db_1.default.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: nextQuantity,
            },
        });
    }
    if (quantity > product.stock) {
        throw new AppError_1.AppError('Quantity exceeds available stock', 400);
    }
    return db_1.default.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity,
        },
    });
};
exports.addToCart = addToCart;
const updateCartItem = async (userId, cartItemId, quantity) => {
    const item = await db_1.default.cartItem.findFirst({
        where: {
            id: cartItemId,
            cart: {
                userId,
            },
        },
        include: {
            product: true,
        },
    });
    if (!item) {
        throw new AppError_1.AppError('Cart item not found', 404);
    }
    if (quantity > item.product.stock) {
        throw new AppError_1.AppError('Quantity exceeds available stock', 400);
    }
    return db_1.default.cartItem.update({
        where: {
            id: cartItemId,
        },
        data: {
            quantity,
        },
    });
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (userId, cartItemId) => {
    const item = await db_1.default.cartItem.findFirst({
        where: {
            id: cartItemId,
            cart: {
                userId,
            },
        },
    });
    if (!item) {
        throw new AppError_1.AppError('Cart item not found', 404);
    }
    return db_1.default.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
};
exports.removeCartItem = removeCartItem;
