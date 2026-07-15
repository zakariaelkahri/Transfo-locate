export default function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && <label style={{ fontWeight: 500 }}>{label}</label>}
      <input style={styles.input} {...props} />
    </div>
  )
}

const styles = {
  input: {
    padding: '0.6rem 0.9rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
  },
}
