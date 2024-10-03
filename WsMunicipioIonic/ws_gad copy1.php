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
                $mail->SMTPDebug = 0; // 0 = off (producción), 1 = mensajes del cliente, 2 = mensajes del cliente y del servidor
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
    $tproducto = (float)$post['tproducto'];
    $materias_primas = $post['materiasPrimas'];
    $mano_de_obra = $post['manoDeObraList'];
    $costos_indirectos = $post['costosIndirectosList'];
    $otros_gastos = $post['otrosGastoList'];
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
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'El producto ya existe en la base de datos.'));
        echo $respuesta;
        exit;
    }

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Inserta el producto en la tabla productos
    $query = "INSERT INTO productos (id_persona, nombre, tproducto, margen_beneficio, utilidad_dis, utilidad_venta, impuestos, costo_produccion, costo_fabrica, costo_distribucion, pvp)
              VALUES ('$codigo_persona', '$producto', $tproducto, $margen_beneficio, $utilidad_dis, $utilidad_venta, $impuestos, $costo_produccion, $costo_fabrica, $costo_distribucion, $pvp)";

    if (mysqli_query($mysqli, $query)) {
        $producto_id = mysqli_insert_id($mysqli);
        $error_occurred = false;

        // Función para ejecutar las inserciones
        function insert_data($mysqli, $producto_id, $data, $table, $include_unidad_cantidad = false, $include_vtotal = false, $include_mano_de_obra = false, $include_costos_indirectos= false) {
            foreach ($data as $item) {
                $nombre = mysqli_real_escape_string($mysqli, $item['nombre']);
                $costo = (float)$item['costo'];
                $unidad = $include_unidad_cantidad ? mysqli_real_escape_string($mysqli, $item['unidad']) : null;
                $cantidad = $include_unidad_cantidad ? (float)$item['cantidad'] : null;
                $vtotal = $include_vtotal ? (float)$item['vtotal'] : null;
                $sueldoMensual = $include_mano_de_obra ? (float)$item['sueldoMensual'] : null;
                $tipoTiempo = $include_mano_de_obra ? mysqli_real_escape_string($mysqli, $item['tipoTiempo']) : null;
                $horasTrabajadas = $include_mano_de_obra ? (float)$item['horasTrabajadas'] : null;
                $pgmensual = $include_costos_indirectos ? (float)($item['valorMensual'] ?? 0) : null;
                $horas = $include_costos_indirectos ? (float)$item['horas'] : null;
                $cantidadagua = $include_costos_indirectos ? (float)$item['cantidadagua']:null;
                $cantidadGas = $include_costos_indirectos ? (float)$item['cantidadGas']:null;
                $cantidadHoras = $include_costos_indirectos ? (float)($item['cantidadHoras']?? 0) : null;


                if ($include_unidad_cantidad && $include_vtotal) {
                    $query = "INSERT INTO $table (producto_id, nombre, vtotal, costo, unidad, cantidad) VALUES ($producto_id, '$nombre', $vtotal, $costo, '$unidad', $cantidad)";
                } elseif ($include_unidad_cantidad) {
                    $query = "INSERT INTO $table (producto_id, nombre, costo, unidad, cantidad) VALUES ($producto_id, '$nombre', $costo, '$unidad', $cantidad)";
                } elseif ($include_mano_de_obra) {
                    $query = "INSERT INTO $table (producto_id, nombre, costo, sueldoMensual, tipoTiempo, horasTrabajadas) VALUES ($producto_id, '$nombre', $costo, $sueldoMensual, '$tipoTiempo', $horasTrabajadas)";
                } elseif ($include_costos_indirectos) {
                    $query = "INSERT INTO $table (producto_id, nombre, costo, pgmensual, horas,cantidadagua,cantidadGas,cantidadHoras ) VALUES ($producto_id, '$nombre', $costo, $pgmensual, $horas, $cantidadagua, $cantidadGas,$cantidadHoras )";
                } elseif ($include_vtotal) {
                    $query = "INSERT INTO $table (producto_id, nombre, vtotal, costo) VALUES ($producto_id, '$nombre', $vtotal, $costo)";
                } else {
                    $query = "INSERT INTO $table (producto_id, nombre, costo) VALUES ($producto_id, '$nombre', $costo)";
                }

                if (!mysqli_query($mysqli, $query)) {
                    error_log("Error al insertar en $table: " . mysqli_error($mysqli));
                    return false;
                }
            }
            return true;
        }

        // Inserta las materias primas con el campo vtotal
        if (!insert_data($mysqli, $producto_id, $materias_primas, 'materias_primas', true, true)) {
            $error_occurred = true;
            error_log("Error al insertar materias primas");
        }

        // Inserta la mano de obra con los nuevos campos: sueldoMensual, tipoTiempo, horasTrabajadas
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $mano_de_obra, 'mano_de_obra', false, false, true)) {
            $error_occurred = true;
            error_log("Error al insertar mano de obra");
        }

        // Inserta los costos indirectos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $costos_indirectos, 'costos_indirectos', false, false, false, true)) {
            $error_occurred = true;
            error_log("Error al insertar costos indirectos");
        }

        // Inserta los otros gastos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $otros_gastos, 'otros_gastos', false, true)) {
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

    echo $respuesta;
}
if ($post['accion'] == 'consultarDatoProductos') {
    $id_producto = (int)$post['id'];
    $datos_producto = [
        'codigo' => '',
        'nombre' => '',
        'tproducto' => '',
        'margenBeneficio' => 0,
        'utilidadDis' => 0,
        'utilidadVenta' => 0,
        'impuestos' => 0,
        'costoProduccion' => 0,
        'costoFabrica' => 0,
        'costoDistribucion' => 0,
        'pvp' => 0,
        'materiasPrimas' => [],
        'manoDeObraList' => [],
        'costosIndirectosList' => [],
        'otrosCostosList' => [],
    ];

    $sentencia = "
    SELECT 
        p.id as codigo,
        p.nombre,
        p.tproducto,
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
        mysqli_stmt_bind_param($stmt, "i", $id_producto);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                // Inicializar datos del producto si no está ya inicializado
                if ($datos_producto['codigo'] === '') {
                    $datos_producto['codigo'] = $row['codigo'];
                    $datos_producto['nombre'] = $row['nombre'];
                    $datos_producto['tproducto'] = $row['tproducto'];
                    $datos_producto['margenBeneficio'] = $row['margenBeneficio'];
                    $datos_producto['utilidadDis'] = $row['utilidadDis'];
                    $datos_producto['utilidadVenta'] = $row['utilidadVenta'];
                    $datos_producto['impuestos'] = $row['impuestos'];
                    $datos_producto['costoProduccion'] = $row['costoProduccion'];
                    $datos_producto['costoFabrica'] = $row['costoFabrica'];
                    $datos_producto['costoDistribucion'] = $row['costoDistribucion'];
                    $datos_producto['pvp'] = $row['pvp'];
                }

                // Materia Prima
                if ($row['mp_nombre']) {
                    $datos_producto['materiasPrimas'][] = array(
                        'nombre' => $row['mp_nombre'],
                        'costo' => $row['mp_costo'],
                        'unidad' => $row['mp_unidad'],
                        'cantidad' => $row['mp_cantidad']
                    );
                }

                // Mano de Obra
                if ($row['mo_nombre']) {
                    $datos_producto['manoDeObraList'][] = array(
                        'nombre' => $row['mo_nombre'],
                        'costo' => $row['mo_costo']
                    );
                }

                // Costos Indirectos
                if ($row['ci_nombre']) {
                    $datos_producto['costosIndirectosList'][] = array(
                        'nombre' => $row['ci_nombre'],
                        'costo' => $row['ci_costo']
                    );
                }

                // Otros Gastos
                if ($row['og_nombre']) {
                    $datos_producto['otrosCostosList'][] = array(
                        'nombre' => $row['og_nombre'],
                        'costo' => $row['og_costo']
                    );
                }
            }

            $respuesta = json_encode(array('estado' => true, 'productos' => [$datos_producto]));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "No existe"));
        }

        mysqli_stmt_close($stmt);
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error en la preparación de la consulta"));
        error_log("Error en la preparación de la consulta: " . mysqli_error($mysqli));
    }

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
if (isset($data['accion'])) {
    switch ($data['accion']) {
        case 'guardar_inventario':
            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare("
                INSERT INTO inventario (
                    producto_id, cantidad_inicial, precio_venta, cantidad_vendida, dinero_total,
                    muestras, ganancias_perdidas, perdidas_productos_regalados, productos_no_vendidos, fecha_registro
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            if ($stmt) {
                $stmt->bind_param(
                    'iiddddddss',
                    $data['producto_id'],
                    $data['cantidad_inicial'],
                    $data['precio_venta'],
                    $data['cantidad_vendida'],
                    $data['dinero_total'],
                    $data['muestras'],
                    $data['ganancias_perdidas'],
                    $data['perdidas_productos_regalados'],
                    $data['productos_no_vendidos'],
                    $data['fecha_registro']
                );

                if ($stmt->execute()) {
                    echo json_encode(['estado' => true, 'mensaje' => 'Datos guardados exitosamente.']);
                } else {
                    echo json_encode(['estado' => false, 'mensaje' => 'Error al guardar los datos: ' . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(['estado' => false, 'mensaje' => 'Error al preparar la consulta.']);
            }
            break;

            // Otros casos aquí...

        default:
            echo json_encode(['estado' => false, 'mensaje' => 'Acción no reconocida.']);
            break;
    }
}


// INSERTAR PRODUCTO
if ($post['accion'] == 'guardar_inventario') {
    $producto_id = $post['producto_id'];
    $cantidad_inicial = $post['cantidad_inicial'];
    $fecha_registro = $post['fecha_registro'];

    // Preparar la consulta para insertar en inventario_registro_inicial
    $stmt_inicial = mysqli_prepare($mysqli, "INSERT INTO inventario_registro_inicial (RI_CANTIDAD_INICIAL, RI_FECHA, PROD_CODIGO) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt_inicial, "isi", $cantidad_inicial, $fecha_registro, $producto_id);

    // Ejecutar la consulta y verificar si fue exitosa
    if (mysqli_stmt_execute($stmt_inicial)) {
        // Obtener el ID autoincremental de la fila recién insertada
        $ri_codigo = mysqli_insert_id($mysqli);

        // Preparar la consulta para insertar en inventario_registro_final
        $stmt_final = mysqli_prepare($mysqli, "INSERT INTO inventario_registro_final (RF_CODIGO, RF_CANTIDAD_VENDIDA, RF_DINERO_TOTAL, RF_PRODUCTOS_MUESTRA, RF_PRODUCTOS_DESECHADOS, RI_CODIGO) VALUES (NULL, 0, 0, 0, 0, ?)");
        mysqli_stmt_bind_param($stmt_final, "i", $ri_codigo);

        // Ejecutar la consulta y verificar si fue exitosa
        if (mysqli_stmt_execute($stmt_final)) {
            // Obtener el ID autoincremental de la fila recién insertada en inventario_registro_final
            $rf_codigo = mysqli_insert_id($mysqli);

            // Preparar la consulta para insertar en inventario_registro_resultado
            $stmt_resultado = mysqli_prepare($mysqli, "INSERT INTO inventario_registro_resultado (RS_CODIGO, RS_GANANCIA_PERDIDA, RS_PERDIDA_REGALADOS, RS_PRODUCTOS_NO_VENDIDOS, RF_CODIGO) VALUES (NULL, 0, 0, 0, ?)");
            mysqli_stmt_bind_param($stmt_resultado, "i", $rf_codigo);

            // Ejecutar la consulta y verificar si fue exitosa
            if (mysqli_stmt_execute($stmt_resultado)) {
                $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Datos guardados exitosamente'));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar los datos en inventario_registro_resultado: ' . mysqli_stmt_error($stmt_resultado)));
            }
            mysqli_stmt_close($stmt_resultado);
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar los datos en inventario_registro_final: ' . mysqli_stmt_error($stmt_final)));
        }
        mysqli_stmt_close($stmt_final);
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar los datos en inventario_registro_inicial: ' . mysqli_stmt_error($stmt_inicial)));
    }

    mysqli_stmt_close($stmt_inicial);
    echo $respuesta;
}

// Cargar productos
if ($post['accion'] == 'cargar_productos') {
    if (isset($post['id_persona'])) {
        $id_persona = $post['id_persona'];
        error_log("ID Persona recibido: " . $id_persona); // Depuración

        // Consulta para obtener productos
        $sentencia = "SELECT id, nombre, pvp FROM productos WHERE id_persona = ?";
        $stmt = $mysqli->prepare($sentencia);
        if (!$stmt) {
            error_log("Error en la preparación de la consulta: " . $mysqli->error);
        }
        $stmt->bind_param('i', $id_persona);

        if (!$stmt->execute()) {
            error_log("Error en la ejecución de la consulta: " . $stmt->error);
        }

        $rs = $stmt->get_result();

        if ($rs->num_rows > 0) {
            $datos = array();
            while ($row = $rs->fetch_assoc()) {
                $datos[] = array(
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'pvp' => $row['pvp']
                );
            }
            $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron productos"));
        }
        echo $respuesta;

        $stmt->close();
    } else {
        echo json_encode(array('estado' => false, 'mensaje' => "ID de persona no proporcionado."));
    }
}
if ($post['accion'] == 'obtener_cantidad_inicial') {
    $producto_id = $post['producto_id'];

    $sentencia = "
        SELECT 
            iri.RI_CANTIDAD_INICIAL,
            (irf.RF_CANTIDAD_VENDIDA + irf.RF_PRODUCTOS_MUESTRA + irf.RF_PRODUCTOS_DESECHADOS) AS total_vendido,
            (iri.RI_CANTIDAD_INICIAL - (irf.RF_CANTIDAD_VENDIDA + irf.RF_PRODUCTOS_MUESTRA + irf.RF_PRODUCTOS_DESECHADOS)) AS cantidad_actual
        FROM inventario_registro_inicial iri
        INNER JOIN inventario_registro_final irf ON iri.RI_CODIGO = irf.RI_CODIGO
        WHERE iri.PROD_CODIGO = '$producto_id'
        ORDER BY iri.RI_FECHA DESC
        LIMIT 1";

    $rs = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($rs) > 0) {
        $row = mysqli_fetch_assoc($rs);
        $respuesta = json_encode(array(
            'estado' => true,
            'cantidad_inicial' => $row['cantidad_actual']
        ));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontró cantidad inicial para este producto"));
    }

    echo $respuesta;
}
// Guardar registro final
if ($post['accion'] == 'guardar_registro_final') {
    $registro_inicial_id = $post['registro_inicial_id'];
    $cantidad_vendida = $post['cantidad_vendida'];
    $productos_muestra = $post['productos_muestra'];
    $productos_desechados = $post['productos_desechados'];
    $dinero_total = $post['dinero_total']; // Recibe el dinero total calculado

    // Preparar la consulta
    $stmt = mysqli_prepare($mysqli, "INSERT INTO inventario_registro_final (RF_CANTIDAD_VENDIDA, RF_DINERO_TOTAL, RF_PRODUCTOS_MUESTRA, RF_PRODUCTOS_DESECHADOS, RI_CODIGO) VALUES (?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "idiii", $cantidad_vendida, $dinero_total, $productos_muestra, $productos_desechados, $registro_inicial_id);

    // Ejecutar la consulta y verificar si fue exitosa
    if (mysqli_stmt_execute($stmt)) {
        $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Datos del registro final guardados exitosamente'));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar los datos del registro final: ' . mysqli_stmt_error($stmt)));
    }

    mysqli_stmt_close($stmt);
    echo $respuesta;
}

// Obtener el último registro inicial
if ($post['accion'] == 'ultimo_registro_inicial') {
    $sentencia = "SELECT RI_CODIGO AS id FROM inventario_registro_inicial ORDER BY RI_CODIGO DESC LIMIT 1";
    $rs = mysqli_query($mysqli, $sentencia);

    if ($row = mysqli_fetch_assoc($rs)) {
        $respuesta = json_encode(array('estado' => true, 'datos' => $row));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontró el último registro inicial"));
    }
    echo $respuesta;
}
if ($post['accion'] == 'cargar_productos2') {
    // Obtener la fecha proporcionada o usar la fecha actual si no se proporciona
    $fecha = isset($post['fecha']) ? $post['fecha'] : date('Y-m-d');

    // Obtener el id_persona del post
    $id_persona = isset($post['id_persona']) ? $post['id_persona'] : '';

    // Consulta con INNER JOIN y filtro por la fecha y id_persona
    $sentencia = "
        SELECT 
            p.id, 
            p.nombre, 
            p.pvp, 
            iri.RI_CODIGO, 
            iri.RI_CANTIDAD_INICIAL, 
            iri.RI_FECHA, 
            irf.RF_CODIGO, 
            irf.RF_CANTIDAD_VENDIDA, 
            irf.RF_DINERO_TOTAL, 
            irf.RF_PRODUCTOS_MUESTRA, 
            irf.RF_PRODUCTOS_DESECHADOS,
            irr.RS_CODIGO,
            irr.RS_GANANCIA_PERDIDA,
            irr.RS_PERDIDA_REGALADOS + irr.RS_PRODUCTOS_NO_VENDIDOS AS RS_TOTAL_PERDIDA
        FROM 
            productos p
        LEFT JOIN 
            inventario_registro_inicial iri ON p.id = iri.PROD_CODIGO
        LEFT JOIN 
            inventario_registro_final irf ON iri.RI_CODIGO = irf.RI_CODIGO
        INNER JOIN 
            inventario_registro_resultado irr ON irf.RF_CODIGO = irr.RF_CODIGO
        WHERE 
            iri.RI_FECHA = '$fecha' AND
            p.id_persona = '$id_persona'
    ";

    $rs = mysqli_query($mysqli, $sentencia);

    if (!$rs) {
        $error = mysqli_error($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error en la consulta: $error"));
        echo $respuesta;
        exit;
    }

    if (mysqli_num_rows($rs) > 0) {
        $datos = array();
        while ($row = mysqli_fetch_assoc($rs)) {
            $total_muestra_desechados = $row['RF_PRODUCTOS_MUESTRA'] + $row['RF_PRODUCTOS_DESECHADOS'];
            $datos[] = array(
                'id' => $row['id'],
                'nombre' => $row['nombre'],
                'pvp' => $row['pvp'],
                'RI_CODIGO' => $row['RI_CODIGO'],
                'RI_CANTIDAD_INICIAL' => $row['RI_CANTIDAD_INICIAL'],
                'RI_FECHA' => $row['RI_FECHA'],
                'RF_CODIGO' => $row['RF_CODIGO'],
                'RF_CANTIDAD_VENDIDA' => $row['RF_CANTIDAD_VENDIDA'],
                'RF_DINERO_TOTAL' => $row['RF_DINERO_TOTAL'],
                'RF_PRODUCTOS_MUESTRA' => $row['RF_PRODUCTOS_MUESTRA'],
                'RF_PRODUCTOS_DESECHADOS' => $row['RF_PRODUCTOS_DESECHADOS'],
                'RS_CODIGO' => $row['RS_CODIGO'],
                'RS_GANANCIA_PERDIDA' => $row['RS_GANANCIA_PERDIDA'],
                'RS_TOTAL_PERDIDA' => $row['RS_TOTAL_PERDIDA'],
                'total_muestra_desechados' => $total_muestra_desechados,
            );
        }
        $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
    } else {
        $respuesta = json_encode(array('estado' => true, 'datos' => array()));
    }
    echo $respuesta;
}


if ($post['accion'] == 'cargar_productos3') {
    $ri_codigo = $post['ri_codigo'];
    $rf_codigo = isset($post['rf_codigo']) && $post['rf_codigo'] !== '' ? $post['rf_codigo'] : null;

    if ($rf_codigo === null) {
        // Si RF_CODIGO es null o vacío, solo filtramos por RI_CODIGO
        $sentencia = "
            SELECT 
                p.id, 
                p.nombre, 
                p.pvp, 
                iri.RI_CODIGO, 
                iri.RI_CANTIDAD_INICIAL, 
                iri.RI_FECHA
            FROM 
                inventario_registro_inicial iri
            INNER JOIN 
                productos p ON p.id = iri.PROD_CODIGO
            WHERE 
                iri.RI_CODIGO = ?
        ";

        $stmt = mysqli_prepare($mysqli, $sentencia);
        mysqli_stmt_bind_param($stmt, "i", $ri_codigo);
    } else {
        // Si RF_CODIGO tiene un valor, filtrar por ambos códigos
        $sentencia = "
            SELECT 
                p.id, 
                p.nombre, 
                p.pvp, 
                iri.RI_CODIGO, 
                iri.RI_CANTIDAD_INICIAL, 
                iri.RI_FECHA, 
                irf.RF_CODIGO, 
                irf.RF_CANTIDAD_VENDIDA, 
                irf.RF_DINERO_TOTAL, 
                irf.RF_PRODUCTOS_MUESTRA, 
                irf.RF_PRODUCTOS_DESECHADOS
            FROM 
                inventario_registro_inicial iri
            INNER JOIN 
                productos p ON p.id = iri.PROD_CODIGO
            LEFT JOIN 
                inventario_registro_final irf ON iri.RI_CODIGO = irf.RI_CODIGO
            WHERE 
                iri.RI_CODIGO = ? AND (irf.RF_CODIGO = ? OR irf.RF_CODIGO IS NULL)
        ";

        $stmt = mysqli_prepare($mysqli, $sentencia);
        mysqli_stmt_bind_param($stmt, "ii", $ri_codigo, $rf_codigo);
    }

    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);
        if (mysqli_num_rows($result) > 0) {
            $datos = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $datos[] = array(
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'pvp' => $row['pvp'],
                    'RI_CODIGO' => $row['RI_CODIGO'],
                    'RI_CANTIDAD_INICIAL' => $row['RI_CANTIDAD_INICIAL'],
                    'RI_FECHA' => $row['RI_FECHA'],
                    'RF_CODIGO' => isset($row['RF_CODIGO']) ? $row['RF_CODIGO'] : null,
                    'RF_CANTIDAD_VENDIDA' => isset($row['RF_CANTIDAD_VENDIDA']) ? $row['RF_CANTIDAD_VENDIDA'] : 0,
                    'RF_DINERO_TOTAL' => isset($row['RF_DINERO_TOTAL']) ? $row['RF_DINERO_TOTAL'] : 0,
                    'RF_PRODUCTOS_MUESTRA' => isset($row['RF_PRODUCTOS_MUESTRA']) ? $row['RF_PRODUCTOS_MUESTRA'] : 0,
                    'RF_PRODUCTOS_DESECHADOS' => isset($row['RF_PRODUCTOS_DESECHADOS']) ? $row['RF_PRODUCTOS_DESECHADOS'] : 0
                );
            }
            $respuesta = json_encode(array('estado' => true, 'datos' => $datos));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => "No se encontraron registros con los códigos proporcionados"));
        }
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error en la consulta: ' . mysqli_stmt_error($stmt)));
    }

    mysqli_stmt_close($stmt);
    echo $respuesta;
}

