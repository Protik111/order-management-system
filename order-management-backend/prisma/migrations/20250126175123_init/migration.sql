-- DropForeignKey
ALTER TABLE "orderProducts" DROP CONSTRAINT "orderProducts_productId_fkey";

-- AddForeignKey
ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
