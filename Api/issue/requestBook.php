<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$roll = $data['roll_number'];
$isbn = $data['isbn'];

// Check duplicate request
$check = $conn->query("
SELECT * FROM issue_books 
WHERE student_roll_number='$roll' 
AND isbn='$isbn' 
AND status IN ('pending','approved')
");

if ($check->num_rows > 0) {
    echo json_encode(["status"=>"error","message"=>"Already requested"]);
    exit;
}

// Insert request (pending)
$conn->query("
INSERT INTO issue_books (student_roll_number, isbn, issue_date, due_date, status) 
VALUES (
  '$roll',
  '$isbn',
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 6 MONTH),
  'pending'
)
");

echo json_encode(["status"=>"success","message"=>"Request sent"]);
?>