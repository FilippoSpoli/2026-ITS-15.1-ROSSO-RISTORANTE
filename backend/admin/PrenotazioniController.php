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
            $type = $_POST['type'] ?? 'soft';

            if ($id <= 0) { throw new Exception('ID non valido'); }

            if ($type === 'hard') {
                $stmt = $pdo->prepare("DELETE FROM prenotazioni WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'message' => 'Prenotazione rimossa permanentemente']);
            } else {
                $stmt = $pdo->prepare("UPDATE prenotazioni SET deleted_at = NOW() WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'message' => 'Prenotazione spostata in archivio (Soft Delete)']);
            }
            break;

        case 'restore':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') { throw new Exception('Metodo non consentito'); }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) { throw new Exception('ID non valido'); }

            // Ripristino: impostiamo la colonna deleted_at nuovamente a NULL
            $stmt = $pdo->prepare("UPDATE prenotazioni SET deleted_at = NULL WHERE id = ?");
            
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Record ripristinato con successo nell\'elenco principale']);
            break;

            case 'bulk':
                if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                    throw new Exception('Metodo non consentito');
                }
                
                $ids = json_decode($_POST['ids'] ?? '[]', true);
                $type = $_POST['type'] ?? ''; 

                if (empty($ids) || !is_array($ids)) {
                    throw new Exception('Nessuna prenotazione selezionata');
                }

                $placeholders = implode(',', array_fill(0, count($ids), '?'));

                if ($type === 'soft_delete') {
                    $stmt = $pdo->prepare("UPDATE prenotazioni SET deleted_at = NOW() WHERE id IN ($placeholders)");
                    $stmt->execute($ids);
                    echo json_encode(['status' => 'success', 'message' => 'Prenotazioni selezionate archiviate con successo']);
                } elseif ($type === 'restore') {
                    $stmt = $pdo->prepare("UPDATE prenotazioni SET deleted_at = NULL WHERE id IN ($placeholders)");
                    $stmt->execute($ids);
                    echo json_encode(['status' => 'success', 'message' => 'Prenotazioni selezionate ripristinate con successo']);
                } else {
                    throw new Exception('Azione di massa non valida');
                }
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
