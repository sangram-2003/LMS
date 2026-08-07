<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


include("../config/db.php");

// GET roll number
$roll = $_GET['roll_number'] ?? '';

if (empty($roll)) {
    echo json_encode([
        "status" => "error",
        "message" => "Roll number required"
    ]);
    exit;
}

// ✅ Prepared Statement (secure)
$stmt = $conn->prepare("
    SELECT 
        roll_number,
        name,
        email,
        department,
        phone,
        date_of_birth
    FROM students
    WHERE roll_number = ?
");

$stmt->bind_param("s", $roll);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Student not found"
    ]);
}

?>