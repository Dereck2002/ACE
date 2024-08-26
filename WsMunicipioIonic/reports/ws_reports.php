<?php
include_once('../config.php');


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT,GET,POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header('Content-Type: application/json; charset=utf-8');

$respuesta = "";
$post = json_decode(file_get_contents("php://input"), true);

if ($post['accion'] == 'report') {
    if (!isset($post['id_persona'])) {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Se requiere el id_persona para generar el reporte."));
        echo $respuesta;
        exit();
    }

    $id_persona = mysqli_real_escape_string($mysqli, $post['id_persona']);
    $page = isset($post['page']) ? intval($post['page']) : 1;
    $items_per_page = isset($post['items_per_page']) ? intval($post['items_per_page']) : 10;
    $offset = ($page - 1) * $items_per_page;

    // Add date range parameters
    $dateFrom = isset($post['dateFrom']) ? mysqli_real_escape_string($mysqli, $post['dateFrom']) : null;
    $dateTo = isset($post['dateTo']) ? mysqli_real_escape_string($mysqli, $post['dateTo']) : null;

    // Modify count query to include date range
    $count_query = "SELECT COUNT(*) as total FROM productos p
                    LEFT JOIN inventario_registro_inicial i ON p.id = i.PROD_CODIGO
                    WHERE p.id_persona = ?";
    $count_params = array($id_persona);
    $count_types = "i";

    if ($dateFrom && $dateTo) {
        $count_query .= " AND i.RI_FECHA BETWEEN ? AND ?";
        $count_params[] = $dateFrom;
        $count_params[] = $dateTo;
        $count_types .= "ss";
    }

    $count_stmt = mysqli_prepare($mysqli, $count_query);
    mysqli_stmt_bind_param($count_stmt, $count_types, ...$count_params);
    mysqli_stmt_execute($count_stmt);
    $count_result = mysqli_stmt_get_result($count_stmt);
    $total_items = mysqli_fetch_assoc($count_result)['total'];
    $total_pages = ceil($total_items / $items_per_page);

    // Modify main query to include date range
    $sentencia = "SELECT p.*, i.*, f.*
                  FROM productos p
                  LEFT JOIN inventario_registro_inicial i ON p.id = i.PROD_CODIGO
                  LEFT JOIN inventario_registro_final f ON i.RI_CODIGO = f.RI_CODIGO
                  WHERE p.id_persona = ?";
    $params = array($id_persona);
    $types = "i";

    if ($dateFrom && $dateTo) {
        $sentencia .= " AND i.RI_FECHA BETWEEN ? AND ?";
        $params[] = $dateFrom;
        $params[] = $dateTo;
        $types .= "ss";
    }

    $sentencia .= " LIMIT ? OFFSET ?";
    $params[] = $items_per_page;
    $params[] = $offset;
    $types .= "ii";

    $stmt = mysqli_prepare($mysqli, $sentencia);
    mysqli_stmt_bind_param($stmt, $types, ...$params);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result) {
        $productos = array();
        while ($row = mysqli_fetch_assoc($result)) {
            // Convert relevant fields to numbers
            $costo_produccion = floatval($row['costo_produccion']);
            $RF_CANTIDAD_VENDIDA = floatval($row['RF_CANTIDAD_VENDIDA']);
            $RF_DINERO_TOTAL = floatval($row['RF_DINERO_TOTAL']);

            // Calculate cuanto_gana
            $cuanto_gana = $RF_DINERO_TOTAL - ($costo_produccion * $RF_CANTIDAD_VENDIDA);

            // Add cuanto_gana to the row
            $row['cuanto_gana'] = $cuanto_gana;

            $productos[] = $row;
        }
        $respuesta = json_encode(array(
            'estado' => true,            'id_persona' => $id_persona,
            'productos' => $productos,
            'pagination' => array(
                'current_page' => $page,
                'total_pages' => $total_pages,
                'items_per_page' => $items_per_page,
                'total_items' => $total_items
            )
        ));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error al obtener los productos, inventario inicial y final."));
    }

    mysqli_stmt_close($stmt);
    mysqli_stmt_close($count_stmt);
    echo $respuesta;
    exit();
}
