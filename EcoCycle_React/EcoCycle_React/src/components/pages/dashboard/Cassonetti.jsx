import { useState, useEffect } from 'react'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import styles from './Cassonetti.module.css'
import { fetchExternal } from '../../../config/apiExternal'

export default function Cassonetti() {
  const [bins, setBins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadBins = async () => {
    setLoading(true)
    setError(null)
    try {
      // Chiamata all'API pubblica esterna (es. Dati Milano)
      // fetchExternal utilizza il proxy configurato in vite.config.js per superare i blocchi CORS
      const data = await fetchExternal('/bins')

      // Siccome l'API esterna restituisce dati di un'altra città (es. Milano),
      // usiamo un array di appoggio per mappare fittiziamente gli indirizzi su Torino
      const turinAddresses = [
        "Via Santa Chiara, 1",
        "Piazza Castello, 10",
        "Via Po, 15",
        "Corso Vittorio Emanuele II, 40",
        "Via Roma, 22"
      ]
      
      // Il metodo map() crea un nuovo array fondendo i dati originali dell'API esterna (...b) 
      // con i nostri campi personalizzati (address e zone)
      const mappedData = data.map((b, i) => ({
        ...b,
        address: turinAddresses[i % turinAddresses.length],
        zone: "Torino Centro"
      }))

      // Aggiorniamo lo State locale (useState) con i dati processati
      setBins(mappedData)
    } catch (err) {
      // Se l'API esterna fallisce (es. server down), mostriamo l'errore a schermo
      setError(err.message)
    } finally {
      // Il blocco finally viene eseguito sia in caso di try che di catch
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBins()
  }, [])

  const filtered = bins.filter(bin => {
    const searchQuery = search.toLowerCase()
    const matchSearch = (bin.code && bin.code.toLowerCase().includes(searchQuery)) || (bin.address && bin.address.toLowerCase().includes(searchQuery))
    const matchStatus = statusFilter === 'all' || bin.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Gestione Cassonetti</h2>
          <p className={styles.subtitle}>Monitora lo stato, il riempimento e pianifica la manutenzione.</p>
        </div>
      </div>

      <div className={styles.toolbar} style={{ display: 'flex', gap: '16px', background: 'var(--white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--neutral-300)', boxShadow: 'var(--shadow-sm)' }}>
        <div className={styles.filters} style={{ display: 'flex', gap: '16px', flex: 1 }}>
          <input className={styles.search} placeholder="Cerca ID o Indirizzo..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--neutral-300)', background: 'var(--neutral-50)' }} />
          <select className={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--neutral-300)', background: 'var(--white)' }}>
            <option value="all">Tutti gli stati</option>
            <option value="normale">Normale</option>
            <option value="quasi_pieno">Quasi Pieno</option>
            <option value="critico">Critico</option>
            <option value="in_manutenzione">Manutenzione</option>
          </select>
        </div>
        <Button variant="primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuovo Cassonetto
        </Button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--neutral-300)' }}>
          <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-700)' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <p style={{ marginTop: '16px', color: 'var(--neutral-600)' }}>Caricamento flotta cassonetti...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--color-error)' }}>
          <h3 style={{ color: 'var(--color-error)' }}>Errore di connessione</h3>
          <p style={{ marginTop: '8px', color: 'var(--neutral-600)' }}>{error}</p>
          <Button variant="primary" onClick={loadBins} style={{ marginTop: '16px' }}>Riprova</Button>
        </div>
      ) : (
        <div className={styles.tableWrap} style={{ background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--neutral-300)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Tipologia e Zona</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Riempimento</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Stato</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Svuotato Il</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(bin => (
                <tr key={bin.id} style={{ borderBottom: '1px solid var(--neutral-100)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--neutral-50)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <code style={{ background: 'var(--neutral-100)', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--neutral-900)' }}>{bin.code}</code>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--neutral-900)' }}>{bin.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {bin.address}, {bin.zone}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--neutral-200)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${bin.capacity}%`, background: bin.capacity >= 80 ? 'var(--color-error)' : bin.capacity >= 50 ? 'var(--color-warning)' : 'var(--primary-500)' }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral-900)', width: '35px' }}>{bin.capacity}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Badge
                      label={bin.status.replace('_', ' ')}
                      variant={bin.status === 'critico' || bin.status === 'fuori_servizio' ? 'error' : bin.status === 'normale' ? 'success' : 'warning'}
                    />
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--neutral-700)' }}>
                    {bin.lastEmptied ? new Date(bin.lastEmptied).toLocaleDateString('it-IT') : '-'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--neutral-500)' }}>Nessun cassonetto trovato.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
    </div>
  )
}