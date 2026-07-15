export default function Button({ children, loading, ...props }) {
  return (
    <button disabled={loading} style={styles.btn} {...props}>
      {loading ? 'Recherche…' : children}
    </button>
  )
}

const styles = {
  btn: {
    padding: '0.6rem 1.4rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
}
