import styles from './InputField.module.css'

export default function InputField({ label, name, type = 'text', value, onChange, placeholder, error, required, disabled }) {
  return (
    <div className={styles.wrap}>
      {label && (
        <label className={styles.label}>
          {label}{required && <span className={styles.req}>*</span>}
        </label>
      )}
      <input
        name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled} required={required}
        className={`${styles.input} ${error ? styles.invalid : ''}`}
      />
      {error && <span className={styles.err}>{error}</span>}
    </div>
  )
}