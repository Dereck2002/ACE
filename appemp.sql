-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2024 a las 15:55:55
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `cod_ciudad` int(11) NOT NULL,
  `nombre_ciudad` varchar(55) NOT NULL,
  `cod_ciudad_provincia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Estructura de tabla para la tabla `costos_indirectos`
--

CREATE TABLE `costos_indirectos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `costos_indirectos`
--

INSERT INTO `costos_indirectos` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(15, 15, 'vbnbv', '3.00'),
(16, 16, 'XVBCV', '1.00'),
(18, 18, 'raspadora', '0.09'),
(26, 26, 'wdwef', '0.90');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mano_de_obra`
--

CREATE TABLE `mano_de_obra` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mano_de_obra`
--

INSERT INTO `mano_de_obra` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(18, 18, 'mezclar', '0.25'),
(19, 18, '', '0.00'),
(27, 26, 'wqdw', '0.10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_primas`
--

CREATE TABLE `materias_primas` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias_primas`
--

INSERT INTO `materias_primas` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(15, 15, 'xbcvv', '1.00'),
(16, 16, 'DGDFH', '1.00'),
(18, 18, 'Agua', '0.10'),
(19, 18, 'clorantes', '0.01'),
(27, 26, 'sfsd', '0.10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nacionalidades`
--

CREATE TABLE `nacionalidades` (
  `cod_nacionalidad` int(11) NOT NULL,
  `nombre_nacionalidad` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `otros_gastos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `otros_gastos`
--

INSERT INTO `otros_gastos` (`id`, `producto_id`, `nombre`, `costo`) VALUES
(2, 15, 'vnvbn', '4.00'),
(3, 16, 'CBCVB', '1.00'),
(5, 18, '', '0.06'),
(13, 26, 'wqdwe', '0.09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

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
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`cod_persona`, `ci_persona`, `cod_tipoced_persona`, `nom_persona`, `ape_persona`, `fecha_nacimiento`, `edad_persona`, `ecivil_persona`, `etnia_persona`, `dis_persona`, `tipo_dis_persona`, `porcentaje_dis_persona`, `ncarnet_dis_persona`, `ocupacion_persona`, `cod_nacionalidad_persona`, `cod_ciudad_persona`, `cod_provincia_persona`, `parroquia_persona`, `barrio_persona`, `calle1_persona`, `calle2_persona`, `neducacion_persona`, `genero_persona`, `clave_persona`, `correo_persona`, `telefono_persona`, `cod_rol_persona`, `img_perfil`) VALUES
(105, '1005037492', 1, 'Dereck', 'Jaramillo', '2024-05-12', 21, 'soltero', 'Afro Ecuatoriana', '', '', '', '', 'Estudiante', 51, 15, 11, 'El sagrario', 'bariio 10 de agosto', 'esfdv', 'sdfsd', 'dsfdgvdx', 'masculino', 'e10adc3949ba59abbe56e057f20f883e', 'jaramilloderek13@gmail.com', '0983288443', 1, ''),
(106, '1050243920', 1, 'Carlos', 'Guevara', '2024-05-15', 21, 'divorciado', 'Mestiza', '', '', '', '', 'Jubilado', 51, 15, 11, 'El sagrario', 'El Vergel', 'Padre Raimundo de Santacruz 3-30', 'Cristóbal Colón', 'Secundaria', 'masculino', 'e10adc3949ba59abbe56e057f20f883e', 'andrescarlos988@gmail.com', '0968569654', 2, ''),
(208, '1002219895', 1, 'Silvana', 'Linto', '1979-06-08', 44, 'soltero', 'Mestiza', 'Si', 'Visual', '70%', '235764352', 'Servidor Público', 51, 15, 11, 'zxvxc', 'vcvb', 'cvbcvb', 'xcvcb', 'Cuarto Nivel', 'femenino', '25d55ad283aa400af464c76d713c07ad', 'john.doe23@mail.com', '0997179693', 2, ''),
(209, '1050225018', 2, 'wqarsef', 'sdfdsg', '2024-05-06', 0, 'casado', 'cv nfnvbnvbn', 'Si', 'nvbnvbnv', 'vbnvbnvb', 'vbnvbnvbn', 'vbnvbnvbnvbn', 51, 15, 11, 'vbnvbn', 'nvbnvbnvbn', 'vbnvbnvb', 'vbnvbnvbn', 'Ninguno', 'vbnvbnvbn', '25d55ad283aa400af464c76d713c07ad', 'swdasfsd2@mail.com', '0987654321', 2, ''),
(210, '0401404512', 1, 'Widinson', 'Pabon', '2004-04-24', 20, 'casado', 'Afro Ecuatoriana', 'No', '', '', '', 'asfsd', 51, 15, 11, 'sdfsdf', 'sdfsd', 'sdfsd', 'sdfs', 'Bachillerato', 'masculino', '25d55ad283aa400af464c76d713c07ad', 'john.doe23@mail.com', '0987654321', 2, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `margen_beneficio` decimal(5,2) NOT NULL,
  `impuestos` decimal(5,2) NOT NULL,
  `costo_produccion` decimal(10,2) DEFAULT NULL,
  `costo_fabrica` decimal(10,2) DEFAULT NULL,
  `costo_distribucion` decimal(10,2) DEFAULT NULL,
  `pvp` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `id_persona`, `nombre`, `margen_beneficio`, `impuestos`, `costo_produccion`, `costo_fabrica`, `costo_distribucion`, `pvp`) VALUES
(18, 105, 'Raspado de Hielo', '35.00', '15.00', '0.51', '0.68', '1.06', '1.65'),
(26, 210, 'Papas', '35.00', '15.00', '1.19', '1.61', '2.49', '3.87');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `cod_provincia` int(11) NOT NULL,
  `nombre_provincia` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `cod_rol` int(11) NOT NULL,
  `tipo_rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `tipocedula` (
  `cod_tipoced` int(11) NOT NULL,
  `tipo` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `mano_de_obra`
--
ALTER TABLE `mano_de_obra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `materias_primas`
--
ALTER TABLE `materias_primas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `nacionalidades`
--
ALTER TABLE `nacionalidades`
  MODIFY `cod_nacionalidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT de la tabla `otros_gastos`
--
ALTER TABLE `otros_gastos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `cod_persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `cod_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
-- Filtros para la tabla `costos_indirectos`
--
ALTER TABLE `costos_indirectos`
  ADD CONSTRAINT `costos_indirectos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mano_de_obra`
--
ALTER TABLE `mano_de_obra`
  ADD CONSTRAINT `mano_de_obra_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `materias_primas`
--
ALTER TABLE `materias_primas`
  ADD CONSTRAINT `materias_primas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `otros_gastos`
--
ALTER TABLE `otros_gastos`
  ADD CONSTRAINT `otros_gastos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`cod_rol_persona`) REFERENCES `roles` (`cod_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `persona_ibfk_2` FOREIGN KEY (`cod_tipoced_persona`) REFERENCES `tipocedula` (`cod_tipoced`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `persona_ibfk_3` FOREIGN KEY (`cod_nacionalidad_persona`) REFERENCES `nacionalidades` (`cod_nacionalidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `persona_ibfk_5` FOREIGN KEY (`cod_provincia_persona`) REFERENCES `provincias` (`cod_provincia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `persona_ibfk_6` FOREIGN KEY (`cod_ciudad_persona`) REFERENCES `ciudades` (`cod_ciudad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`cod_persona`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
