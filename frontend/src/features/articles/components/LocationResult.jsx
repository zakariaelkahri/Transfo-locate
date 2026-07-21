export default function LocationResult({ loc }) {
  if (!Array.isArray(loc) || loc.length === 0) return null

  return (
    <section style={s.card}>
      <div style={s.header}>
        <div>
          <span style={s.headerIcon}>📦</span>
          <span style={s.headerText}>Articles disponibles</span>
        </div>
        <span style={s.count}>{loc.length} ligne{loc.length > 1 ? 's' : ''}</span>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ITMREF</th>
              <th style={s.th}>LOT</th>
              <th style={s.th}>SLO</th>
              <th style={s.th}>Type</th>
              <th style={s.thRight}>Qté</th>
              <th style={s.th}>Site</th>
              <th style={s.th}>Emplacement</th>
            </tr>
          </thead>
          <tbody>
            {loc.map((item, index) => (
              <tr key={`${item.ITMREF ?? 'item'}-${item.LOT ?? 'lot'}-${index}`} style={index % 2 === 0 ? s.rowEven : s.rowOdd}>
                <td style={s.tdStrong}>{item.ITMREF ?? '—'}</td>
                <td style={s.td}>{item.LOT || '—'}</td>
                <td style={s.td}>{item.SLO || '—'}</td>
                <td style={s.td}>
                  <span style={s.typeChip}>{item.LOCTYP ?? '—'}</span>
                </td>
                <td style={s.tdRight}>{item.QTYSTU ?? '—'}</td>
                <td style={s.td}>{item.STOFCY ?? '—'}</td>
                <td style={s.td}>
                  <div style={s.locCard}>
                    <div style={s.locGrid}>
                      {[
                        { label: 'Z', value: item.LOC?.zone,   color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
                        { label: 'A', value: item.LOC?.alee,   color: '#0369a1', bg: '#e0f2fe', border: '#bae6fd' },
                        { label: 'R', value: item.LOC?.rack,   color: '#0f766e', bg: '#ccfbf1', border: '#99f6e4' },
                        { label: 'T', value: item.LOC?.travee, color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
                        { label: 'N', value: item.LOC?.niveau, color: '#be123c', bg: '#ffe4e6', border: '#fecdd3' },
                      ].map(({ label, value, color, bg, border }) => (
                        <div key={label} style={{ ...s.locSegment, background: bg, border: `1px solid ${border}` }}>
                          <span style={{ ...s.locSegLabel, color }}>{label}</span>
                          <span style={{ ...s.locSegValue, color }}>{value ?? '—'}</span>
                        </div>
                      ))}
                    </div>
                    <div style={s.locCode}>
                      {item.LOC?.zone ?? '--'} · {item.LOC?.alee ?? '--'} · {item.LOC?.rack ?? '--'} · {item.LOC?.travee ?? '--'} · {item.LOC?.niveau ?? '--'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.tip}>
        Astuce: la zone d’emplacement est lisible d’un coup d’œil dans la dernière colonne, avec le code complet en dessous pour éviter toute ambiguïté.
      </div>
    </section>
  )
}

const s = {
  card: {
    marginTop: '1.5rem',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
    borderRadius: '18px',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.10)',
    overflow: 'hidden',
    border: '1px solid #dbeafe',
  },
  header: {
    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #0f766e 100%)',
    color: '#fff',
    padding: '0.95rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1rem',
  },
  headerIcon: { fontSize: '1.15rem', marginRight: '0.5rem' },
  headerText: { display: 'inline-flex', alignItems: 'center' },
  count: {
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.18)',
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  tableWrap: {
    overflowX: 'auto',
    padding: '0.25rem 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: '980px',
  },
  th: {
    textAlign: 'left',
    fontSize: '0.78rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#475569',
    background: '#eff6ff',
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #dbeafe',
    whiteSpace: 'nowrap',
  },
  thRight: { textAlign: 'right', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', background: '#eff6ff', padding: '0.9rem 1rem', borderBottom: '1px solid #dbeafe', whiteSpace: 'nowrap' },
  td: {
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a',
    verticalAlign: 'top',
    fontSize: '0.95rem',
  },
  tdStrong: {
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a',
    verticalAlign: 'top',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  tdRight: {
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a',
    verticalAlign: 'top',
    fontSize: '0.95rem',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
  },
  rowEven: { background: '#ffffff' },
  rowOdd: { background: '#f8fafc' },
  typeChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.28rem 0.65rem',
    borderRadius: '999px',
    background: '#ecfeff',
    color: '#0f766e',
    border: '1px solid #99f6e4',
    fontSize: '0.82rem',
    fontWeight: 700,
  },
  locCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  locGrid: {
    display: 'flex',
    gap: '0.3rem',
  },
  locSegment: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '0.3rem 0.45rem',
    minWidth: '2.4rem',
  },
  locSegLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: 1,
    marginBottom: '0.2rem',
    opacity: 0.7,
  },
  locSegValue: {
    fontSize: '0.88rem',
    fontWeight: 700,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  locCode: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.86rem',
    color: '#475569',
    letterSpacing: '0.06em',
  },
  tip: {
    margin: '1rem 1.25rem 1.25rem',
    padding: '0.85rem 1rem',
    background: 'linear-gradient(135deg, #fefce8 0%, #ecfeff 100%)',
    border: '1px solid #fde68a',
    borderRadius: '12px',
    fontSize: '0.9rem',
    color: '#854d0e',
  },
}
