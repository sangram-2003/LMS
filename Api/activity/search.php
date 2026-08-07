<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$term = $data['search_term'] ?? null;
$roll = $data['roll_number'] ?? null;

if (!$term) {
    echo json_encode(["status" => "error", "message" => "Search term required"]);
    exit;
}

$sql = "INSERT INTO search_logs (roll_number, search_term, search_count, last_searched_at)
        VALUES (?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
        search_count = search_count + 1,
        last_searched_at = NOW()";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $roll, $term);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Search tracked"
]);