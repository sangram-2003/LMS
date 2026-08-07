<?php
header("Access-Control-Allow-Origin: *");

include("../config/db.php");

$result = mysqli_query($conn,"SELECT * FROM categories");

$data=[];

while($row=mysqli_fetch_assoc($result)){
 $data[]=$row;
}

echo json_encode($data);
?>