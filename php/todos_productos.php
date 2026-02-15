<?php
header('Content-Type: application/json');
try {
    require(__DIR__ . '/conexion.php');
    if (!$link) {
        echo json_encode(['error' => 'Conexión fallida']);
        exit;
    }
    $datos = [];
    $result = mysqli_query($link, "SELECT * FROM productos");
    if ($result) {
        while ($row = mysqli_fetch_array($result)) {
            $objeto = new stdClass();
            $objeto->id = $row["idProducto"];
            $objeto->nombre = $row["nombre"];
            $objeto->precio = $row["precio"];
            $objeto->unidades = intval($row["unidades"]);
            $objeto->foto = $row["foto"];
            $datos[] = $objeto;
        }
        mysqli_free_result($result);
    }
    echo json_encode($datos);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
if (isset($link) && $link) {
    mysqli_close($link);
}
