import { Router } from 'express';

import {
  confirmCheckoutSession,
  createCheckoutSession,
} from '../controllers/payment.controller';

import { protect }
from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post(
  '/create-checkout-session',
  createCheckoutSession
);

router.post(
  '/confirm-checkout-session',
  confirmCheckoutSession
);

export default router;
