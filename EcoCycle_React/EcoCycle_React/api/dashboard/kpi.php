<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$db = (new Database())->connect();

try {
    $total   = $db->query("SELECT COUNT(*) FROM bins")->fetchColumn();
    $online  = $db->query("SELECT COUNT(*) FROM bins WHERE status='Attivo'")->fetchColumn();
    $avgFill = $db->query("SELECT AVG(fill_level) FROM bins")->fetchColumn();
    $maint   = $db->query("SELECT COUNT(*) FROM bins WHERE status='Manutenzione'")->fetchColumn();

    Response::json([
        'success' => true,
        'data'    => [
            'totalBins'        => (int)$total,
            'onlineBins'       => (int)$online,
            'maintenanceBins'  => (int)$maint,
            'avgFill'          => round((float)$avgFill),
            'collectionsToday' => 23,   // mock — integrare con tabella collections
            'efficiency'       => 94,   // mock — calcolare da rotte
        ]
    ]);
} catch (Exception $e) {
    Response::error('Errore KPI: ' . $e->getMessage(), 500);
}