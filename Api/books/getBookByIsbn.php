<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ✅ Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("../config/db.php");

// =========================
// 📥 GET ISBN
// =========================
$isbn = $_GET['isbn'] ?? '';

if (empty($isbn)) {
    echo json_encode([
        "success" => false,
        "error" => "ISBN is required"
    ]);
    exit();
}

// =========================
// 🔍 QUERY DATABASE
// =========================
try {
    $sql = "SELECT * FROM books WHERE isbn = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $isbn);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $book = $result->fetch_assoc();

        echo json_encode([
            "success" => true,
            "data" => $book
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Book not found",
            "isbn" => $isbn
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Server error",
        "details" => $e->getMessage()
    ]);
}
?>