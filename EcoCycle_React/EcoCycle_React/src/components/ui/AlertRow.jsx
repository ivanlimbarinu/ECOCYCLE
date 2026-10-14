import Badge from './Badge'
import styles from './AlertRow.module.css'

const SMAP = { Critico: 'error-filled', Avviso: 'warning-filled', Info: 'info', Success: 'success-filled' }

const ICONS = {
  Critico: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-error)' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Avviso: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-warning)' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-info)' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Success: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-success)' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}

export default function AlertRow({ id, type, message, severity, time, binId }) {
  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.wrap}>
          <div style={{ marginTop: '2px' }}>{ICONS[severity]}</div>
          <div>
            <div className={styles.type}>{type}</div>
            <div className={styles.msg}>{message}</div>
          </div>
        </div>
      </td>
      <td className={styles.td}><Badge label={severity} variant={SMAP[severity] ?? 'default'} /></td>
      <td className={styles.td}><code className={styles.bin}>{binId}</code></td>
      <td className={styles.td}>{time}</td>
    </tr>
  )
}