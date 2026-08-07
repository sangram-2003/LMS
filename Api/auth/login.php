<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$roll = $data['roll_number'];
$password = $data['password'];

// Check user
$sql = "SELECT * FROM students WHERE roll_number='$roll'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {

    $row = mysqli_fetch_assoc($result);

    if (password_verify($password, $row['password'])) {

        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "roll_number" => $row['roll_number'],
                "name"=>$row['name'],
                "isLoggedIn"=> true,
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