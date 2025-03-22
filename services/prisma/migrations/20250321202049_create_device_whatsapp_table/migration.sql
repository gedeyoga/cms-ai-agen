-- CreateTable
CREATE TABLE `device_whatsapp` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `device` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL DEFAULT '62',
    `autoread` BOOLEAN NOT NULL DEFAULT false,
    `group` BOOLEAN NOT NULL DEFAULT false,
    `personal` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `quick` BOOLEAN NOT NULL DEFAULT false,
    `resend` BOOLEAN NOT NULL DEFAULT false,
    `expired` DATETIME(3) NULL,
    `package` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `quota` INTEGER NULL,
    `messages` INTEGER NULL,
    `webhook` VARCHAR(191) NULL,
    `webhookConnect` VARCHAR(191) NULL,
    `webhookStatus` VARCHAR(191) NULL,
    `webhookChaining` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
