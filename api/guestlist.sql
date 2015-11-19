-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 07, 2015 at 02:48 PM
-- Server version: 5.5.45-cll-lve
-- PHP Version: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nerdiieq_WNM369`
--

-- --------------------------------------------------------

--
-- Table structure for table `guestlist`
--

CREATE TABLE IF NOT EXISTS `guestlist` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `guestName` varchar(124) NOT NULL,
  `streetAddress` varchar(256) NOT NULL,
  `city` varchar(60) NOT NULL,
  `state` varchar(60) DEFAULT NULL,
  `country` varchar(60) DEFAULT NULL,
  `peopleInvited` int(10) NOT NULL DEFAULT '1',
  `thumbnail` varchar(256) NOT NULL,
  `invitationStatus` tinyint(1) DEFAULT NULL,
  `numOfPeopleComing` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `guestlist`
--

INSERT INTO `guestlist` (`id`, `guestName`, `streetAddress`, `city`, `state`, `country`, `peopleInvited`, `thumbnail`, `invitationStatus`, `numOfPeopleComing`) VALUES
(1, 'Steve Wilson', '155 Mission St', 'San Francisco', 'CA', 'USA', 1, '', 2, 2),
(2, 'Brittney Staropoli', '523 Laguna St', 'San Francisco', 'CA', 'USA', 1, '', 1, 2),
(3, 'Laura Kendras', '84 Ocean St', 'Oakland', 'CA', 'USA', 1, '', 0, 0),
(4, 'Marta Lopez', '55 California Dr', 'Berkeley', 'CA', 'USA', 1, '', 1, 1),
(5, 'Ryan Horvath', '923 Benton Dr', 'Oakland', 'CA', 'USA', 1, '', 0, 0),
(6, 'Joni Mitchell', '11 Penn Ave', 'San Francisco', 'CA', 'USA', 1, '', 1, 2),
(7, 'John Wilgore', '45 Duncle St', 'Concord', 'CA', 'USA', 1, '', 1, 1),
(8, 'Lena Kelly', '663 Russia St', 'Oakland', 'CA', 'USA', 1, '', 1, 3),
(9, 'Fred Casely', '12 Montgomery St', 'San Francisco', 'CA', 'USA', 1, '', 1, 2),
(10, 'Daniel Tosh', '1945 Market St', 'San Francico', 'CA', 'USA', 1, '', 0, 0),
(11, 'Amy Shumer', '4626 Bercloak Blvd', 'Daly City', 'CA', 'USA', 1, '', 1, 4),
(12, 'Emily Darnle', '43 Oak St', 'Daly City', 'CA', 'USA', 1, '', 0, 0),
(13, 'Nicole Burns', '7524 White Court Pl', 'Atlanta', 'GA', 'USA', 1, '', 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
