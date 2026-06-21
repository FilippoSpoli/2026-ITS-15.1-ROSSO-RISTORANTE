<?php
// Include la connessione al database centralizzata (db.php si trova nella stessa cartella)
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Recupera e sanifica i dati inviati da JavaScript
    $nome = htmlspecialchars(strip_tags(trim($_POST['nome'])));
    $indirizzo = htmlspecialchars(strip_tags(trim($_POST['indirizzo'])));
    $telefono = htmlspecialchars(strip_tags(trim($_POST['telefono'])));
    $dettaglio_ordine = htmlspecialchars(strip_tags(trim($_POST['carrello']))); 
    $totale = floatval($_POST['totale']);
    
    // Gestione del valore NULL reale per le note vuote
    if (isset($_POST['note']) && trim($_POST['note']) !== '') {
        $note = htmlspecialchars(strip_tags(trim($_POST['note'])));
    } else {
        $note = null;
    }

    // Valida che i campi fondamentali non siano vuoti
    if (empty($nome) || empty($indirizzo) || empty($telefono) || empty($dettaglio_ordine) || $totale <= 0) {
        die("Errore: Dati dell'ordine incompleti o non validi.");
    }

    try {
        // 2. Prepara la query SQL inserendo tutte le colonne
        $sql = "INSERT INTO ordini (nome_cliente, indirizzo, telefono, dettaglio_ordine, totale, note) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        
        // 3. Esegue la query iniettando in sicurezza i dati reali
        $eseguito = $stmt->execute([
            $nome, 
            $indirizzo, 
            $telefono, 
            $dettaglio_ordine, 
            $totale, 
            $note
        ]);

        if ($eseguito) {
            // Risposta testuale pulita per intercettare il successo via Fetch in JavaScript
            echo "success";
            exit;
        } else {
            echo "Errore durante l'inserimento dell'ordine nel database.";
        }

    } catch (\PDOException $e) {
        echo "Errore del database: " . $e->getMessage();
    }
} else {
    echo "Metodo di richiesta non consentito.";
}
