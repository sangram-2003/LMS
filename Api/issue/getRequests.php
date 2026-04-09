<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include("../config/db.php");

$role = $_GET['role'] ?? '';
$roll = $_GET['roll_number'] ?? '';

//  Base query (UPDATED with new columns)
$sql = "
SELECT 
    ib.issue_id,
    ib.student_roll_number,
    b.title,
    b.author,
    b.isbn,
    ib.status,
    ib.return_status,
    ib.issue_date,
    ib.due_date,
    ib.due_date
FROM issue_books ib
JOIN books b ON ib.isbn = b.isbn
";

//  Apply filter
if ($role === "student") {
    if (!empty($roll)) {
        $sql .= " WHERE ib.student_roll_number = '$roll'";
    } else {
        echo json_encode(["status"=>"error","message"=>"Roll number missing"]);
        exit;
    }
}

//  Always order
$sql .= " ORDER BY ib.issue_id DESC";

$result = $conn->query($sql);

if(!$result){
    echo json_encode(["status"=>"error","message"=>"Query failed"]);
    exit;
}

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);

?>