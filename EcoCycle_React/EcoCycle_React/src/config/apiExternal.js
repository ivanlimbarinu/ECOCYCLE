// '/external-api' è la rotta "fittizia" che Vite (nel file vite.config.js) 
// intercetterà e rimpiazzerà con 'https://dati.comune.milano.it/dataset/...' 
// Questo trucco aggira il problema del blocco CORS (Cross-Origin Resource Sharing) del browser.
export const EXTERNAL_API_URL = '/external-api'

// Utility function per fare fetch verso l'API esterna pubblica con error handling
export async function fetchExternal(endpoint, options = {}) {
  // Costruiamo l'URL unendo la base fittizia (il Proxy di Vite) e l'endpoint specifico 
  // (es: '/package_show?id=...' o '/action/datastore_search')
  const url = `${EXTERNAL_API_URL}${endpoint}`
  
  // Utilizziamo fetch (metodo nativo di JS) per la chiamata asincrona all'API
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  // Se lo status della risposta HTTP non è nella famiglia 200 (es. 404, 500)
  // forziamo un'eccezione, così verrà catturata dal blocco 'catch' di chi ha chiamato questa funzione.
  if (!response.ok) {
    throw new Error(`Errore API: ${response.status} ${response.statusText}`)
  }

  // Risolviamo la promise restituendo direttamente il JSON parsato
  return response.json()
}
