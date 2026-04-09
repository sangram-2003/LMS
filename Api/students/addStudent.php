<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$roll = $data['roll_no'];
$name = $data['name'];

$sql = "INSERT INTO students(roll_no,name) VALUES('$roll','$name')";

mysqli_query($conn,$sql);

echo json_encode(["status"=>"success"]);
?>