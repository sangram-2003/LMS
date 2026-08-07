<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['issue_id']) || !isset($data['action'])) {
    echo json_encode(["status"=>"error","message"=>"Invalid input"]);
    exit;
}

$id = $data['issue_id'];
$action = $data['action']; // approved / rejected / return

// Get request
$get = $conn->query("SELECT * FROM issue_books WHERE issue_id='$id'");
$row = $get->fetch_assoc();

if(!$row){
    echo json_encode(["status"=>"error","message"=>"Request not found"]);
    exit;
}

// APPROVE LOGIC
if($action == "approved"){
    $isbn = $row['isbn'];

    $book = $conn->query("SELECT available FROM books WHERE isbn='$isbn'")->fetch_assoc();

    if($book['available'] <= 0){
        echo json_encode(["status"=>"error","message"=>"No stock"]);
        exit;
    }

    //  Reduce stock
    $conn->query("UPDATE books SET available = available - 1 WHERE isbn='$isbn'");

    //  Update status + issue_date + due_date
    $conn->query("
        UPDATE issue_books 
        SET 
            status='approved',
            issue_date = CURDATE(),
            due_date = DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
        WHERE issue_id='$id'
    ");

} else {

    //  Reject
    $conn->query("
        UPDATE issue_books 
        SET status='reject'
        WHERE issue_id='$id'
    ");
}

echo json_encode(["status"=>"success","message"=>"Updated successfully"]);

?>