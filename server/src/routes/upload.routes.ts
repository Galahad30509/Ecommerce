import { Router } from 'express';

import { upload }
from '../middleware/upload.middleware';

import {
  uploadProductImage,
}
from '../controllers/upload.controller';

import { protect }
from '../middleware/auth.middleware';

import { adminOnly }
from '../middleware/admin.middleware';

const router = Router();

router.post(
  '/product',
  protect,
  adminOnly,
  upload.single('image'),
  uploadProductImage
);

export default router;