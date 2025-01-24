/*
  Warnings:

  - You are about to drop the column `slabs` on the `promotions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "slabs";

-- CreateTable
CREATE TABLE "promotionSlabs" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "promotionSlabs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "promotionSlabs" ADD CONSTRAINT "promotionSlabs_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
