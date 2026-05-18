CREATE DATABASE IF NOT EXISTS `database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `database`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `user_name`    VARCHAR(255) NULL,
  `phone_number` VARCHAR(20)  NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
