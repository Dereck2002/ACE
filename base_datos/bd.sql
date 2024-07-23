-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-07-2024 a las 16:58:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `appemp`
--
CREATE DATABASE IF NOT EXISTS `appemp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `appemp`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
CREATE TABLE `ciudades` (
  `cod_ciudad` int(11) NOT NULL,
  `nombre_ciudad` varchar(55) NOT NULL,
  `cod_ciudad_provincia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `ciudades`:
--   `cod_ciudad_provincia`
--       `provincias` -> `cod_provincia`
--

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`cod_ciudad`, `nombre_ciudad`, `cod_ciudad_provincia`) VALUES
(1, 'Guayaquil', 10),
(2, 'Quito', 19),
(3, 'Cuenca', 1),
(4, 'Santo Domingo', 21),
(5, 'Durán', 10),
(6, 'Machala', 7),
(7, 'Manta', 14),
(8, 'Portoviejo', 14),
(9, 'Loja', 12),
(10, 'Quevedo', 13),
(11, 'Ambato', 23),
(12, 'Riobamba', 5),
(13, 'Daule', 10),
(14, 'Milagro', 10),
(15, 'Ibarra', 11),
(16, 'Esmeraldas', 8),
(17, 'La Libertad', 20),
(18, 'Babahoyo', 13),
(19, 'Sangolquí', 19),
(20, 'Latacunga', 6),
(21, 'Samborondón', 10),
(22, 'Montecristi', 14),
(23, 'Pasaje', 7),
(24, 'Santa Rosa', 7),
(25, 'Tulcán', 4),
(26, 'Huaquillas', 7),
(27, 'Nueva Loja', 22),
(28, 'Chone', 14),
(29, 'Santa Elena', 20),
(30, 'El Carmen', 14),
(31, 'El Coca', 17),
(32, 'General Villamil', 10),
(33, 'Buena Fe', 13),
(34, 'Jipijapa', 14),
(35, 'Cayambe', 19),
(36, 'Velasco Ibarra', 10),
(37, 'Otavalo', 11),
(38, 'Ventanas', 13),
(39, 'El Triunfo', 10),
(40, 'La Troncal', 3),
(41, 'Naranjal', 10),
(42, 'Azogues', 3),
(43, 'La Concordia', 21),
(44, 'Salinas', 20),
(45, 'Vinces', 13),
(46, 'Naranjito', 10),
(47, 'Puyo', 15),
(48, 'Balzar', 10),
(49, 'La Maná', 6),
(50, 'Rosa Zárate', 8),
(51, 'Guaranda', 2),
(52, 'Tena', 16),
(53, 'San Lorenzo', 8),
(54, 'Jaramijó', 14),
(55, 'Pedernales', 14),
(56, 'Catamayo', 12),
(57, 'El Guabo', 7),
(58, 'Atuntaqui', 11),
(59, 'Pedro Carbo', 10),
(60, 'Machachi', 19),
(61, 'Valencia', 13),
(62, 'Yaguachi', 10),
(63, 'Macas', 15),
(64, 'Bahía de Caráquez', 14),
(65, 'Arenillas', 7),
(66, 'Calceta', 14),
(67, 'Atacames', 8),
(68, 'Piñas', 7),
(69, 'Zamora', 24),
(70, 'San Miguel de Salcedo', 6),
(71, 'Lomas de Sargentillo', 10),
(72, 'Shushufindi', 22),
(73, 'Montalvo', 13),
(74, 'Pujilí', 6),
(75, 'La Joya de los Sachas', 17),
(76, 'San Gabriel', 3),
(77, 'Baños de Agua Santa', 23),
(78, 'Gualaceo', 1),
(79, 'Salitre', 10),
(80, 'Yantzaza', 24),
(81, 'Cariamanga', 12),
(82, 'Cañar', 3),
(83, 'Tabacundo', 19),
(84, 'Balao', 10),
(85, 'Puerto Ayora', 9),
(86, 'Puerto López', 14),
(87, 'Macará', 12),
(88, 'Santa Ana', 14),
(89, 'Rocafuerte', 14),
(90, 'Cumandá', 5),
(91, 'Pelileo', 23),
(92, 'Tosagua', 14),
(93, 'Santa Lucía', 10),
(94, 'Sucúa', 15),
(95, 'Cotacachi', 11),
(96, 'San Vicente', 14),
(97, 'Palestina', 10),
(98, 'Camilo Ponce Enríquez', 1),
(99, 'Narcisa de Jesús', 10),
(100, 'Zaruma', 7),
(101, 'Saquisilí', 6),
(102, 'Píllaro', 23),
(103, 'Portovelo', 7),
(104, 'Puebloviejo', 13),
(105, 'Mocache', 13),
(106, 'Gualaquiza', 15),
(107, 'Guano', 5),
(108, 'San Miguel', 2),
(109, 'Paute', 1),
(110, 'Simón Bolívar', 7),
(111, 'Flavio Alfaro', 14),
(112, 'Isidro Ayora', 10),
(113, 'Caluma', 2),
(114, 'Catacocha', 12),
(115, 'Coronel Marcelino Maridueña', 10),
(116, 'Paján', 14),
(117, 'Colimes', 10),
(118, 'Archidona', 16),
(119, 'Junín', 14),
(120, 'Puerto Baquerizo Moreno', 9),
(121, 'Palenque', 13),
(122, 'Catarama', 13),
(123, 'Pedro Vicente Maldonado', 19),
(124, 'Echeandía', 3),
(125, 'Baba', 13),
(126, 'Bucay', 10),
(127, 'Sucre', 14),
(128, 'Santa Isabel', 1),
(129, 'Quinsaloma', 13),
(130, 'Alausí', 5),
(131, 'Jujan', 10),
(132, 'Alamor', 12),
(133, 'Pimampiro', 11),
(134, 'Palora', 15),
(135, 'Biblián', 3),
(136, 'Muisne', 8),
(137, 'Chambo', 5),
(138, 'San Miguel de Los Bancos', 19),
(139, 'Loreto', 17),
(140, 'El Pangui', 24),
(141, 'Jama', 14),
(142, 'El Tambo', 3),
(143, 'El Ángel', 4),
(144, 'Marcabelí', 7),
(145, 'Valdez', 8),
(146, 'Saraguro', 12),
(147, 'Balsas', 7),
(148, 'Huaca', 4),
(149, 'Celica', 12),
(150, 'Urcuquí', 11),
(151, 'Chordeleg', 1),
(152, 'Pichincha', 14),
(153, 'Chimbo', 2),
(154, 'El Chaco', 16),
(155, 'Girón', 1),
(156, 'Pallatanga', 5),
(157, 'Zumba', 24),
(158, 'Sígsig', 1),
(159, 'Rioverde', 20),
(160, 'Guachapala', 1),
(161, 'Arajuno', 15),
(162, 'San Cristóbal', 9),
(163, 'Santa Clara', 14),
(164, 'La Mana', 6),
(165, 'Paquisha', 24),
(166, 'Huamboya', 24),
(167, 'Huachi Chico', 19),
(168, 'Puerto Bolívar', 8),
(169, 'Puerto Quito', 19),
(170, 'Olmedo', 14),
(171, 'La Victoria', 14),
(172, 'Santa Cruz', 20),
(173, 'Palora', 15),
(174, 'Cumbayá', 19),
(175, 'Santa Rosa de Puerto Viejo', 6),
(176, 'Gonzalo Pizarro', 24),
(177, 'San Jacinto de Yaguachi', 10),
(178, 'Borbón', 14),
(179, 'El Empalme', 10),
(180, 'Pajan', 14),
(181, 'Pallatanga', 5),
(182, 'Puerto Villamil', 3),
(183, 'San Miguel de Urcuquí', 11),
(184, 'Alfredo Baquerizo Moreno', 20),
(185, 'Puerto Bolívar', 8),
(186, 'Puerto Ayacucho', 14),
(187, 'Cotundo', 17),
(188, 'Sígsig', 1),
(189, 'Sevilla de Oro', 3),
(190, 'Cuyabeno', 22),
(191, 'Papallacta', 19),
(192, 'Carlos Julio Arosemena Tola', 20),
(193, 'San Francisco de las Pampas', 10),
(194, 'Puerto Misahuallí', 16),
(195, 'Sevilla', 3),
(196, 'Tumbabiro', 11),
(197, 'Guamote', 5),
(198, 'Santa María', 14),
(199, 'Santa Rosa de Sucumbíos', 22),
(200, 'San Juan Bosco', 15),
(201, 'Pintag', 19),
(202, 'Quinindé', 14),
(203, 'Pimocha', 10),
(204, 'Pangua', 6),
(205, 'Cascales', 22),
(206, 'San Pedro de Huaca', 4),
(207, 'Palora', 15),
(208, 'Santiago de Méndez', 15),
(209, 'San Rafael', 10),
(210, 'Santa Clara', 14),
(211, 'Pedro Moncayo', 19),
(212, 'Quilanga', 12),
(213, 'Píllaro', 23),
(214, 'Puerto El Carmen del Putumayo', 22),
(215, 'Lumbaquí', 8),
(216, 'Calvas', 12),
(217, 'Santa María de Cayambe', 19),
(218, 'Morona', 15),
(219, 'Puerto López', 14),
(220, 'Mocha', 19),
(221, 'Cotundo', 17),
(222, 'Pucará', 14),
(223, 'El Páramo', 10),
(224, 'Paltas', 12),
(225, 'Pucará', 14),
(226, 'Olón', 20),
(227, 'Puerto Quito', 19),
(228, 'Loreto', 17),
(229, 'Santa Clara', 14),
(230, 'Palenque', 13),
(231, 'Morona', 15),
(232, 'La Joya de los Sachas', 17),
(233, 'Santiago de Méndez', 15),
(234, 'Nayón', 19),
(235, 'Puerto El Carmen del Putumayo', 22),
(236, 'Santiago', 3),
(237, 'Puerto Misahuallí', 16),
(238, 'La Mana', 6),
(239, 'Cuyabeno', 22),
(240, 'San Miguel de Urcuquí', 11),
(241, 'La Concordia', 21),
(242, 'Aguarico', 17),
(243, 'Huamboya', 24),
(244, 'Paquisha', 24),
(245, 'Santiago', 3),
(246, 'Palenque', 13),
(247, 'Arajuno', 15),
(248, 'San Juan Bosco', 15),
(249, 'Puerto Ayora', 9),
(250, 'Santa Rosa de Sucumbíos', 22),
(251, 'San Vicente', 14),
(252, 'Carlos Julio Arosemena Tola', 20),
(253, 'Santa Clara', 14),
(254, 'Puerto Villamil', 3),
(255, 'Puerto Bolívar', 8),
(256, 'Santa Rosa de Puerto Viejo', 6),
(257, 'Santa Rosa de las Canteras', 10),
(258, 'Santiago de Méndez', 15),
(259, 'La Troncal', 3),
(260, 'Puerto Francisco de Orellana', 17),
(261, 'Puerto Bolívar', 8),
(262, 'Borja', 16),
(263, 'San Lorenzo de Río Coca', 17),
(264, 'Puerto Francisco de Orellana', 17),
(265, 'Puerto Misahuallí', 16),
(266, 'Puerto Francisco de Orellana', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contrasenia_reset`
--

DROP TABLE IF EXISTS `contrasenia_reset`;
CREATE TABLE `contrasenia_reset` (
  `correo_persona` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `contrasenia_reset`:
--

--
-- Volcado de datos para la tabla `contrasenia_reset`
--

INSERT INTO `contrasenia_reset` (`correo_persona`, `token`, `created_at`) VALUES
('steevenflores2019@gmail.com', '03466b364c45f7ed777f4fc5e471bae48c18e800b1508629f959fb3980b9f6178bad2efd83a942888559719b0f4fbaf4018b', '2024-06-01 00:26:42'),
('andrescarlos988@gmail.com', '5b8da529b09f34f4bbc08668957e9db77504c8731af2c0dc712853af9d17e0ac890ebd87ed5034043b37e099dba745369cdd', '2024-06-05 13:57:49'),
('guillojj80@gmail.com', '1f9e36e9e71297041a42e49ff37a60c10a25cf22cc672eef6012ee8aff3f36b15e12e9680a12dc9e5580c4038121bed9bc57', '2024-06-06 02:02:02'),
('soniapabon2016@gmail.com', '0441a8313d5d951cce2c3eac457b36bb912a55bd544c12447a15efde15621827145efa98a675d3ee51d0d24a4bdd1c97a6b4', '2024-06-06 02:02:57'),
('jaramilloderek13@gmail.com', 'cea649d1a047d31a31c81b2b6b223d6d48367e774ed43e7ba133b4bd434eea2fe94d77ec41fc0b3c3375e32598b82ea6e52f', '2024-06-06 14:45:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costos_indirectos`
--

DROP TABLE IF EXISTS `costos_indirectos`;
CREATE TABLE `costos_indirectos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `costos_indirectos`:
--

--
-- Volcado de datos para la tabla `costos_indirectos`
--

INSERT INTO `costos_indirectos` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(15, 15, 'vbnbv', 3.0000000),
(16, 16, 'XVBCV', 1.0000000),
(57, 57, '', 1.0000000),
(82, 82, 'ci', 1.0000000),
(89, 98, 'gas', 0.0200000),
(115, 138, 'ci', 124.0000000),
(127, 18, 'raspadora', 0.0900000),
(133, 142, '', 0.0000000),
(134, 143, '', 0.0000000),
(135, 144, '', 0.0000000),
(136, 145, '', 0.0000000),
(137, 146, '', 0.0000000),
(138, 147, '', 0.0000000),
(139, 148, '', 0.0000000),
(140, 149, '', 0.0000000),
(141, 150, '', 0.0000000),
(170, 151, 'luz', 0.0004000),
(171, 151, 'agua', 0.0001000),
(172, 151, 'gas', 0.0056000),
(179, 152, 'Luz', 0.0020000),
(180, 152, 'Agua', 0.0008000),
(181, 152, 'Gas', 0.0002000),
(185, 154, 'Luz', 0.0004000),
(186, 154, 'Agua', 0.0001000),
(187, 154, 'Gas', 0.0056000),
(218, 153, 'Luz', 0.0020000),
(220, 153, 'Agua', 0.0008000),
(222, 153, 'Gas', 0.0002000),
(254, 134, 'luz', 0.0004000),
(256, 134, 'agua', 0.0001000),
(258, 134, 'gas', 0.0056000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mano_de_obra`
--

DROP TABLE IF EXISTS `mano_de_obra`;
CREATE TABLE `mano_de_obra` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `mano_de_obra`:
--   `producto_id`
--       `productos` -> `id`
--

--
-- Volcado de datos para la tabla `mano_de_obra`
--

INSERT INTO `mano_de_obra` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(58, 57, '', 1.0000000),
(83, 82, 'mo', 1.0000000),
(89, 98, 'pelar papas', 0.0500000),
(114, 138, 'mo1', 101.0000000),
(126, 18, 'mezclar', 0.2500000),
(132, 142, '', 0.0000000),
(133, 143, '', 0.0000000),
(134, 144, '', 0.0000000),
(135, 145, '', 0.0000000),
(136, 146, '', 0.0000000),
(137, 147, '', 0.0000000),
(138, 148, '', 0.0000000),
(139, 149, '', 0.0000000),
(140, 150, '', 0.0000000),
(159, 151, 'operario freidor', 0.0300000),
(160, 151, 'operario pelador', 0.0300000),
(165, 152, 'elaboración', 0.6000000),
(166, 152, 'Auxiliar', 1.0700000),
(169, 154, 'Pelador', 0.0300000),
(170, 154, 'Freidor', 0.0300000),
(191, 153, '1 Elaboracion', 0.6000000),
(193, 153, '2 Auxiliar', 1.0700000),
(215, 134, 'operario freidor', 0.0300000),
(217, 134, 'operario pelador', 0.0300000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_primas`
--

DROP TABLE IF EXISTS `materias_primas`;
CREATE TABLE `materias_primas` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,7) NOT NULL,
  `unidad` varchar(50) NOT NULL,
  `cantidad` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `materias_primas`:
--

--
-- Volcado de datos para la tabla `materias_primas`
--

INSERT INTO `materias_primas` (`id`, `producto_id`, `nombre`, `costo`, `unidad`, `cantidad`) VALUES
(15, 15, 'xbcvv', 1.0000000, '', 0),
(16, 16, 'DGDFH', 1.0000000, '', 0),
(65, 57, '', 0.0000000, 'kg', 1),
(106, 82, 'mp1', 1.0000000, 'lb', 1),
(120, 98, 'papa', 0.1000000, 'g', 1),
(121, 98, 'salchicha', 0.1000000, 'unid', 0),
(122, 98, 'aceite', 0.1000000, 'mL', 10),
(151, 138, 'mp1', 1.0000000, 'kg', 1),
(156, 139, 'asda', 122.0000000, 'unidad', 1),
(175, 18, 'Agua', 0.1000000, 'L', 1),
(176, 18, 'clorantes', 2.5000000, 'g', 0.1),
(182, 142, 'dsgb', 1.0000000, '', 0),
(183, 143, 'dsgb', 1.0000000, 'unidad', 1),
(184, 144, 'dsgb', 1.0000000, 'unidad', 1),
(185, 145, 'dsgb', 1.0000000, 'unidad', 1),
(186, 146, 'dsgb', 1.0000000, 'unidad', 1),
(187, 147, 'dsgb', 1.0000000, 'unidad', 1),
(188, 148, 'dsgb', 1.0000000, 'unidad', 1),
(189, 149, 'dsgb', 1.0000000, 'unidad', 1),
(190, 150, 'dsgb', 1.0000000, 'unidad', 1),
(227, 151, 'papas', 0.1200000, 'g', 1),
(228, 151, 'sal', 0.0004000, 'g', 10),
(229, 151, 'salsa de tomate', 0.0100000, 'mL', 5),
(230, 151, 'Aceite', 0.0500000, 'unidad', 1),
(241, 152, 'Mortiño', 0.5800000, 'lb', 1),
(242, 152, 'Azucar', 0.3100000, 'g', 500),
(243, 152, 'Agua', 0.1300000, 'L', 1),
(244, 152, 'Levadura', 0.0227000, 'g', 500),
(245, 152, 'metabisulfito de sodio', 0.0100000, 'g', 500),
(251, 154, 'papas', 0.1200000, 'g', 200),
(252, 154, 'sal', 0.0000000, 'g', 10),
(253, 154, 'salsa de tomate', 0.0100000, 'unidad', 1),
(254, 154, 'Aceite', 0.0500000, 'L', 0.5),
(297, 153, 'Mortiño', 0.5800000, 'unidad', 1),
(299, 153, 'azucar', 0.3100000, 'kg', 0.1),
(301, 153, 'agua', 0.1300000, 'L', 1),
(303, 153, 'Levadura', 0.0227000, 'unidad', 1),
(345, 134, 'papas', 0.1200000, 'g', 1),
(347, 134, 'sal', 0.0000000, 'g', 10),
(349, 134, 'salsa de tomate', 0.0100000, 'mL', 5),
(351, 134, 'Aceite', 0.0500000, 'unidad', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nacionalidades`
--

DROP TABLE IF EXISTS `nacionalidades`;
CREATE TABLE `nacionalidades` (
  `cod_nacionalidad` int(11) NOT NULL,
  `nombre_nacionalidad` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `nacionalidades`:
--

--
-- Volcado de datos para la tabla `nacionalidades`
--

INSERT INTO `nacionalidades` (`cod_nacionalidad`, `nombre_nacionalidad`) VALUES
(1, 'Afgana'),
(2, 'Albanesa'),
(3, 'Alemana'),
(4, 'Andorrana'),
(5, 'Angoleña'),
(6, 'Antiguana'),
(7, 'Argentina'),
(8, 'Armenia'),
(9, 'Australiana'),
(10, 'Austriaca'),
(11, 'Azerbaiyana'),
(12, 'Bahameña'),
(13, 'Bangladesí'),
(14, 'Barbadense'),
(15, 'Bareiní'),
(16, 'Belga'),
(17, 'Belice'),
(18, 'Beliceña'),
(19, 'Beninesa'),
(20, 'Bielorrusa'),
(21, 'Birmana'),
(22, 'Boliviana'),
(23, 'Bosnia'),
(24, 'Botsuanesa'),
(25, 'Brasileña'),
(26, 'Bruneana'),
(27, 'Búlgara'),
(28, 'Burkinesa'),
(29, 'Burundesa'),
(30, 'Butanesa'),
(31, 'Cabo Verdeana'),
(32, 'Camboyana'),
(33, 'Camerunesa'),
(34, 'Canadiense'),
(35, 'Catarí'),
(36, 'Chadiana'),
(37, 'Checa'),
(38, 'Chilena'),
(39, 'China'),
(40, 'Chipriota'),
(41, 'Colombiana'),
(42, 'Comorense'),
(43, 'Congoleña'),
(44, 'Norcoreana'),
(45, 'Surcoreana'),
(46, 'Costarricense'),
(47, 'Croata'),
(48, 'Cubana'),
(49, 'Danesa'),
(50, 'Dominica'),
(51, 'Ecuatoriana'),
(52, 'Egipcia'),
(53, 'Salvadoreña'),
(54, 'Emiratí'),
(55, 'Eslovaca'),
(56, 'Eslovena'),
(57, 'Española'),
(58, 'Estadounidense'),
(59, 'Estonia'),
(60, 'Etíope'),
(61, 'Fiyiana'),
(62, 'Filipina'),
(63, 'Finlandesa'),
(64, 'Francesa'),
(65, 'Gabonesa'),
(66, 'Gambiana'),
(67, 'Georgiana'),
(68, 'Ghanesa'),
(69, 'Granadina'),
(70, 'Griega'),
(71, 'Guatemalteca'),
(72, 'Guineana'),
(73, 'Guineana Ecuatorial'),
(74, 'Guineana-Bissau'),
(75, 'Guyanesa'),
(76, 'Haitiana'),
(77, 'Hondureña'),
(78, 'Húngara'),
(79, 'India'),
(80, 'Indonesia'),
(81, 'Iraquí'),
(82, 'Iraní'),
(83, 'Irlandesa'),
(84, 'Islandesa'),
(85, 'Israelí'),
(86, 'Italiana'),
(87, 'Jamaiquina'),
(88, 'Japonesa'),
(89, 'Jordana'),
(90, 'Kazaja'),
(91, 'Kenia'),
(92, 'Kirguisa'),
(93, 'Kiribatiana'),
(94, 'Kuwaití'),
(95, 'Laosiana'),
(96, 'Lesotense'),
(97, 'Letona'),
(98, 'Libanesa'),
(99, 'Liberiana'),
(100, 'Libia'),
(101, 'Liechtensteiniana'),
(102, 'Lituana'),
(103, 'Luxemburguesa'),
(104, 'Macedonia'),
(105, 'Madagascarense'),
(106, 'Malasia'),
(107, 'Malauí'),
(108, 'Maldiva'),
(109, 'Malgache'),
(110, 'Maliense'),
(111, 'Maltesa'),
(112, 'Marroquí'),
(113, 'Marshallese'),
(114, 'Mauritana'),
(115, 'Mauriciana'),
(116, 'Mexicana'),
(117, 'Micronesia'),
(118, 'Moldava'),
(119, 'Monegasca'),
(120, 'Mongola'),
(121, 'Montenegrina'),
(122, 'Mozambiqueña'),
(123, 'Namibia'),
(124, 'Nauruana'),
(125, 'Nepalesa'),
(126, 'Nicaragüense'),
(127, 'Nigerina'),
(128, 'Nigeriana'),
(129, 'Noruega'),
(130, 'Neozelandesa'),
(131, 'Omán'),
(132, 'Neerlandesa'),
(133, 'Paquistaní'),
(134, 'Palauana'),
(135, 'Palestina'),
(136, 'Panameña'),
(137, 'Papú'),
(138, 'Paraguaya'),
(139, 'Peruana'),
(140, 'Polaca'),
(141, 'Portuguesa'),
(142, 'Británica'),
(143, 'Ruandesa'),
(144, 'Rumana'),
(145, 'Rusa'),
(146, 'Salomonesa'),
(147, 'Samoana'),
(148, 'Sancristobaleña'),
(149, 'Sanvicentina'),
(150, 'Santa Lucía'),
(151, 'Santotomense'),
(152, 'Senegalesa'),
(153, 'Serbia'),
(154, 'Seychellense'),
(155, 'Sierraleonesa'),
(156, 'Singapurense'),
(157, 'Siria'),
(158, 'Somalí'),
(159, 'Esrilanquesa'),
(160, 'Suazi'),
(161, 'Sudafricana'),
(162, 'Sudanesa'),
(163, 'Sueca'),
(164, 'Suiza'),
(165, 'Surinamesa'),
(166, 'Tailandesa'),
(167, 'Tanzana'),
(168, 'Tayika'),
(169, 'Timorense'),
(170, 'Togolesa'),
(171, 'Tongana'),
(172, 'Trinitense'),
(173, 'Tunecina'),
(174, 'Turca'),
(175, 'Turkmena'),
(176, 'Tuvaluana'),
(177, 'Ucraniana'),
(178, 'Ugandesa'),
(179, 'Uruguaya'),
(180, 'Uzbeca'),
(181, 'Vanuatuense'),
(182, 'Venezolana'),
(183, 'Vietnamita'),
(184, 'Yemení'),
(185, 'Yibutiana'),
(186, 'Zambiana'),
(187, 'Zimbabuense');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otros_gastos`
--

DROP TABLE IF EXISTS `otros_gastos`;
CREATE TABLE `otros_gastos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `otros_gastos`:
--

--
-- Volcado de datos para la tabla `otros_gastos`
--

INSERT INTO `otros_gastos` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(2, 15, 'vnvbn', 4.0000000),
(3, 16, 'CBCVB', 1.0000000),
(40, 57, '', 1.0000000),
(66, 82, 'gg', 1.0000000),
(72, 98, 'Desechables', 0.0500000),
(97, 138, 'gg', 123.0000000),
(101, 142, '', 0.0000000),
(102, 143, '', 0.0000000),
(103, 144, '', 0.0000000),
(104, 145, '', 0.0000000),
(105, 146, '', 0.0000000),
(106, 147, '', 0.0000000),
(107, 148, '', 0.0000000),
(108, 149, '', 0.0000000),
(109, 150, '', 0.0000000),
(118, 154, 'Fundas', 0.0200000),
(119, 154, 'Etiquetas', 0.0100000),
(146, 153, 'Botellas', 1.0300000),
(148, 153, 'etiquetas', 0.6300000),
(150, 153, 'Timbre', 0.0500000),
(182, 134, 'fundas', 0.0200000),
(184, 134, 'Etiquetas', 0.0100000),
(186, 134, 'trasporte', 0.0025000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

DROP TABLE IF EXISTS `persona`;
CREATE TABLE `persona` (
  `cod_persona` int(11) NOT NULL,
  `ci_persona` varchar(12) NOT NULL,
  `cod_tipoced_persona` int(11) NOT NULL,
  `nom_persona` varchar(200) NOT NULL,
  `ape_persona` varchar(200) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `edad_persona` int(3) NOT NULL,
  `ecivil_persona` varchar(30) NOT NULL,
  `etnia_persona` varchar(30) NOT NULL,
  `dis_persona` varchar(10) NOT NULL,
  `tipo_dis_persona` varchar(50) DEFAULT NULL,
  `porcentaje_dis_persona` varchar(20) DEFAULT NULL,
  `ncarnet_dis_persona` varchar(15) DEFAULT NULL,
  `ocupacion_persona` varchar(60) NOT NULL,
  `cod_nacionalidad_persona` int(11) NOT NULL,
  `cod_ciudad_persona` int(11) NOT NULL,
  `cod_provincia_persona` int(11) NOT NULL,
  `parroquia_persona` varchar(60) NOT NULL,
  `barrio_persona` varchar(60) NOT NULL,
  `calle1_persona` varchar(60) NOT NULL,
  `calle2_persona` varchar(60) NOT NULL,
  `neducacion_persona` varchar(30) NOT NULL,
  `genero_persona` varchar(20) NOT NULL,
  `clave_persona` varchar(100) NOT NULL,
  `correo_persona` varchar(100) NOT NULL,
  `telefono_persona` varchar(15) NOT NULL,
  `cod_rol_persona` int(11) NOT NULL,
  `img_perfil` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `persona`:
--

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`cod_persona`, `ci_persona`, `cod_tipoced_persona`, `nom_persona`, `ape_persona`, `fecha_nacimiento`, `edad_persona`, `ecivil_persona`, `etnia_persona`, `dis_persona`, `tipo_dis_persona`, `porcentaje_dis_persona`, `ncarnet_dis_persona`, `ocupacion_persona`, `cod_nacionalidad_persona`, `cod_ciudad_persona`, `cod_provincia_persona`, `parroquia_persona`, `barrio_persona`, `calle1_persona`, `calle2_persona`, `neducacion_persona`, `genero_persona`, `clave_persona`, `correo_persona`, `telefono_persona`, `cod_rol_persona`, `img_perfil`) VALUES
(105, '1005037492', 1, 'Dereck', 'Jaramillo', '2024-05-12', 21, 'soltero', 'Afro Ecuatoriana', '', '', '', '', 'Estudiante', 51, 15, 11, 'El sagrario', 'bariio 10 de agosto', 'esfdv', 'sdfsd', 'dsfdgvdx', 'masculino', 'e10adc3949ba59abbe56e057f20f883e', 'jaramilloderek13@gmail.com', '0983288443', 1, 'http://localhost/ACE/WsMunicipioIonic/uploads/avatar_user_1005037492.jpg'),
(106, '1050243920', 1, 'Carlos', 'Guevara', '2024-05-15', 21, 'divorciado', 'Mestiza', '', '', '', '', 'Jubilado', 51, 15, 11, 'El sagrario', 'El Vergel', 'Padre Raimundo de Santacruz 3-30', 'Cristóbal Colón', 'Secundaria', 'masculino', 'e10adc3949ba59abbe56e057f20f883e', 'andrescarlos988@gmail.com', '0968569654', 2, 'http://localhost/ACE/WsMunicipioIonic/uploads/avatar_user_1050243920.jpg'),
(208, '1002219895', 1, 'Silvana', 'Linto', '1979-06-08', 44, 'soltero', 'Mestiza', 'Si', 'Visual', '70%', '235764352', 'Servidor Público', 51, 15, 11, 'zxvxc', 'vcvb', 'cvbcvb', 'xcvcb', 'Cuarto Nivel', 'femenino', '25d55ad283aa400af464c76d713c07ad', 'john.doe23@mail.com', '0997179693', 2, ''),
(209, '1050225018', 2, 'wqarsef', 'sdfdsg', '2024-05-06', 0, 'casado', 'cv nfnvbnvbn', 'Si', 'nvbnvbnv', 'vbnvbnvb', 'vbnvbnvbn', 'vbnvbnvbnvbn', 51, 15, 11, 'vbnvbn', 'nvbnvbnvbn', 'vbnvbnvb', 'vbnvbnvbn', 'Ninguno', 'vbnvbnvbn', '25d55ad283aa400af464c76d713c07ad', 'swdasfsd2@mail.com', '0987654321', 2, ''),
(210, '0401404512', 1, 'Widinson', 'Pabon', '2004-04-24', 20, 'casado', 'Afro Ecuatoriana', 'No', '', '', '', 'asfsd', 51, 15, 11, 'sdfsdf', 'sdfsd', 'sdfsd', 'sdfs', 'Bachillerato', 'masculino', '25d55ad283aa400af464c76d713c07ad', 'soniapabon2016@gmail.com', '0987654321', 2, ''),
(211, '1002401501', 1, 'Guillermo ', 'Jaramillo', '1939-06-05', 85, 'casado', 'Afro Ecuatoriana', 'No', '', '', '', 'Servidor Público', 51, 15, 11, 'dfvcfsdgdf', 'fdgdfg', 'fdgfdg', 'dfgdfg', 'Bachillerato', 'masculino', '25d55ad283aa400af464c76d713c07ad', 'guillojj80@gmail.com', '0959606539', 2, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `margen_beneficio` decimal(5,2) NOT NULL,
  `utilidad_dis` decimal(10,0) NOT NULL,
  `utilidad_venta` decimal(10,0) NOT NULL,
  `impuestos` decimal(5,2) NOT NULL,
  `costo_produccion` decimal(10,2) DEFAULT NULL,
  `costo_fabrica` decimal(10,2) DEFAULT NULL,
  `costo_distribucion` decimal(10,2) DEFAULT NULL,
  `pvp` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `productos`:
--

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `id_persona`, `nombre`, `margen_beneficio`, `utilidad_dis`, `utilidad_venta`, `impuestos`, `costo_produccion`, `costo_fabrica`, `costo_distribucion`, `pvp`) VALUES
(18, 105, 'Raspado de Hielo', 25.00, 0, 0, 15.00, 0.35, 0.35, 0.35, 0.35),
(57, 105, 'Capuchino', 35.00, 0, 0, 15.00, 3.00, 4.05, 6.29, 9.76),
(82, 106, 'paraguas', 123.00, 0, 0, 123.00, 4.00, 8.92, 44.36, 220.59),
(98, 105, 'Salchi papa', 30.00, 0, 0, 15.00, 0.42, 0.55, 0.82, 1.22),
(134, 210, 'papitas', 30.00, 39, 20, 12.00, 0.26, 0.34, 0.41, 0.62),
(138, 105, 'prueba1', 12.00, 0, 0, 11.00, 349.00, 41.88, 46.49, 52.07),
(139, 105, 'prueba2', 123.00, 0, 0, 99.00, 122.00, 150.06, 298.62, 665.92),
(142, 105, 'vcxbx', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(143, 105, 'carlos', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(144, 105, 'fjdfjd', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(145, 105, 'zfjxjgxjn', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(146, 105, 's<nzdfnzd', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(147, 105, 'dfbz z', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(148, 105, 'rdhdj', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(149, 105, 'erajteszgn', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(150, 105, 'zdfnmfg', 35.00, 0, 0, 15.00, 1.00, 0.35, 0.40, 0.54),
(151, 210, 'papitas2', 35.00, 0, 0, 12.00, 0.26, 0.35, 0.39, 0.52),
(152, 105, 'Vino de mortiño', 44.50, 0, 0, 12.00, 4.47, 6.45, 7.23, 10.44),
(153, 210, 'Vino Artesanal', 44.50, 0, 0, 12.00, 4.41, 6.37, 8.53, 13.46),
(154, 210, 'Papitas 3', 30.00, 0, 0, 12.00, 0.28, 0.36, 0.40, 0.52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

DROP TABLE IF EXISTS `provincias`;
CREATE TABLE `provincias` (
  `cod_provincia` int(11) NOT NULL,
  `nombre_provincia` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `provincias`:
--

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`cod_provincia`, `nombre_provincia`) VALUES
(1, 'Azuay'),
(2, 'Bolívar'),
(3, 'Cañar'),
(4, 'Carchi'),
(5, 'Chimborazo'),
(6, 'Cotopaxi'),
(7, 'El Oro'),
(8, 'Esmeraldas'),
(9, 'Galápagos'),
(10, 'Guayas'),
(11, 'Imbabura'),
(12, 'Loja'),
(13, 'Los Ríos'),
(14, 'Manabí'),
(15, 'Morona Santiago'),
(16, 'Napo'),
(17, 'Orellana'),
(18, 'Pastaza'),
(19, 'Pichincha'),
(20, 'Santa Elena'),
(21, 'Santo Domingo de los Tsáchilas'),
(22, 'Sucumbíos'),
(23, 'Tungurahua'),
(24, 'Zamora Chinchipe');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registropr_inicial`
--

DROP TABLE IF EXISTS `registropr_inicial`;
CREATE TABLE `registropr_inicial` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cantidad_inicial` int(11) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `registropr_inicial`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_final`
--

DROP TABLE IF EXISTS `registro_final`;
CREATE TABLE `registro_final` (
  `id_final` int(11) NOT NULL,
  `id_inicial` int(11) NOT NULL,
  `cantidad_vendida` int(11) NOT NULL,
  `dinero_total` decimal(10,2) NOT NULL,
  `productos_regalados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `registro_final`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_inventario`
--

DROP TABLE IF EXISTS `resultados_inventario`;
CREATE TABLE `resultados_inventario` (
  `id_resuldatos` int(11) NOT NULL,
  `id_final` int(11) NOT NULL,
  `ganancia_o_perdida` decimal(10,2) NOT NULL,
  `perdida_regalados` decimal(10,2) NOT NULL,
  `productos_no_vendidos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `resultados_inventario`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `cod_rol` int(11) NOT NULL,
  `tipo_rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `roles`:
--

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`cod_rol`, `tipo_rol`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipocedula`
--

DROP TABLE IF EXISTS `tipocedula`;
CREATE TABLE `tipocedula` (
  `cod_tipoced` int(11) NOT NULL,
  `tipo` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tipocedula`:
--

--
-- Volcado de datos para la tabla `tipocedula`
--

INSERT INTO `tipocedula` (`cod_tipoced`, `tipo`) VALUES
(1, 'Ecuatoriana'),
(2, 'Extranjera');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`cod_ciudad`),
  ADD KEY `cod_ciudad_provincia` (`cod_ciudad_provincia`);

--
-- Indices de la tabla `costos_indirectos`
--
ALTER TABLE `costos_indirectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `mano_de_obra`
--
ALTER TABLE `mano_de_obra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `materias_primas`
--
ALTER TABLE `materias_primas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `nacionalidades`
--
ALTER TABLE `nacionalidades`
  ADD PRIMARY KEY (`cod_nacionalidad`);

--
-- Indices de la tabla `otros_gastos`
--
ALTER TABLE `otros_gastos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`cod_persona`),
  ADD UNIQUE KEY `ci_persona` (`ci_persona`),
  ADD UNIQUE KEY `ci_persona_2` (`ci_persona`),
  ADD KEY `cod_rol_persona` (`cod_rol_persona`),
  ADD KEY `cod_tipoced_persona` (`cod_tipoced_persona`),
  ADD KEY `cod_nacionalidad_persona` (`cod_nacionalidad_persona`),
  ADD KEY `cod_provincia_persona` (`cod_provincia_persona`),
  ADD KEY `cod_ciudad_persona` (`cod_ciudad_persona`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`cod_provincia`);

--
-- Indices de la tabla `registropr_inicial`
--
ALTER TABLE `registropr_inicial`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `registro_final`
--
ALTER TABLE `registro_final`
  ADD PRIMARY KEY (`id_final`),
  ADD KEY `id` (`id_inicial`);

--
-- Indices de la tabla `resultados_inventario`
--
ALTER TABLE `resultados_inventario`
  ADD PRIMARY KEY (`id_resuldatos`),
  ADD KEY `id_final` (`id_final`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`cod_rol`);

--
-- Indices de la tabla `tipocedula`
--
ALTER TABLE `tipocedula`
  ADD PRIMARY KEY (`cod_tipoced`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `cod_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT de la tabla `costos_indirectos`
--
ALTER TABLE `costos_indirectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- AUTO_INCREMENT de la tabla `mano_de_obra`
--
ALTER TABLE `mano_de_obra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- AUTO_INCREMENT de la tabla `materias_primas`
--
ALTER TABLE `materias_primas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=358;

--
-- AUTO_INCREMENT de la tabla `nacionalidades`
--
ALTER TABLE `nacionalidades`
  MODIFY `cod_nacionalidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT de la tabla `otros_gastos`
--
ALTER TABLE `otros_gastos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `cod_persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `cod_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `registropr_inicial`
--
ALTER TABLE `registropr_inicial`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `registro_final`
--
ALTER TABLE `registro_final`
  MODIFY `id_final` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultados_inventario`
--
ALTER TABLE `resultados_inventario`
  MODIFY `id_resuldatos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `cod_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipocedula`
--
ALTER TABLE `tipocedula`
  MODIFY `cod_tipoced` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`cod_ciudad_provincia`) REFERENCES `provincias` (`cod_provincia`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mano_de_obra`
--
ALTER TABLE `mano_de_obra`
  ADD CONSTRAINT `mano_de_obra_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
