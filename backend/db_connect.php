<?php
// db_connect.php
// Setup the credentials for InfinityFree
$servername = "sql101.infinityfree.com";
$username = "if0_39204378";
$password = "viper0593552";
$dbname = "if0_39204378_portfolio_db"; // Assuming this is the DB name the user creates

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // If it fails to connect, output json error for API compatibility
    header('Content-Type: application/json');
    echo json_encode(['error' => "Connection failed: " . $e->getMessage()]);
    exit();
}
?>
