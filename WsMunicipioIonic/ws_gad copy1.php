<?php
include_once('config.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT,GET,POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header('Content-Type: application/json; charset=utf-8');
require 'vendor/autoload.php';

$respuesta = "";
$post = json_decode(file_get_contents("php://input"), true);

if (isset($post['accion'])) {
    if ($post['accion'] == 'login') {
        if (isset($post['usuario']) && isset($post['clave']) && !empty($post['usuario']) && !empty($post['clave'])) {
            $usuario = mysqli_real_escape_string($mysqli, $post['usuario']);
            $clave_md5 = md5($post['clave']); // Encriptar la contraseña con MD5
            $sentencia = sprintf("SELECT * FROM persona WHERE ci_persona='%s' AND clave_persona='%s'", $usuario, $clave_md5);
            $rs = mysqli_query($mysqli, $sentencia);

            if (mysqli_num_rows($rs) > 0) {
                $row = mysqli_fetch_array($rs);
                $datos[0] = array(
                    'codigo' => $row['cod_persona'],
                    'cedula' => $row['ci_persona'],
                    'nombre' => $row['nom_persona'],
                    'apellido' => $row['ape_persona'],
                    'correo' => $row['correo_persona'],
                    'img_perfil' => $row['img_perfil'],
                );
                $respuesta = json_encode(array('estado' => true, 'persona' => $datos));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "Usuario o clave incorrecto"));
            }
        }
        echo $respuesta;
    }

    if ($post['accion'] == 'n_usuario') {
        if (
            isset($post['cedula']) && isset($post['tipoced']) && isset($post['nombre']) && isset($post['apellido']) && isset($post['etnia']) && isset($post['discapacidad']) && isset($post['tipodis']) && isset($post['porcentajedis']) && isset($post['ncarnetdis']) && isset($post['ocupacion']) && isset($post['nacionalidad']) && isset($post['ciudad']) && isset($post['provincia']) && isset($post['parroquia']) && isset($post['barrio']) && isset($post['calle1']) && isset($post['calle2']) && isset($post['neducacion']) && isset($post['genero']) && isset($post['correo']) && isset($post['telefono']) && isset($post['clave']) && isset($post['conf_clave'])
            && !empty($post['cedula']) && !empty($post['nombre']) && !empty($post['apellido']) && !empty($post['correo']) && !empty($post['telefono']) && !empty($post['clave']) && !empty($post['conf_clave'])
        ) {

            // Validar que la cédula tenga exactamente 10 dígitos
            if (strlen($post['cedula']) != 10) {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "La cédula debe tener 10 dígitos."));
                echo $respuesta;
                exit;
            }

            // Reemplazar el valor de etnia si es "otro"
            if ($post['etnia'] === 'otro') {
                $post['etnia'] = $post['otraetnia'];
            }
            // Reemplazar el valor de estado civil si es "otro"
            if ($post['ecivil'] === 'otro') {
                $post['ecivil'] = $post['otroecivil'];
            }
            // Reemplazar el valor de ocupacion si es "otro"
            if ($post['ocupacion'] === 'otro') {
                $post['ocupacion'] = $post['otraocupacion'];
            }
            // Reemplazar el valor de genero si es "otro"
            if ($post['genero'] === 'otro') {
                $post['genero'] = $post['otrogenero'];
            }

            $clave_md5 = md5($post['clave']); // Encriptar la contraseña con MD5

            $sentencia = sprintf(
                "INSERT INTO persona (ci_persona, cod_tipoced_persona, nom_persona, ape_persona, fecha_nacimiento, edad_persona, ecivil_persona, etnia_persona, dis_persona, tipo_dis_persona, porcentaje_dis_persona, ncarnet_dis_persona, ocupacion_persona, cod_nacionalidad_persona, cod_ciudad_persona, cod_provincia_persona, parroquia_persona, barrio_persona, calle1_persona, calle2_persona, neducacion_persona, genero_persona, correo_persona, telefono_persona, clave_persona, cod_rol_persona) 
                VALUES ('%s', %s, '%s', '%s', '%s', TIMESTAMPDIFF(YEAR, '%s', CURDATE()), '%s', '%s', '%s', '%s', '%s', '%s', '%s', %s, %s, %s, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 2);",
                $post['cedula'],
                $post['tipoced'],
                $post['nombre'],
                $post['apellido'],
                $post['fecha_nacimiento'],
                $post['fecha_nacimiento'],
                $post['ecivil'],
                $post['etnia'],
                $post['discapacidad'],
                $post['tipodis'],
                $post['porcentajedis'],
                $post['ncarnetdis'],
                $post['ocupacion'],
                $post['nacionalidad'],
                $post['ciudad'],
                $post['provincia'],
                $post['parroquia'],
                $post['barrio'],
                $post['calle1'],
                $post['calle2'],
                $post['neducacion'],
                $post['genero'],
                $post['correo'],
                $post['telefono'],
                $clave_md5
            );

            $rs = mysqli_query($mysqli, $sentencia);

            if ($rs) {
                $respuesta = json_encode(array('estado' => true, 'mensaje1' => "Usuario creado satisfactoriamente."));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje1' => "Error al crear el usuario."));
            }

            echo $respuesta;
        }
    }
} else {
    $respuesta = json_encode(array('estado' => false, 'mensaje' => "Acción no especificada"));
    echo $respuesta;
}

