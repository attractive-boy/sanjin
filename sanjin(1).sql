/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : sanjin

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 05/10/2024 22:28:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cashapplies
-- ----------------------------
DROP TABLE IF EXISTS `cashapplies`;
CREATE TABLE `cashapplies`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `count` decimal(10, 2) NOT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `cashapplies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cashapplies
-- ----------------------------
INSERT INTO `cashapplies` VALUES (1, 13, 22.00, 'pending', '2024-09-25 22:12:51', '2024-09-25 22:12:51');
INSERT INTO `cashapplies` VALUES (2, 13, 11.00, 'pending', '2024-09-25 22:29:32', '2024-09-25 22:29:32');
INSERT INTO `cashapplies` VALUES (3, 13, 200.00, 'pending', '2024-09-25 23:18:26', '2024-09-25 23:18:26');

-- ----------------------------
-- Table structure for code
-- ----------------------------
DROP TABLE IF EXISTS `code`;
CREATE TABLE `code`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `verification_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `code_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of code
-- ----------------------------
INSERT INTO `code` VALUES (1, 12, '747047', '2024-09-24 23:54:18', '2024-09-24 23:59:18');
INSERT INTO `code` VALUES (2, 13, '588469', '2024-09-25 00:43:09', '2024-09-25 00:48:08');
INSERT INTO `code` VALUES (3, 13, '617846', '2024-09-25 00:55:33', '2024-09-25 01:00:33');
INSERT INTO `code` VALUES (4, 13, '206349', '2024-09-25 20:42:40', '2024-09-25 20:47:40');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int NOT NULL,
  `total_price` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for product_des_images
-- ----------------------------
DROP TABLE IF EXISTS `product_des_images`;
CREATE TABLE `product_des_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `desPicPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `productId`(`productId` ASC) USING BTREE,
  CONSTRAINT `product_des_images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 141 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_des_images
-- ----------------------------
INSERT INTO `product_des_images` VALUES (129, 196, '../public/images/72IHHZ53lDtgx6nxB1UIf/des_1727357836113_fu5IiV3dY4_xMqxNlj-Tj.png');
INSERT INTO `product_des_images` VALUES (130, 196, '../public/images/72IHHZ53lDtgx6nxB1UIf/des_1727357846772.png');
INSERT INTO `product_des_images` VALUES (131, 196, '../public/images/72IHHZ53lDtgx6nxB1UIf/des_1727357846774.png');
INSERT INTO `product_des_images` VALUES (134, 197, '../public/images/9KgPQesEBirAh_Dr1syXs/des_1727358209583_Sfed8y2paeiDmJ5EHF0fG.png');
INSERT INTO `product_des_images` VALUES (135, 197, '../public/images/9KgPQesEBirAh_Dr1syXs/des_1727358221650.png');
INSERT INTO `product_des_images` VALUES (136, 197, '../public/images/9KgPQesEBirAh_Dr1syXs/des_1727358221651.png');
INSERT INTO `product_des_images` VALUES (139, 198, '../public/images/FISM8H2wzCfV8Tzj0TMux/des_1727358366282_qenC1ivAkwEFyWXdXlLFc.png');
INSERT INTO `product_des_images` VALUES (140, 198, '../public/images/FISM8H2wzCfV8Tzj0TMux/des_1727358372651.png');

-- ----------------------------
-- Table structure for product_views
-- ----------------------------
DROP TABLE IF EXISTS `product_views`;
CREATE TABLE `product_views`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `view_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `product_views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `product_views_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_views
-- ----------------------------

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `limitTime` datetime NULL DEFAULT NULL,
  `reward` decimal(10, 2) NULL DEFAULT NULL,
  `picPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `special` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nanoid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 199 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (196, '带我去', '2024-10-01 09:30:00', 213.00, '../public/images/72IHHZ53lDtgx6nxB1UIf/head_1727357836111_sxDUJN13mZ47ayVVobqc4.png', '分我', '废物废物', '72IHHZ53lDtgx6nxB1UIf', '2000-11-10 02:10:00', '2000-11-11 02:10:00');
INSERT INTO `products` VALUES (197, '去玩的', '2024-10-01 09:30:00', 123.00, '../public/images/9KgPQesEBirAh_Dr1syXs/head_1727358209582_aIFpJ43MPP-gSx-UzfkGt.png', '大青蛙', '方伟伟', '9KgPQesEBirAh_Dr1syXs', '2000-11-10 02:10:00', '2000-11-11 02:10:00');
INSERT INTO `products` VALUES (198, '范围', '2024-10-01 09:30:00', 123.00, '../public/images/FISM8H2wzCfV8Tzj0TMux/head_1727358366282_WCBWnnQPxtbqZflaD3Grh.png', '分我', '废文网', 'FISM8H2wzCfV8Tzj0TMux', '2000-11-10 02:10:00', '2000-11-11 02:10:00');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `idNum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tel` bigint NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `account` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (7, '发发发', 'addasdsa', '213323211312', 123132321, NULL, 0);
INSERT INTO `users` VALUES (8, 'dsaads', 'addasdsa', '213323211312', 123132321, '废物废物', 0);
INSERT INTO `users` VALUES (9, '222222', 'user', '212121', 2222222, '123', 534);
INSERT INTO `users` VALUES (10, '份额无法访问', 'user', '212132323', 32322323, '123123', 0);
INSERT INTO `users` VALUES (12, 'qwe', 'user', '123321', 123, '123', 0);
INSERT INTO `users` VALUES (13, '打算', 'user', '123321321312', 15983979188, '435543', 445);
INSERT INTO `users` VALUES (14, '范围', 'user', '45543534', 15932324444, '123312', 691);

SET FOREIGN_KEY_CHECKS = 1;
