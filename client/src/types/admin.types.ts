import type { Order } from './order.types';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<
    Order & {
      user: {
        id: number;
        name: string;
        email: string;
      };
    }
  >;
}
