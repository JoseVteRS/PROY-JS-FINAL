<?php
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pwd = getenv('DB_PASSWORD') ?: '';
$db = getenv('DB_NAME') ?: 'virtualmarket';

$link = @mysqli_connect($host, $user, $pwd);
if (!$link) {
    $link = null;
    return;
}
mysqli_select_db($link, $db);
$link->query("SET NAMES 'UTF8'");
?>
