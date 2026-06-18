import api from '../api/axios';

import type { Order } from '../types/order.types';

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  orderId: number;
  mode: 'mock' | 'stripe';
}

export const createCheckoutSession =
  async (): Promise<CheckoutSessionResponse> => {
    const response =
      await api.post(
        '/payments/create-checkout-session'
      );

    return response.data;
  };

export const confirmCheckoutSession =
  async (
    sessionId: string
  ): Promise<Order> => {
    const response =
      await api.post(
        '/payments/confirm-checkout-session',
        {
          sessionId,
        }
      );

    return response.data;
  };
