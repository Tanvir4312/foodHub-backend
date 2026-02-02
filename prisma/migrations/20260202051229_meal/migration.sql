/*
  Warnings:

  - The values [GLUTEN_FRE] on the enum `DietaryPreference` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DietaryPreference_new" AS ENUM ('VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'KETO');
ALTER TABLE "meals" ALTER COLUMN "dietary" TYPE "DietaryPreference_new" USING ("dietary"::text::"DietaryPreference_new");
ALTER TYPE "DietaryPreference" RENAME TO "DietaryPreference_old";
ALTER TYPE "DietaryPreference_new" RENAME TO "DietaryPreference";
DROP TYPE "public"."DietaryPreference_old";
COMMIT;
