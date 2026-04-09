<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");



include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$roll = $data['roll_number'] ?? null;
$isbn = $data['isbn'] ?? null;
$action = $data['action_type'] ?? null;
$search = $data['search_term'] ?? null;

// ✅ validation
if (!$action) {
    echo json_encode(["status" => "error", "message" => "Action required"]);
    exit;
}

$sql = "INSERT INTO user_activity (roll_number, isbn, action_type, search_term)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $roll, $isbn, $action, $search);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Activity recorded"
]);