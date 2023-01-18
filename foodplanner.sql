-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 12. Dez 2022 um 00:56
-- Server-Version: 10.4.25-MariaDB
-- PHP-Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `foodplanner`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `day`
--

CREATE TABLE `day` (
  `id` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `file`
--

CREATE TABLE `file` (
  `id` int(11) NOT NULL,
  `filename` longtext NOT NULL,
  `directory` longtext NOT NULL,
  `public` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ingredient`
--

CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `storage_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `quantity_value` varchar(64) DEFAULT NULL,
  `quantity_unit` varchar(64) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `checked` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `instruction`
--

CREATE TABLE `instruction` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `instruction` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `meal`
--

CREATE TABLE `meal` (
  `id` int(11) NOT NULL,
  `meal_category_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `user_group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `meal_category`
--

CREATE TABLE `meal_category` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `standard` tinyint(1) NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `meal_category`
--

INSERT INTO `meal_category` (`id`, `name`, `standard`, `icon`) VALUES
(1, 'Morgens', 0, 'bakery_dining'),
(2, 'Mittags', 1, 'fastfood'),
(3, 'Abends', 0, 'ramen_dining');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `recipe`
--

CREATE TABLE `recipe` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `portion_size` int(11) NOT NULL,
  `image_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `refresh_data_timestamp`
--

CREATE TABLE `refresh_data_timestamp` (
  `id` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `refresh_data_timestamp`
--

INSERT INTO `refresh_data_timestamp` (`id`, `timestamp`) VALUES 
(1, '0');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `show_pantry` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `storage`
--

CREATE TABLE `storage` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `storage`
--

INSERT INTO `storage` (`id`, `name`) VALUES
(1, 'pantry'),
(2, 'shoppinglist');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_group`
--

CREATE TABLE `user_group` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `standard` tinyint(1) DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_group_user`
--

CREATE TABLE `user_group_user` (
  `user_group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `day`
--
ALTER TABLE `day`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6BAF787059D8A214` (`recipe_id`),
  ADD KEY `IDX_6BAF78705CC5DB90` (`storage_id`);

--
-- Indizes für die Tabelle `instruction`
--
ALTER TABLE `instruction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7BBAE15659D8A214` (`recipe_id`);

--
-- Indizes für die Tabelle `meal`
--
ALTER TABLE `meal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9EF68E9C1FBC9B6A` (`meal_category_id`),
  ADD KEY `IDX_9EF68E9C59D8A214` (`recipe_id`),
  ADD KEY `IDX_9EF68E9C9C24126` (`day_id`),
  ADD KEY `IDX_9EF68E9C1ED93D47` (`user_group_id`);

--
-- Indizes für die Tabelle `meal_category`
--
ALTER TABLE `meal_category`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DA88B1373DA5256D` (`image_id`);

--
-- Indizes für die Tabelle `refresh_data_timestamp`
--
ALTER TABLE `refresh_data_timestamp`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_E545A0C5A76ED395` (`user_id`);

--
-- Indizes für die Tabelle `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`);

--
-- Indizes für die Tabelle `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_group_user`
--
ALTER TABLE `user_group_user`
  ADD PRIMARY KEY (`user_group_id`,`user_id`),
  ADD KEY `IDX_3AE4BD51ED93D47` (`user_group_id`),
  ADD KEY `IDX_3AE4BD5A76ED395` (`user_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `day`
--
ALTER TABLE `day`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `file`
--
ALTER TABLE `file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `instruction`
--
ALTER TABLE `instruction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `meal`
--
ALTER TABLE `meal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `meal_category`
--
ALTER TABLE `meal_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `recipe`
--
ALTER TABLE `recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `refresh_data_timestamp`
--
ALTER TABLE `refresh_data_timestamp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `storage`
--
ALTER TABLE `storage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `user_group`
--
ALTER TABLE `user_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `ingredient`
--
ALTER TABLE `ingredient`
  ADD CONSTRAINT `FK_6BAF787059D8A214` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`),
  ADD CONSTRAINT `FK_6BAF78705CC5DB90` FOREIGN KEY (`storage_id`) REFERENCES `storage` (`id`);

--
-- Constraints der Tabelle `instruction`
--
ALTER TABLE `instruction`
  ADD CONSTRAINT `FK_7BBAE15659D8A214` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`);

--
-- Constraints der Tabelle `meal`
--
ALTER TABLE `meal`
  ADD CONSTRAINT `FK_9EF68E9C1ED93D47` FOREIGN KEY (`user_group_id`) REFERENCES `user_group` (`id`),
  ADD CONSTRAINT `FK_9EF68E9C1FBC9B6A` FOREIGN KEY (`meal_category_id`) REFERENCES `meal_category` (`id`),
  ADD CONSTRAINT `FK_9EF68E9C59D8A214` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`),
  ADD CONSTRAINT `FK_9EF68E9C9C24126` FOREIGN KEY (`day_id`) REFERENCES `day` (`id`);

--
-- Constraints der Tabelle `recipe`
--
ALTER TABLE `recipe`
  ADD CONSTRAINT `FK_DA88B1373DA5256D` FOREIGN KEY (`image_id`) REFERENCES `file` (`id`);

--
-- Constraints der Tabelle `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FK_E545A0C5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `user_group_user`
--
ALTER TABLE `user_group_user`
  ADD CONSTRAINT `FK_3AE4BD51ED93D47` FOREIGN KEY (`user_group_id`) REFERENCES `user_group` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_3AE4BD5A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
