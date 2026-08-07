<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "collegelibrery";

$conn = mysqli_connect($host,$user,$pass,$db);

if(!$conn){
 die("Database connection failed");
}

?>