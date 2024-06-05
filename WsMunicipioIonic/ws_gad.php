<?php
include_once('config.php');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT,GET,POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header('Content-Type: application/json; charset=utf-8');

$respuesta = "";
$post = json_decode(file_get_contents("php://input"), true);

if(isset($post['accion'])) {
    if ($post['accion'] == 'login') {
        if(isset($post['usuario']) && isset($post['clave']) && !empty($post['usuario']) && !empty($post['clave'])) {
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
        if (isset($post['cedula']) && isset($post['tipoced']) && isset($post['nombre']) && isset($post['apellido']) && isset($post['etnia']) && isset($post['discapacidad']) && isset($post['tipodis']) && isset($post['porcentajedis']) && isset($post['ncarnetdis']) && isset($post['ocupacion']) && isset($post['nacionalidad']) && isset($post['ciudad']) && isset($post['provincia']) && isset($post['parroquia']) && isset($post['barrio']) && isset($post['calle1']) && isset($post['calle2']) && isset($post['neducacion']) && isset($post['genero']) && isset($post['correo']) && isset($post['telefono']) && isset($post['clave']) && isset($post['conf_clave'])
            && !empty($post['cedula']) && !empty($post['nombre']) && !empty($post['apellido']) && !empty($post['correo']) && !empty($post['telefono']) && !empty($post['clave']) && !empty($post['conf_clave'])) {
    
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
    
            $sentencia = sprintf("INSERT INTO persona (ci_persona, cod_tipoced_persona, nom_persona, ape_persona, fecha_nacimiento, edad_persona, ecivil_persona, etnia_persona, dis_persona, tipo_dis_persona, porcentaje_dis_persona, ncarnet_dis_persona, ocupacion_persona, cod_nacionalidad_persona, cod_ciudad_persona, cod_provincia_persona, parroquia_persona, barrio_persona, calle1_persona, calle2_persona, neducacion_persona, genero_persona, correo_persona, telefono_persona, clave_persona, cod_rol_persona) 
                VALUES ('%s', %s, '%s', '%s', '%s', TIMESTAMPDIFF(YEAR, '%s', CURDATE()), '%s', '%s', '%s', '%s', '%s', '%s', '%s', %s, %s, %s, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 2);",
                $post['cedula'], $post['tipoced'], $post['nombre'], $post['apellido'], $post['fecha_nacimiento'], $post['fecha_nacimiento'], $post['ecivil'], $post['etnia'], $post['discapacidad'], $post['tipodis'], $post['porcentajedis'], $post['ncarnetdis'], $post['ocupacion'], $post['nacionalidad'], $post['ciudad'], $post['provincia'], $post['parroquia'], $post['barrio'], $post['calle1'], $post['calle2'], $post['neducacion'], $post['genero'], $post['correo'], $post['telefono'], $clave_md5);
    
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

//Nueva acción para recuperación de contraseña
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

            // Ajuste de la consulta para usar la columna correcta
            $stmt = $mysqli->prepare("DELETE FROM contrasenia_reset WHERE correo_persona = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();

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

if($post['accion']=='lproductos')
{
    $sentencia=sprintf("SELECT id, nombre, pvp  from productos where id_persona='%s'",$post['cod_persona']);
    //echo $sentencia;
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'id'=>$row['id'],
                'nombre'=>$row['nombre'],
                'pvp'=>$row['pvp']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de productos para esta persona"));
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

if($post['accion']=='lnacionalidad')
{
    $sentencia=sprintf("SELECT * from nacionalidades");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_nacionalidad'],
                'nombre'=> $row['nombre_nacionalidad']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}

if($post['accion']=='lciudad')
{
    $sentencia=sprintf("SELECT * from ciudades");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_ciudad'],
                'nombre'=> $row['nombre_ciudad']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron datos"));
    }
    echo $respuesta;
}

if($post['accion']=='lprovincia')
{
    $sentencia=sprintf("SELECT * from provincias");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_provincia'],
                'nombre'=> $row['nombre_provincia']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}

if ($post['accion'] == 'guardar_costos_produccion') {
    $codigo_persona = ($post['codigo']);
    $producto = mysqli_real_escape_string($mysqli, $post['nombre']);
    $materias_primas = $post['materiasPrimas'];
    $mano_de_obra = $post['manoDeObraList'];
    $costos_indirectos = $post['costosIndirectosList'];
    $otros_gastos = $post['otrosCostosList'];
    $margen_beneficio = (float)$post['margenBeneficio'];
    $impuestos = (float)$post['impuestos'];
    $costo_produccion = (float)$post['costoProduccion'];
    $costo_fabrica = (float)$post['costoFabrica'];
    $costo_distribucion = (float)$post['costoDistribucion'];
    $pvp = (float)$post['pvp'];

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Inserta el producto en la tabla productos
    $query = "INSERT INTO productos (id_persona,nombre, margen_beneficio, impuestos, costo_produccion, costo_fabrica, costo_distribucion, pvp)
              VALUES ('$codigo_persona','$producto', $margen_beneficio, $impuestos, $costo_produccion, $costo_fabrica, $costo_distribucion, $pvp)";

    if (mysqli_query($mysqli, $query)) {
        $producto_id = mysqli_insert_id($mysqli);
        $error_occurred = false;

        // Función para ejecutar las inserciones
        function insert_data($mysqli, $producto_id, $data, $table) {
            foreach ($data as $item) {
                $nombre = mysqli_real_escape_string($mysqli, $item['nombre']);
                $costo = (float)$item['costo'];
                $query = "INSERT INTO $table (producto_id, nombre, costo) VALUES ($producto_id, '$nombre', $costo)";
                if (!mysqli_query($mysqli, $query)) {
                    return false;
                }
            }
            return true;
        }

        // Inserta las materias primas
        if (!insert_data($mysqli, $producto_id, $materias_primas, 'materias_primas')) $error_occurred = true;

        // Inserta la mano de obra
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $mano_de_obra, 'mano_de_obra')) $error_occurred = true;

        // Inserta los costos indirectos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $costos_indirectos, 'costos_indirectos')) $error_occurred = true;

        // Inserta los otros gastos
        if (!$error_occurred && !insert_data($mysqli, $producto_id, $otros_gastos, 'otros_gastos')) $error_occurred = true;

        if ($error_occurred) {
            mysqli_rollback($mysqli);
            $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar algunos de los datos.'));
        } else {
            mysqli_commit($mysqli);
            $respuesta = json_encode(array('estado' => true, 'mensaje' => 'Producto guardado correctamente.'));
        }
    } else {
        mysqli_rollback($mysqli);
        $respuesta = json_encode(array('estado' => false, 'mensaje' => 'Error al guardar el producto.'));
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
    function delete_data($mysqli, $producto_id, $table) {
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
    $codigo_persona = ($post['codigo']);
    $producto_id = (int)$post['producto_id']; // Suponiendo que envías el ID del producto a editar
    $producto = mysqli_real_escape_string($mysqli, $post['nombre']);
    $materias_primas = $post['materiasPrimas'];
    $mano_de_obra = $post['manoDeObraList'];
    $costos_indirectos = $post['costosIndirectosList'];
    $otros_gastos = $post['otrosCostosList'];
    $margen_beneficio = (float)$post['margenBeneficio'];
    $impuestos = (float)$post['impuestos'];
    $costo_produccion = (float)$post['costoProduccion'];
    $costo_fabrica = (float)$post['costoFabrica'];
    $costo_distribucion = (float)$post['costoDistribucion'];
    $pvp = (float)$post['pvp'];

    // Inicia una transacción
    mysqli_begin_transaction($mysqli);

    // Actualiza el producto en la tabla productos
    $query = "UPDATE productos SET 
              nombre = '$producto', 
              margen_beneficio = $margen_beneficio, 
              impuestos = $impuestos, 
              costo_produccion = $costo_produccion, 
              costo_fabrica = $costo_fabrica, 
              costo_distribucion = $costo_distribucion, 
              pvp = $pvp
              WHERE id = $producto_id AND id_persona = '$codigo_persona'";

    if (mysqli_query($mysqli, $query)) {
        $error_occurred = false;

        // Función para actualizar datos
        function update_data($mysqli, $producto_id, $data, $table) {
            // Primero eliminar los registros existentes
            $delete_query = "DELETE FROM $table WHERE producto_id = $producto_id";
            if (!mysqli_query($mysqli, $delete_query)) {
                return false;
            }

            // Luego insertar los nuevos registros
            foreach ($data as $item) {
                $nombre = mysqli_real_escape_string($mysqli, $item['nombre']);
                $costo = (float)$item['costo'];
                $query = "INSERT INTO $table (producto_id, nombre, costo) VALUES ($producto_id, '$nombre', $costo)";
                if (!mysqli_query($mysqli, $query)) {
                    return false;
                }
            }
            return true;
        }

        // Actualiza las materias primas
        if (!update_data($mysqli, $producto_id, $materias_primas, 'materias_primas')) $error_occurred = true;

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


?>
