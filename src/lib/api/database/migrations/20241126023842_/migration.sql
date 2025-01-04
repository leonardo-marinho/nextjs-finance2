-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "creditCardBillDay" INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "billingDate" TIMESTAMP(0);
