# EcoCycle - Sistema di Gestione Cassonetti Intelligente

EcoCycle è una piattaforma web moderna progettata per ottimizzare la raccolta dei rifiuti urbani. Attraverso una dashboard interattiva, permette di monitorare lo stato di riempimento dei cassonetti intelligenti, gestire le segnalazioni e amministrare gli operatori ecologici sul territorio (focus su Torino).

## Obiettivi del Progetto
L'obiettivo primario di EcoCycle è dimostrare le competenze acquisite nello sviluppo frontend con **React** (Hooks, Context API, Router) integrato a un backend ibrido:
1. **Backend Locale (PHP/MySQL)**: Gestione sicura dell'autenticazione, registrazione e gestione degli utenti (ruoli Admin e Operatore).
2. **API Esterna (Mock)**: Recupero dati in tempo reale sullo stato della flotta di cassonetti.

## Tecnologie Utilizzate
- **Frontend**: React (Vite), React Router DOM, CSS Modules.
- **Backend Locale**: PHP (PDO), MySQL (XAMPP).
- **Integrazioni**: Fetch API per chiamate esterne (proxy tramite Vite per aggirare i problemi di CORS).

## Come avviare il progetto in locale

### 1. Avvio del Database e Backend (XAMPP)
1. Apri **XAMPP Control Panel**.
2. Avvia i moduli **Apache** e **MySQL**.
3. Assicurati che la cartella `api` (contenente il codice PHP) sia stata copiata in `C:\xampp\htdocs\ecocycle-api\api`.
4. Importa il file `database.sql` (se necessario) tramite PHPMyAdmin per creare la tabella `users`.

### 2. Avvio del Frontend (Vite)
1. Apri il terminale nella cartella principale del progetto React (`ecocycleREACTJS`).
2. Esegui il comando di installazione delle dipendenze (se è la prima volta):
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```
4. Il progetto sarà raggiungibile all'indirizzo `http://localhost:5173`.

## Documentazione Dettagliata
Per l'esame, la documentazione è stata divisa in tre sezioni tematiche approfondite:
- [**Frontend & Requisiti React**](./README-frontend.md) -> Scopri dove sono stati implementati Hooks, Props, Router e il Context API.
- [**Backend & Autenticazione**](./README-backend.md) -> Dettagli su PHP, MySQL e gestione ruoli.
- [**Integrazione API**](./README-api.md) -> Flusso dati, chiamate asincrone e fallback di emergenza.

## Licenza

© 2025–2027 Codreanu Stefan Ioan — All rights reserved.

---
