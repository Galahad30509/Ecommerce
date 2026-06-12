"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.confirmCheckoutSession = exports.createCheckoutSession = void 0;
const db_1 = __importDefault(require("../config/db"));
const stripe_1 = require("../config/stripe");
const AppError_1 = require("../utils/AppError");
const order_service_1 = require("./order.service");
const getPaymentIntentId = (paymentIntent) => {
    if (!paymentIntent) {
        return null;
    }
    return typeof paymentIntent === 'string'
        ? paymentIntent
        : paymentIntent.id;
};
const createCheckoutSession = async (userId) => {
    const cart = await db_1.default.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: {
                select: {
                    email: true,
                },
            },
        },
    });
    if (!cart ||
        cart.items.length === 0) {
        throw new AppError_1.AppError('Cart is empty', 400);
    }
    for (const item of cart.items) {
        if (item.product.isDeleted ||
            item.quantity > item.product.stock) {
            throw new AppError_1.AppError(`${item.product.title} is not available`, 400);
        }
    }
    const currency = (0, stripe_1.getStripeCurrency)();
    const clientUrl = (0, stripe_1.getClientUrl)();
    const stripe = (0, stripe_1.getStripe)();
    const lineItems = cart.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
            currency,
            product_data: {
                name: item.product.title,
                description: item.product.description,
            },
            unit_amount: Math.round(Number(item.product.price) * 100),
        },
    }));
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        customer_email: cart.user.email,
        success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/checkout/cancel`,
        metadata: {
            userId: String(userId),
            cartId: String(cart.id),
        },
    });
    const order = await (0, order_service_1.createPendingOrderFromCart)(userId, {
        stripeSessionId: session.id,
        stripePaymentIntentId: getPaymentIntentId(session.payment_intent),
    });
    return {
        checkoutUrl: session.url,
        sessionId: session.id,
        orderId: order.id,
    };
};
exports.createCheckoutSession = createCheckoutSession;
const confirmCheckoutSession = async (userId, sessionId) => {
    const stripe = (0, stripe_1.getStripe)();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId !==
        String(userId)) {
        throw new AppError_1.AppError('Forbidden', 403);
    }
    if (session.payment_status !== 'paid') {
        throw new AppError_1.AppError('Payment is not completed', 400);
    }
    return (0, order_service_1.markStripeOrderPaid)(session.id, getPaymentIntentId(session.payment_intent));
};
exports.confirmCheckoutSession = confirmCheckoutSession;
const handleStripeWebhook = async (event) => {
    if (event.type ===
        'checkout.session.completed') {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
            await (0, order_service_1.markStripeOrderPaid)(session.id, getPaymentIntentId(session.payment_intent));
        }
    }
    if (event.type ===
        'checkout.session.expired' ||
        event.type ===
            'checkout.session.async_payment_failed') {
        const session = event.data.object;
        await (0, order_service_1.cancelStripeOrder)(session.id);
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
