-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: blockchain_audit_trail
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_keys` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usersId` bigint NOT NULL,
  `smartContractId` bigint NOT NULL,
  `emailId` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `apiKey` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedTimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_smart_contracts_1` (`smartContractId`),
  KEY `fk_users_1` (`usersId`),
  CONSTRAINT `fk_smart_contracts_1` FOREIGN KEY (`smartContractId`) REFERENCES `smart_contracts` (`id`),
  CONSTRAINT `fk_users_1` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datatype`
--

DROP TABLE IF EXISTS `datatype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datatype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `datatype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datatype`
--

LOCK TABLES `datatype` WRITE;
/*!40000 ALTER TABLE `datatype` DISABLE KEYS */;
INSERT INTO `datatype` VALUES (1,'Boolean','bool','2023-03-02 10:10:39'),(2,'String','string','2023-03-02 10:10:39'),(3,'Unsigned Integer','uint','2023-03-02 10:10:39'),(4,'Integer','int','2023-03-02 10:10:39'),(5,'Bytes','bytes','2023-03-02 10:10:39');
/*!40000 ALTER TABLE `datatype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_details`
--

DROP TABLE IF EXISTS `event_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `smartContractId` bigint NOT NULL,
  `eventName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `args` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `argTypes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedTimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_smart_Contracts` (`smartContractId`),
  CONSTRAINT `fk_smart_Contracts` FOREIGN KEY (`smartContractId`) REFERENCES `smart_contracts` (`id`),
  CONSTRAINT `event_details_chk_1` CHECK (json_valid(`args`)),
  CONSTRAINT `event_details_chk_2` CHECK (json_valid(`argTypes`))
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_details`
--

LOCK TABLES `event_details` WRITE;
/*!40000 ALTER TABLE `event_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `eventDetailsId` bigint NOT NULL,
  `eventPayload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `eventStatus` tinyint NOT NULL DEFAULT '0',
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `loggedDate` timestamp NULL DEFAULT NULL,
  `updatedTimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_details` (`eventDetailsId`),
  CONSTRAINT `fk_event_details` FOREIGN KEY (`eventDetailsId`) REFERENCES `event_details` (`id`),
  CONSTRAINT `events_chk_1` CHECK (json_valid(`eventPayload`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events_log_details`
--

DROP TABLE IF EXISTS `events_log_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_log_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `eventsId` bigint NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `block_number` bigint NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `transactionHash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `fk_event_1` (`eventsId`),
  CONSTRAINT `fk_event_1` FOREIGN KEY (`eventsId`) REFERENCES `events` (`id`),
  CONSTRAINT `events_log_details_chk_1` CHECK (json_valid(`data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_log_details`
--

LOCK TABLES `events_log_details` WRITE;
/*!40000 ALTER TABLE `events_log_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `events_log_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `roleName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint NOT NULL,
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','Tenant Admin',1,'2023-03-02 09:09:08'),(2,'SuperAdmin','Super Admin',0,'2023-03-02 09:09:11'),(3,'User','User',1,'2023-03-02 09:09:13');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smart_contracts`
--

DROP TABLE IF EXISTS `smart_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `smart_contracts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contractName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `abi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `deployerId` bigint NOT NULL,
  `tenantId` bigint NOT NULL,
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedTimestamp` timestamp NULL DEFAULT NULL,
  `isDeleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_deployers` (`deployerId`),
  KEY `fk_tenants_1` (`tenantId`),
  CONSTRAINT `fk_deployers` FOREIGN KEY (`deployerId`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_tenants_1` FOREIGN KEY (`tenantId`) REFERENCES `tenant` (`id`),
  CONSTRAINT `smart_contracts_chk_1` CHECK (json_valid(`abi`))
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smart_contracts`
--

LOCK TABLES `smart_contracts` WRITE;
/*!40000 ALTER TABLE `smart_contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `smart_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant`
--

DROP TABLE IF EXISTS `tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdTimestamp` datetime(6) DEFAULT NULL,
  `imageURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tenantName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updatedTimestamp` datetime(6) DEFAULT NULL,
  `createdBy` bigint DEFAULT NULL,
  `updatedBy` bigint DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `domainName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_2` (`updatedBy`),
  KEY `fk_users_3` (`createdBy`),
  CONSTRAINT `fk_users_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_users_3` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant`
--

LOCK TABLES `tenant` WRITE;
/*!40000 ALTER TABLE `tenant` DISABLE KEYS */;
INSERT INTO `tenant` VALUES (1,NULL,NULL,'Sakha Global',NULL,NULL,NULL,1,'sakhaglobal');
/*!40000 ALTER TABLE `tenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `emailId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mobileNumber` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `passwordSalt` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isVerified` tinyint NOT NULL DEFAULT '1',
  `roleId` bigint NOT NULL,
  `tenantId` bigint NOT NULL,
  `loginTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_roles` (`roleId`),
  CONSTRAINT `fk_roles` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','A','admin@sakhaglobal.com','2023031601',NULL,'$2a$10$96kJN08ZKYC1vYsIcH0zIOmtDGwvUyXKMmZrXnbYOb4RiIu2fBiYK','2023-03-16 06:00:54',1,1,1,'2023-03-16 06:01:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-20 13:26:37


-- POST Finalizing the DB Design
ALTER TABLE `blockchain_audit_trail`.`tenant` 
CHANGE COLUMN `createdTimestamp` `createdTimestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `updatedTimestamp` `updatedTimestamp` TIMESTAMP NULL DEFAULT NULL ;

ALTER TABLE `blockchain_audit_trail`.`tenant` 
ADD UNIQUE INDEX `domainName_UNIQUE` (`domainName` ASC) VISIBLE;


