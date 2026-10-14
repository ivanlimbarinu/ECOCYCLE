import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './TopBar.module.css'

const TITLES = {
  '/': 'Dashboard',
  '/mappa': 'Mappa',
  '/alert': 'Alert',
  '/analisi': 'Analisi',
  '/cassonetti': 'Cassonetti',
  '/utenti': 'Utenti',
  '/configurazione': 'Configurazione',
}

export default function TopBar() {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const title = TITLES[pathname] ?? 'EcoCycle'

  return (
    <header className={styles.bar}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.right}>
        <div className={styles.menuWrap}>
          <button className={styles.notifBtn} onClick={() => setNotifOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className={styles.badge}>2</span>
          </button>
          {notifOpen && (
            <div className={styles.dropdown} style={{ width: '280px', right: '-10px' }}>
              <div style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid var(--neutral-300)' }}>Notifiche</div>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--neutral-300)', fontSize: '13px' }}>
                <strong style={{ color: 'var(--color-error)' }}>Critico:</strong> Cassonetto B-01 riempito al 95%
                <div style={{ color: 'var(--neutral-500)', fontSize: '11px', marginTop: '4px' }}>5 min fa</div>
              </div>
              <div style={{ padding: '12px 16px', fontSize: '13px' }}>
                <strong style={{ color: 'var(--color-warning)' }}>Avviso:</strong> Batteria B-23 bassa
                <div style={{ color: 'var(--neutral-500)', fontSize: '11px', marginTop: '4px' }}>2 h fa</div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.menuWrap}>
          <button className={styles.menuBtn} onClick={() => setOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
          {open && (
            <div className={styles.dropdown}>
              <span className={styles.dropUser}>{user?.name}</span>
              <hr className={styles.sep} />
              <button className={styles.dropItem} onClick={() => { setOpen(false); logout() }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Esci
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}