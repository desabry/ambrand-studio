<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all projects
        try {
            $stmt = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
            $projects = $stmt->fetchAll();
            
            // Loop through and attach blocks
            foreach($projects as &$project) {
                $bStmt = $conn->prepare("SELECT id, block_type as type, content FROM project_blocks WHERE project_id = ? ORDER BY order_index ASC");
                $bStmt->execute([$project['id']]);
                // Rename desc map to frontend expectation
                $project['desc'] = $project['description'];
                unset($project['description']);
                
                $project['contentBlocks'] = $bStmt->fetchAll();
            }
            
            echo json_encode($projects);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Add new project
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['name'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid data"]);
            exit();
        }

        try {
            $conn->beginTransaction();

            $stmt = $conn->prepare("INSERT INTO projects (name, client, cat, description, mediaType, mediaUrl) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'], 
                $data['client'] ?? '', 
                $data['cat'] ?? '', 
                $data['desc'] ?? '', 
                $data['mediaType'] ?? 'image', 
                $data['mediaUrl'] ?? ''
            ]);
            
            $projectId = $conn->lastInsertId();

            // Insert blocks
            if (isset($data['contentBlocks']) && is_array($data['contentBlocks'])) {
                $bStmt = $conn->prepare("INSERT INTO project_blocks (id, project_id, block_type, content, order_index) VALUES (?, ?, ?, ?, ?)");
                foreach ($data['contentBlocks'] as $index => $block) {
                    $bStmt->execute([
                        $block['id'],
                        $projectId,
                        $block['type'],
                        $block['content'],
                        $index
                    ]);
                }
            }

            $conn->commit();
            echo json_encode(["success" => true, "id" => $projectId]);

        } catch (PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update project
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid data or missing ID"]);
            exit();
        }

        try {
            $conn->beginTransaction();

            $stmt = $conn->prepare("UPDATE projects SET name=?, client=?, cat=?, description=?, mediaType=?, mediaUrl=? WHERE id=?");
            $stmt->execute([
                $data['name'], 
                $data['client'] ?? '', 
                $data['cat'] ?? '', 
                $data['desc'] ?? '', 
                $data['mediaType'] ?? 'image', 
                $data['mediaUrl'] ?? '',
                $data['id']
            ]);

            // Clear old blocks
            $delStmt = $conn->prepare("DELETE FROM project_blocks WHERE project_id = ?");
            $delStmt->execute([$data['id']]);

            // Insert new blocks
            if (isset($data['contentBlocks']) && is_array($data['contentBlocks'])) {
                $bStmt = $conn->prepare("INSERT INTO project_blocks (id, project_id, block_type, content, order_index) VALUES (?, ?, ?, ?, ?)");
                foreach ($data['contentBlocks'] as $index => $block) {
                    $bStmt->execute([
                        $block['id'],
                        $data['id'],
                        $block['type'],
                        $block['content'],
                        $index
                    ]);
                }
            }

            $conn->commit();
            echo json_encode(["success" => true]);

        } catch (PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete project
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing ID"]);
            exit();
        }

        try {
            // Note: Cascade delete on foreign key will handle project_blocks
            $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
}
?>
