-- DropForeignKey
ALTER TABLE `chathistory` DROP FOREIGN KEY `chathistory_contactId_fkey`;

-- DropForeignKey
ALTER TABLE `contactcategory` DROP FOREIGN KEY `fk_contactcategory_category`;

-- DropForeignKey
ALTER TABLE `contactcategory` DROP FOREIGN KEY `fk_contactcategory_contact`;

-- DropIndex
DROP INDEX `chathistory_contactId_fkey` ON `chathistory`;

-- DropIndex
DROP INDEX `fk_contactcategory_category` ON `contactcategory`;

-- AddForeignKey
ALTER TABLE `contactcategory` ADD CONSTRAINT `fk_contactcategory_contact` FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactcategory` ADD CONSTRAINT `fk_contactcategory_category` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chathistory` ADD CONSTRAINT `chathistory_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
