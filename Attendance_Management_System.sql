-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 03, 2026 at 10:52 AM
-- Server version: 8.0.46-0ubuntu0.22.04.4
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Attendance_Management_System`
--

-- --------------------------------------------------------

CREATE DATABASE Attendance_Management_System;

use Attendance_Management_System;

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int NOT NULL,
  `Roll_No` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `class_group` set('I A','I B','I C','II A','II B','II C','III A','III B','III C','IV A','IV B','IV C','V A','V B','V C','VI A','VI B','VI C','VII A','VII B','VII C','VIII A','VIII B','VIII C','IX A','IX B','IX C','X A','X B','X C') NOT NULL,
  `take_attendance` enum('CHECK IN','CHECK OUT') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(25) DEFAULT 'ADMIN',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(25) DEFAULT 'ADMIN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;
ALTER TABLE student add COLUMN reg_no INT NOT NULL;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



insert into student (reg_no, Roll_No, name, class_group, take_attendance) values
(1001, 1, 'John Doe', 'I A'),
(1002, 2, 'Jane Smith', 'I B'),
(1003, 3, 'Michael Johnson', 'II A'),
(1004, 4, 'Emily Davis', 'II B'),
(1005, 5, 'William Brown', 'III A'),
(1006, 6, 'Olivia Wilson', 'III B'),
(1007, 7, 'James Taylor', 'IV A'),
(1008, 8, 'Sophia Anderson', 'IV B'),
(1009, 9, 'Benjamin Thomas', 'V A'),
(1010, 10, 'Ava Jackson', 'V B');



create table attendance(id INT PRIMARY KEY AUTO_INCREMENT,student_id int, status varchar(25),`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(25) DEFAULT 'ADMIN',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(25) DEFAULT 'ADMIN')