<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ✅ Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("../config/db.php");

// ✅ Query
$sql = "SELECT * FROM books";
$result = mysqli_query($conn, $sql);

// ✅ Error handling
if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
    exit();
}

// ✅ Fetch data
$books = [];
while ($row = mysqli_fetch_assoc($result)) {
    $books[] = $row;
}

// ✅ RETURN ONLY ARRAY (BEST PRACTICE 🚀)
echo json_encode($books);

?>