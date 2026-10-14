import styles from './Button.module.css'

export default function Button({ children, variant = 'primary', size = 'md', type = 'button', disabled = false, onClick }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}>
      {children}
    </button>
  )
}