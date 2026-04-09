<?php
header("Access-Control-Allow-Origin: *");

include("../config/db.php");

$roll_no = $_GET['roll_no'];

$sql = "SELECT issue_books.*, books.title 
FROM issue_books
JOIN books ON issue_books.book_id = books.id
WHERE issue_books.student_roll_no='$roll_no' AND status='issued'";

$result = mysqli_query($conn,$sql);

$data=[];

while($row=mysqli_fetch_assoc($result)){
 $data[]=$row;
}

echo json_encode($data);
?>