if ($post['accion'] == 'actualizar_cantidad_inicial') {
    $ri_codigo = $post['ri_codigo'];
    $nueva_cantidad = $post['nueva_cantidad'];

    $sentencia = "
        UPDATE inventario_registro_inicial
        SET RI_CANTIDAD_INICIAL = ?
        WHERE RI_CODIGO = ?
    ";

    $stmt = mysqli_prepare($mysqli, $sentencia);
    mysqli_stmt_bind_param($stmt, "ii", $nueva_cantidad, $ri_codigo);

    if (mysqli_stmt_execute($stmt)) {
        $respuesta = json_encode(array('estado' => true));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar la cantidad inicial: ' . mysqli_stmt_error($stmt)));
    }

    mysqli_stmt_close($stmt);
    echo $respuesta;
}

if ($post['accion'] == 'actualizar_registro_final') {
    $rf_codigo = $post['rf_codigo'];
    $ri_codigo = $post['ri_codigo'];
    $cantidad_vendida = $post['cantidad_vendida'];
    $productos_muestra = $post['productos_muestra'];
    $productos_desechados = $post['productos_desechados'];
    $dinero_total = $post['dinero_total'];

    $sentencia = "
        UPDATE inventario_registro_final
        SET 
            RF_CANTIDAD_VENDIDA = ?, 
            RF_DINERO_TOTAL = ?, 
            RF_PRODUCTOS_MUESTRA = ?, 
            RF_PRODUCTOS_DESECHADOS = ?
        WHERE 
            RF_CODIGO = ? AND RI_CODIGO = ?
    ";

    $stmt = mysqli_prepare($mysqli, $sentencia);
    mysqli_stmt_bind_param($stmt, "idiiii", $cantidad_vendida, $dinero_total, $productos_muestra, $productos_desechados, $rf_codigo, $ri_codigo);

    if (mysqli_stmt_execute($stmt)) {
        // Obtener el costo_fabrica y costo_produccion del producto
        $query = "
            SELECT  p.costo_fabrica, p.costo_produccion, p.pvp
            FROM inventario_registro_inicial ri
            JOIN productos p ON ri.PROD_CODIGO = p.id
            WHERE ri.RI_CODIGO = ?
        ";
        $stmt = mysqli_prepare($mysqli, $query);
        mysqli_stmt_bind_param($stmt, "i", $ri_codigo);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $costo_fabrica, $costo_produccion, $pvp);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);

        // Calcular la ganancia/perdida
        $ganancia_perdida = ($costo_fabrica - $costo_produccion) * $cantidad_vendida;

        $perdida_regalados = $productos_muestra * $pvp;
        $productos_no_vendidos = $productos_desechados * $pvp;

        // Actualizar en inventario_registro_resultado
        $update_query = "
            UPDATE inventario_registro_resultado
            SET RS_GANANCIA_PERDIDA = ?, RS_PERDIDA_REGALADOS = ?, RS_PRODUCTOS_NO_VENDIDOS = ?
            WHERE RF_CODIGO = ?
        ";
        $stmt = mysqli_prepare($mysqli, $update_query);
        mysqli_stmt_bind_param($stmt, "dddi", $ganancia_perdida, $perdida_regalados, $productos_no_vendidos, $rf_codigo);

        if (mysqli_stmt_execute($stmt)) {
            $respuesta = json_encode(array('estado' => true));
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar en inventario_registro_resultado: ' . mysqli_stmt_error($stmt)));
        }

        mysqli_stmt_close($stmt);
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al actualizar el registro final: ' . mysqli_stmt_error($stmt)));
    }

    echo $respuesta;
}



