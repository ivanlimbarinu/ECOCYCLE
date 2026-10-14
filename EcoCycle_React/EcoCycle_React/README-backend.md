# Backend Locale (PHP & MySQL)

EcoCycle utilizza un server backend locale basato su XAMPP per gestire in modo sicuro e persistente l'identità degli utenti, l'autenticazione e la gestione dei privilegi (RBAC - Role Based Access Control).

## Database (MySQL)

Il database ospita la tabella vitale del progetto: `users`.

### Tabella `users`
- `id` (INT, AUTO_INCREMENT)
- `name` (VARCHAR)
- `username` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR) - *Contiene l'hash sicuro della password, NON la password in chiaro.*
- `role` (VARCHAR) - *Determina i permessi. Valori previsti: 'Admin', 'Operatore'.*
- `created_at` (TIMESTAMP)

## Architettura PHP

Il codice PHP espone delle vere e proprie **RESTful API** locali, rispondendo sempre in formato **JSON** e gestendo in modo autonomo il controllo dei metodi HTTP e del CORS.

### File Principali di Configurazione
- `config/Database.php`: Implementa la classe per la connessione al database MySQL utilizzando **PDO** (PHP Data Objects), che previene nativamente attacchi di tipo SQL Injection.
- `config/Auth.php`: Contiene i metodi di utility per l'hashing delle password (utilizzando `password_hash()` con l'algoritmo sicuro `BCRYPT`) e per la verifica delle stesse durante il login.

### Endpoint Principali

#### Autenticazione (`/api/auth/`)
- `login.php`: Riceve le credenziali in POST. Se verificate correttamente contro l'hash salvato nel DB, restituisce un token e i dati dell'utente.
- `register.php`: Riceve i dati del nuovo utente, hasha la password e lo inserisce nel database assegnandogli il ruolo predefinito di `Operatore`.

#### Gestione Utenti (`/api/users/`)
- `list.php`: Endpoint accessibile (idealmente protetto) per restituire in JSON la lista di tutti gli utenti registrati nel sistema locale.
- `update_role.php`: Script dedicato esclusivamente all'amministratore per poter innalzare o abbassare i privilegi di un altro utente (es. da Operatore ad Admin).

## Sicurezza
1. **No SQL Injection**: Tutto il database viene interrogato usando *Prepared Statements* via PDO. Mai stringhe concatenate.
2. **Cifratura Password**: Le password non vengono mai salvate in chiaro. Si sfrutta bcrypt.
3. **API Ibride**: Siccome il React frontend gira sulla porta `5173` e il backend su XAMPP porta `80`, si utilizza il `proxy` di Vite (configurato in `vite.config.js`) per veicolare il traffico senza incorrere nei rigidi blocchi **CORS** del browser.


## Licenza

© 2025–2027 Codreanu Stefan Ioan — All rights reserved.

---
