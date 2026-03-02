<?php
require 'config.php';

if(isset($_POST['update'])){
    $user_id = $POST['users_id'];
    $name = $POST['name'];
    $email = $POST['email'];

    $stmt = $pdo->prepare("UPDATE users SET name = ?,
    email = ? WHERE user_id =?");
    $stmt ->execute([$name,$email,$users_id]);
}
?>