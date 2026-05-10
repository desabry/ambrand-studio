<?php
header('Content-Type: application/json');

// Attempt to connect mapping out the tables needed
require_once 'db_connect.php';

try {
    // 1. Create Projects Table
    $sqlProjects = "CREATE TABLE IF NOT EXISTS projects (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        client VARCHAR(255) DEFAULT 'Unknown',
        cat VARCHAR(100) DEFAULT 'Uncategorized',
        description TEXT,
        mediaType VARCHAR(50) DEFAULT 'image',
        mediaUrl TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sqlProjects);

    // 2. Create Project Blocks Table (for Behance-style builder)
    $sqlBlocks = "CREATE TABLE IF NOT EXISTS project_blocks (
        id VARCHAR(100) PRIMARY KEY,
        project_id INT(11) NOT NULL,
        block_type VARCHAR(50) NOT NULL,
        content TEXT,
        order_index INT(11) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )";
    $conn->exec($sqlBlocks);

    echo json_encode(["success" => true, "message" => "Database tables initialized successfully."]);

} catch(PDOException $e) {
    echo json_encode(["success" => false, "error" => "Initialization failed: " . $e->getMessage()]);
}
?>
