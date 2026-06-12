import type { Product } from './product.types';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number | string;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number | string;
  createdAt: string;
  items?: OrderItem[];
}
