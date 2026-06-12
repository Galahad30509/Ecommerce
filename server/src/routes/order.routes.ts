import { Router } from 'express';

import {
  getMyOrders,
  getOrder,
} from '../controllers/order.controller';

import { protect }
from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get(
  '/my-orders',
  getMyOrders
);

router.get(
  '/:id',
  getOrder
);

export default router;
