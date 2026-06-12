import prisma from '../config/db';

import { AppError } from '../utils/AppError';

interface StripeOrderInput {
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
}

export const createPendingOrderFromCart =
async (
  userId: number,
  payment: StripeOrderInput
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
            paymentStatus: 'PENDING',
            paymentProvider: 'stripe',
            stripeSessionId:
              payment.stripeSessionId,
            stripePaymentIntentId:
              payment.stripePaymentIntentId,
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
      }

      return order;
    }
  );
};

export const markStripeOrderPaid =
async (
  stripeSessionId: string,
  stripePaymentIntentId?: string | null
) => {
  return prisma.$transaction(
    async (tx) => {
      const order =
        await tx.order.findUnique({
          where: {
            stripeSessionId,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

      if (!order) {
        throw new AppError(
          'Order not found for Stripe session',
          404
        );
      }

      if (
        order.paymentStatus === 'PAID'
      ) {
        return order;
      }

      for (const item of order.items) {
        const product =
          await tx.product.findFirst({
            where: {
              id: item.productId,
              isDeleted: false,
            },
          });

        if (!product) {
          throw new AppError(
            'Product not found',
            404
          );
        }

        if (
          item.quantity >
          product.stock
        ) {
          throw new AppError(
            `${product.title} stock not enough`,
            400
          );
        }
      }

      for (const item of order.items) {
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
          cart: {
            userId: order.userId,
          },
        },
      });

      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: 'PAID',
          stripePaymentIntentId:
            stripePaymentIntentId ??
            order.stripePaymentIntentId,
          paidAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
  );
};

export const cancelStripeOrder =
async (
  stripeSessionId: string
) => {
  const order =
    await prisma.order.findUnique({
      where: {
        stripeSessionId,
      },
    });

  if (!order) {
    return null;
  }

  if (order.paymentStatus !== 'PENDING') {
    return order;
  }

  return prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      paymentStatus: 'CANCELED',
    },
  });
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
