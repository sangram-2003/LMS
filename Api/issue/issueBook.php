<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
 echo json_encode([
  "status"=>"error",
  "message"=>"No data received"
 ]);
 exit();
}

$book_id = $data['book_id'];
$roll_no = $data['roll_no'];
$role = $data['role'] ?? '';

/* role check */
if($role !== "admin" && $role !== "librarian"){
 echo json_encode([
  "status"=>"error",
  "message"=>"Access denied"
 ]);
 exit();
}

/* check availability */
$check = mysqli_query($conn,"SELECT available FROM books WHERE id=$book_id");

if(!$check || mysqli_num_rows($check) == 0){
 echo json_encode([
  "status"=>"error",
  "message"=>"Book not found"
 ]);
 exit();
}

$book = mysqli_fetch_assoc($check);

if($book['available'] <= 0){
 echo json_encode([
  "status"=>"error",
  "message"=>"Book not available"
 ]);
 exit();
}

/* check already issued */
$already = mysqli_query($conn,"
SELECT * FROM issue_books 
WHERE book_id=$book_id 
AND student_roll_no='$roll_no' 
AND status='issued'
");

if(mysqli_num_rows($already) > 0){
 echo json_encode([
  "status"=>"error",
  "message"=>"Book already issued to this student"
 ]);
 exit();
}

/* start transaction */
mysqli_begin_transaction($conn);

try {

 /* issue book */
 $sql = "INSERT INTO issue_books 
 (book_id, student_roll_no, issue_date, status) 
 VALUES 
 ('$book_id','$roll_no',NOW(),'issued')";

 $result = mysqli_query($conn,$sql);

 if(!$result){
  throw new Exception("Issue failed");
 }

 /* decrease available */
 $update = mysqli_query($conn,
 "UPDATE books SET available = available - 1 WHERE id=$book_id");

 if(!$update){
  throw new Exception("Update failed");
 }

 mysqli_commit($conn);

 echo json_encode([
  "status"=>"success",
  "message"=>"Book issued successfully"
 ]);

} catch(Exception $e){

 mysqli_rollback($conn);

 echo json_encode([
  "status"=>"error",
  "message"=>$e->getMessage()
 ]);

}

?>