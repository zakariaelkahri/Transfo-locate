const segments = [
  ['zone', 'Zone'],
  ['alee', 'Allée'],
  ['rack', 'Rack'],
  ['travee', 'Travée'],
  ['niveau', 'Niveau'],
]

export default function ItemLocation({ code, details }) {
  return (
    <div className="inventory-location-details">
      {details && <dl className="inventory-location-segments">
        {segments.map(([key, label]) => (
          <div key={key}><dt>{label}</dt><dd>{details[key] ?? '—'}</dd></div>
        ))}
      </dl>}
      <span className="inventory-location-code" aria-label={`Code emplacement : ${code}`}>{code}</span>
    </div>
  )
}
