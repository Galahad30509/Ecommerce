import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = path.join(
  process.cwd(),
  'uploads',
  'products'
);

fs.mkdirSync(uploadDir, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (
    _req,
    _file,
    cb
  ) => {
    cb(
      null,
      uploadDir
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {

    const ext =
      path.extname(
        file.originalname
      );

    cb(
      null,
      `${uuidv4()}${ext}`
    );
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (
    allowed.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only images allowed'
      )
    );
  }
};

export const upload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });
