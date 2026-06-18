import type { Product } from './product.types';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELED';

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
  paymentStatus: PaymentStatus;
  paymentProvider?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  items?: OrderItem[];
}
