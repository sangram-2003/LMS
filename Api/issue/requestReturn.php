<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['issue_id'] ?? '';

if(!$id){
    echo json_encode(["status"=>"error","message"=>"Issue ID required"]);
    exit;
}

// Check record
$get = $conn->query("SELECT * FROM issue_books WHERE issue_id='$id'");
$row = $get->fetch_assoc();

if(!$row){
    echo json_encode(["status"=>"error","message"=>"Not found"]);
    exit;
}

// Already requested or returned
if($row['return_status'] == 'pending'){
    echo json_encode(["status"=>"error","message"=>"Already requested"]);
    exit;
}

if($row['return_status'] == 'returned'){
    echo json_encode(["status"=>"error","message"=>"Already returned"]);
    exit;
}

//  Make return request
$conn->query("
UPDATE issue_books 
SET return_status='pending' 
WHERE issue_id='$id'
");

echo json_encode(["status"=>"success","message"=>"Return request sent"]);

?>