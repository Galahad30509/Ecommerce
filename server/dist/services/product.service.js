"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const getAllProducts = async (page = 1, limit = 10, search, sort, minPrice, maxPrice) => {
    const skip = (page - 1) * limit;
    let orderBy = {
        createdAt: 'desc',
    };
    if (sort === 'price_asc') {
        orderBy = { price: 'asc' };
    }
    if (sort === 'price_desc') {
        orderBy = { price: 'desc' };
    }
    if (sort === 'newest') {
        orderBy = { createdAt: 'desc' };
    }
    const where = {
        isDeleted: false,
    };
    if (search) {
        where.title = {
            contains: search,
        };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {
            gte: minPrice ?? 0,
            lte: maxPrice ?? 999999999,
        };
    }
    const [products, total] = await Promise.all([
        db_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
        }),
        db_1.default.product.count({ where }),
    ]);
    return {
        products,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return db_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    return db_1.default.product.create({
        data,
    });
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    const existing = await (0, exports.getProductById)(id);
    if (!existing) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    return db_1.default.product.update({
        where: {
            id,
        },
        data,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return db_1.default.product.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
};
exports.deleteProduct = deleteProduct;
