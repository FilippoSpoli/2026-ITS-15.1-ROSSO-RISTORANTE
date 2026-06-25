<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Recupera e sanifica i dati inviati da JavaScript (Inclusi Nome e Cognome)
    $nome = htmlspecialchars(strip_tags(trim($_POST['nome'] ?? 'Anonimo')));
    $cognome = htmlspecialchars(strip_tags(trim($_POST['cognome'] ?? '')));
    $valutazione = intval($_POST['valutazione'] ?? 5);
    $commento = htmlspecialchars(strip_tags(trim($_POST['commento'] ?? '')));

    // Valida che i campi fondamentali non siano vuoti
    if (empty($commento) || $valutazione < 1 || $valutazione > 5) {
        die("Errore: Dati della recensione incompleti o non validi.");
    }

    try {
        // 2. Prepara la query inserendo esplicitamente anche la colonna cognome
        $sql = "INSERT INTO recensioni (nome, cognome, valutazione, commento) VALUES (?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        
        // 3. Esegue l'inserimento sicuro a database
        $eseguito = $stmt->execute([
            $nome, 
            $cognome,
            $valutazione, 
            $commento
        ]);

        if ($eseguito) {
            // Ritorna la stringa di successo pura interpretata da main.js
            echo "success";
            exit;
        } else {
            echo "Errore durante l'inserimento della recensione nel database.";
        }

    } catch (\PDOException $e) {
        die("Errore Database: " . $e->getMessage());
    }
}
