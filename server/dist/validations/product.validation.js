"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3),
    description: zod_1.z
        .string()
        .min(10),
    price: zod_1.z
        .coerce
        .number()
        .positive(),
    stock: zod_1.z
        .coerce
        .number()
        .int()
        .min(0),
    image: zod_1.z
        .string()
        .optional(),
});
exports.updateProductSchema = exports.createProductSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
});
