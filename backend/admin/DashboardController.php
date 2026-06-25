<?php
require_once '../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $stmtOrdini = $pdo->query("SELECT COUNT(*) as totale FROM ordini");
    $totaleOrdini = $stmtOrdini->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;

    $stmtIncassi = $pdo->query("SELECT SUM(totale) as totale FROM ordini");
    $totaleIncassi = $stmtIncassi->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0.00;

    $totalePiatti = 0;
    try {
        $stmtPiatti = $pdo->query("SELECT COUNT(*) as totale FROM menu");
        $totalePiatti = $stmtPiatti->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;
    } catch (\PDOException $e) { $totalePiatti = 0; }

    $stmtPrenotazioni = $pdo->query("SELECT COUNT(*) as totale FROM prenotazioni");
    $totalePrenotazioni = $stmtPrenotazioni->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;

    $ferieAttesa = 0;
    try {
        $stmtFerie = $pdo->query("SELECT COUNT(*) as totale FROM dipendenti_ferie WHERE stato = 'In attesa'");
        $ferieAttesa = $stmtFerie->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;
    } catch (\PDOException $e) { $ferieAttesa = 0; }

    $malattieAttive = 0;
    try {
        $stmtMalattia = $pdo->query("SELECT COUNT(*) as totale FROM dipendenti_malattia WHERE stato = 'Attiva'");
        $malattieAttive = $stmtMalattia->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;
    } catch (\PDOException $e) { $malattieAttive = 0; }

    $cedoliniMese = 0;
    try {
        $stmtCedolini = $pdo->query("SELECT COUNT(*) as totale FROM cedolini WHERE MONTH(data_emissione) = MONTH(CURRENT_DATE()) AND YEAR(data_emissione) = YEAR(CURRENT_DATE())");
        $cedoliniMese = $stmtCedolini->fetch(PDO::FETCH_ASSOC)['totale'] ?? 0;
    } catch (\PDOException $e) { $cedoliniMese = 0; }

    echo json_encode([
        'totale_ordini'       => intval($totaleOrdini),
        'totale_incassi'      => floatval($totaleIncassi),
        'totale_piatti'       => intval($totalePiatti),
        'totale_prenotazioni' => intval($totalePrenotazioni),
        'ferie_attesa'        => intval($ferieAttesa),
        'malattie_attive'     => intval($malattieAttive),
        'cedolini_mese'       => intval($cedoliniMese)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
