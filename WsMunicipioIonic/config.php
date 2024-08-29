<?php
define('db','appemp');
define('usuario','root');
define('clave','');
define('host','localhost');
$mysqli=new mysqli(host,usuario,clave,db);

// Verificar la conexión
if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}
?>
