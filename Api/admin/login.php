<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$phone = $data['phone'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT * FROM staff WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();

    // 🔐 Verify hashed password
    if (password_verify($password, $row['password'])) {

        echo json_encode([
            "status" => "success",
            "user" => [
                "name" => $row['name'],
                "phone" => $row['phone'],
                "role" => $row['role'],
                "isLoggedIn"=>true,
            ]
        ]);

    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Wrong password"
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
}
?>