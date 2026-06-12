-- Add payment status and Stripe checkout metadata to orders.
ALTER TABLE `Order`
  ADD COLUMN `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
  ADD COLUMN `paymentProvider` VARCHAR(191) NULL,
  ADD COLUMN `stripeSessionId` VARCHAR(191) NULL,
  ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NULL,
  ADD COLUMN `paidAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `Order_stripeSessionId_key`
  ON `Order`(`stripeSessionId`);
