-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `role` ENUM('USER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerified` DATETIME(3) NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `sellerRating` DOUBLE NULL,
    `totalSales` INTEGER NOT NULL DEFAULT 0,
    `responseRate` DOUBLE NULL DEFAULT 0,
    `responseTime` INTEGER NULL,
    `completedOrders` INTEGER NOT NULL DEFAULT 0,
    `cancellationRate` DOUBLE NULL DEFAULT 0,
    `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SellerProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `originalPrice` DECIMAL(10, 2) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sellerId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `sales` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `listingId` INTEGER NOT NULL,
    `isMain` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'DISPUTED') NOT NULL DEFAULT 'PENDING',
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `platformFee` DECIMAL(10, 2) NOT NULL,
    `transactionFee` DECIMAL(10, 2) NOT NULL,
    `buyerId` INTEGER NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `listingId` INTEGER NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `deliveryMethod` VARCHAR(191) NULL,
    `deliveryStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` TINYINT NOT NULL,
    `comment` TEXT NULL,
    `giverId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `listingId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Review_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user1Id` INTEGER NOT NULL,
    `user2Id` INTEGER NOT NULL,
    `lastMessage` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Conversation_user1Id_user2Id_key`(`user1Id`, `user2Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `listingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Favorite_userId_listingId_key`(`userId`, `listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SYSTEM', 'ORDER', 'MESSAGE', 'PAYMENT', 'REVIEW') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `pushNotifications` BOOLEAN NOT NULL DEFAULT true,
    `marketingEmails` BOOLEAN NOT NULL DEFAULT false,
    `theme` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Settings_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerProfile` ADD CONSTRAINT `SellerProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `SellerProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `SellerProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_giverId_fkey` FOREIGN KEY (`giverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `SellerProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `Listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