// Nueva acción para recuperación de contraseña
if ($post['accion'] == 'recuperar_contrasena') {
    if (isset($post['cedula']) && !empty($post['cedula'])) {
        $cedula = mysqli_real_escape_string($mysqli, $post['cedula']);

        $stmt = $mysqli->prepare("SELECT correo_persona FROM persona WHERE ci_persona = ?");
        $stmt->bind_param('s', $cedula);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $email = $row['correo_persona'];
            $token = bin2hex(random_bytes(50)); // Genera un token único

            // Eliminar cualquier token previo para este correo
            $stmt = $mysqli->prepare("DELETE FROM contrasenia_reset WHERE correo_persona = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();

            // Insertar el nuevo token en la base de datos
            $stmt = $mysqli->prepare("INSERT INTO contrasenia_reset (correo_persona, token) VALUES (?, ?)");
            $stmt->bind_param('ss', $email, $token);
            $stmt->execute();

            $resetLink = "http://localhost:8100/password-form?token=" . $token;

            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'flowltm@gmail.com';
                $mail->Password = 'njctmhjncngjvwui'; // Reemplaza esto por una contraseña de aplicación de Gmail
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = 587;

                // Habilita el modo de depuración
                $mail->SMTPDebug = 2; // 0 = off (producción), 1 = mensajes del cliente, 2 = mensajes del cliente y del servidor
                $mail->Debugoutput = 'html'; // Formato de salida de la depuración

                $mail->setFrom('flowltm@gmail.com', 'CAAAAAA');
                $mail->addAddress($email);

                $mail->isHTML(true);
                $mail->Subject = 'Solicitud de Restablecimiento de Contraseña';

                $mail->Body = "
                <!DOCTYPE html>
                <html lang='es'>
                <head>
                    <meta charset='UTF-8'>
                    <style>
                        .container {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            padding: 20px;
                            text-align: center;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 0;
                        }
                        .content {
                            background-color: white;
                            padding: 20px;
                            margin-top: 10px;
                        }
                        .button {
                            background-color: #000000; /* Color negro */
                            color: white;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                            margin-top: 20px;
                        }
                        .footer {
                            color: #777;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Solicitud de Restablecimiento de Contraseña</h1>
                        </div>
                        <div class='content'>
                            <p>Hola,</p>
                            <p>Recibimos una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
                            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                            <a href='$resetLink' class='button'>Restablecer Contraseña</a>
                            <p>Este enlace expirará en 1 hora.</p>
                        </div>
                        <div class='footer'>
                            <p>Gracias por confiar en nosotros.</p>
                            <p>El equipo de Soporte</p>
                        </div>
                    </div>
                </body>
                </html>
                ";

                $mail->send();
                $respuesta = json_encode(array('estado' => true, 'mensaje' => "Se ha enviado un enlace de recuperación de contraseña a su correo electrónico."));
            } catch (Exception $e) {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se pudo enviar el correo. Error: {$mail->ErrorInfo}"));
            }
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontró un usuario con esa cédula."));
        }
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Cédula no proporcionada."));
    }
    echo $respuesta;
}

if ($post['accion'] == 'nueva_contrasena') {
    if (isset($post['token']) && isset($post['nueva_contrasena']) && !empty($post['token']) && !empty($post['nueva_contrasena'])) {
        $token = mysqli_real_escape_string($mysqli, $post['token']);
        $nueva_contrasena = md5($post['nueva_contrasena']); // Encriptar la nueva contraseña con MD5

        // Verificar si el token es válido y obtener el correo asociado
        $stmt = $mysqli->prepare("SELECT correo_persona FROM contrasenia_reset WHERE token = ?");
        $stmt->bind_param('s', $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $correo = $row['correo_persona'];

            // Actualizar la contraseña en la tabla persona
            $stmt = $mysqli->prepare("UPDATE persona SET clave_persona = ? WHERE correo_persona = ?");
            $stmt->bind_param('ss', $nueva_contrasena, $correo);
            $stmt->execute();

            // Eliminar el registro de contrasenia_reset asociado al token
            $stmt = $mysqli->prepare("DELETE FROM contrasenia_reset WHERE token = ?");
            $stmt->bind_param('s', $token);
            $stmt->execute();

            $respuesta = json_encode(array('estado' => true, 'mensaje' => "La contraseña se ha actualizado correctamente."));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "El token proporcionado no es válido."));
        }
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Datos incompletos para restablecer la contraseña."));
    }
    echo $respuesta;
}


