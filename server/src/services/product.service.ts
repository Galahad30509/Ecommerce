import prisma from '../config/db';

import { Prisma } from '@prisma/client';

import { AppError } from '../utils/AppError';

export const getAllProducts = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sort?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const skip = (page - 1) * limit;

  let orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: 'desc',
  };

  if (sort === 'price_asc') {
    orderBy = { price: 'asc' };
  }

  if (sort === 'price_desc') {
    orderBy = { price: 'desc' };
  }

  if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
  };

  if (search) {
    where.title = {
      contains: search,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      gte: minPrice ?? 0,
      lte: maxPrice ?? 999999999,
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),

    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: number) => {
  return prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });
};

export const createProduct = async (data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}) => {
  return prisma.product.create({
    data,
  });
};

export const updateProduct = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
  }
) => {
  const existing =
    await getProductById(id);

  if (!existing) {
    throw new AppError(
      'Product not found',
      404
    );
  }

  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};
