export default function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && <label style={{ fontWeight: 500, color: '#94a3b8', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{label}</label>}
      <input style={styles.input} {...props} />
    </div>
  )
}

const styles = {
  input: {
    padding: '0.65rem 1rem',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    transition: 'border-color 0.2s',
  },
}
