<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'index':
            if ($method !== 'GET') { throw new Exception('Metodo non consentito'); }
            $stmt = $pdo->query("SELECT * FROM prenotazioni ORDER BY data_prenotazione DESC, ora_prenotazione DESC");
            $prenotazioni = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($prenotazioni);
            break;

        case 'destroy':
            if ($method !== 'POST') { throw new Exception('Metodo non consentito'); }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) { throw new Exception('ID non valido'); }

            $stmt = $pdo->prepare("DELETE FROM prenotazioni WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['status' => 'success', 'message' => 'Prenotazione eliminata']);
            break;

        case 'svuota':
            if ($method !== 'POST') { throw new Exception('Metodo non consentito'); }
            $pdo->query("TRUNCATE TABLE prenotazioni");
            echo json_encode(['status' => 'success', 'message' => 'Archivio svuotato con successo']);
            break;

        default:
            throw new Exception('Azione non riconosciuta');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
