import { Request, Response } from 'express';

import {
  createUser,
  findUserByEmail,
  findPublicUserById,
} from '../services/auth.service';

import {
  hashPassword,
  comparePassword,
} from '../utils/hashPassword';

import { generateToken } from '../utils/generateToken';

import { AppError } from '../utils/AppError';

export const register = async (
  req: Request,
  res: Response
) => {
  const { name, email, password } =
    req.body;

  const existingUser =
    await findUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({
      message: 'Email already exists',
    });
  }

  const hashedPassword =
    await hashPassword(password);

  const user = await createUser(
    name,
    email,
    hashedPassword
  );

  res.status(201).json({
    message: 'Register Success',
    user,
  });
};

export const login = async (
  req: Request,
  res: Response
) => {
  const { email, password } =
    req.body;

  const user =
    await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const isMatch =
    await comparePassword(
      password,
      user.password
    );

  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const token = generateToken(
    user.id,
    user.role
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const profile = async (
  req: Request,
  res: Response
) => {
  const user =
    await findPublicUserById(
      req.user!.id
    );

  if (!user) {
    throw new AppError(
      'User not found',
      404
    );
  }

  res.json({
    user,
  });
};
