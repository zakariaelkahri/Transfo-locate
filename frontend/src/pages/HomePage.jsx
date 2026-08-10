import { useState } from 'react'
import Button from '../components/Button'
import { LocationResult, useItemLoc, OFResult, useOFLoc } from '../features/articles'

const SEARCH_TYPES = [
  { value: 'itemref', label: 'Référence article', placeholder: 'ex. TRF-001' },
  { value: 'lot', label: 'Lot', placeholder: 'ex. LOT-001' },
  { value: 'serienum', label: 'Numéro de série', placeholder: 'ex. SN-00123' },
]

const NAV_ITEMS = [
  { key: 'article', icon: '🔍', label: 'Localiser un article' },
  { key: 'of',      icon: '🏭', label: 'Matières par OF' },
]

function ArticleSection() {
  const [code, setCode] = useState('')
  const [searchType, setSearchType] = useState('itemref')
  const { loc, loading, error, hasMore, search } = useItemLoc()
  const current = SEARCH_TYPES.find(t => t.value === searchType)

  function handleSubmit(e) {
    e.preventDefault()
    if (code.trim()) search(code.trim(), searchType)
  }

  return (
    <div>
      <h1 style={s.title}>🔍 Localiser un article</h1>
      <p style={s.subtitle}>Entrez une référence article pour afficher toutes les lignes disponibles avec leur emplacement détaillé.</p>

      <form onSubmit={handleSubmit} style={s.form}>
        <select
          value={searchType}
          onChange={(e) => { setSearchType(e.target.value); setCode('') }}
          style={s.select}
        >
          {SEARCH_TYPES.map(t => (
            <option key={t.value} value={t.value} style={{ background: '#1e293b', color: '#f1f5f9' }}>{t.label}</option>
          ))}
        </select>
        <input
          style={s.input}
          placeholder={current.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button loading={loading} type="submit">Localiser</Button>
      </form>

      {error && <p style={s.error}>⚠️ {error}</p>}
      {hasMore && <p style={s.warning}>⚠️ Résultats tronqués — il existe davantage d'articles non affichés. Affinez votre recherche pour voir tous les résultats.</p>}
      <LocationResult loc={loc} />
    </div>
  )
}

function OFSection() {
  const [ofCode, setOfCode] = useState('')
  const { items, loading, error, search } = useOFLoc()

  function handleSubmit(e) {
    e.preventDefault()
    if (ofCode.trim()) search(ofCode.trim())
  }

  return (
    <div>
      <h1 style={s.title}>🏭 Matières allouées — Ordre de fabrication</h1>
      <p style={s.subtitle}>Entrez un numéro d'OF pour localiser toutes les matières allouées.</p>

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.ofBadge}>N° OF</div>
        <input
          style={s.input}
          placeholder="ex. OF-2024-001"
          value={ofCode}
          onChange={(e) => setOfCode(e.target.value)}
        />
        <Button loading={loading} type="submit">Rechercher</Button>
      </form>

      {error && <p style={s.error}>⚠️ {error}</p>}
      <OFResult items={items} />
    </div>
  )
}

export default function HomePage() {
  const [active, setActive] = useState('article')

  return (
    <div style={s.layout}>
      <nav style={s.sidebar}>
        <div style={s.sidebarBrand}>
          <span style={s.sidebarBrandIcon}>⚡</span>
          <span style={s.sidebarBrandText}>Modules</span>
        </div>

        <div style={s.navGroup}>
          <p style={s.navLabel}>Recherche</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{ ...s.navItem, ...(active === item.key ? s.navItemActive : {}) }}
            >
              <span style={{ ...s.navIconWrap, ...(active === item.key ? s.navIconWrapActive : {}) }}>
                {item.icon}
              </span>
              <span style={s.navText}>{item.label}</span>
              {active === item.key && <span style={s.navChevron}>›</span>}
            </button>
          ))}
        </div>

        <div style={s.sidebarFooter}>
          <div style={s.sidebarFooterDot} />
          <span style={s.sidebarFooterText}>Transfo-Locate v1</span>
        </div>
      </nav>

      <main style={s.content}>
        {active === 'article' ? <ArticleSection /> : <OFSection />}
      </main>
    </div>
  )
}

const s = {
  layout: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '100%',
    margin: '0',
    padding: '0.5rem 1rem 0.5rem 0',
    minHeight: 'calc(100vh - 80px)',
  },
  sidebar: {
    width: '200px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, rgba(15,37,68,0.95) 0%, rgba(11,24,41,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '18px',
    padding: '1.25rem 0.85rem',
    gap: '0.25rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(12px)',
    alignSelf: 'flex-start',
    position: 'sticky',
    top: '1rem',
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.25rem 0.6rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: '0.75rem',
  },
  sidebarBrandIcon: {
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    borderRadius: '8px',
    padding: '0.3rem 0.4rem',
    lineHeight: 1,
    boxShadow: '0 0 10px rgba(249,115,22,0.4)',
  },
  sidebarBrandText: {
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    flex: 1,
  },
  navLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#334155',
    padding: '0 0.6rem',
    marginBottom: '0.35rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    width: '100%',
    padding: '0.7rem 0.75rem',
    borderRadius: '10px',
    border: '1px solid transparent',
    background: 'transparent',
    color: '#475569',
    fontSize: '0.88rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.18s',
  },
  navItemActive: {
    background: 'rgba(249,115,22,0.12)',
    border: '1px solid rgba(249,115,22,0.28)',
    color: '#fed7aa',
    fontWeight: 700,
    boxShadow: '0 2px 12px rgba(249,115,22,0.12)',
  },
  navIconWrap: {
    fontSize: '1rem',
    flexShrink: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 0.18s',
  },
  navIconWrapActive: {
    background: 'rgba(249,115,22,0.2)',
    border: '1px solid rgba(249,115,22,0.35)',
    boxShadow: '0 0 8px rgba(249,115,22,0.25)',
  },
  navText: {
    flex: 1,
    lineHeight: 1.3,
  },
  navChevron: {
    color: '#f97316',
    fontSize: '1.2rem',
    fontWeight: 700,
    lineHeight: 1,
    flexShrink: 0,
  },
  sidebarFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 0.6rem 0.1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: '0.75rem',
  },
  sidebarFooterDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px rgba(34,197,94,0.6)',
    flexShrink: 0,
  },
  sidebarFooterText: {
    fontSize: '0.72rem',
    color: '#334155',
    fontWeight: 500,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingTop: '0.5rem',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
    color: '#f1f5f9',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '1.5rem',
    maxWidth: '64ch',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    backdropFilter: 'blur(8px)',
    flexWrap: 'wrap',
  },
  error: {
    marginTop: '1rem',
    color: '#fca5a5',
    background: 'rgba(185,28,28,0.15)',
    border: '1px solid rgba(185,28,28,0.35)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    maxWidth: '720px',
  },
  warning: {
    marginTop: '1rem',
    color: '#fde68a',
    background: 'rgba(180,83,9,0.15)',
    border: '1px solid rgba(180,83,9,0.4)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    maxWidth: '720px',
  },
  select: {
    padding: '0.65rem 2.2rem 0.65rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    fontSize: '1rem',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    transition: 'border-color 0.2s',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    minWidth: '160px',
    padding: '0.65rem 1rem',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    transition: 'border-color 0.2s',
  },
  ofBadge: {
    padding: '0.5rem 0.9rem',
    borderRadius: '8px',
    background: 'rgba(249,115,22,0.15)',
    border: '1px solid rgba(249,115,22,0.35)',
    color: '#fdba74',
    fontWeight: 700,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
}
