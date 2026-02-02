/*
  Warnings:

  - Changed the type of `dietary` on the `meals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('VEGAN', 'VEGETARIAN', 'GLUTEN_FRE', 'KETO');

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "dietary",
ADD COLUMN     "dietary" "DietaryPreference" NOT NULL;
