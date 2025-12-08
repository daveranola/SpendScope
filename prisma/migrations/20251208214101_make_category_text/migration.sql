-- Move enum-backed columns to text, preserving existing values
ALTER TABLE "Budget"
  ALTER COLUMN "category" TYPE text USING "category"::text;

ALTER TABLE "Transaction"
  ALTER COLUMN "category" TYPE text USING "category"::text;

-- Drop legacy enum types now that columns no longer depend on them
DROP TYPE IF EXISTS "TransactionCategory_old" CASCADE;
DROP TYPE IF EXISTS "TransactionCategory" CASCADE;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_userId_type_idx" ON "Category"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_type_key" ON "Category"("userId", "name", "type");

-- CreateIndex
DROP INDEX IF EXISTS "Budget_userId_category_key";
CREATE UNIQUE INDEX "Budget_userId_category_key" ON "Budget"("userId", "category");
