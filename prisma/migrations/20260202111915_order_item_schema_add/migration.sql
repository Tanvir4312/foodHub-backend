/*
  Warnings:

  - You are about to drop the column `items` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "items";

-- CreateTable
CREATE TABLE "order-items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order-items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
