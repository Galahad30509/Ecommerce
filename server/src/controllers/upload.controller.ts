import {
  Request,
  Response,
} from 'express';

export const uploadProductImage =
(
  req: Request,
  res: Response
) => {

  if (!req.file) {
    return res.status(400).json({
      message:
        'No file uploaded',
    });
  }

  res.json({
    imageUrl:
      `/uploads/products/${req.file.filename}`,
  });
};