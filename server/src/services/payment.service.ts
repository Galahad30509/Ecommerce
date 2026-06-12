import Stripe from 'stripe';

import prisma from '../config/db';
import {
  getClientUrl,
  getStripe,
  getStripeCurrency,
} from '../config/stripe';

import { AppError } from '../utils/AppError';

import {
  cancelStripeOrder,
  createPendingOrderFromCart,
  markStripeOrderPaid,
} from './order.service';

const getPaymentIntentId = (
  paymentIntent:
    | string
    | Stripe.PaymentIntent
    | null
) => {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === 'string'
    ? paymentIntent
    : paymentIntent.id;
};

export const createCheckoutSession =
async (
  userId: number
) => {
  const cart =
    await prisma.cart.findUnique({
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

  if (
    !cart ||
    cart.items.length === 0
  ) {
    throw new AppError(
      'Cart is empty',
      400
    );
  }

  for (const item of cart.items) {
    if (
      item.product.isDeleted ||
      item.quantity > item.product.stock
    ) {
      throw new AppError(
        `${item.product.title} is not available`,
        400
      );
    }
  }

  const currency =
    getStripeCurrency();

  const clientUrl =
    getClientUrl();

  const stripe =
    getStripe();

  const lineItems =
    cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        product_data: {
          name: item.product.title,
          description:
            item.product.description,
        },
        unit_amount: Math.round(
          Number(item.product.price) * 100
        ),
      },
    }));

  const session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: cart.user.email,
      success_url:
        `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        `${clientUrl}/checkout/cancel`,
      metadata: {
        userId: String(userId),
        cartId: String(cart.id),
      },
    });

  const order =
    await createPendingOrderFromCart(
      userId,
      {
        stripeSessionId: session.id,
        stripePaymentIntentId:
          getPaymentIntentId(
            session.payment_intent
          ),
      }
    );

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    orderId: order.id,
  };
};

export const confirmCheckoutSession =
async (
  userId: number,
  sessionId: string
) => {
  const stripe =
    getStripe();

  const session =
    await stripe.checkout.sessions.retrieve(
      sessionId
    );

  if (
    session.metadata?.userId !==
    String(userId)
  ) {
    throw new AppError(
      'Forbidden',
      403
    );
  }

  if (
    session.payment_status !== 'paid'
  ) {
    throw new AppError(
      'Payment is not completed',
      400
    );
  }

  return markStripeOrderPaid(
    session.id,
    getPaymentIntentId(
      session.payment_intent
    )
  );
};

export const handleStripeWebhook =
async (
  event: Stripe.Event
) => {
  if (
    event.type ===
    'checkout.session.completed'
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    if (
      session.payment_status === 'paid'
    ) {
      await markStripeOrderPaid(
        session.id,
        getPaymentIntentId(
          session.payment_intent
        )
      );
    }
  }

  if (
    event.type ===
      'checkout.session.expired' ||
    event.type ===
      'checkout.session.async_payment_failed'
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    await cancelStripeOrder(
      session.id
    );
  }
};
