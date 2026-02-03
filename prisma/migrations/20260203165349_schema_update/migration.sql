-- DropForeignKey
ALTER TABLE "order-items" DROP CONSTRAINT "order-items_order_id_fkey";

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
