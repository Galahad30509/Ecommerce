import prisma from '../config/db';

import { AppError } from '../utils/AppError';

export const checkout = async (
  userId: number
) => {

  return prisma.$transaction(
    async (tx) => {

      const cart =
        await tx.cart.findUnique({
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

      if (
        !cart ||
        cart.items.length === 0
      ) {
        throw new AppError(
          'Cart is empty',
          400
        );
      }

      let totalPrice = 0;

      for (const item of cart.items) {

        if (
          item.quantity >
          item.product.stock
        ) {
          throw new AppError(
            `${item.product.title} stock not enough`,
            400
          );
        }

        totalPrice +=
          Number(item.product.price) *
          item.quantity;
      }

      const order =
        await tx.order.create({
          data: {
            userId,
            totalPrice,
          },
        });

      for (const item of cart.items) {

        await tx.orderItem.create({
          data: {
            orderId: order.id,

            productId:
              item.productId,

            quantity:
              item.quantity,

            price:
              item.product.price,
          },
        });

        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement:
                item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    }
  );
};

export const getMyOrders =
async (
  userId: number
) => {

  return prisma.order.findMany({
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

    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getOrderById =
async (
  id: number,
  userId: number
) => {

  return prisma.order.findFirst({
    where: {
      id,
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

