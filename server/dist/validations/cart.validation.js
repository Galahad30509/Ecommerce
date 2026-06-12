"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z
        .coerce
        .number()
        .int()
        .positive(),
    quantity: zod_1.z
        .coerce
        .number()
        .int()
        .positive(),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z
        .coerce
        .number()
        .int()
        .positive(),
});
