<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$issue_id = $data['issue_id'];

/* get book id */
$res = mysqli_query($conn,"SELECT book_id FROM issue_books WHERE id=$issue_id");
$row = mysqli_fetch_assoc($res);

$book_id = $row['book_id'];

/* update issue status */
mysqli_query($conn,"UPDATE issue_books 
SET status='returned', return_date=NOW() 
WHERE id=$issue_id");

/* increase available */
mysqli_query($conn,"UPDATE books 
SET available = available + 1 
WHERE id=$book_id");

echo json_encode([
 "status"=>"success",
 "message"=>"Book returned"
]);

?>