<?php
$host = 'localhost';
$db   = 'steakhouse_db';
$user = 'root'; // Cambia con il tuo utente MySQL (es. 'root' su XAMPP)
$pass = '';     // Cambia con la tua password MySQL (vuota di default su XAMPP)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Attiva i report degli errori
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Ritorna i dati come array associativi
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Disattiva l'emulazione per maggiore sicurezza
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
