<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Auth.php';
require_once __DIR__ . '/../config/Response.php';

// Header per prevenire blocchi CORS da parte del browser (es. se React gira su localhost:5173)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') Response::error('Metodo non consentito', 405);

// json_decode traduce i dati dal body della fetch in un array PHP
$data = json_decode(file_get_contents('php://input'), true);

// Controllo che tutti i campi fondamentali siano stati inviati
foreach (['name', 'username', 'email', 'password'] as $f) {
    if (empty($data[$f])) Response::error("Il campo $f è obbligatorio", 400);
}

// Filtro nativo PHP per validare la sintassi della mail
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    Response::error('Email non valida', 400);
}

// Regola base di sicurezza: password minimamente complesse
if (strlen($data['password']) < 8) {
    Response::error('La password deve essere di almeno 8 caratteri', 400);
}

$db = (new Database())->connect();
$auth = new Auth($db);

// Controlliamo che l'email non esista già
if ($auth->getUserByEmail($data['email'])) {
    Response::error('Email già registrata', 400);
}

// Controlliamo che l'username non esista già
if ($auth->getUserByUsername($data['username'])) {
    Response::error('Username già in uso', 400);
}

try {
    // PREPARED STATEMENTS: usiamo i punti interrogativi per evitare SQL Injection
    $stmt = $db->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'Operatore')");
    
    // Hashiamo la password prima di salvarla! Mai salvare password in chiaro.
    $stmt->execute([
        $data['name'], 
        $data['username'], 
        $data['email'], 
        $auth->hashPassword($data['password'])
    ]);
    Response::success(null, 'Registrazione completata con successo', 201);
} catch (Exception $e) {
    Response::error('Errore registrazione: ' . $e->getMessage(), 500);
}
