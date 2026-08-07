<?php
include '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");


try {
$total = $conn->query("SELECT IFNULL(SUM(total),0) as total FROM books")->fetch_assoc();
$available = $conn->query("SELECT IFNULL(SUM(available),0) as available FROM books")->fetch_assoc();
$students = $conn->query("SELECT COUNT(*) as total FROM students")->fetch_assoc();
$active = $conn->query("SELECT COUNT(*) as total FROM issue_books WHERE status='issued'")->fetch_assoc();
$returned = $conn->query("SELECT COUNT(*) as total FROM issue_books WHERE status='returned'")->fetch_assoc();


echo json_encode([
    "total_books" => (int)$total['total'],
    "available" => (int)$available['available'],
    "students" => (int)$students['total'],
    "active" => (int)$active['total'],
    "returned" => (int)$returned['total'],
    
]);
} catch (Exception $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
?>