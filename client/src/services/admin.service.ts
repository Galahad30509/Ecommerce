import api from '../api/axios';

import type { DashboardStats } from '../types/admin.types';

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response =
      await api.get(
        '/admin/dashboard'
      );

    return response.data;
  };