if ($post['accion'] == 'lproductos') {
    $sentencia = sprintf("SELECT id, nombre, pvp  from productos where id_persona='%s'", $post['cod_persona']);
    //echo $sentencia;
    $rs = mysqli_query($mysqli, $sentencia);
    if (mysqli_num_rows($rs) > 0) {
        while ($row = mysqli_fetch_array($rs)) {
            $datos[] = array(
                'codigo' => $row['id'],
                'nombre' => $row['nombre'],
                'pvp' => $row['pvp']
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron registro de productos para esta persona"));
    }
    echo $respuesta;
}

// Mostrar datos en la pagina de inventarios de la tabla de registro inicial
if ($post['accion'] == 'productosInventario') {
    // ORDER BY id DESC LIMIT 5
    $sentencia = sprintf("SELECT id, nombre, cantidad_inicial, precio_venta from registropr_inicial", $post['cod_persona']);
    //echo $sentencia;
    $rs = mysqli_query($mysqli, $sentencia);
    if (mysqli_num_rows($rs) > 0) {
        while ($row = mysqli_fetch_array($rs)) {
            $datos[] = array(
                'codigo' => $row['id'],
                'nombre' => $row['nombre'],
                'cantidad_inicial' => $row['cantidad_inicial'],
                'precio_ventas' => $row['precio_venta']
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron registro de productos para esta persona"));
    }
    echo $respuesta;
}

if ($post['accion'] == 'actnombre') {
    $sentencia = sprintf("UPDATE persona SET nom_persona = '%s', ape_persona = '%s', img_perfil = '%s'  WHERE ci_persona ='%s'", $post['nombre'], $post['apellido'], $post['imgUrl'], $post['cedula']);
    $rs = mysqli_query($mysqli, $sentencia);

    if ($rs) {
        $respuesta = json_encode(array('estado' => true, 'mensaje2' => 'Se actualizaron los datos.'));
    } else {
        $error = $mysqli->error;
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar los datos.'));
    }
    echo $respuesta;
}

if ($post['accion'] == 'lnacionalidad') {
    $sentencia = sprintf("SELECT * from nacionalidades");
    $rs = mysqli_query($mysqli, $sentencia);
    if (mysqli_num_rows($rs) > 0) {
        while ($row = mysqli_fetch_array($rs)) {
            $datos[] = array(
                'codigo' => $row['cod_nacionalidad'],
                'nombre' => $row['nombre_nacionalidad']
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}

if ($post['accion'] == 'lciudad') {
    $sentencia = sprintf("SELECT * from ciudades");
    $rs = mysqli_query($mysqli, $sentencia);
    if (mysqli_num_rows($rs) > 0) {
        while ($row = mysqli_fetch_array($rs)) {
            $datos[] = array(
                'codigo' => $row['cod_ciudad'],
                'nombre' => $row['nombre_ciudad']
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron datos"));
    }
    echo $respuesta;
}

if ($post['accion'] == 'lprovincia') {
    $sentencia = sprintf("SELECT * from provincias");
    $rs = mysqli_query($mysqli, $sentencia);
    if (mysqli_num_rows($rs) > 0) {
        while ($row = mysqli_fetch_array($rs)) {
            $datos[] = array(
                'codigo' => $row['cod_provincia'],
                'nombre' => $row['nombre_provincia']
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}

if ($post['accion'] == 'guardar_costos_produccion') {
    $codigo_persona = ($post['codigo']);
    $producto = mysqli_real_escape_string($mysqli, $post['nombre']);
    $materias_primas = $post['materiasPrimas'];
    $mano_de_obra = $post['manoDeObraList'];
    $costos_indirectos = $post['costosIndirectosList'];
    $otros_gastos = $post['otrosGastoList']; // Cambiado de otrosCostosList a otrosGastoList
    $margen_beneficio = (float)$post['margenBeneficio'];
    $utilidad_venta = (float)$post['utilidad_venta'];
    $utilidad_dis = (float)$post['utilidad_dis'];
    $impuestos = (float)$post['impuestos'];
    $costo_produccion = (float)$post['costoProduccion'];
    $costo_fabrica = (float)$post['costoFabrica'];
    $costo_distribucion = (float)$post['costoDistribucion'];
    $pvp = (float)$post['pvp'];

    // Verifica si el producto ya existe
    $query = "SELECT DISTINCT id FROM productos WHERE id_persona = '$codigo_persona' AND nombre = '$producto'";
    $result = mysqli_query($mysqli, $query);

    if (mysqli_num_rows($result) > 0) {
        // Si el producto ya existe, envía una respuesta indicando que ya está registrado
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'El producto ya existe en la base de datos.'));
        echo $respuesta;
        exit;
    }

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Inserta el producto en la tabla productos
    $query = "INSERT INTO productos (id_persona, nombre, margen_beneficio, utilidad_dis, utilidad_venta,impuestos, costo_produccion, costo_fabrica, costo_distribucion, pvp)
              VALUES ('$codigo_persona','$producto', $margen_beneficio, $utilidad_dis, $utilidad_venta, $impuestos, $costo_produccion, $costo_fabrica, $costo_distribucion, $pvp)";

    if (mysqli_query($mysqli, $query)) {
        $producto_id = mysqli_insert_id($mysqli);
        $error_occurred = false;

        // Función para ejecutar las inserciones
        function insert_data($mysqli, $producto_id, $data, $table, $include_unidad_cantidad = false)
        {
            foreach ($data as $item) {
                $nombre = mysqli_real_escape_string($mysqli, $item['nombre']);
                $costo = (float)$item['costo'];
                $unidad = $include_unidad_cantidad ? mysqli_real_escape_string($mysqli, $item['unidad']) : null;
                $cantidad = $include_unidad_cantidad ? (float)$item['cantidad'] : null;
                $query = $include_unidad_cantidad
                    ? "INSERT INTO $table (producto_id, nombre, costo, unidad, cantidad) VALUES ($producto_id, '$nombre', $costo, '$unidad', $cantidad)"
                    : "INSERT INTO $table (producto_id, nombre, costo) VALUES ($producto_id, '$nombre', $costo)";
                if (!mysqli_query($mysqli, $query)) {
                    error_log("Error al insertar en $table: " . mysqli_error($mysqli));
                    return false;
                }
            }
            return true;
        }

        // Inserta las materias primas
        if (!insert_data($mysqli, $producto_id, $materias_primas, 'materias_primas', true)) {
            $error_occurred = true;
            error_log("Error al insertar materias primas");
        }

        // Inserta la mano de obra
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $mano_de_obra, 'mano_de_obra')) {
            $error_occurred = true;
            error_log("Error al insertar mano de obra");
        }

        // Inserta los costos indirectos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $costos_indirectos, 'costos_indirectos')) {
            $error_occurred = true;
            error_log("Error al insertar costos indirectos");
        }

        // Inserta los otros gastos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $otros_gastos, 'otros_gastos')) {
            $error_occurred = true;
            error_log("Error al insertar otros gastos");
        }

        if ($error_occurred) {
            mysqli_rollback($mysqli);
            $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar algunos de los datos.'));
        } else {
            mysqli_commit($mysqli);
            $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto guardado correctamente.'));
        }
    } else {
        mysqli_rollback($mysqli);
        error_log("Error al insertar producto: " . mysqli_error($mysqli));
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar el producto.'));
    }

    // Envía la respuesta
    echo $respuesta;
}

if ($post['accion'] == 'consultarDatoProductos') {
    $id_producto = (int)$post['id'];
    $datos_producto = [];

    // Prepared statement para prevenir inyecciones SQL
    $sentencia = "
    SELECT 
        p.id as codigo,
        p.nombre,
        p.margen_beneficio as margenBeneficio,
        p.impuestos,
        p.costo_produccion as costoProduccion,
        p.costo_fabrica as costoFabrica,
        p.costo_distribucion as costoDistribucion,
        p.utilidad_dis as utilidadDis,
        p.utilidad_venta as utilidadVenta,
        p.pvp,
        mp.nombre as mp_nombre, mp.costo as mp_costo, mp.unidad as mp_unidad, mp.cantidad as mp_cantidad,
        mo.nombre as mo_nombre, mo.costo as mo_costo,
        ci.nombre as ci_nombre, ci.costo as ci_costo,
        og.nombre as og_nombre, og.costo as og_costo
    FROM 
        productos p
    LEFT JOIN 
        materias_primas mp ON p.id = mp.producto_id
    LEFT JOIN 
        mano_de_obra mo ON p.id = mo.producto_id
    LEFT JOIN 
        costos_indirectos ci ON p.id = ci.producto_id
    LEFT JOIN 
        otros_gastos og ON p.id = og.producto_id
    WHERE 
        p.id = ?
    ";

    if ($stmt = mysqli_prepare($mysqli, $sentencia)) {
        // Bind parameters
        mysqli_stmt_bind_param($stmt, "i", $id_producto);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($result) > 0) {
            $datos_producto = null; // Inicializa aquí antes del bucle

            while ($row = mysqli_fetch_assoc($result)) {
                if (is_null($datos_producto)) {
                    $datos_producto = array(
                        'codigo' => $row['codigo'],
                        'nombre' => $row['nombre'],
                        'margenBeneficio' => $row['margenBeneficio'],
                        'utilidadDis' => $row['utilidadDis'],
                        'utilidadVenta' => $row['utilidadVenta'],
                        'impuestos' => $row['impuestos'],
                        'costoProduccion' => $row['costoProduccion'],
                        'costoFabrica' => $row['costoFabrica'],
                        'costoDistribucion' => $row['costoDistribucion'],
                        'pvp' => $row['pvp'],
                        'materiasPrimas' => [],
                        'manoDeObraList' => [],
                        'costosIndirectosList' => [],
                        'otrosCostosList' => [],
                    );
                }

                // Agregar datos de materias primas
                if ($row['mp_nombre']) {
                    $datos_producto['materiasPrimas'][] = array(
                        'txt_nombre' => $row['mp_nombre'],
                        'txt_costo' => $row['mp_costo'],
                        'txt_unidad' => $row['mp_unidad'],
                        'txt_cantidad' => $row['mp_cantidad']
                    );
                }

                // Agregar datos de mano de obra
                if ($row['mo_nombre']) {
                    $datos_producto['manoDeObraList'][] = array(
                        'txt_nombre' => $row['mo_nombre'],
                        'txt_costo' => $row['mo_costo']
                    );
                }

                // Agregar datos de costos indirectos
                if ($row['ci_nombre']) {
                    $datos_producto['costosIndirectosList'][] = array(
                        'txt_nombre' => $row['ci_nombre'],
                        'txt_costo' => $row['ci_costo']
                    );
                }

                // Agregar datos de otros gastos
                if ($row['og_nombre']) {
                    $datos_producto['otrosCostosList'][] = array(
                        'txt_nombre' => $row['og_nombre'],
                        'txt_costo' => $row['og_costo']
                    );
                }
            }

            $respuesta = json_encode(array('estado' => true, 'productos' => [$datos_producto]));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "No existe"));
        }

        // Cerrar el statement
        mysqli_stmt_close($stmt);
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error en la consulta"));
        error_log("Error en la preparación de la consulta: " . mysqli_error($mysqli));
    }

    // Envía la respuesta
    echo $respuesta;
}

if ($post['accion'] == 'eliminarProducto') {
    $producto_id = (int)$post['productoId'];
    $codigo_persona = (int)$post['cod_persona'];

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Consulta para eliminar de la tabla productos
    $query_producto = "DELETE FROM productos WHERE id = $producto_id AND id_persona = $codigo_persona";

    // Función para ejecutar las eliminaciones
    function delete_data($mysqli, $producto_id, $table)
    {
        $query = "DELETE FROM $table WHERE producto_id = $producto_id";
        return mysqli_query($mysqli, $query);
    }

    $error_occurred = false;

    // Elimina de las tablas relacionadas
    if (!delete_data($mysqli, $producto_id, 'materias_primas')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'mano_de_obra')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'costos_indirectos')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'otros_gastos')) $error_occurred = true;
    if (!$error_occurred && !mysqli_query($mysqli, $query_producto)) $error_occurred = true;

    if ($error_occurred) {
        mysqli_rollback($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al eliminar el producto.'));
    } else {
        mysqli_commit($mysqli);
        $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto eliminado correctamente.'));
    }

    // Envía la respuesta
    echo $respuesta;
}

// Eliminar inventario de la tabla registropr_inicial
if ($post['accion'] == 'eliminarProductoInventario') {
    $producto_id = (int)$post['productoId'];
    $codigo_persona = (int)$post['cod_persona'];

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Consulta para eliminar de la tabla inventario
    $query_producto = "DELETE FROM registropr_inicial WHERE id = $producto_id";

    // Función para ejecutar las eliminaciones
    function delete_data($mysqli, $producto_id, $table)
    {
        $query = "DELETE FROM $table WHERE producto_id = $producto_id";
        return mysqli_query($mysqli, $query);
    }

    $error_occurred = false;

    // Elimina de las tablas relacionadas
    if (!delete_data($mysqli, $producto_id, 'materias_primas')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'mano_de_obra')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'costos_indirectos')) $error_occurred = true;
    if (!$error_occurred && !delete_data($mysqli, $producto_id, 'otros_gastos')) $error_occurred = true;
    if (!$error_occurred && !mysqli_query($mysqli, $query_producto)) $error_occurred = true;

    if ($error_occurred) {
        mysqli_rollback($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al eliminar el producto.'));
    } else {
        mysqli_commit($mysqli);
        $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto eliminado correctamente.'));
    }

    // Envía la respuesta
    echo $respuesta;
}

