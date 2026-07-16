export default function LocationResult({ loc }) {
  if (!loc) return null

  const steps = [
    { icon: '🗺️', label: 'Zone',    value: loc.zone,    desc: `Zone ${loc.zone}` },
    { icon: '🚶', label: 'Allée',   value: loc.alee,    desc: `Allée ${loc.alee}` },
    { icon: '🗄️', label: 'Rack',    value: loc.rack,    desc: `Rack ${loc.rack}` },
    { icon: '📍', label: 'Travée',  value: loc.travee,  desc: `Travée ${loc.travee}` },
    { icon: '📦', label: 'Niveau',  value: loc.niveau,  desc: `Niveau ${loc.niveau}` },
  ]

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.headerIcon}>📌</span>
        <span style={s.headerText}>Emplacement trouvé</span>
      </div>

      <div style={s.badge}>
        {loc.zone} · {loc.alee} · {loc.rack} · {loc.travee} · {loc.niveau}
      </div>

      <ol style={s.steps}>
        {steps.map((step, i) => (
          <li key={step.label} style={s.step}>
            <div style={s.stepNum}>{i + 1}</div>
            <div style={s.stepIcon}>{step.icon}</div>
            <div>
              <div style={s.stepLabel}>{step.label} <strong>{step.value}</strong></div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          </li>
        ))}
      </ol>

      <div style={s.tip}>
        💡 L'article se trouve au <strong>niveau {loc.niveau}</strong> du rack <strong>{loc.rack}</strong>, travée <strong>{loc.travee}</strong>, allée <strong>{loc.alee}</strong>, zone <strong>{loc.zone}</strong>.
      </div>
    </div>
  )
}

const s = {
  card: {
    marginTop: '1.5rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    overflow: 'hidden',
  },
  header: {
    background: '#2563eb',
    color: '#fff',
    padding: '0.85rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 700,
    fontSize: '1rem',
  },
  headerIcon: { fontSize: '1.2rem' },
  headerText: {},
  badge: {
    margin: '1rem 1.25rem 0',
    padding: '0.5rem 1rem',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '1.05rem',
    color: '#1d4ed8',
    letterSpacing: '0.08em',
    textAlign: 'center',
    fontWeight: 700,
  },
  steps: {
    listStyle: 'none',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  stepNum: {
    minWidth: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  stepIcon: { fontSize: '1.3rem' },
  stepLabel: { fontSize: '0.9rem', color: '#334155' },
  stepDesc: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' },
  tip: {
    margin: '0 1.25rem 1.25rem',
    padding: '0.75rem 1rem',
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#92400e',
  },
}
