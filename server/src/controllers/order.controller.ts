import {
  Request,
  Response,
} from 'express';

import * as OrderService
from '../services/order.service';

import { asyncHandler }
from '../utils/asyncHandler';

import { AppError }
from '../utils/AppError';

export const getMyOrders =
asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const orders =
      await OrderService.getMyOrders(
        req.user!.id
      );

    res.json(orders);
  }
);

export const getOrder =
asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const order =
      await OrderService.getOrderById(
        Number(req.params.id),
        req.user!.id
      );

    if (!order) {
      throw new AppError(
        'Order not found',
        404
      );
    }

    res.json(order);
  }
);
