import Badge from './Badge'
import styles from './BinRow.module.css'

const SMAP = { Attivo: 'success', Manutenzione: 'warning', Offline: 'error' }

export default function BinRow({ id, name, location, fillLevel, status, capacity, lastUpdate }) {
  const color = fillLevel > 80 ? 'var(--error)' : fillLevel > 50 ? 'var(--warning)' : 'var(--success)'
  return (
    <tr className={styles.row}>
      <td className={styles.td}><code className={styles.id}>{id}</code></td>
      <td className={styles.td}>
        <div className={styles.name}>{name}</div>
        <div className={styles.loc}>{location}</div>
      </td>
      <td className={styles.td}>
        <div className={styles.fillWrap}>
          <div className={styles.bar}><div className={styles.fill} style={{ width: `${fillLevel}%`, background: color }} /></div>
          <span className={styles.pct}>{fillLevel}%</span>
        </div>
      </td>
      <td className={styles.td}><Badge label={status} variant={SMAP[status] ?? 'default'} /></td>
      <td className={styles.td}>{capacity} L</td>
      <td className={styles.td}>{lastUpdate}</td>
    </tr>
  )
}