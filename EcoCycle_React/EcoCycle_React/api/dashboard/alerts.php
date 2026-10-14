<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$db    = (new Database())->connect();
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

try {
    $stmt = $db->prepare(
        "SELECT a.*, b.bin_id as binId
         FROM alerts a
         LEFT JOIN bins b ON a.bin_id = b.id
         WHERE a.resolved = 0
         ORDER BY a.created_at DESC
         LIMIT ?"
    );
    $stmt->execute([$limit]);
    $rows = $stmt->fetchAll();


    foreach ($rows as &$r) {
        $diff = time() - strtotime($r['created_at']);
        if ($diff < 60)        $r['time'] = $diff . 's fa';
        elseif ($diff < 3600)  $r['time'] = floor($diff/60) . ' min fa';
        else                   $r['time'] = floor($diff/3600) . ' h fa';
    }

    Response::json(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    Response::error('Errore alerts: ' . $e->getMessage(), 500);
}