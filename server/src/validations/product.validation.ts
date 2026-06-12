import { z } from 'zod';

export const createProductSchema =
  z.object({
    title: z
      .string()
      .min(3),

    description: z
      .string()
      .min(10),

    price: z
      .coerce
      .number()
      .positive(),

    stock: z
      .coerce
      .number()
      .int()
      .min(0),

    image: z
      .string()
      .optional(),
  });

export const updateProductSchema =
  createProductSchema
    .partial()
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required',
      }
    );
