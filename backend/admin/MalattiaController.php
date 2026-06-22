<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

require_once __DIR__ . '/../db.php';

$action = $_GET['action'] ?? '';

if ($action === 'index') {
    try {
        $stmt = $pdo->query("SELECT id, dipendente, codice_inps, data_inizio, data_fine, stato, deleted_at FROM richieste_malattia ORDER BY id DESC");
        $malantie = $stmt->fetchAll();
        echo json_encode($malantie);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

if ($action === 'update_stato') {
    $id = $_POST['id'] ?? null;
    $stato = $_POST['stato'] ?? null;

    if (!$id || !in_array($stato, ['approvato', 'rifiutato'])) {
        echo json_encode(["status" => "error", "message" => "Parametri non validi"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE richieste_malattia SET stato = ? WHERE id = ?");
        $stmt->execute([$stato, $id]);
        echo json_encode(["status" => "success", "message" => "Certificato aggiornato correttamente in: " . ucfirst($stato)]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

if ($action === 'destroy') {
    $id = $_POST['id'] ?? null;
    $type = $_POST['type'] ?? 'soft'; // Riceve 'soft' o 'hard'

    if (!$id) {
        echo json_encode(["status" => "error", "message" => "ID mancante"]);
        exit;
    }

    try {
        if ($type === 'hard') {
            // Eliminazione Definitiva
            $stmt = $pdo->prepare("DELETE FROM richieste_malattia WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Pratica di malattia eliminata definitivamente dal database."]);
        } else {
            // Soft Delete (Archiviazione)
            $stmt = $pdo->prepare("UPDATE richieste_malattia SET deleted_at = NOW() WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Pratica di malattia archiviata correttamente."]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Errore durante l'eliminazione: " . $e->getMessage()]);
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
        // Ripristina portando deleted_at a NULL
        $stmt = $pdo->prepare("UPDATE richieste_malattia SET deleted_at = NULL WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Pratica di malattia ripristinata con successo!"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Errore durante il ripristino: " . $e->getMessage()]);
    }
    exit;
}
