import { useState, useEffect } from 'react'
import InputField from '../../ui/InputField'
import Button from '../../ui/Button'
import styles from './Configurazione.module.css'

export default function Configurazione() {
  const [settings, setSettings] = useState({
    companyName: 'EcoCycle Admin', email: 'admin@ecocycle.com',
    phone: '+39 123 456 7890', address: 'Via Roma 123, Roma',
    maxBins: 1000, alertThreshold: 80, maintenanceInterval: 30,
    notificationsEnabled: true, darkMode: false,
  })

  const [toast, setToast] = useState(null)

  // Applica classe dark al body quando il toggle cambia
  useEffect(() => {
    if (settings.darkMode) document.body.classList.add('dark')
    else document.body.classList.remove('dark')
  }, [settings.darkMode])

  function handle(e) {
    const { name, value, type, checked } = e.target
    setSettings(prevSettings => ({ ...prevSettings, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = () => {
    setToast('Impostazioni salvate con successo!')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className={styles.page}>

      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-success)', color: 'white', padding: '12px 24px',
          borderRadius: '8px', fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease-out'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {toast}
        </div>
      )}

      <div className={styles.card}>
        <h2>Informazioni Azienda</h2>
        <div className={styles.grid}>
          <InputField label="Nome Azienda" name="companyName" value={settings.companyName} onChange={handle} />
          <InputField label="Email" name="email" type="email" value={settings.email} onChange={handle} />
          <InputField label="Telefono" name="phone" type="tel" value={settings.phone} onChange={handle} />
          <InputField label="Indirizzo" name="address" value={settings.address} onChange={handle} />
        </div>
      </div>

      <div className={styles.card}>
        <h2>Parametri Sistema</h2>
        <div className={styles.grid}>
          <InputField label="Cassonetti massimi" name="maxBins" type="number" value={settings.maxBins} onChange={handle} />
          <InputField label="Soglia avviso riempimento (%)" name="alertThreshold" type="number" value={settings.alertThreshold} onChange={handle} />
          <InputField label="Intervallo manutenzione (gg)" name="maintenanceInterval" type="number" value={settings.maintenanceInterval} onChange={handle} />
        </div>
      </div>

      <div className={styles.card}>
        <h2>Preferenze</h2>
        <div className={styles.checks}>
          {[['notificationsEnabled', 'Abilita notifiche push'], ['darkMode', 'Modalità scura (Beta)']].map(([n, l]) => (
            <div key={n} className={styles.checkRow}>
              <span className={styles.checkLabel}>{l}</span>
              <label className={styles.switch}>
                <input type="checkbox" name={n} checked={settings[n]} onChange={handle} />
                <span className={styles.slider}></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Backup e Sicurezza</h2>
        <div className={styles.actions} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Backup Database
          </Button>
          <Button variant="secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Cambia Password
          </Button>
          <button style={{
            background: '#fff1f0', color: 'var(--color-error)', border: '1px solid var(--color-error)',
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', transition: 'all 0.2s ease'
          }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-error)'; e.currentTarget.style.color = 'white' }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff1f0'; e.currentTarget.style.color = 'var(--color-error)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            Cancella Dati
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" onClick={handleSave}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
          Salva Impostazioni
        </Button>
      </div>
    </div>
  )
}