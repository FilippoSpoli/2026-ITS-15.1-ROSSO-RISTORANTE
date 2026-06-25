<?php
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $stmt = $pdo->query("SELECT nome, cognome, valutazione, commento FROM recensioni ORDER BY created_at DESC LIMIT 10");
    $recensioni = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($recensioni);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
