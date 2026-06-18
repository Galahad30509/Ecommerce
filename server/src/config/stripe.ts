import Stripe from 'stripe';

import { AppError } from '../utils/AppError';

let stripeClient: ReturnType<typeof Stripe> | null = null;

export const getStripe = () => {
  const secretKey =
    process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new AppError(
      'Stripe secret key is not configured',
      500
    );
  }

  if (!stripeClient) {
    stripeClient = Stripe(secretKey);
  }

  return stripeClient;
};

export const getStripeCurrency = () =>
  process.env.STRIPE_CURRENCY ||
  'thb';

export const getClientUrl = () =>
  process.env.CLIENT_URL ||
  'http://127.0.0.1:5173';

export const isMockPaymentMode = () =>
  process.env.PAYMENT_MODE === 'mock';
