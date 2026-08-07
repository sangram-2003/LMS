<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'];
$author = $data['author'];
$category_id = $data['category_id'];
$isbn = $data['isbn'];
$total = $data['total'];

$available = $data['available'];

$sql = "INSERT INTO books(title,author,category_id,isbn,total,available)
VALUES('$title','$author','$category_id','$isbn','$total','$available')";

if(mysqli_query($conn,$sql)){
 echo json_encode(["status"=>"success"]);
}else{
 echo json_encode(["status"=>"error"]);
}
?>