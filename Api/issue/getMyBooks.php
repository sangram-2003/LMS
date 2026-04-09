<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


include("../config/db.php");

$roll = $_GET['roll_number'];

$sql = "
SELECT 
    ib.id,
    b.title,
    b.author,
    c.name AS category,
    ib.issue_date,
    ib.due_date
FROM issue_books ib
JOIN books b ON ib.isbn = b.isbn
LEFT JOIN categories c ON b.category_id = c.id
WHERE ib.student_roll_number='$roll'
AND ib.status='issued'
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>