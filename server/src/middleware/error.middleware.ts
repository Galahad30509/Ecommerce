import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(
      err.statusCode
    ).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.name ===
    'PrismaClientInitializationError'
  ) {
    return res.status(503).json({
      success: false,
      message:
        'Database unavailable',
    });
  }

  return res.status(500).json({
    success: false,
    message:
      'Internal Server Error',
  });
};
