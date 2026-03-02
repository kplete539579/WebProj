<?php
require 'config.php';

$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchALL(PDO::FETCH_ASSOC);
?>