import prisma from '../config/db';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.order.count(),

    prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: Number(
      revenueResult._sum.totalPrice || 0
    ),
    recentOrders,
  };
};