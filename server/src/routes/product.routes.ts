import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';

import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validation';

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

import { protect } from '../middleware/auth.middleware';

import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

router.get('/', getProducts);

router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  adminOnly,
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  protect,
  adminOnly,
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteProduct
);

export default router;
