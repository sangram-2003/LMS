<?php

// CORS + JSON headers (IMPORTANT for React)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if data received
if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No data received"
    ]);
    exit();
}

// Get values
$roll = $data['roll_number'];
$name = $data['name'];
$email = $data['email'];
$dept = $data['department'];
$phone = $data['phone'];
$dob = $data['date_of_birth'];

//  Convert DOB to DDMMYYYY format
$default_password = date("dmY", strtotime($dob));

// Hash password
$hashed_password = password_hash($default_password, PASSWORD_DEFAULT);

// Check if roll number exists
$check = "SELECT * FROM students WHERE roll_number='$roll'";
$result = mysqli_query($conn, $check);

if (mysqli_num_rows($result) > 0) {

    echo json_encode([
        "status" => "error",
        "message" => "Roll Number already exists"
    ]);

} else {

    // Insert data
    $sql = "INSERT INTO students 
    (roll_number, name, email, department, phone, date_of_birth, password) 
    VALUES 
    ('$roll', '$name', '$email', '$dept', '$phone', '$dob', '$hashed_password')";

    if (mysqli_query($conn, $sql)) {

        echo json_encode([
            "status" => "success",
            "message" => "Registration successful",
            "default_password" => $default_password   //  for testing/demo
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => mysqli_error($conn)
        ]);
    }
}
?>