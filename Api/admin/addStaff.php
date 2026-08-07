<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$name  = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$role  = $data['role'];

// 🔐 Default password = phone (hashed)
$hashed_password = password_hash($phone, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO staff (name, email, phone, role, password)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("sssss", $name, $email, $phone, $role, $hashed_password);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "User created successfully"
    ]);
}
?>