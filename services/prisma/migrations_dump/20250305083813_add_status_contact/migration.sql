-- AlterTable
ALTER TABLE `contact` ADD COLUMN `status` ENUM('NEW', 'HOT', 'WARM', 'COLD', 'FOLLOWUP', 'LOST', 'ACTIVE') NOT NULL DEFAULT 'NEW';
