<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
session_start();
session_destroy();
header("Location: index.php");
session_start();
session_destroy();

echo json_encode([
  "status" => "success",
  "message" => "Logged out"
]);
?>