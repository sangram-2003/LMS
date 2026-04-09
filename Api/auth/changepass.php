<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$old_password = $data['old_password'];
$new_password = $data['new_password'];
$confirm_password = $data['confirm_password'];

// Check new & confirm password
if ($new_password !== $confirm_password) {
    echo json_encode([
        "status" => "error",
        "message" => "New and Confirm Password do not match"
    ]);
    exit();
}

// Fetch user
$sql = "SELECT * FROM students 
        WHERE roll_number='$user_id' OR email='$user_id'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {

    $row = mysqli_fetch_assoc($result);

    // Verify old password
    if (password_verify($old_password, $row['password'])) {

        $new_hashed = password_hash($new_password, PASSWORD_DEFAULT);

        // Update password
        $update = "UPDATE students 
                   SET password='$new_hashed' 
                   WHERE roll_number='$user_id' OR email='$user_id'";

        if (mysqli_query($conn, $update)) {
            echo json_encode([
                "status" => "success",
                "message" => "Password changed successfully"
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Update failed"
            ]);
        }

    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Old password incorrect"
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
}
?>