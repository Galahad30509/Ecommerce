import { Router } from 'express';

import {
  checkout,
  getMyOrders,
  getOrder,
} from '../controllers/order.controller';

import { protect }
from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post(
  '/checkout',
  checkout
);

router.get(
  '/my-orders',
  getMyOrders
);

router.get(
  '/:id',
  getOrder
);

export default router;