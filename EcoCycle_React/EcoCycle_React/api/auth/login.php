<?php
// Questi 'require' importano i file di configurazione (database, hashing password, risposte JSON)
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Auth.php';
require_once __DIR__ . '/../config/Response.php';

// Impostazioni degli Header per evitare problemi CORS (Cross-Origin Resource Sharing)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Se il browser manda una richiesta di "pre-flight" (OPTIONS) rispondiamo 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Accettiamo solo richieste POST (perché stiamo inviando password e non devono essere nel link GET)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') Response::error('Metodo non consentito', 405);

// Decodifichiamo i dati inviati da React (che usa JSON.stringify nel fetch)
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['username']) || empty($data['password']))
    Response::error('Username e password obbligatori', 400);

// Inizializzazione della connessione al database
$db   = (new Database())->connect();
$auth = new Auth($db);

// Cerchiamo l'utente nel Database partendo dall'email. Se non c'è, proviamo con lo username
$user = $auth->getUserByEmail($data['username']);
if (!$user) {
    $user = $auth->getUserByUsername($data['username']);
}

// verifyPassword() confronta la password in chiaro inviata con quella criptata nel Database (hash bcrypt)
if (!$user || !$auth->verifyPassword($data['password'], $user['password']))
    Response::error('Credenziali non valide', 401);

// Generiamo un token fittizio per mantenere la sessione attiva lato React
$token = $auth->generateToken();

// Restituiamo il JSON pulito a React
Response::json([
    'success' => true,
    'message' => 'Login riuscito',
    'token'   => $token,
    'user'    => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
    ]
]);