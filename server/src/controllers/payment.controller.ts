import {
  Request,
  Response,
} from 'express';

import {
  getStripe,
} from '../config/stripe';

import * as PaymentService
from '../services/payment.service';

import { asyncHandler }
from '../utils/asyncHandler';

import { AppError }
from '../utils/AppError';

export const createCheckoutSession =
asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const session =
      await PaymentService
        .createCheckoutSession(
          req.user!.id
        );

    res.status(201).json(session);
  }
);

export const confirmCheckoutSession =
asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      throw new AppError(
        'sessionId is required',
        400
      );
    }

    const order =
      await PaymentService
        .confirmCheckoutSession(
          req.user!.id,
          sessionId
        );

    res.json(order);
  }
);

export const stripeWebhook =
async (
  req: Request,
  res: Response
) => {
  const signature =
    req.headers[
      'stripe-signature'
    ];

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({
      message:
        'Stripe webhook secret is not configured',
    });
  }

  if (
    !signature ||
    Array.isArray(signature)
  ) {
    return res.status(400).json({
      message:
        'Missing Stripe signature',
    });
  }

  try {
    const stripe =
      getStripe();

    const event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );

    await PaymentService
      .handleStripeWebhook(event);

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      'STRIPE WEBHOOK ERROR =>',
      error
    );

    return res.status(400).json({
      message:
        'Invalid Stripe webhook',
    });
  }
};
