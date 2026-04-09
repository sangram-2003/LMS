<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Content-Type: application/json");
include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$isbn = $_GET['isbn'] ?? null;
$role = "admin";

if($role !== "admin"){
 echo json_encode(["status"=>"Access denied"]);
 exit();
}

// ✅ use isbn in query
$sql = "DELETE FROM books WHERE isbn='$isbn'";

mysqli_query($conn,$sql);

echo json_encode(["status"=>"deleted"]);
?>