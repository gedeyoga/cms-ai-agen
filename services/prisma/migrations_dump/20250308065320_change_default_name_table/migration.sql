-- DropForeignKey
ALTER TABLE `chathistory` DROP FOREIGN KEY `ChatHistory_contactId_fkey`;

-- DropForeignKey
ALTER TABLE `contactcategory` DROP FOREIGN KEY `ContactCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `contactcategory` DROP FOREIGN KEY `ContactCategory_contactId_fkey`;

-- AddForeignKey
ALTER TABLE `contactcategory` ADD CONSTRAINT `fk_contactcategory_contact` FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactcategory` ADD CONSTRAINT `fk_contactcategory_category` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chathistory` ADD CONSTRAINT `chathistory_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `contact` RENAME INDEX `Contact_phone_key` TO `contact_phone_key`;

-- RenameIndex
ALTER TABLE `contactcategory` RENAME INDEX `ContactCategory_contactId_categoryId_idx` TO `contactcategory_contactId_categoryId_idx`;
