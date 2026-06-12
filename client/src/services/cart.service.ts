import api from '../api/axios';

import type {
  Cart,
  CartItem,
} from '../types/cart.types';

export const getCart =
  async (): Promise<Cart | null> => {
    const response =
      await api.get('/cart');

    return response.data;
  };

export const addToCart =
  async (
    productId: number,
    quantity = 1
  ): Promise<CartItem> => {
    const response =
      await api.post('/cart', {
        productId,
        quantity,
      });

    return response.data;
  };

export const updateCartItem =
  async (
    id: number,
    quantity: number
  ): Promise<CartItem> => {
    const response =
      await api.put(
        `/cart/${id}`,
        {
          quantity,
        }
      );

    return response.data;
  };

export const removeCartItem =
  async (id: number) => {
    const response =
      await api.delete(
        `/cart/${id}`
      );

    return response.data;
  };
