import { Request, Response } from 'express';

import * as ProductService from '../services/product.service';

import { asyncHandler } from '../utils/asyncHandler';

import { AppError } from '../utils/AppError';

import { successResponse } from '../utils/response';

export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search?.toString();
    const sort = req.query.sort?.toString();

    const minPrice = req.query.min
      ? Number(req.query.min)
      : undefined;

    const maxPrice = req.query.max
      ? Number(req.query.max)
      : undefined;

    try {
      const result =
        await ProductService.getAllProducts(
          page,
          limit,
          search,
          sort,
          minPrice,
          maxPrice
        );

      return successResponse(
        res,
        result,
        'Products fetched'
      );
    } catch (error) {
      console.error(
        'GET PRODUCTS ERROR =>',
        error
      );

      throw error;
    }
  }
);

export const getProduct = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const product =
      await ProductService.getProductById(
        Number(req.params.id)
      );

    if (!product) {
      throw new AppError(
        'Product not found',
        404
      );
    }

    successResponse(
      res,
      product,
      'Product fetched'
    );
  }
);

export const createProduct = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const product =
      await ProductService.createProduct(
        req.body
      );

    successResponse(
      res,
      product,
      'Product created',
      201
    );
  }
);

export const updateProduct = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const product =
      await ProductService.updateProduct(
        Number(req.params.id),
        req.body
      );

    successResponse(
      res,
      product,
      'Product updated'
    );
  }
);

export const deleteProduct = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    await ProductService.deleteProduct(
      Number(req.params.id)
    );

    successResponse(
      res,
      null,
      'Product deleted'
    );
  }
);