if ($post['accion'] == 'eliminar') {
    $ri_codigo = $post['RI_CODIGO'];

    // Primero, obtenemos el RF_CODIGO relacionado con el RI_CODIGO
    $consulta_rf_codigo = "SELECT RF_CODIGO FROM inventario_registro_final WHERE RI_CODIGO = '$ri_codigo'";
    $resultado_rf_codigo = mysqli_query($mysqli, $consulta_rf_codigo);

    if (!$resultado_rf_codigo) {
        $error = mysqli_error($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => "Error en la consulta: $error"));
        echo $respuesta;
        exit;
    }

    $rf_codigo = mysqli_fetch_assoc($resultado_rf_codigo)['RF_CODIGO'];

    // Eliminar registros en inventario_registro_resultado
    $sentencia_resultado = "DELETE FROM inventario_registro_resultado WHERE RF_CODIGO = '$rf_codigo'";
    mysqli_query($mysqli, $sentencia_resultado);

    // Eliminar registros en inventario_registro_final
    $sentencia_final = "DELETE FROM inventario_registro_final WHERE RF_CODIGO = '$rf_codigo'";
    mysqli_query($mysqli, $sentencia_final);

    // Eliminar registros en inventario_registro_inicial
    $sentencia_inicial = "DELETE FROM inventario_registro_inicial WHERE RI_CODIGO = '$ri_codigo'";
    mysqli_query($mysqli, $sentencia_inicial);

    if (mysqli_affected_rows($mysqli) > 0) {
        $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto eliminado con éxito'));
    } else {
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'No se encontró el producto para eliminar'));
    }

    echo $respuesta;
}