-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('GROCERIES', 'RENT', 'EATING_OUT', 'TRANSPORT', 'SUBSCRIPTIONS', 'ENTERTAINMENT', 'UTILITIES', 'INCOME', 'OTHER');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "category" "TransactionCategory" NOT NULL DEFAULT 'OTHER';
