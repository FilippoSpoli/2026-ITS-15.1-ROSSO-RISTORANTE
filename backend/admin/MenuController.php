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

            if ($id <= 0) { throw new Exception('ID non valido'); }

            $stmt = $pdo->prepare("DELETE FROM menu WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['status' => 'success', 'message' => 'Piatto rimosso con successo']);
            break;

        default:
            throw new Exception('Azione non riconosciuta o non configurata');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
