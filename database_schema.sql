-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Počítač: localhost
-- Vytvořeno: Čtv 22. led 2026, 11:02
-- Verze serveru: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- Verze PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `pospislu20_1`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` mediumtext DEFAULT NULL,
  `image_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int(11) NOT NULL,
  `rating` float DEFAULT 2.5,
  `removed` tinyint(3) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `description`, `image_name`, `price`, `category_id`, `rating`, `removed`) VALUES
(1, 'Pánské tričko Basic', 'Jednoduché bavlněné tričko pro každodenní nošení.', '1d0877fbfab4d58dbbfe58bf5a54207a', 399.00, 1, 4.2, 0),
(2, 'Dámské tričko Classic', 'Stylové tričko s pohodlným střihem.', '4fb99ce8ab6f6483c176eb30fb627a9c', 449.00, 1, 4.4, 0),
(3, 'Mikina s kapucí', 'Teplá mikina ideální na chladnější dny.', '5bd6e815c7daf654e118cc82f80be80a', 899.00, 1, 4.6, 0),
(4, 'Lehká jarní bunda', 'Přechodová bunda vhodná na jaro.', '5f06db0dd6a8067338fbfa3fa6ae6676', 1299.00, 1, 4.3, 0),
(5, 'Elegantní kabát', 'Stylový kabát do města.', '80ba153dab6f568579fbda44d7bf7b78', 2499.00, 1, 4.7, 0),
(6, 'Sportovní boty', 'Pohodlné boty pro každodenní pohyb.', '83aa1734a1a1303d2b0f1153baabd259', 1599.00, 2, 4.5, 0),
(7, 'Kožené boty', 'Formální kožená obuv.', '5763bba08e0142329fe8fcfe7d389590', 2199.00, 2, 4.6, 0),
(8, 'Letní sandály', 'Vzdušné sandály na léto.', '338797d618ac97d97bb693e48cb3af9e', 899.00, 2, 4.1, 0),
(9, 'Tenisky Street', 'Moderní městské tenisky.', '5114511630033b851b078ce496979c92', 1399.00, 2, 4.4, 0),
(10, 'Běžecké boty', 'Lehké boty na běhání.', 'shoes-2538424_1280', 1799.00, 2, 4.8, 0),
(11, 'Kožený pásek', 'Kvalitní kožený opasek.', 'accessory-3002608_1280', 499.00, 3, 4.3, 0),
(12, 'Dámská kabelka', 'Elegantní kabelka na každodenní použití.', 'handbag-1478814_1280', 1299.00, 3, 4.6, 0),
(13, 'Stylový batoh', 'Batoh vhodný do města i školy.', 'fashion-1283863_1280', 999.00, 3, 4.5, 0),
(14, 'Zimní čepice', 'Teplá čepice na zimu.', 'pexels-pixabay-157675', 299.00, 3, 4.2, 0),
(15, 'Sluneční brýle', 'Moderní sluneční brýle s UV filtrem.', 'spring-wardrobe-switch-still-life', 699.00, 3, 4.4, 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `product_categories`
--

CREATE TABLE `product_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

--
-- Vypisuji data pro tabulku `product_categories`
--

INSERT INTO `product_categories` (`category_id`, `category_name`) VALUES
(3, 'Doplňky'),
(1, 'Oblečení'),
(2, 'Obuv');

-- --------------------------------------------------------

--
-- Struktura tabulky `sales`
--

CREATE TABLE `sales` (
  `sale_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `sale_date` timestamp NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `sale_status` int(11) NOT NULL,
  `stripe_session_id` varchar(255) DEFAULT NULL,
  `stripe_payment_intent` varchar(255) DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `sale_details`
--

CREATE TABLE `sale_details` (
  `sale_detail_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `sale_status`
--

CREATE TABLE `sale_status` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `user_role` int(11) NOT NULL DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `user_roles`
--

CREATE TABLE `user_roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`) USING BTREE,
  ADD UNIQUE KEY `product_name` (`product_name`) USING BTREE,
  ADD KEY `category_id` (`category_id`) USING BTREE;

--
-- Indexy pro tabulku `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`category_id`) USING BTREE,
  ADD UNIQUE KEY `category_name` (`category_name`) USING BTREE;

--
-- Indexy pro tabulku `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `sale_status` (`sale_status`) USING BTREE;

--
-- Indexy pro tabulku `sale_details`
--
ALTER TABLE `sale_details`
  ADD PRIMARY KEY (`sale_detail_id`) USING BTREE,
  ADD KEY `sale_id` (`sale_id`) USING BTREE,
  ADD KEY `product_id` (`product_id`) USING BTREE;

--
-- Indexy pro tabulku `sale_status`
--
ALTER TABLE `sale_status`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `status` (`status`) USING BTREE;

--
-- Indexy pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`) USING BTREE,
  ADD KEY `FK_UserRole` (`user_role`) USING BTREE;

--
-- Indexy pro tabulku `user_roles`
--
ALTER TABLE `user_roles`
  ADD UNIQUE KEY `role_id` (`role_id`) USING BTREE,
  ADD UNIQUE KEY `role_name` (`role_name`) USING BTREE;

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pro tabulku `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pro tabulku `sales`
--
ALTER TABLE `sales`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `sale_details`
--
ALTER TABLE `sale_details`
  MODIFY `sale_detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `sale_status`
--
ALTER TABLE `sale_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pro tabulku `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`);

--
-- Omezení pro tabulku `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`sale_status`) REFERENCES `sale_status` (`id`);

--
-- Omezení pro tabulku `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  ADD CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Omezení pro tabulku `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_UserRole` FOREIGN KEY (`user_role`) REFERENCES `user_roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
