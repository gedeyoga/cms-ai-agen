/*
  Warnings:

  - You are about to drop the column `validation_token` on the `user_registration` table. All the data in the column will be lost.
  - Added the required column `email` to the `user_registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validationToken` to the `user_registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_registration` DROP COLUMN `validation_token`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `validationToken` VARCHAR(191) NOT NULL;
