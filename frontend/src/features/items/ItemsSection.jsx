import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient'
import './items.css'
import './items-list.css'

const PAGE_SIZE = 20

function formatDate(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export default function ItemsSection({ onAdd }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState({ q: '', available: '', page: 1 })
  const [reload, setReload] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ q: query.q, page: query.page, page_size: PAGE_SIZE })
    if (query.available !== '') params.set('available', query.available)
    apiClient.get(`/items?${params}`).then(result => {
      if (!active) return
      const lastPage = Math.max(1, Math.ceil(result.total / PAGE_SIZE))
      if (query.page > lastPage) {
        setQuery(previous => ({ ...previous, page: lastPage }))
        return
      }
      setData(result)
    }).catch(reason => {
      if (!active) return
      setError(/HTTP (401|403)/.test(reason.message)
        ? 'Votre session ne permet pas de consulter les articles. Veuillez vous reconnecter.'
        : 'Impossible de charger les articles. Vérifiez votre connexion et réessayez.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query, reload])

  const filtered = query.q !== '' || query.available !== ''
  const pages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

  function resetFilters() {
    setSearch('')
    setQuery({ q: '', available: '', page: 1 })
  }

  return (
    <section className="item-section inventory" aria-labelledby="inventory-title">
      <div className="item-eyebrow">INVENTAIRE / ARTICLES</div>
      <div className="inventory-heading">
        <div><h1 id="inventory-title">Liste des articles</h1><p className="item-intro">Retrouvez les articles enregistrés, leur emplacement et leur disponibilité.</p></div>
        <button type="button" className="inventory-primary" onClick={onAdd}>＋ Ajouter un article</button>
      </div>

      <form className="inventory-toolbar" onSubmit={event => { event.preventDefault(); setQuery(previous => ({ ...previous, q: search.trim(), page: 1 })) }}>
        <div className="inventory-search"><label htmlFor="inventory-search">Rechercher un article</label><div><input id="inventory-search" type="search" maxLength={100} value={search} onChange={event => setSearch(event.target.value)} placeholder="Description, numéro de série, MP ou emplacement…" /><button type="submit">Rechercher</button></div></div>
        <div className="inventory-filter"><label htmlFor="inventory-availability">Disponibilité</label><select id="inventory-availability" value={query.available} onChange={event => setQuery(previous => ({ ...previous, available: event.target.value, page: 1 }))}><option value="">Tous les statuts</option><option value="true">Disponible</option><option value="false">Indisponible</option></select></div>
        <button type="button" className="inventory-refresh" disabled={loading} onClick={() => setReload(previous => previous + 1)}>Actualiser</button>
      </form>
      {filtered && <div className="inventory-filter-note"><span>Filtres actifs{query.q && ` · « ${query.q} »`}</span><button type="button" onClick={resetFilters}>Effacer les filtres</button></div>}

      <div className="inventory-panel" aria-busy={loading}>
        {loading ? <div className="inventory-state" role="status"><span className="inventory-spinner" aria-hidden="true" /><h2>Chargement des articles…</h2><p>Récupération de votre inventaire.</p></div>
          : error ? <div className="inventory-state" role="alert"><h2>Chargement impossible</h2><p>{error}</p><button type="button" onClick={() => setReload(previous => previous + 1)}>Réessayer</button></div>
            : data?.items.length === 0 ? <div className="inventory-state"><span className="inventory-empty-icon" aria-hidden="true">☷</span><h2>{filtered ? 'Aucun article trouvé' : 'Votre inventaire commence ici'}</h2><p>{filtered ? 'Essayez une autre référence ou effacez les filtres.' : 'Ajoutez votre premier article pour retrouver ici ses informations.'}</p><button type="button" onClick={filtered ? resetFilters : onAdd}>{filtered ? 'Effacer les filtres' : '＋ Ajouter un article'}</button></div>
              : data && <>
                <div className="inventory-table-heading"><h2>{data.total} article{data.total !== 1 ? 's' : ''}{filtered ? ' trouvé(s)' : ''}</h2><span>Date d’entrée décroissante</span></div>
                <div className="inventory-table-scroll" tabIndex={0} role="region" aria-label="Tableau des articles, défilement horizontal disponible">
                  <table><caption className="inventory-sr-only">Articles enregistrés et leurs emplacements</caption><thead><tr><th scope="col">N° de série</th><th scope="col">Description</th><th scope="col">MP</th><th scope="col">Tension</th><th scope="col">Emplacement</th><th scope="col">Date d’entrée</th><th scope="col">Statut</th></tr></thead>
                    <tbody>{data.items.map(item => <tr key={item.id}>
                      <th scope="row">{item.serie_number || '—'}</th><td>{item.description || '—'}</td><td>{item.mp || '—'}</td><td className="inventory-nowrap">{item.kv == null ? '—' : `${item.kv} kV`}</td><td><span className="inventory-location">{item.location}</span></td><td className="inventory-nowrap">{formatDate(item.insertion_date)}</td><td><span className={`inventory-badge ${item.availlable ? 'is-available' : ''}`}>{item.availlable ? '● Disponible' : '○ Indisponible'}</span></td>
                    </tr>)}</tbody>
                  </table>
                </div>
                <div className="inventory-pagination"><p>{(query.page - 1) * PAGE_SIZE + 1}–{Math.min(query.page * PAGE_SIZE, data.total)} sur {data.total} articles</p><nav aria-label="Pagination des articles"><button type="button" disabled={query.page === 1} onClick={() => setQuery(previous => ({ ...previous, page: previous.page - 1 }))}>Précédent</button><span>Page {query.page} / {pages}</span><button type="button" disabled={query.page >= pages} onClick={() => setQuery(previous => ({ ...previous, page: previous.page + 1 }))}>Suivant</button></nav></div>
              </>}
      </div>
    </section>
  )
}
