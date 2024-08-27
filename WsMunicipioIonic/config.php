<?php
define('db','appemp');
define('usuario','root');
define('clave','vi3C6pzwtjPjrQd0iZtKMhOHUg8X7sstolVBuItkAZXyuWRFAuUJ5bJwv4fLmj3J');
define('host','admin.fonlescompany.com:3306');
$mysqli=new mysqli(host,usuario,clave,db);

// Verificar la conexión
if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}
?>
