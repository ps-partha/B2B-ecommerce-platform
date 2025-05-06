/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `listing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `listing` MODIFY `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Listing_slug_key` ON `Listing`(`slug`);
