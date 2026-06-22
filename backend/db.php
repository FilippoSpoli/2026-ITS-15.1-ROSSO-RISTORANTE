<?php
$host = '127.0.0.1';
$db   = 'steakhouse_db';
$charset = 'utf8mb4';

// Configurazione di default (MAMP)
$user = 'root';
$pass = 'root';
$port = '8889';

// Rilevamento automatico dell'ambiente: se la porta 8889 è chiusa, assumiamo sia XAMPP
$connectionCheck = @fsockopen($host, 8889, $errno, $errstr, 0.1);
if (!$connectionCheck) {
    // Switch automatico a XAMPP
    $pass = '';
    $port = '3306';
} else {
    fclose($connectionCheck);
}

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
