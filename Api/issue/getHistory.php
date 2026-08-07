<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$roll = $_GET['roll_number'];

// ✅ FIXED QUERY
$sql = "
SELECT 
    ib.issue_id,
    b.title,
    b.author,
    ib.issue_date,

    DATE_ADD(ib.issue_date, INTERVAL 6 MONTH) AS due_date,

    ib.return_date,
    ib.status,

    CASE 
        WHEN ib.status='issued' 
             AND CURDATE() > DATE_ADD(ib.issue_date, INTERVAL 6 MONTH)
        THEN 'overdue'
        ELSE ib.status
    END as current_status

FROM issue_books ib
JOIN books b ON ib.isbn = b.isbn
WHERE ib.student_roll_number='$roll'
ORDER BY ib.issue_id DESC
";

$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>