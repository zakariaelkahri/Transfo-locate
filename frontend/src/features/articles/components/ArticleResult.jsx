export default function ArticleResult({ article }) {
  if (!article) return null
  return (
    <div style={styles.card}>
      <h3>{article.code}</h3>
      <p><strong>Désignation :</strong> {article.designation}</p>
      <p><strong>Emplacement :</strong> {article.location ?? '—'}</p>
      <p><strong>Stock :</strong> {article.stock ?? '—'}</p>
    </div>
  )
}

const styles = {
  card: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    lineHeight: '1.8',
  },
}
