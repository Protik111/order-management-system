/*
  Warnings:

  - Changed the type of `type` on the `promotions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('percentage', 'fixed', 'weighted');

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "type",
ADD COLUMN     "type" "PromotionType" NOT NULL;

-- CreateTable
CREATE TABLE "promotionProducts" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "promotionProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "promotionProducts" ADD CONSTRAINT "promotionProducts_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotionProducts" ADD CONSTRAINT "promotionProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
