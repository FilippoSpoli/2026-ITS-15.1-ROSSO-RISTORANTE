<?php
// Include la connessione al database appena creata
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Recupera e pulisci i dati
    $nome = htmlspecialchars(strip_tags(trim($_POST['nome'])));
    $data = htmlspecialchars(strip_tags(trim($_POST['data'])));
    $ora = htmlspecialchars(strip_tags(trim($_POST['ora'])));
    $ospiti = intval($_POST['ospiti']);

    // Valida i campi obbligatori
    if (empty($nome) || empty($data) || empty($ora) || $ospiti <= 0) {
        die("Errore: Compila tutti i campi correttamente.");
    }

    try {
        // 2. Prepara la query SQL con i segnaposto (?) per la sicurezza
        $sql = "INSERT INTO prenotazioni (nome, data_prenotazione, ora_prenotazione, ospiti) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        // 3. Esegui la query passando i dati reali
        $eseguito = $stmt->execute([$nome, $data, $ora, $ospiti]);

        if ($eseguito) {
            // Reindirizza l'utente alla pagina iniziale con lo stato di successo
            header("Location: ../prenotazioni.html?status=success");
            exit;
        } else {
            echo "Si è verificato un errore durante il salvataggio dei dati.";
        }

    } catch (\PDOException $e) {
        // In produzione è meglio non mostrare l'errore crudo ($e->getMessage()) per sicurezza
        echo "Errore del database: " . $e->getMessage();
    }

} else {
    header("Location: ../index.html");
    exit;
}
