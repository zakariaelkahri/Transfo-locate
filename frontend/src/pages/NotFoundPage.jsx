import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h2>404 — Page introuvable</h2>
      <Link to="/" style={{ color: '#2563eb', marginTop: '1rem', display: 'inline-block' }}>
        Retour à l'accueil
      </Link>
    </div>
  )
}
