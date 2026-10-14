import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './Analisi.module.css'
import { fetchExternal } from '../../../config/apiExternal'

const COLORS = {
  Plastica: '#FDD835',
  Vetro: '#43A047',
  Organico: '#8D6E63',
  Indifferenziato: '#757575',
  Carta: '#1E88E5'
}

export default function Analisi() {
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [trendData, setTrendData] = useState([])
  const [typeData, setTypeData] = useState([])
  const [binsData, setBinsData] = useState([])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch weekly stats per trend e torta
      const weekly = await fetchExternal('/weekly_stats?_sort=week&_order=asc&_limit=7')
      
      // Mappa dati per area chart (Andamento)
      const formattedTrend = weekly.map(w => ({
        time: w.week.split('-')[1] || w.week, // Prende la parte Wxx
        raccolta: w.avgCapacity * w.collectionsCount, // mock calcolo
        emissioni: Math.round(w.avgCapacity * 0.5)    // mock calcolo
      }))
      setTrendData(formattedTrend)

      // Aggrega i dati per la torta tipologie (prendendo l'ultima settimana come base)
      if (weekly.length > 0) {
        const lastW = weekly[weekly.length - 1]
        setTypeData([
          { name: 'Plastica', value: lastW.plastica || 0, color: COLORS.Plastica },
          { name: 'Vetro', value: lastW.vetro || 0, color: COLORS.Vetro },
          { name: 'Organico', value: lastW.organico || 0, color: COLORS.Organico },
          { name: 'Indifferenziato', value: lastW.indifferenziato || 0, color: COLORS.Indifferenziato }
        ])
      }

      // 2. Fetch bins per grafico a barre del riempimento
      const bins = await fetchExternal('/bins?isActive=true&_limit=10')
      setBinsData(bins)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = [
    { label:'Raccolte Effettuate', value:'1.245', change:'+12% vs scorsa sett.', up:true },
    { label:'Volume Totale (kg)', value:'14.500', change:'+8% vs scorsa sett.', up:true },
    { label:'CO2 Risparmiata (kg)', value:'320', change:'+15% vs scorsa sett.', up:true },
    { label:'Anomalie Segnalate', value:'12', change:'-2% vs scorsa sett.', up:true },
  ]

  if (loading) {
    return (
      <div className={styles.page} style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--primary-700)'}}>
          <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <p>Elaborazione statistiche in corso...</p>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page} style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{background: 'var(--white)', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-error)', textAlign: 'center', maxWidth: '400px'}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px'}}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3 style={{color: 'var(--color-error)', marginBottom: '8px'}}>Errore Analisi</h3>
          <p style={{color: 'var(--neutral-700)', marginBottom: '24px'}}>{error}</p>
          <button onClick={loadData} style={{background: 'var(--primary-700)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
            Riprova a scaricare i dati
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Analisi e Performance</h2>
          <p className={styles.pageSubtitle}>Dati in tempo reale sulle operazioni di raccolta differenziata.</p>
        </div>
        <select className={styles.select} value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="day">Oggi</option>
          <option value="week">Questa Settimana</option>
          <option value="month">Questo Mese</option>
          <option value="year">Quest'Anno</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={`${styles.statChange} ${s.up ? styles.textSuccess : styles.textError}`}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartGrid2}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Andamento Settimanale vs Emissioni</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRaccolta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--neutral-300)" />
              <XAxis dataKey="time" stroke="var(--neutral-500)" fontSize={12} />
              <YAxis stroke="var(--neutral-500)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Legend />
              <Area type="monotone" dataKey="raccolta" name="Indice Raccolta" stroke="var(--primary-600)" fillOpacity={1} fill="url(#colorRaccolta)" />
              <Line type="monotone" dataKey="emissioni" name="Emissioni (CO2)" stroke="var(--color-warning)" strokeWidth={2} dot={{r: 4}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Composizione Rifiuti</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartCard} style={{marginTop: '24px'}}>
        <h3 className={styles.chartTitle}>Stato Riempimento per Cassonetto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={binsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--neutral-300)" />
            <XAxis dataKey="code" stroke="var(--neutral-500)" fontSize={11} tick={{fill: 'var(--neutral-500)'}} />
            <YAxis stroke="var(--neutral-500)" fontSize={12} />
            <Tooltip cursor={{fill: 'var(--neutral-100)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
            <Bar dataKey="capacity" name="Livello (%)" radius={[4, 4, 0, 0]}>
              {binsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.capacity > 80 ? 'var(--color-error)' : entry.capacity > 50 ? 'var(--color-warning)' : 'var(--primary-500)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}