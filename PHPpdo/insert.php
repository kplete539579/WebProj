<?php
require 'config.php';

if (isset($POST['add'])){

    $name = $_POST['name'];
    $email = $POST['email'];
    $product = $POST['product'];
    $amount = $POST['amount'];

    $stmt = $pdo ->prepare("INSERT INTO user(name,email)
    VALUES (?, ?)");
    $stmt->execute([$name, $email]);

    $users_id = $pdo ->lastinsertid();

    $stmt = $pdo->prepare("INSERT INTO orders(users_id, product, amount)
    VALUES(?, ?, ?)");
    $stmt->execute([$users_id,$product, $amount]);

    echo "User and Order added successfuly";
}
?>