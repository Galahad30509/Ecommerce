import { Router } from 'express';

import { getDashboard } from '../controllers/admin.controller';

import { protect } from '../middleware/auth.middleware';

import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.get(
  '/dashboard',
  protect,
  adminOnly,
  getDashboard
);

export default router;