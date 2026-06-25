# ************************************************************
# Optimized Steakhouse DB Dump
# Compatible with MySQL 5.7+ / 8.0+ / MariaDB (XAMPP)
# ************************************************************

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

# ------------------------------------------------------------
# Table: menu
# ------------------------------------------------------------
DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(150) NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `prezzo` DECIMAL(6,2) UNSIGNED NOT NULL,
  `foto` VARCHAR(255) DEFAULT NULL,
  `disponibile` TINYINT(1) NOT NULL DEFAULT 1,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_menu_categoria` (`categoria`),
  INDEX `idx_menu_disponibile` (`disponibile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `menu` WRITE;
INSERT INTO `menu` (`id`, `nome`, `categoria`, `prezzo`, `foto`, `disponibile`, `deleted_at`)
VALUES
	(1, 'Fiorentina di Black Angus', 'I Nostri Tagli', 45.00, NULL, 1, NULL),
	(2, 'Filetto al Pepe Verde', 'I Nostri Tagli', 28.50, NULL, 1, '2026-06-22 10:53:39');
UNLOCK TABLES;


# ------------------------------------------------------------
# Table: ordini
# ------------------------------------------------------------
DROP TABLE IF EXISTS `ordini`;

CREATE TABLE `ordini` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome_cliente` VARCHAR(150) NOT NULL,
  `indirizzo` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `dettaglio_ordine` TEXT NOT NULL,
  `totale` DECIMAL(8,2) UNSIGNED NOT NULL,
  `note` TEXT DEFAULT NULL,
  `data_creazione` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ordini_data` (`data_creazione`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `ordini` WRITE;
INSERT INTO `ordini` (`id`, `nome_cliente`, `indirizzo`, `telefono`, `dettaglio_ordine`, `totale`, `note`, `data_creazione`)
VALUES
	(1, 'mario', 'via bla bla 1', '123456789', 'Toma-Bone (1.2kg), Ribeye Wagyu A5, Amarone Valpolicella', 273.00, NULL, '2026-06-21 11:58:14'),
	(2, 'ciao', 'via okok', '8723647389216', 'Filetto al Tartufo (€45)', 48.00, NULL, '2026-06-21 13:11:19');
UNLOCK TABLES;


# ------------------------------------------------------------
# Table: prenotazioni
# ------------------------------------------------------------
DROP TABLE IF EXISTS `prenotazioni`;

CREATE TABLE `prenotazioni` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `data_prenotazione` DATE NOT NULL,
  `ora_prenotazione` TIME NOT NULL, -- Ottimizzato da VARCHAR a TIME
  `ospiti` TINYINT UNSIGNED NOT NULL, -- Ottimizzato da INT a TINYINT
  `note` TEXT DEFAULT NULL,
  `data_creazione` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_prenotazione_data_ora` (`data_prenotazione`, `ora_prenotazione`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `prenotazioni` WRITE;
INSERT INTO `prenotazioni` (`id`, `nome`, `email`, `telefono`, `data_prenotazione`, `ora_prenotazione`, `ospiti`, `note`, `data_creazione`, `deleted_at`)
VALUES
	(1, 'Mario', 'weavwe@qwef.com', '1234567890', '2026-06-30', '19:30:00', 4, '', '2026-06-21 11:44:47', NULL);
UNLOCK TABLES;


# ------------------------------------------------------------
# Table: richieste_cedolini
# ------------------------------------------------------------
DROP TABLE IF EXISTS `richieste_cedolini`;

CREATE TABLE `richieste_cedolini` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dipendente` VARCHAR(150) NOT NULL,
  `periodo` VARCHAR(30) NOT NULL,
  `data_emissione` DATE NOT NULL,
  `netto` DECIMAL(7,2) UNSIGNED NOT NULL,
  `file_path` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- <-- CORRETTO QUI
  PRIMARY KEY (`id`),
  INDEX `idx_cedolini_dipendente` (`dipendente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `richieste_cedolini` WRITE;
INSERT INTO `richieste_cedolini` (`id`, `dipendente`, `periodo`, `data_emissione`, `netto`, `file_path`, `created_at`, `deleted_at`)
VALUES
	(1, 'Marco Rossi', 'Maggio 2026', '2026-06-05', 1650.50, 'uploads/cedolini/rossi_maggio_2026.pdf', '2026-06-22 11:31:56', NULL),
	(2, 'Alessandro Bianchi', 'Maggio 2026', '2026-06-05', 1820.00, 'uploads/cedolini/bianchi_maggio_2026.pdf', '2026-06-22 11:31:56', NULL),
	(3, 'Giulia Verona', 'Maggio 2026', '2026-06-05', 1450.00, 'uploads/cedolini/verona_maggio_2026.pdf', '2026-06-22 11:31:56', NULL),
	(4, 'Luca Moretti', 'Aprile 2026', '2026-05-05', 1580.00, 'uploads/cedolini/moretti_aprile_2026.pdf', '2026-06-22 11:31:56', '2026-06-22 11:59:34'),
	(5, 'Dipendente Licenziato', 'Gennaio 2026', '2026-02-05', 1200.00, 'uploads/cedolini/vecchio_file.pdf', '2026-06-22 11:31:56', NULL);
UNLOCK TABLES;


# ------------------------------------------------------------
# Table: richieste_ferie
# ------------------------------------------------------------
DROP TABLE IF EXISTS `richieste_ferie`;

CREATE TABLE `richieste_ferie` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dipendente` VARCHAR(150) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `data_inizio` DATE NOT NULL,
  `data_fine` DATE NOT NULL,
  `note` TEXT DEFAULT NULL,
  `stato` ENUM('in_attesa', 'approvato', 'rifiutato') NOT NULL DEFAULT 'in_attesa',
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- <-- CORRETTO QUI
  PRIMARY KEY (`id`),
  INDEX `idx_ferie_dipendente` (`dipendente`),
  INDEX `idx_ferie_stato` (`stato`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `richieste_ferie` WRITE;
INSERT INTO `richieste_ferie` (`id`, `dipendente`, `tipo`, `data_inizio`, `data_fine`, `note`, `stato`, `updated_at`, `created_at`, `deleted_at`)
VALUES
	(1, 'Marco Rossi', 'Ferie', '2026-07-10', '2026-07-17', 'Vacanze estive con la famiglia', 'in_attesa', NULL, '2026-06-22 12:01:35', NULL),
	(2, 'Giulia Verona', 'Permesso', '2026-06-25', '2026-06-25', 'Visita medica specialistica mattina', 'in_attesa', NULL, '2026-06-22 12:01:35', NULL),
	(3, 'Alessandro Bianchi', 'Ferie', '2026-08-01', '2026-08-15', 'Ferie ad agosto concordate col secondo chef', 'approvato', '2026-06-22 12:13:14', '2026-06-22 12:01:35', NULL),
	(4, 'Luca Moretti', 'Permesso', '2026-06-12', '2026-06-12', 'Rinnovamento patente di guida', 'rifiutato', NULL, '2026-06-22 12:01:35', NULL),
	(5, 'Francesco Neri', 'Ferie', '2026-09-01', '2026-09-07', 'Richiesta inserita per errore', 'in_attesa', NULL, '2026-06-22 12:01:35', '2026-06-22 09:30:00');
UNLOCK TABLES;


# ------------------------------------------------------------
# Table: richieste_malattia
# ------------------------------------------------------------
CREATE TABLE `richieste_malattia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dipendente` VARCHAR(150) NOT NULL,
  `codice_inps` VARCHAR(50) NOT NULL,
  `data_inizio` DATE NOT NULL,
  `data_fine` DATE NOT NULL,
  `stato` ENUM('in_attesa', 'approvato', 'rifiutato') NOT NULL DEFAULT 'in_attesa',
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- <-- CORRETTO QUI
  PRIMARY KEY (`id`),
  INDEX `idx_malattia_dipendente` (`dipendente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `richieste_malattia` WRITE;
INSERT INTO `richieste_malattia` (`id`, `dipendente`, `codice_inps`, `data_inizio`, `data_fine`, `stato`, `updated_at`, `created_at`, `deleted_at`)
VALUES
	(1, 'Luca Moretti', 'INPS2026MAL88319X', '2026-06-20', '2026-06-24', 'rifiutato', '2026-06-22 12:16:07', '2026-06-22 12:14:06', NULL),
	(2, 'Alessandro Bianchi', 'INPS2026MAL44102A', '2026-05-10', '2026-05-14', 'rifiutato', '2026-06-22 12:18:15', '2026-06-22 12:14:06', NULL),
	(3, 'Marco Rossi', 'INPS2026MAL11029B', '2026-04-02', '2026-04-05', 'rifiutato', '2026-06-22 12:17:15', '2026-06-22 12:14:06', NULL),
	(4, 'Giulia Verona', 'ERR404INPS', '2026-05-20', '2026-05-22', 'in_attesa', '2026-06-22 12:18:54', '2026-06-22 12:14:06', '2026-05-23 14:00:00'),
	(5, 'Luca Moretti', 'INPS2026MAL88319X', '2026-06-20', '2026-06-24', 'in_attesa', NULL, '2026-06-22 12:18:42', NULL),
	(6, 'Alessandro Bianchi', 'INPS2026MAL44102A', '2026-05-10', '2026-05-14', 'approvato', NULL, '2026-06-22 12:18:42', NULL),
	(7, 'Marco Rossi', 'INPS2026MAL11029B', '2026-04-02', '2026-04-05', 'approvato', NULL, '2026-06-22 12:18:42', NULL),
	(8, 'Giulia Verona', 'ERR404INPS', '2026-05-20', '2026-05-22', 'rifiutato', NULL, '2026-06-22 12:18:42', '2026-05-23 14:00:00');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS = 1;
