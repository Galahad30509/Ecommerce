import prisma from '../config/db';

import { AppError } from '../utils/AppError';

export const getCartByUserId = async (
  userId: number
) => {
  return prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const product =
    await prisma.product.findFirst({
      where: {
        id: productId,
        isDeleted: false,
      },
    });

  if (!product) {
    throw new AppError(
      'Product not found',
      404
    );
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

  if (existingItem) {
    const nextQuantity =
      existingItem.quantity +
      quantity;

    if (nextQuantity > product.stock) {
      throw new AppError(
        'Quantity exceeds available stock',
        400
      );
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: nextQuantity,
      },
    });
  }

  if (quantity > product.stock) {
    throw new AppError(
      'Quantity exceeds available stock',
      400
    );
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  const item =
    await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
      include: {
        product: true,
      },
    });

  if (!item) {
    throw new AppError(
      'Cart item not found',
      404
    );
  }

  if (quantity > item.product.stock) {
    throw new AppError(
      'Quantity exceeds available stock',
      400
    );
  }

  return prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity,
    },
  });
};

export const removeCartItem = async (
  userId: number,
  cartItemId: number
) => {
  const item =
    await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
    });

  if (!item) {
    throw new AppError(
      'Cart item not found',
      404
    );
  }

  return prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
};
