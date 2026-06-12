import api from '../api/axios';

import type { Order } from '../types/order.types';

export const checkout =
  async (): Promise<Order> => {
    const response =
      await api.post(
        '/orders/checkout'
      );

    return response.data;
  };

export const getMyOrders =
  async (): Promise<Order[]> => {
    const response =
      await api.get(
        '/orders/my-orders'
      );

    return response.data;
  };

export const getOrderById =
  async (
    id: number
  ): Promise<Order> => {
    const response =
      await api.get(
        `/orders/${id}`
      );

    return response.data;
  };
