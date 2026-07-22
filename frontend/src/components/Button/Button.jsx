export default function Button({ children, loading, ...props }) {
  return (
    <button disabled={loading} style={styles.btn} {...props}>
      {loading ? 'Recherche…' : children}
    </button>
  )
}

const styles = {
  btn: {
    padding: '0.65rem 1.4rem',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '0.04em',
    boxShadow: '0 0 16px rgba(249,115,22,0.4)',
    transition: 'opacity 0.2s',
  },
}
