import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from './Mappa.module.css'
import { fetchExternal } from '../../../config/apiExternal'

// Fix Icone native Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Mappa gli stati dell'API ai colori
const getMarkerColor = (status, capacity) => {
  if (status === 'in_manutenzione' || status === 'fuori_servizio') return '#F57C00'
  if (capacity >= 80 || status === 'critico') return '#D32F2F'
  if (capacity >= 50 || status === 'quasi_pieno') return '#F57C00'
  return '#388E3C' // normale
}

const getStatusIcon = (status, capacity) => {
  const color = getMarkerColor(status, capacity)
  return L.divIcon({
    html: `<div style="background-color: ${color}; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"></div>`,
    className: styles.customLeafletMarker,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

export default function Mappa() {
  const [bins, setBins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadMapData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchExternal('/bins?isActive=true')

      // FORZATURA TORINO: Il mock restituisce coordinate di Milano. 
      // Le sovrascriviamo artificialmente attorno al centro di Torino per il mockup
      const torinoCenterLat = 45.0703
      const torinoCenterLng = 7.6868

      const mappedToTorino = data.map((b, index) => {
        // Aggiunge un offset pseudo-casuale basato sull'index per spargerli
        const latOffset = (Math.random() - 0.5) * 0.04
        const lngOffset = (Math.random() - 0.5) * 0.05
        return {
          ...b,
          lat: torinoCenterLat + latOffset,
          lng: torinoCenterLng + lngOffset,
          city: 'Torino',
          zone: 'Centro'
        }
      })

      setBins(mappedToTorino)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMapData()
  }, [])

  const filtered = bins.filter(b => {
    const matchSearch = (b.city && b.city.toLowerCase().includes(search.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(search.toLowerCase())) ||
      (b.code && b.code.toLowerCase().includes(search.toLowerCase()))

    // Raggruppo per logica semplificata (Attivo vs Manutenzione)
    const isMaintenance = b.status === 'in_manutenzione' || b.status === 'fuori_servizio'
    const mappedStatus = isMaintenance ? 'Manutenzione' : 'Attivo'

    const matchStatus = statusFilter === 'all' || mappedStatus === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) {
    return (
      <div className={styles.page} style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--primary-700)' }}>
          <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <p>Caricamento dati mappa in corso...</p>
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-error)', textAlign: 'center', maxWidth: '400px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3 style={{ color: 'var(--color-error)', marginBottom: '8px' }}>Errore Mappa</h3>
          <p style={{ color: 'var(--neutral-700)', marginBottom: '24px' }}>{error}</p>
          <button onClick={loadMapData} style={{ background: 'var(--primary-700)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Riprova connessione
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h2>Mappatura Cassonetti Integrata</h2>
        <span className={styles.counterBadge}>{filtered.length} totali</span>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Cerca per ID, Zona o Indirizzo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Tutti gli stati</option>
          <option value="Attivo">Operativi</option>
          <option value="Manutenzione">In Manutenzione</option>
        </select>
      </div>

      <div className={styles.mapCard}>
        <MapContainer center={[45.0703, 7.6868]} zoom={13} className={styles.leafletContainer}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {filtered.map(bin => (
            <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={getStatusIcon(bin.status, bin.capacity)}>
              <Popup className={styles.customPopup}>
                <div className={styles.popupContent}>
                  <h3>{bin.code}</h3>
                  <p><strong>Tipo:</strong> {bin.type}</p>
                  <p><strong>Posizione:</strong> {bin.address}, {bin.zone}</p>
                  <p><strong>Riempimento:</strong> {bin.capacity}%</p>
                  <p><strong>Stato:</strong> {bin.status.replace('_', ' ')}</p>
                  <p><strong>Temperatura:</strong> {bin.temperature}°C</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className={styles.legendCard}>
        <div className={styles.legendGrid}>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.green}`}></span>
            <span>Normale</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.yellow}`}></span>
            <span>Quasi Pieno / Manutenzione</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.red}`}></span>
            <span>Critico (&ge;80%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}