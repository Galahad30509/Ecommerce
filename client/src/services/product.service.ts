import api from '../api/axios';

import type {
  Product,
  ProductInput,
  ProductListPayload,
} from '../types/product.types';

interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  min?: number;
  max?: number;
}

export const getProducts = async ({
  page = 1,
  limit = 10,
  search = '',
  sort,
  min,
  max,
}: ProductQuery = {}): Promise<ProductListPayload> => {

  const response =
    await api.get('/products', {
      params: {
        page,
        limit,
        search,
        sort,
        min,
        max,
      },
    });

  return response.data.data;
};

export const getProductById =
  async (id: number): Promise<Product> => {

    const response =
      await api.get(
        `/products/${id}`
      );

    return response.data.data;
  };

export const createProduct =
  async (
    data: ProductInput
  ): Promise<Product> => {
    const response =
      await api.post(
        '/products',
        data
      );

    return response.data.data;
  };

export const updateProduct =
  async (
    id: number,
    data: Partial<ProductInput>
  ): Promise<Product> => {
    const response =
      await api.put(
        `/products/${id}`,
        data
      );

    return response.data.data;
  };

export const deleteProduct =
  async (id: number) => {
    const response =
      await api.delete(
        `/products/${id}`
      );

    return response.data;
  };
