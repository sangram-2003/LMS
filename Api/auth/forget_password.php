<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$phone = $data['phone'];

// Check user exists
$sql = "SELECT * FROM students WHERE phone='$phone'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {

    // Generate OTP
    $otp = rand(100000, 999999);
    $expiry = date("Y-m-d H:i:s", strtotime("+5 minutes"));

    // Save OTP in DB
    $update = "UPDATE students 
               SET otp='$otp', otp_expiry='$expiry' 
               WHERE phone='$phone'";

    mysqli_query($conn, $update);

    // ⚠️ Demo: show OTP (instead of sending SMS)
    echo json_encode([
        "status" => "success",
        "message" => "OTP sent successfully",
        "otp" => $otp
    ]);

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Phone number not found"
    ]);
}
?>