if ($post['accion'] == 'editarProducto') {
    $producto_id = (int)$post['codigo'];
    $producto = mysqli_real_escape_string($mysqli, $post['nombre']);
    $materias_primas = isset($post['materiasPrimas']) ? $post['materiasPrimas'] : [];
    $mano_de_obra = isset($post['manoDeObraList']) ? $post['manoDeObraList'] : [];
    $costos_indirectos = isset($post['costosIndirectosList']) ? $post['costosIndirectosList'] : [];
    $otros_gastos = isset($post['otrosCostosList']) ? $post['otrosCostosList'] : [];
    $margen_beneficio = isset($post['margenBeneficio']) ? (float)$post['margenBeneficio'] : 0;
    $utilidad_dis = isset($post['utilidad_dis']) ? (float)$post['utilidad_dis'] : 0;
    $utilidad_venta = isset($post['utilidad_venta']) ? (float)$post['utilidad_venta'] : 0;
    $impuestos = isset($post['impuestos']) ? (float)$post['impuestos'] : 0;
    $costo_produccion = isset($post['costoProduccion']) ? (float)$post['costoProduccion'] : 0;
    $costo_fabrica = isset($post['costoFabrica']) ? (float)$post['costoFabrica'] : 0;
    $costo_distribucion = isset($post['costoDistribucion']) ? (float)$post['costoDistribucion'] : 0;
    $pvp = isset($post['pvp']) ? (float)$post['pvp'] : 0;

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Actualiza el producto en la tabla productos
    $query = "UPDATE productos SET 
                nombre = '$producto', 
                margen_beneficio = $margen_beneficio, 
                utilidad_dis = $utilidad_dis,
                utilidad_venta = $utilidad_venta,
                impuestos = $impuestos, 
                costo_produccion = $costo_produccion, 
                costo_fabrica = $costo_fabrica, 
                costo_distribucion = $costo_distribucion, 
                pvp = $pvp
              WHERE id = $producto_id";

    if (mysqli_query($mysqli, $query)) {
        $error_occurred = false;

        // Función para actualizar y agregar datos a la tabla
        function update_data($mysqli, $producto_id, $data, $table, $include_unidad_cantidad = false)
        {
            $ids = [];
            foreach ($data as $item) {
                $nombre = mysqli_real_escape_string($mysqli, $item['txt_nombre']);
                $costo = (float)$item['txt_costo'];
                $unidad = $include_unidad_cantidad ? mysqli_real_escape_string($mysqli, $item['txt_unidad']) : null;
                $cantidad = $include_unidad_cantidad ? (float)$item['txt_cantidad'] : null;

                if (isset($item['id']) && !empty($item['id'])) {
                    // Actualiza el registro existente
                    $id = (int)$item['id'];
                    $ids[] = $id;
                    $query_update = $include_unidad_cantidad
                        ? "UPDATE $table SET nombre = '$nombre', costo = $costo, unidad = '$unidad', cantidad = $cantidad WHERE id = $id"
                        : "UPDATE $table SET nombre = '$nombre', costo = $costo WHERE id = $id";
                } else {
                    // Inserta un nuevo registro
                    $query_update = $include_unidad_cantidad
                        ? "INSERT INTO $table (producto_id, nombre, costo, unidad, cantidad) VALUES ($producto_id, '$nombre', $costo, '$unidad', $cantidad)"
                        : "INSERT INTO $table (producto_id, nombre, costo) VALUES ($producto_id, '$nombre', $costo)";
                    if (mysqli_query($mysqli, $query_update)) {
                        $ids[] = mysqli_insert_id($mysqli);
                    }
                }

                if (!mysqli_query($mysqli, $query_update)) {
                    return false;
                }
            }

            // Elimina los registros que no están en la nueva lista
            if (!empty($ids)) {
                $ids_to_keep = implode(',', array_map('intval', $ids));
                $query_delete = "DELETE FROM $table WHERE producto_id = $producto_id AND id NOT IN ($ids_to_keep)";
                if (!mysqli_query($mysqli, $query_delete)) {
                    return false;
                }
            }
            return true;
        }

        // Actualiza las materias primas
        if (!update_data($mysqli, $producto_id, $materias_primas, 'materias_primas', true)) $error_occurred = true;

        // Actualiza la mano de obra
        if (!$error_occurred && !update_data($mysqli, $producto_id, $mano_de_obra, 'mano_de_obra')) $error_occurred = true;

        // Actualiza los costos indirectos
        if (!$error_occurred && !update_data($mysqli, $producto_id, $costos_indirectos, 'costos_indirectos')) $error_occurred = true;

        // Actualiza los otros gastos
        if (!$error_occurred && !update_data($mysqli, $producto_id, $otros_gastos, 'otros_gastos')) $error_occurred = true;

        if ($error_occurred) {
            mysqli_rollback($mysqli);
            $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar algunos de los datos.'));
        } else {
            mysqli_commit($mysqli);
            $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto actualizado correctamente.'));
        }
    } else {
        mysqli_rollback($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar el producto.'));
    }

    // Envía la respuesta
    echo $respuesta;
}

// Consultar datos de la tabla registro inicial
/* if ($post['accion'] == 'obtenerProductosInventario') {
    $query = "SELECT * FROM registropr_inicial";
    $result = mysqli_query($mysqli, $query);

    if ($result) {
        $registros = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $registros[] = $row;
        }
        echo json_encode(array('estado' => true, 'datos' => $registros));
    } else {
        echo json_encode(array('estado' => false, 'mensaje' => 'Error al obtener la lista de registros iniciales.'));
    }
} */
// Editar invventario de la tabla registro inical
/* if ($post['accion'] == 'editarProductoInventario') {
    $codigo = (int)$post['codigo'];
    $producto_id = (int)$post['producto_id'];
    $cantidad_inicial = (int)$post['cantidad_inicial'];
    $precio_venta = (float)$post['precio_venta'];
    $fecha = mysqli_real_escape_string($mysqli, $post['fecha']);

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Actualiza el registro inicial en la tabla registropr_inicial
    $query = "UPDATE registropr_inicial SET 
                producto_id = $codigo, 
                cantidad_inicial = $cantidad_inicial, 
                precio_venta = $precio_venta, 
                fecha = '$fecha'
              WHERE id = $registro_id";

    if (mysqli_query($mysqli, $query)) {
        mysqli_commit($mysqli);
        $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Registro inicial actualizado correctamente.'));
    } else {
        mysqli_rollback($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar el registro inicial.'));
    }

    // Envía la respuesta
    echo $respuesta;
} */

// Inventario
if ($post['accion'] == 'registrar_inventario') {
    $nombre_producto = mysqli_real_escape_string($mysqli, $post['nombre']);
    $cantidad_inicial = (int)$post['cantidad_inicial'];
    $precio_venta = (float)$post['precio_venta'];

    $cantidad_vendida = (int)$post['cantidad_vendida'];
    $dinero_total = (float)$post['dinero_total'];
    $productos_regalados = (int)$post['productos_regalados'];
    $fecha = date('Y-m-d'); // Fecha actual del servidor

    // Verifica si el producto ya existe en el registro inicial para la misma fecha
    $query = "SELECT id FROM registropr_inicial WHERE nombre = '$nombre_producto' AND fecha = '$fecha'";
    $result = mysqli_query($mysqli, $query);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $producto_id = $row['id'];

        // Inserta en registros_finales
        $query = "INSERT INTO registros_finales (producto_id, cantidad_vendida, dinero_total, productos_regalados, fecha) 
                  VALUES ($producto_id, $cantidad_vendida, $dinero_total, $productos_regalados, '$fecha')";

        if (mysqli_query($mysqli, $query)) {
            $response = calculateResults($mysqli, $producto_id, $cantidad_vendida, $dinero_total, $productos_regalados, $fecha);
            echo json_encode($response);
        } else {
            echo json_encode(array('estado' => false, 'mensaje' => 'Error al registrar los datos finales.'));
        }
    } else {
        // Inicia una transacción
        mysqli_begin_transaction($mysqli);

        // Inserta en registropr_inicial
        $query = "INSERT INTO registropr_inicial (nombre, cantidad_inicial, precio_venta, fecha) 
                  VALUES ('$nombre_producto', $cantidad_inicial, $precio_venta, '$fecha')";

        if (mysqli_query($mysqli, $query)) {
            $producto_id = mysqli_insert_id($mysqli);

            // Inserta en registros_finales
            $query = "INSERT INTO registros_finales (producto_id, cantidad_vendida, dinero_total, productos_regalados, fecha) 
                      VALUES ($producto_id, $cantidad_vendida, $dinero_total, $productos_regalados, '$fecha')";

            if (mysqli_query($mysqli, $query)) {
                mysqli_commit($mysqli);
                $response = calculateResults($mysqli, $producto_id, $cantidad_vendida, $dinero_total, $productos_regalados, $fecha);
                echo json_encode($response);
            } else {
                mysqli_rollback($mysqli);
                echo json_encode(array('estado' => false, 'mensaje' => 'Error al registrar los datos finales.'));
            }
        } else {
            mysqli_rollback($mysqli);
            echo json_encode(array('estado' => false, 'mensaje' => 'Error al registrar los datos iniciales.'));
        }
    }
}

