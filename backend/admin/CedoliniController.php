<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

require_once __DIR__ . '/../db.php'; 

$action = $_GET['action'] ?? '';

if ($action === 'index') {
    try {
        $query = "SELECT id, dipendente, periodo, data_emissione, netto, deleted_at FROM richieste_cedolini ORDER BY id DESC";
        $stmt = $pdo->prepare($query);
        
        if ($stmt) {
            $stmt->execute();
            $cedolini = $stmt->fetchAll();
            echo json_encode($cedolini);
        } else {
            echo json_encode(["status" => "error", "message" => "Impossibile preparare la query SQL."]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Errore DB: " . $e->getMessage()]);
    }
    exit;
}

if ($action === 'upload') {
    $dipendente = $_POST['dipendente'] ?? '';
    $periodo = $_POST['periodo'] ?? '';
    $data_emissione = $_POST['data_emissione'] ?? date('Y-m-d');
    $netto = $_POST['netto'] ?? 0;

    if (empty($dipendente) || empty($periodo) || empty($netto)) {
        echo json_encode(["status" => "error", "message" => "Dati obbligatori mancanti"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO richieste_cedolini (dipendente, periodo, data_emissione, netto) VALUES (?, ?, ?, ?)");
        $stmt->execute([$dipendente, $periodo, $data_emissione, $netto]);
        echo json_encode(["status" => "success", "message" => "Cedolino caricato con successo"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

if ($action === 'destroy') {
    $id = $_POST['id'] ?? null;
    if (!$id) {
        echo json_encode(["status" => "error", "message" => "ID mancante"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("UPDATE richieste_cedolini SET deleted_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Cedolino archiviato correttamente (Soft Delete)"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Errore durante l'archiviazione: " . $e->getMessage()]);
    }
    exit;
}

if ($action === 'restore') {
    $id = $_POST['id'] ?? null;
    if (!$id) {
        echo json_encode(["status" => "error", "message" => "ID mancante"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("UPDATE richieste_cedolini SET deleted_at = NULL WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Cedolino ripristinato con successo!"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Errore durante il ripristino: " . $e->getMessage()]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Azione non consentita"]);
