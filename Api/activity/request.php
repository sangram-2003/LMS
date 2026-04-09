<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$isbn = $data['isbn'] ?? null;
$roll = $data['roll_number'] ?? null;

if (!$isbn || !$roll) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

// 🔥 Insert into request table (your existing system)
$conn->query("INSERT INTO requests (isbn, roll_number) VALUES ('$isbn', '$roll')");

// 🔥 Update analytics
$sql = "INSERT INTO book_analytics (isbn, roll_number, request_count, last_requested_at)
        VALUES (?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
        request_count = request_count + 1,
        last_requested_at = NOW()";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $isbn, $roll);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Request added"
]);