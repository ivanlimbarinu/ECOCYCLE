import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login, loading } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoginError('')

    if (!username || !password) {
      setLoginError('Inserisci sia username che password')
      return
    }

    const err = await login(username, password)
    if (err) {
      setLoginError(err)
    }
  }

  return (
    <div className={styles.page}>
      {/* Pannello Sinistro*/}
      <div className={styles.leftPanel}>
        <div className={styles.circleBg1}></div>
        <div className={styles.circleBg2}></div>

        <div className={styles.brandContainer}>
          <img src="/eco.png" alt="EcoCycle Logo" className={styles.mainLogo} />
          <h1 className={styles.brandTitle}>EcoCycle</h1>
          <p className={styles.brandSubtitle}>ADMIN SYSTEM</p>
          <p className={styles.brandTagline}>Gestione intelligente dei rifiuti urbani</p>
        </div>

        <span className={styles.footerCopy}>© 2026 EcoCycle</span>
      </div>

      {/* Pannello Destro Form */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <h2 className={styles.formTitle}>LOGIN</h2>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Campo Username */}
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${loginError ? styles.labelError : ''}`}>
                Username
              </label>
              <input
                type="text"
                className={`${styles.input} ${loginError ? styles.inputError : ''}`}
                placeholder="Il tuo username (es. admin)"
                value={username}
                onChange={e => { setUsername(e.target.value); setLoginError('') }}
              />
            </div>

            {/* Campo Password */}
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${loginError ? styles.labelError : ''}`}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${loginError ? styles.inputError : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError('') }}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostra/Nascondi Password"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              <small className={styles.hintText}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                La password deve essere lunga almeno 8 caratteri
              </small>
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Ricordami</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Accesso in corso...' : '➔ Accedi'}
            </button>

            <Link to="/auth/register" className={styles.forgotLink} style={{ textAlign: 'center', display: 'block', marginTop: '16px', color: 'var(--primary-700)', fontWeight: 600 }}>
              Non hai un account? Registrati
            </Link>
          </form>

          <div className={styles.divider}><span>oppure</span></div>

          <div className={styles.socialRow}>
            <button type="button" className={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.436 2.064 15.62 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.305-.175-1.764H12.24z" /></svg>
              <span>Google</span>
            </button>
            <button type="button" className={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              <span>Facebook</span>
            </button>
            <button type="button" className={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39z" /></svg>
              <span>AppleID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}