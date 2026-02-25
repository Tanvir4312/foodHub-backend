-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DietaryPreference" ADD VALUE 'NON_VEGETARIAN';
ALTER TYPE "DietaryPreference" ADD VALUE 'DAIRY_FREE';
ALTER TYPE "DietaryPreference" ADD VALUE 'NUT_FREE';
ALTER TYPE "DietaryPreference" ADD VALUE 'EGG_FREE';
ALTER TYPE "DietaryPreference" ADD VALUE 'LOW_CARB';
ALTER TYPE "DietaryPreference" ADD VALUE 'LOW_FAT';
ALTER TYPE "DietaryPreference" ADD VALUE 'HIGH_PROTEIN';
