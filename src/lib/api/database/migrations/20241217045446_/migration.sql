-- CreateEnum
CREATE TYPE "TransactionStatusEnum" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "TransactionStatusEnum" NOT NULL DEFAULT 'PENDING';
