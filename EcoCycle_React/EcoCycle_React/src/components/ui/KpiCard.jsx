import styles from './KpiCard.module.css'

export default function KpiCard({ label, value, subtitle, trend, dotColor }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {trend !== undefined && (
          <span className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <span className={styles.value}>{value}</span>
      <div className={styles.foot}>
        {dotColor && <span className={styles.dot} style={{ background: dotColor }} />}
        <span className={styles.sub}>{subtitle}</span>
      </div>
    </div>
  )
}