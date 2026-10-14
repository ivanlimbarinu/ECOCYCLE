<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Auth.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
// Siccome stiamo MODIFICANDO un dato sul server, usiamo POST (sarebbe più corretto PUT, ma POST è lo standard XHR/fetch)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito']);
    exit;
}

// Estraiamo il JSON dal corpo della richiesta React e lo trasformiamo in array PHP
$data = json_decode(file_get_contents('php://input'), true);

// Controlliamo che React abbia inviato sia l'ID dell'utente sia il nuovo RUOLO da assegnare
if (!isset($data['id']) || !isset($data['role'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
    exit;
}

try {
    $db = (new Database())->connect();
    
    // Sicurezza (SQL Injection Prevention): invece di concatenare stringhe ("UPDATE... role=" . $data['role'])
    // usiamo i segnaposto nominativi (:role e :id) che verranno "bindati" in sicurezza nell'execute.
    $stmt = $db->prepare("UPDATE users SET role = :role WHERE id = :id");
    $stmt->execute([
        ':role' => $data['role'],
        ':id' => $data['id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Ruolo aggiornato con successo']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Errore durante l\'aggiornamento: ' . $e->getMessage()]);
}
