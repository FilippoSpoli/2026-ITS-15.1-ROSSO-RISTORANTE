<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // 1. Ordini totali e incassi sum
    $stmtOrdini = $pdo->query("SELECT COUNT(*) as totale, SUM(totale) as incassi FROM ordini");
    $resOrdini = $stmtOrdini->fetch(PDO::FETCH_ASSOC);

    // 2. Piatti attivi (Verificato: colonna 'disponibile' con la i)
    $stmtPiatti = $pdo->query("SELECT COUNT(*) as totale FROM menu WHERE disponibile = 1");
    $resPiatti = $stmtPiatti->fetch(PDO::FETCH_ASSOC);

    // 3. Prenotazioni totali (Verificato: tabella 'prenotazioni' al plurale)
    $stmtPrenotazioni = $pdo->query("SELECT COUNT(*) as totale FROM prenotazioni");
    $resPrenotazioni = $stmtPrenotazioni->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'totale_ordini' => intval($resOrdini['totale'] ?? 0),
        'totale_incassi' => floatval($resOrdini['incassi'] ?? 0),
        'totale_piatti' => intval($resPiatti['totale'] ?? 0),
        'totale_prenotazioni' => intval($resPrenotazioni['totale'] ?? 0)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
