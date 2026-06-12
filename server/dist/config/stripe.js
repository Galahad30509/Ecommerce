"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientUrl = exports.getStripeCurrency = exports.getStripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const AppError_1 = require("../utils/AppError");
let stripeClient = null;
const getStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new AppError_1.AppError('Stripe secret key is not configured', 500);
    }
    if (!stripeClient) {
        stripeClient = new stripe_1.default(secretKey);
    }
    return stripeClient;
};
exports.getStripe = getStripe;
const getStripeCurrency = () => process.env.STRIPE_CURRENCY ||
    'thb';
exports.getStripeCurrency = getStripeCurrency;
const getClientUrl = () => process.env.CLIENT_URL ||
    'http://127.0.0.1:5173';
exports.getClientUrl = getClientUrl;
