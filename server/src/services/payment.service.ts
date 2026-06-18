import prisma from '../config/db';
import {
  getClientUrl,
  getStripe,
  getStripeCurrency,
  isMockPaymentMode,
} from '../config/stripe';

import { AppError } from '../utils/AppError';

import {
  cancelStripeOrder,
  createPendingOrderFromCart,
  markStripeOrderPaid,
} from './order.service';

type PaymentIntentLike =
  | string
  | {
      id: string;
    }
  | null;

type StripeSessionLike = {
  id: string;
  payment_status?: string;
  payment_intent?: PaymentIntentLike;
};

type StripeEventLike = {
  type: string;
  data: {
    object: StripeSessionLike;
  };
};

const getPaymentIntentId = (
  paymentIntent: PaymentIntentLike
) => {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === 'string'
    ? paymentIntent
    : paymentIntent.id;
};

const createMockSessionId = (
  userId: number
) => {
  return `mock_${userId}_${Date.now()}`;
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

  const clientUrl = getClientUrl();

  if (isMockPaymentMode()) {
    const sessionId =
      createMockSessionId(userId);

    const order =
      await createPendingOrderFromCart(
        userId,
        {
          stripeSessionId: sessionId,
          stripePaymentIntentId: null,
        }
      );

    return {
      checkoutUrl:
        `${clientUrl}/checkout/success?session_id=${sessionId}`,
      sessionId,
      orderId: order.id,
      mode: 'mock',
    };
  }

  const currency = getStripeCurrency();
  const stripe = getStripe();

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
    mode: 'stripe',
  };
};

export const confirmCheckoutSession =
async (
  userId: number,
  sessionId: string
) => {
  if (sessionId.startsWith('mock_')) {
    return markStripeOrderPaid(
      sessionId,
      null,
      userId
    );
  }

  const stripe = getStripe();

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
    ),
    userId
  );
};

export const handleStripeWebhook =
async (
  event: StripeEventLike
) => {
  if (
    event.type ===
    'checkout.session.completed'
  ) {
    const session = event.data.object;

    if (
      session.payment_status === 'paid'
    ) {
      await markStripeOrderPaid(
        session.id,
        getPaymentIntentId(
          session.payment_intent || null
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
    const session = event.data.object;

    await cancelStripeOrder(
      session.id
    );
  }
};
