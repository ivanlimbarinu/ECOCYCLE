import { useState, useEffect } from 'react'
import Badge from '../../ui/Badge'
import styles from './Utenti.module.css'
import { useAuth } from '../../../context/AuthContext'
import { fetchExternal } from '../../../config/apiExternal'

export default function Utenti() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLocal, setIsLocal] = useState(true)

  const fetchUsers = () => {
    // Effettuiamo una chiamata fetch in GET verso il nostro server PHP locale.
    // L'URL è relativo: il proxy in vite.config.js lo reindirizzerà a http://localhost/ecocycle-api/api/users/list.php
    fetch('/api/users/list.php')
      .then(async r => {
        // Estraiamo il corpo della risposta come puro testo
        const text = await r.text();
        try {
          // Tentiamo di convertire il testo in JSON. Se PHP ha stampato errori HTML, questo fallirà!
          const d = JSON.parse(text);
          if (r.ok && (d.success || Array.isArray(d))) {
            setUsers(d.data || d);
            setIsLocal(true);
            setLoading(false);
          } else {
            // Se PHP ha restituito JSON ma con status "error" (es. credenziali errate)
            setError(d.message || 'Errore dal server: ' + text.substring(0, 150));
            setLoading(false);
          }
        } catch (e) {
          // Fallback intelligente 1: JSON.parse() è fallito. Significa che PHP ha stampato un Fatal Error o un Warning
          setError('Errore Server Locale: ' + text.substring(0, 150));
          setLoading(false);
        }
      })
      .catch((err) => {
        // Fallback intelligente 2: La fetch non è proprio partita (es. server XAMPP spento, CORS bloccato o rete assente)
        setError('Errore di rete: ' + err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateRole = async (id, newRole) => {
    try {
      const res = await fetch('/api/users/update_role.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole })
      })
      const text = await res.text()
      try {
        const data = JSON.parse(text)
        if (data.success) {
          setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
        } else {
          alert("Errore nell'aggiornamento ruolo: " + data.message)
        }
      } catch (e) {
        alert("Errore Server Aggiornamento: " + text.substring(0, 100))
      }
    } catch (err) {
      alert("Errore di connessione durante l'aggiornamento.")
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Gestione Utenti</h2>
          <p className={styles.subtitle}>Utenti registrati a sistema. {isAdmin && "Solo l'Admin può modificare i ruoli."}</p>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{padding: '40px', textAlign: 'center', color: 'var(--neutral-500)'}}>
            <svg className="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            <p>Caricamento utenti...</p>
          </div>
        ) : error ? (
          <div style={{padding: '40px', textAlign: 'center', color: 'var(--color-error)'}}>
            {error}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>Email / Username</th>
                  <th>Ruolo</th>
                  <th>Registrato il</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id} className={styles.row}>
                    <td className={styles.td}>#{userItem.id}</td>
                    <td className={styles.td}><strong>{userItem.name || (userItem.firstName + ' ' + userItem.lastName)}</strong></td>
                    <td className={styles.td}>
                      {userItem.email}<br/>
                      <span style={{fontSize: '11px', color: 'var(--neutral-500)'}}>@{userItem.username}</span>
                    </td>
                    <td className={styles.td}>
                      {isAdmin && currentUser.id !== userItem.id ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select 
                            value={userItem.role || 'Operatore'} 
                            onChange={(e) => updateRole(userItem.id, e.target.value)}
                            style={{
                              appearance: 'none',
                              padding: '6px 32px 6px 12px', 
                              borderRadius: '20px', 
                              border: '1px solid ' + (userItem.role?.toLowerCase() === 'admin' ? 'var(--color-error)' : 'var(--primary-600)'),
                              background: userItem.role?.toLowerCase() === 'admin' ? '#fff1f0' : 'var(--primary-50)',
                              color: userItem.role?.toLowerCase() === 'admin' ? 'var(--color-error)' : 'var(--primary-700)',
                              fontWeight: 600,
                              fontSize: '13px',
                              cursor: 'pointer',
                              outline: 'none',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Operatore">Operatore</option>
                          </select>
                          <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={userItem.role?.toLowerCase() === 'admin' ? 'var(--color-error)' : 'var(--primary-700)'} strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      ) : (
                        <Badge label={userItem.role || 'Operatore'} variant={userItem.role?.toLowerCase() === 'admin' ? 'error' : 'info'} />
                      )}
                    </td>
                    <td className={styles.td}>
                      {(userItem.created_at || userItem.joinedAt) ? new Date(userItem.created_at || userItem.joinedAt).toLocaleDateString('it-IT') : '-'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{padding: '40px', textAlign: 'center', color: 'var(--neutral-500)'}}>Nessun utente trovato.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}