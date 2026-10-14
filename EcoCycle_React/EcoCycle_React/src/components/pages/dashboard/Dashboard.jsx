import { useState, useEffect } from 'react'
import KpiCard from '../../ui/KpiCard'
import AlertRow from '../../ui/AlertRow'
import styles from './Dashboard.module.css'
import { fetchExternal } from '../../../config/apiExternal'

export default function Dashboard() {
  const [kpi, setKpi] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Carico le statistiche globali (usiamo ID 1 come da specifiche)
      const stats = await fetchExternal('/dashboard_stats/1')
      setKpi(stats)

      // Carico notifiche/alert recenti (rimosso filtro in_attesa per mostrarne di più)
      const recentReports = await fetchExternal('/reports?_limit=4')

      const formattedAlerts = recentReports.map(r => ({
        id: r.id,
        type: r.type,
        message: r.description,
        severity: r.type.includes('danneggiato') || r.type.includes('fuori uso') ? 'Critico' : 'Avviso',
        time: new Date(r.createdAt).toLocaleDateString('it-IT'),
        binId: r.binCode
      }))
      setAlerts(formattedAlerts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className={styles.page} style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--primary-700)' }}>
          <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <p>Caricamento dati della dashboard in corso...</p>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-error)', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3 style={{ color: 'var(--color-error)', marginBottom: '8px' }}>Errore di caricamento</h3>
          <p style={{ color: 'var(--neutral-700)', marginBottom: '24px' }}>{error}</p>
          <button onClick={loadData} style={{ background: 'var(--primary-700)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Riprova connessione
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.kpiGrid}>
        <KpiCard label="Cassonetti Totali" value={kpi?.totalBins || 0} subtitle={`${kpi?.activeBins || 0} online`} dotColor="var(--primary-500)" />
        <KpiCard label="Riempimento Medio" value={`${kpi?.avgCapacity || 0}%`} subtitle="media globale attuale" dotColor="var(--color-warning)" />
        <KpiCard label="Cassonetti Critici" value={kpi?.criticalBins || 0} subtitle="richiedono intervento" dotColor="var(--color-error)" trend={kpi?.criticalBins > 5 ? -10 : 5} />
        <KpiCard label="Raccolte Odierne" value={kpi?.collectionsToday || 0} subtitle="svuotamenti effettuati" dotColor="var(--color-info)" />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Segnalazioni in attesa</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Evento</th><th>Severità</th><th>Cassonetto</th><th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length > 0 ? alerts.map(a => <AlertRow key={a.id} {...a} />) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--neutral-500)' }}>Nessuna segnalazione in attesa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}