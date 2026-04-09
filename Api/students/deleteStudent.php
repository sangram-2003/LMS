<!-- Api_key = http://localhost/Api/students/deleteStudent.php
  -->
<!-- required :{
 "roll_no":"101",
 "role":"admin"
} -->
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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

$roll_no = $data['roll_no'];
$role = $data['role'];

/* role check */
if($role !== "admin"){
 echo json_encode([
  "status"=>"error",
  "message"=>"Access denied. Only admin can delete students."
 ]);
 exit();
}

/* delete query */
$sql = "DELETE FROM students WHERE roll_no='$roll_no'";

$result = mysqli_query($conn,$sql);

if($result){

 echo json_encode([
  "status"=>"success",
  "message"=>"Student deleted"
 ]);

}else{

 echo json_encode([
  "status"=>"error",
  "message"=>"Delete failed"
 ]);

}

?>