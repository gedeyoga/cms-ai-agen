-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_companyId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `user_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `User` DROP INDEX `User_email_key`;

ALTER TABLE `User` ADD UNIQUE INDEX `user_email_key` (`email`);

ALTER TABLE `User` DROP INDEX `User_phone_key`;

ALTER TABLE `User` ADD UNIQUE INDEX `user_phone_key` (`phone`);
