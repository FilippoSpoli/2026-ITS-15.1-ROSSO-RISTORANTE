<?php
// Include la connessione centralizzata al database
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Recupera e pulisci i dati inviati dal form
    $nome = htmlspecialchars(strip_tags(trim($_POST['nome'])));
    $indirizzo = htmlspecialchars(strip_tags(trim($_POST['indirizzo'])));
    $telefono = htmlspecialchars(strip_tags(trim($_POST['telefono'])));
    
    // Ipotizziamo che dal frontend arrivi una stringa o testo con l'elenco dei piatti
    $dettaglio_ordine = htmlspecialchars(strip_tags(trim($_POST['carrello']))); 
    
    // Convertiamo il totale in un numero decimale float
    $totale = floatval($_POST['totale']);
    
    // Le note sono opzionali, se non ci sono salviamo un valore vuoto
    $note = isset($_POST['note']) ? htmlspecialchars(strip_tags(trim($_POST['note']))) : '';

    // Valida i campi obbligatori
    if (empty($nome) || empty($indirizzo) || empty($telefono) || empty($dettaglio_ordine) || $totale <= 0) {
        die("Errore: Dati dell'ordine incompleti o non validi.");
    }

    try {
        // 2. Prepara la query SQL con i segnaposto (?) per evitare la SQL Injection
        $sql = "INSERT INTO ordini (nome_cliente, indirizzo, telefono, dettaglio_ordine, totale, note) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        
        // 3. Esegui la query passando l'array con i dati reali
        $eseguito = $stmt->execute([
            $nome, 
            $indirizzo, 
            $telefono, 
            $dettaglio_ordine, 
            $totale, 
            $note
        ]);

        if ($eseguito) {
            // Reindirizza l'utente alla pagina degli ordini con un messaggio di successo nell'URL
            header("Location: ../ordini.html?status=success");
            exit;
        } else {
            echo "Si è verificato un errore durante l'invio dell'ordine.";
        }

    } catch (\PDOException $e) {
        // Mostra l'errore del database (in produzione è meglio nasconderlo o salvarlo in un log privato)
        echo "Errore del database: " . $e->getMessage();
    }

} else {
    // Se qualcuno prova ad accedere direttamente al file PHP tramite URL, lo rimanda alla home
    header("Location: ../index.html");
    exit;
}
