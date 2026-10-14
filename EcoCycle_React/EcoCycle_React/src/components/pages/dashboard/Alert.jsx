import { useState } from 'react'
import Badge from '../../ui/Badge'
import styles from './Alert.module.css'

const ALL = [
  { id: 1, type: 'Bin Full', message: 'Il cassonetto di Via Roma ha superato il 95% di riempimento. Svuotamento richiesto.', severity: 'Critico', time: '5 min fa', bin: 'B-01' },
  { id: 2, type: 'Maintenance', message: 'Manutenzione programmata per sostituzione sensore volumetrico.', severity: 'Avviso', time: '30 min fa', bin: 'B-45' },
  { id: 3, type: 'Low Battery', message: 'Batteria sensore sotto il 10%. Necessaria sostituzione al prossimo giro.', severity: 'Avviso', time: '2 h fa', bin: 'B-23' },
  { id: 4, type: 'Online', message: 'Il dispositivo è tornato online dopo un periodo di inattività.', severity: 'Info', time: '1 h fa', bin: 'B-89' },
  { id: 5, type: 'Offline', message: 'Nessun segnale dal dispositivo da oltre 24 ore. Inviare ispezione.', severity: 'Critico', time: '3 h fa', bin: 'B-67' },
  { id: 6, type: 'Collection', message: 'L\'operatore ha confermato lo svuotamento del cassonetto.', severity: 'Success', time: '5 h fa', bin: 'B-12' },
]

const SMAP = { Critico: 'error-filled', Avviso: 'warning-filled', Info: 'info', Success: 'success-filled' }

const Icons = {
  Critico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-error)' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Avviso: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-warning)' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Info: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-info)' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Success: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-success)' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}

export default function Alert() {
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? ALL : ALL.filter(a => a.severity === filter)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Centro Notifiche e Allarmi</h2>
          <p className={styles.pageSubtitle}>Monitora e gestisci gli eventi di sistema.</p>
        </div>
        <div className={styles.filters}>
          {['all', 'Critico', 'Avviso', 'Info', 'Success'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `Tutti (${ALL.length})` : `${f} (${ALL.filter(a => a.severity === f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {list.map(a => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardIcon}>
              {Icons[a.severity]}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <span className={styles.type}>{a.type}</span>
                <span className={styles.time}>{a.time}</span>
              </div>
              <p className={styles.msg}>{a.message}</p>
              <div className={styles.foot}>
                <span className={styles.binTag}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Cassonetto {a.bin}
                </span>
                <Badge label={a.severity} variant={SMAP[a.severity] ?? 'default'} />
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className={styles.emptyState}>
            Nessun avviso presente per questa categoria.
          </div>
        )}
      </div>
    </div>
  )
}