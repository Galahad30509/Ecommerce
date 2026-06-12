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
exports.stripeWebhook = exports.confirmCheckoutSession = exports.createCheckoutSession = void 0;
const stripe_1 = require("../config/stripe");
const PaymentService = __importStar(require("../services/payment.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
exports.createCheckoutSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await PaymentService
        .createCheckoutSession(req.user.id);
    res.status(201).json(session);
});
exports.confirmCheckoutSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        throw new AppError_1.AppError('sessionId is required', 400);
    }
    const order = await PaymentService
        .confirmCheckoutSession(req.user.id, sessionId);
    res.json(order);
});
const stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return res.status(400).json({
            message: 'Stripe webhook secret is not configured',
        });
    }
    if (!signature ||
        Array.isArray(signature)) {
        return res.status(400).json({
            message: 'Missing Stripe signature',
        });
    }
    try {
        const stripe = (0, stripe_1.getStripe)();
        const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        await PaymentService
            .handleStripeWebhook(event);
        return res.json({
            received: true,
        });
    }
    catch (error) {
        console.error('STRIPE WEBHOOK ERROR =>', error);
        return res.status(400).json({
            message: 'Invalid Stripe webhook',
        });
    }
};
exports.stripeWebhook = stripeWebhook;
