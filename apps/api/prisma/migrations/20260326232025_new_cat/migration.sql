-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionCategory" ADD VALUE 'UTILITIES';
ALTER TYPE "TransactionCategory" ADD VALUE 'INSURANCE';
ALTER TYPE "TransactionCategory" ADD VALUE 'FREELANCE';
ALTER TYPE "TransactionCategory" ADD VALUE 'INVESTMENT_INCOME';
ALTER TYPE "TransactionCategory" ADD VALUE 'DEBT_PAYMENT';
ALTER TYPE "TransactionCategory" ADD VALUE 'SAVINGS';
ALTER TYPE "TransactionCategory" ADD VALUE 'GIFT';
ALTER TYPE "TransactionCategory" ADD VALUE 'EDUCATION';
