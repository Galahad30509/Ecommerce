import { Router } from 'express';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cart.controller';

import { protect } from '../middleware/auth.middleware';

import { validate } from '../middleware/validate.middleware';

import {
  addToCartSchema,
  updateCartItemSchema,
} from '../validations/cart.validation';

const router = Router();

router.use(protect);

router.get('/', getCart);

router.post(
  '/',
  validate(addToCartSchema),
  addToCart
);

router.put(
  '/:id',
  validate(updateCartItemSchema),
  updateCartItem
);

router.delete('/:id', removeCartItem);

export default router;
