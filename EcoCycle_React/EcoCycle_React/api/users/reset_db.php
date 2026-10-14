<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Auth.php';

try {
    $db = (new Database())->connect();
    
    // 1. Elimina tutti gli utenti presenti nella tabella
    $db->exec("DELETE FROM users");
    
    // 2. Resetta il contatore degli ID in modo che riparta da 1
    $db->exec("ALTER TABLE users AUTO_INCREMENT = 1");
    
    // 3. Genera l'utente admin di default
    $auth = new Auth($db);
    $stmt = $db->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'Admin')");
    $stmt->execute([
        'Amministratore', 
        'admin', 
        'admin@ecocycle.com', 
        $auth->hashPassword('admin123')
    ]);
    
    echo "<div style='font-family: Arial, sans-serif; padding: 20px; text-align: center;'>";
    echo "<h1 style='color: #4caf50;'>Database Resettato! </h1>";
    echo "<p>Tutti gli utenti vecchi sono stati cancellati in modo definitivo.</p>";
    echo "<p>L'account Admin è stato ricreato con successo (ID = 1).</p>";
    echo "<p>Credenziali attuali:<br><b>Username:</b> admin<br><b>Password:</b> admin123</p>";
    echo "<p>Il prossimo utente che registrerai partirà perfettamente dall'ID = 2!</p>";
    echo "</div>";
} catch (Exception $e) {
    echo "<h2>Errore durante il reset del DB:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
}
