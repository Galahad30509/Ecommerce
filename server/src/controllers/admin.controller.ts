import { Request, Response } from 'express';

import { asyncHandler } from '../utils/asyncHandler';

import * as AdminService from '../services/admin.service';

export const getDashboard = asyncHandler(
  async (
    _req: Request,
    res: Response
  ) => {
    const stats =
      await AdminService.getDashboardStats();

    res.json(stats);
  }
);