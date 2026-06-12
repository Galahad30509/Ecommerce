import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { z } from 'zod';

export const validate = (
  schema: z.ZodTypeAny
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.issues,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
      });
    }
  };
};
