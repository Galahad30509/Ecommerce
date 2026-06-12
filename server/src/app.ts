import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';

import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

import { stripeWebhook } from './controllers/payment.controller';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger';

const app = express();

app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

app.use(morgan('dev'));

app.post(
  '/api/payments/webhook',
  express.raw({
    type: 'application/json',
  }),
  stripeWebhook
);

app.use(express.json());

app.use(
  '/api/products',
  productRoutes
);

app.use(
  '/api/cart',
  cartRoutes
);

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(
  '/api/orders',
  orderRoutes
);

app.use(
  '/api/payments',
  paymentRoutes
);

app.get('/', (_req, res) => {
  res.json({
    message: 'API Running',
  });
});

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/uploads',
  express.static(
    path.join(
      process.cwd(),
      'uploads'
    )
  )
);

app.use(
  '/api/upload',
  uploadRoutes
);

app.use(
  '/api/admin',
  adminRoutes
);

app.use(notFound);

app.use(errorHandler);

export default app;
