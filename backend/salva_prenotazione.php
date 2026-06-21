<?php
// 1. Include db.php che è già connesso a 'steakhouse_db'
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 2. Recupera e sanifica tutti i campi inviati da JavaScript
    $nome = htmlspecialchars(strip_tags(trim($_POST['nome'])));
    $email = htmlspecialchars(strip_tags(trim($_POST['email'])));
    $telefono = htmlspecialchars(strip_tags(trim($_POST['telefono'])));
    $data = htmlspecialchars(strip_tags(trim($_POST['data'])));
    $ora = htmlspecialchars(strip_tags(trim($_POST['ora'])));
    $ospiti = intval($_POST['ospiti']);
    $note = isset($_POST['note']) ? htmlspecialchars(strip_tags(trim($_POST['note']))) : '';

    // Controlla che i campi obbligatori non siano vuoti
    if (empty($nome) || empty($email) || empty($telefono) || empty($data) || empty($ora) || $ospiti <= 0) {
        die("Errore: Compila tutti i campi obbligatori.");
    }

    try {
        // 3. Prepariamo la query usando i nomi esatti delle colonne della tua tabella
        $sql = "INSERT INTO prenotazioni (nome, email, telefono, data_prenotazione, ora_prenotazione, ospiti, note) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        
        // 4. Eseguiamo il salvataggio iniettando i dati in sicurezza
        $eseguito = $stmt->execute([
            $nome, 
            $email, 
            $telefono, 
            $data, 
            $ora, 
            $ospiti, 
            $note
        ]);

        if ($eseguito) {
            // Risposta testuale pulita letta dal fetch di main.js per attivare la card di successo
            echo "success";
            exit;
        } else {
            echo "Errore durante l'inserimento dei dati.";
        }

    } catch (\PDOException $e) {
        echo "Errore del database: " . $e->getMessage();
    }
} else {
    echo "Metodo non consentito.";
}
