<?php
header('Content-Type: application/json');
require(__DIR__ . '/conexion.php');
if (!$link) {
    echo json_encode(['error' => 'Conexión fallida']);
    exit;
}

$carrito = json_decode($_POST["carrito"] ?? '[]', true);
if (empty($carrito)) {
    echo json_encode(['error' => 'Carrito vacío']);
    exit;
}

mysqli_begin_transaction($link);

foreach ($carrito as $item) {
    $idProd = intval($item['id'] ?? 0);
    $cant = intval($item['cantidad'] ?? 0);
    $r = mysqli_query($link, "SELECT unidades FROM productos WHERE idProducto = $idProd");
    $row = mysqli_fetch_assoc($r);
    $u = $row ? intval($row['unidades']) : 0;
    if ($u < $cant) {
        mysqli_rollback($link);
        mysqli_close($link);
        echo json_encode(['error' => 'Stock insuficiente: ' . ($item['nombre'] ?? $idProd)]);
        exit;
    }
}

$res = mysqli_query($link, "SELECT COALESCE(MAX(idPedido), 0) + 1 as id FROM pedidos");
$row = mysqli_fetch_assoc($res);
$idPedido = intval($row['id']);

$ok = mysqli_query($link, "INSERT INTO pedidos (idPedido, fecha, dirEntrega, dniCliente) VALUES ($idPedido, CURDATE(), '', NULL)");
if (!$ok) {
    mysqli_rollback($link);
    mysqli_close($link);
    echo json_encode(['error' => 'Error al crear pedido']);
    exit;
}

$nlinea = 1;
foreach ($carrito as $item) {
    $idProd = intval($item['id'] ?? 0);
    $cant = intval($item['cantidad'] ?? 0);
    $ok = mysqli_query($link, "INSERT INTO lineaspedidos (idPedido, nlinea, idProducto, cantidad) VALUES ($idPedido, $nlinea, $idProd, $cant)");
    if (!$ok) {
        mysqli_rollback($link);
        mysqli_close($link);
        echo json_encode(['error' => 'Error al guardar líneas']);
        exit;
    }
    $ok = mysqli_query($link, "UPDATE productos SET unidades = unidades - $cant WHERE idProducto = $idProd");
    if (!$ok) {
        mysqli_rollback($link);
        mysqli_close($link);
        echo json_encode(['error' => 'Error al actualizar stock']);
        exit;
    }
    $nlinea++;
}

mysqli_commit($link);
mysqli_close($link);
echo json_encode("ok");
