# Integrazione API & Architettura Ibrida

EcoCycle è un progetto complesso che non si limita a comunicare con un solo database, ma implementa un'architettura ibrida per simulare scenari reali del mondo del lavoro.

## 1. Il Problema del CORS (Cross-Origin Resource Sharing)
Siccome il frontend React viene servito da Vite sulla porta `5173` (es. `http://localhost:5173`) e il backend PHP viene servito da Apache su porta `80` (es. `http://localhost`), i browser moderni bloccano nativamente le richieste per motivi di sicurezza (CORS).

**Soluzione Implementata:**
È stato utilizzato il server di sviluppo di Vite come **Proxy Inverso**. Nel file `vite.config.js` abbiamo istruito il frontend in questo modo:
- Ogni volta che React fa una chiamata verso `/api/auth/...`, Vite intercetta la richiesta e la inoltra silenziosamente verso `http://localhost/ecocycle-api/api/...`.
- In questo modo, il browser crede che frontend e backend risiedano sullo stesso server, evitando qualsiasi errore CORS.

## 2. Mock API Esterna (Dati Cassonetti)
Per simulare il recupero dei dati in tempo reale dei sensori dei cassonetti (livello di riempimento, stato, ultima manutenzione), è stata integrata l'API fornita dal docente:
- **URL Base:** `https://mock-api-server-production-7f5d.up.railway.app/ecocycle/api`
- Anche questa chiamata viene protetta dal Proxy Vite (rotta `/external-api`) per prevenire problemi.

**Customizzazione dei Dati:**
Essendo un'API "fissa" che restituisce indirizzi milanesi, il componente React (`Cassonetti.jsx`) implementa un livello di "traduzione" lato frontend: dopo aver recuperato il JSON originale dall'API, re-mappa in modo trasparente gli indirizzi (es. trasformandoli in "Via Santa Chiara", "Via Roma" a Torino) prima di iniettarli nello State del componente, permettendo così alla barra di ricerca di funzionare sugli indirizzi piemontesi.

## 3. Resilience e Fallback (Il Piano B)
Cosa succede se il database locale XAMPP non è acceso ma la pagina cerca di recuperare gli utenti? Invece di far crashare rovinosamente l'interfaccia con uno schermo bianco, è stato implementato un meccanismo di **Fallback Inteligente** in `Utenti.jsx`:
1. React prova a chiamare l'API PHP locale `list.php`.
2. Se la chiamata fallisce (Catch Error), logga silenziosamente l'errore e passa al Piano B.
3. Esegue una fetch all'API mock remota esterna per recuperare degli "utenti fittizi", garantendo che la tabella a schermo continui a funzionare e mostri dei dati.


## 📄 Licenza

© 2025–2027 Codreanu Stefan Ioan — All rights reserved.

---
