<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}
if (!isset($_FILES["image"])) {
    http_response_code(405); // Código 400 para solicitud incorrecta
    echo json_encode(["mensaje" => "No se ha enviado ninguna imagen."]);
    exit();
}


$userId = $_POST['userId']; // Obtiene el ID del usuario del formulario
$file_tmp = $_FILES["image"]["tmp_name"];
$file_mime = mime_content_type($file_tmp);

$allowed_mimes = ["image/jpeg", "image/png", "image/gif"];
if (!in_array($file_mime, $allowed_mimes)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "Tipo de archivo no permitido."]);
    exit();
}

// Renombra el archivo con extensión .jpg
$target_file = $target_dir . $userId . '.jpg';

$response = array();

if (move_uploaded_file($file_tmp, $target_file)) {
    $response["mensaje"] = "La imagen ha sido subida exitosamente.";
} else {
    $response["mensaje"] = "Hubo un error al subir la imagen.";
}

echo json_encode($response);

