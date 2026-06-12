import prisma from '../config/db';

export const findUserByEmail = async (
  email: string
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findPublicUserById = async (
  id: number
) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
