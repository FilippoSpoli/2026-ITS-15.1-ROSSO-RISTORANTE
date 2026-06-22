<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'index':
            if ($method !== 'GET') { throw new Exception('Metodo non consentito'); }
            $stmt = $pdo->query("SELECT * FROM menu ORDER BY id DESC");
            $piatti = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($piatti);
            break;

        case 'store':
            if ($method !== 'POST') { throw new Exception('Metodo non consentito'); }
            $nome = htmlspecialchars(strip_tags(trim($_POST['nome'] ?? '')));
            $categoria = htmlspecialchars(strip_tags(trim($_POST['categoria'] ?? '')));
            $prezzo = floatval($_POST['prezzo'] ?? 0);
            $foto = htmlspecialchars(strip_tags(trim($_POST['foto'] ?? '')));
            $disponibile = isset($_POST['disponibile']) ? intval($_POST['disponibile']) : 1;

            if (empty($nome) || $prezzo <= 0) { throw new Exception('Dati incompleti o non validi'); }

            $sql = "INSERT INTO menu (nome, categoria, prezzo, foto, disponibile) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nome, $categoria, $prezzo, $foto, $disponibile]);

            echo json_encode(['status' => 'success', 'message' => 'Piatto creato con successo']);
            break;

        case 'update':
            if ($method !== 'POST') { throw new Exception('Metodo non consentito'); }
            $id = intval($_POST['id'] ?? 0);
            $nome = htmlspecialchars(strip_tags(trim($_POST['nome'] ?? '')));
            $categoria = htmlspecialchars(strip_tags(trim($_POST['categoria'] ?? '')));
            $prezzo = floatval($_POST['prezzo'] ?? 0);
            $foto = htmlspecialchars(strip_tags(trim($_POST['foto'] ?? '')));
            $disponibile = isset($_POST['disponibile']) ? intval($_POST['disponibile']) : 1;

            if ($id <= 0 || empty($nome) || $prezzo <= 0) { throw new Exception('Dati di aggiornamento non validi'); }

            // CORRETTO: disponibile = ? anziché disponible = ?
            $sql = "UPDATE menu SET nome = ?, categoria = ?, prezzo = ?, foto = ?, disponibile = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nome, $categoria, $prezzo, $foto, $disponibile, $id]);

            echo json_encode(['status' => 'success', 'message' => 'Piatto aggiornato con successo']);
            break;

        case 'destroy':
            if ($method !== 'POST') { throw new Exception('Metodo non consentito'); }
            $id = intval($_POST['id'] ?? 0);
            $type = $_POST['type'] ?? 'soft'; // Recupera il tipo (soft o hard)

            if ($id <= 0) { throw new Exception('ID non valido'); }

            if ($type === 'hard') {
                $stmt = $pdo->prepare("DELETE FROM menu WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'message' => 'Piatto eliminato definitivamente dal database']);
            } else {
                $stmt = $pdo->prepare("UPDATE menu SET deleted_at = NOW() WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'message' => 'Piatto archiviato con successo (Soft Delete)']);
            }
            break;

        case 'restore':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') { throw new Exception('Metodo non consentito'); }
            $id = intval($_POST['id'] ?? 0);
            if ($id <= 0) { throw new Exception('ID non valido'); }

            // Ripristino: impostiamo la colonna deleted_at nuovamente a NULL
            $stmt = $pdo->prepare("UPDATE menu SET deleted_at = NULL WHERE id = ?");
            
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Record ripristinato con successo nell\'elenco principale']);
            break;

            case 'bulk':
                if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                    throw new Exception('Metodo non consentito');
                }
                
                // Decodifichiamo l'array di ID inviati dal Javascript
                $ids = json_decode($_POST['ids'] ?? '[]', true);
                $type = $_POST['type'] ?? ''; // Riceve 'soft_delete' o 'restore'

                if (empty($ids) || !is_array($ids)) {
                    throw new Exception('Nessun record selezionato o formato non valido');
                }

                // Generiamo i punti di domanda per la query IN es. (?, ?, ?)
                $placeholders = implode(',', array_fill(0, count($ids), '?'));

                if ($type === 'soft_delete') {
                    // Soft delete di massa: imposta la data corrente
                    $stmt = $pdo->prepare("UPDATE menu SET deleted_at = NOW() WHERE id IN ($placeholders)");
                    $stmt->execute($ids);
                    echo json_encode(['status' => 'success', 'message' => 'Piatti selezionati archiviati con successo']);
                } elseif ($type === 'restore') {
                    // Ripristino di massa: azzera la colonna deleted_at
                    $stmt = $pdo->prepare("UPDATE menu SET deleted_at = NULL WHERE id IN ($placeholders)");
                    $stmt->execute($ids);
                    echo json_encode(['status' => 'success', 'message' => 'Piatti selezionati ripristinati con successo']);
                } else {
                    throw new Exception('Azione di massa non valida');
                }
                break;

        default:
            throw new Exception('Azione non riconosciuta o non configurata');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
