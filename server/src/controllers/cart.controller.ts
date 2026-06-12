import { Request, Response } from 'express';

import * as CartService from '../services/cart.service';

import { asyncHandler } from '../utils/asyncHandler';

export const getCart = asyncHandler(
  async (req: Request, res: Response) => {
    const cart =
      await CartService.getCartByUserId(
        req.user!.id
      );

    res.json(cart);
  }
);

export const addToCart = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, quantity } =
      req.body;

    const item =
      await CartService.addToCart(
        req.user!.id,
        productId,
        quantity
      );

    res.status(201).json(item);
  }
);

export const updateCartItem =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const item =
        await CartService.updateCartItem(
          req.user!.id,
          Number(req.params.id),
          req.body.quantity
        );

      res.json(item);
    }
  );

export const removeCartItem =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      await CartService.removeCartItem(
        req.user!.id,
        Number(req.params.id)
      );

      res.json({
        message: 'Item removed',
      });
    }
  );
