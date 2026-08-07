<?php
header("Access-Control-Allow-Origin: *");

include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];

$sql = "INSERT INTO categories(name) VALUES('$name')";
mysqli_query($conn,$sql);

echo json_encode(["status"=>"success"]);
?>