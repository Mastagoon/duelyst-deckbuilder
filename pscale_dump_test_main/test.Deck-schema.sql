CREATE TABLE `Deck` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deckName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'New Deck',
  `generalId` int NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minionCount` int NOT NULL,
  `artifactCount` int NOT NULL,
  `spellCount` int NOT NULL,
  `faction` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
