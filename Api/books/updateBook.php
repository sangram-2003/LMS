<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$isbn = $data['isbn'];
$title = $data['title'];


$title = $data['title'] ?? '';
$author = $data['author'] ?? '';
$category_id = $data['category_id'] ?? '';
$total = $data['total'] ?? 0;
$available = $data['available'] ?? 0;

if (!$isbn) {
    echo json_encode(["status" => "error", "message" => "ISBN required"]);
    exit();
}

// ✅ prepared statement (SAFE)
$stmt = $conn->prepare("
    UPDATE books 
    SET title=?, author=?, category_id=?, total=?, available=? 
    WHERE isbn=?
");

$stmt->bind_param("ssiiis", $title, $author, $category_id, $total, $available, $isbn);
$stmt->execute();

echo json_encode(["status" => "success"]);
?>