function calculateResults($mysqli, $producto_id, $cantidad_vendida, $dinero_total, $productos_regalados, $fecha)
{
    $query = "SELECT cantidad_inicial, precio_venta FROM registropr_inicial WHERE id = $producto_id";
    $result = mysqli_query($mysqli, $query);

    if ($row = mysqli_fetch_assoc($result)) {
        $cantidad_inicial = (int)$row['cantidad_inicial'];
        $precio_venta = (float)$row['precio_venta'];

        $total_income = $cantidad_vendida * $precio_venta;
        $gifted_value = $productos_regalados * $precio_venta;

        $ganancia_perdida = $total_income - $gifted_value;
        $perdida_regalados = $gifted_value;
        $productos_no_vendidos = $cantidad_inicial - $cantidad_vendida - $productos_regalados;

        // Inserta en resultados_inventario
        $query = "INSERT INTO resultados_inventario (producto_id, ganancia_perdida, perdida_regalados, productos_no_vendidos, fecha) 
                  VALUES ($producto_id, $ganancia_perdida, $perdida_regalados, $productos_no_vendidos, '$fecha')";

        if (mysqli_query($mysqli, $query)) {
            return array(
                'estado' => true,
                'mensaje' => 'Registro exitoso.',
                'ganancia_perdida' => $ganancia_perdida,
                'perdida_regalados' => $perdida_regalados,
                'productos_no_vendidos' => $productos_no_vendidos
            );
        } else {
            return array('estado' => false, 'mensaje' => 'Error al calcular y registrar los resultados.');
        }
    } else {
        return array('estado' => false, 'mensaje' => 'Error al obtener los datos iniciales del producto.');
    }

    if (isset($_POST['accion'])) {
        if ($_POST['accion'] == 'guardar_inventario') {
            if (
                isset($_POST['producto_id']) && isset($_POST['cantidad_inicial']) && isset($_POST['precio_venta'])
                && isset($_POST['cantidad_vendida']) && isset($_POST['dinero_total']) && isset($_POST['muestras'])
                && isset($_POST['ganancias_perdidas']) && isset($_POST['perdidas_productos_regalados']) && isset($_POST['productos_no_vendidos'])
                && isset($_POST['fecha_registro'])
                && !empty($_POST['producto_id']) && !empty($_POST['cantidad_inicial']) && !empty($_POST['precio_venta'])
                && !empty($_POST['cantidad_vendida']) && !empty($_POST['dinero_total']) && !empty($_POST['muestras'])
                && !empty($_POST['ganancias_perdidas']) && !empty($_POST['perdidas_productos_regalados']) && !empty($_POST['productos_no_vendidos'])
                && !empty($_POST['fecha_registro'])
            ) {
                $producto_id = mysqli_real_escape_string($mysqli, $_POST['producto_id']);
                $cantidad_inicial = (int)$_POST['cantidad_inicial'];
                $precio_venta = (float)$_POST['precio_venta'];
                $cantidad_vendida = (int)$_POST['cantidad_vendida'];
                $dinero_total = (float)$_POST['dinero_total'];
                $muestras = (int)$_POST['muestras'];
                $ganancias_perdidas = (float)$_POST['ganancias_perdidas'];
                $perdidas_productos_regalados = (float)$_POST['perdidas_productos_regalados'];
                $productos_no_vendidos = (int)$_POST['productos_no_vendidos'];
                $fecha_registro = mysqli_real_escape_string($mysqli, $_POST['fecha_registro']);
    
                // Inserta el nuevo inventario en la base de datos
                $query = "INSERT INTO inventarios (producto_id, cantidad_inicial, precio_venta, cantidad_vendida, dinero_total, muestras, ganancias_perdidas, perdidas_productos_regalados, productos_no_vendidos, fecha_registro) VALUES ('$producto_id', $cantidad_inicial, $precio_venta, $cantidad_vendida, $dinero_total, $muestras, $ganancias_perdidas, $perdidas_productos_regalados, $productos_no_vendidos, '$fecha_registro')";
                $rs = mysqli_query($mysqli, $query);
    
                if ($rs) {
                    $respuesta = json_encode(array('estado' => true, 'mensaje' => "Inventario guardado correctamente."));
                } else {
                    $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error al guardar el inventario."));
                }
                echo $respuesta;
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "Datos incompletos para guardar el inventario."));
                echo $respuesta;
            }
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "Acción no especificada o desconocida"));
            echo $respuesta;
        }
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Acción no especificada"));
        echo $respuesta;
    }

// Consulta SQL para obtener el nombre y el pvp del producto
$query = "SELECT nombre, pvp FROM productos WHERE id = $producto_id";
$result = mysqli_query($mysqli, $query);

if ($result) {
    if ($row = mysqli_fetch_assoc($result)) {
        $nombre_producto = $row['nombre'];
        $pvp_producto = $row['pvp'];

        // Devuelve el nombre y el pvp como parte de la respuesta
        $respuesta = array(
            'estado' => true,
            'nombre' => $nombre_producto,
            'pvp' => $pvp_producto
        );
    } else {
        // Producto no encontrado
        $respuesta = array(
            'estado' => false,
            'mensaje' => 'Producto no encontrado'
        );
    }
} else {
    // Error en la consulta SQL
    $respuesta = array(
        'estado' => false,
        'mensaje' => 'Error en la consulta SQL'
    );
    echo json_encode($respuesta);
exit;
}

echo json_encode($respuesta);
}
