"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const CartService = __importStar(require("../services/cart.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cart = await CartService.getCartByUserId(req.user.id);
    res.json(cart);
});
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId, quantity } = req.body;
    const item = await CartService.addToCart(req.user.id, productId, quantity);
    res.status(201).json(item);
});
exports.updateCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await CartService.updateCartItem(req.user.id, Number(req.params.id), req.body.quantity);
    res.json(item);
});
exports.removeCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await CartService.removeCartItem(req.user.id, Number(req.params.id));
    res.json({
        message: 'Item removed',
    });
});
