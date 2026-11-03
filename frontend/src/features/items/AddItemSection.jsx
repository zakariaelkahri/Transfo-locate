import { useId, useRef, useState } from 'react'
import { apiClient } from '../../services/apiClient'
import './items.css'

function initialValues() {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return { description: '', mp: '', serie_number: '', kv: '', location: '', insertion_date: today }
}

const labels = { description: 'Description', mp: 'MP', serie_number: 'Numéro de série', kv: 'Tension (kV)', location: 'Emplacement', insertion_date: 'Date d’insertion' }
const identifiers = ['serie_number', 'mp']
const identifierOptions = {
  serie_number: { maxLength: 50, placeholder: 'Ex. SN-00123' },
  mp: { maxLength: 100, placeholder: 'Référence MP' },
}

export default function AddItemSection({ itemToEdit = null, onSaved, onCancel }) {
  const formId = useId()
  const editing = Boolean(itemToEdit)
  const [values, setValues] = useState(() => itemToEdit ? {
    description: itemToEdit.description ?? '',
    mp: itemToEdit.mp ?? '',
    serie_number: itemToEdit.serie_number ?? '',
    kv: itemToEdit.kv == null ? '' : String(itemToEdit.kv),
    location: itemToEdit.location,
    insertion_date: itemToEdit.insertion_date,
    availlable: itemToEdit.availlable,
  } : initialValues())
  const [identifierType, setIdentifierType] = useState(itemToEdit?.serie_number ? 'serie_number' : itemToEdit?.mp ? 'mp' : '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)
  const [message, setMessage] = useState('')
  const formRef = useRef(null)
  const submitting = useRef(false)

  function changeIdentifier(name) {
    setIdentifierType(name)
    setValues(previous => ({ ...previous, mp: '', serie_number: '', kv: '' }))
    setErrors(previous => ({ ...previous, identifierType: undefined, mp: undefined, serie_number: undefined, kv: undefined }))
    setMessage('')
    setSaved(null)
  }

  function update(name, value) {
    setValues(previous => ({ ...previous, [name]: value }))
    setErrors(previous => ({ ...previous, [name]: undefined }))
    setMessage('')
    setSaved(null)
  }

  async function submit(event) {
    event.preventDefault()
    if (submitting.current) return
    const nextErrors = {}
    if (!identifierType) {
      nextErrors.identifierType = 'Choisissez un type d’identifiant avant de continuer.'
    } else if (identifiers.filter(name => values[name].trim()).length !== 1) {
      nextErrors[identifierType] = 'Renseignez un seul identifiant : numéro de série ou MP.'
    }
    if (!/^[0-9]{10}$/.test(values.location)) {
      nextErrors.location = 'Saisissez exactement 10 chiffres (ex. 0106100810).'
    }
    for (const name of ['kv']) {
      const value = values[name].trim()
      if (value && (!/^-?\d+$/.test(value) || Number(value) < -2147483648 || Number(value) > 2147483647)) nextErrors[name] = 'Saisissez un nombre entier valide.'
    }
    if (!values.insertion_date) nextErrors.insertion_date = 'Choisissez une date.'
    for (const [name, limit] of [['description', 100], ['serie_number', 50], ['mp', 50]]) {
      if (values[name].trim().length > limit) nextErrors[name] = `Maximum ${limit} caractères.`
    }
    setErrors(nextErrors)
    setSaved(null)
    setMessage('')
    if (Object.keys(nextErrors).length) {
      const firstError = Object.keys(nextErrors)[0]
      if (firstError === 'identifierType') {
        formRef.current.querySelector('input[name="identifierType"]')?.focus()
      } else {
        formRef.current.elements.namedItem(firstError)?.focus()
      }
      return
    }
    submitting.current = true
    setSaving(true)
    try {
      const item = await apiClient.postRaw(editing ? `/items/${itemToEdit.id}/edit` : '/items', {
        ...values,
        description: values.description.trim() || null,
        mp: values.mp.trim() || null,
        serie_number: values.serie_number.trim() || null,
        kv: identifierType !== 'serie_number' || values.kv.trim() === '' ? null : Number(values.kv),
        location: values.location,
      })
      if (editing) {
        onSaved?.(item)
        return
      }
      setSaved(item)
      setValues(initialValues())
      setIdentifierType('')
    } catch (error) {
      if (error.status === 422 && Array.isArray(error.detail)) {
        const fieldErrors = {}
        error.detail.forEach(issue => {
          const name = issue.loc?.[1]
          if (labels[name]) fieldErrors[name] = 'Vérifiez la valeur de ce champ.'
        })
        setErrors(fieldErrors)
      }
      setMessage(error.status === 401 || error.status === 403
        ? 'Votre session ne permet pas cet enregistrement. Reconnectez-vous pour continuer.'
        : 'L’article n’a pas pu être enregistré. Vérifiez les champs et votre connexion, puis réessayez. Vos informations sont conservées.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  function field(name, { required = false, disabled = false, type = 'text', placeholder, maxLength, hint } = {}) {
    return (
      <div className="item-field">
        <label htmlFor={`${formId}-${name}`}>{labels[name]} {!required && <span>Facultatif</span>}</label>
        <input id={`${formId}-${name}`} name={name} type={type} value={values[name]}
          onChange={event => update(name, event.target.value)} required={required} disabled={disabled}
          placeholder={placeholder} maxLength={maxLength}
          minLength={name === 'location' ? 10 : undefined}
          pattern={name === 'location' ? '[0-9]{10}' : undefined}
          inputMode={name === 'kv' || name === 'location' ? 'numeric' : undefined}
          aria-invalid={Boolean(errors[name])} aria-describedby={`${formId}-${name}-help`} />
        <small id={`${formId}-${name}-help`} className={errors[name] ? 'item-field-error' : ''}>{errors[name] || hint}</small>
      </div>
    )
  }

  return (
    <section className="item-section" aria-labelledby={`${formId}-title`}>
      <div className="item-eyebrow">INVENTAIRE / {editing ? 'MODIFIER UN ARTICLE' : 'NOUVEL ARTICLE'}</div>
      <h1 id={`${formId}-title`}>{editing ? 'Modifier l’article' : 'Ajouter un article'}</h1>
      <p className="item-intro">{editing ? 'Modifiez les informations puis enregistrez vos changements.' : 'Enregistrez un article et son emplacement en quelques instants.'}</p>

      {saved && <div className="item-success" role="status"><strong>✓ Article enregistré</strong><p>{saved.serie_number || saved.mp || 'Votre article'} a été ajouté à l’emplacement {saved.location}. Vous pouvez ajouter un autre article.</p></div>}
      {message && <div className="item-error" role="alert">{message}</div>}

      <div className="item-layout">
        <form ref={formRef} onSubmit={submit} noValidate className="item-form" aria-busy={saving}>
          <fieldset disabled={saving}>
            <div className="item-form-section">
              <div className="item-section-heading"><span aria-hidden="true">01</span><div><h2>Identification</h2><p>Choisissez un seul identifiant : numéro de série ou MP.</p></div></div>
              <fieldset className="item-identifier-choice" aria-describedby={`${formId}-choice-help`}>
                <legend>Type d’identifiant — obligatoire</legend>
                <div>{identifiers.map(name => (
                  <label key={name} className={identifierType === name ? 'is-selected' : ''}>
                    <input type="radio" name="identifierType" value={name} required aria-invalid={Boolean(errors.identifierType)} checked={identifierType === name} onChange={() => changeIdentifier(name)} />
                    {labels[name]}
                  </label>
                ))}</div>
                <p id={`${formId}-choice-help`} role={errors.identifierType ? 'alert' : undefined}>
                  {errors.identifierType || 'Choisissez un type puis renseignez sa valeur. Changer de type efface l’identifiant saisi.'}
                </p>
              </fieldset>
              <div className="item-grid">
                {identifierType && field(identifierType, { ...identifierOptions[identifierType], required: true, hint: 'Identifiant obligatoire. Un seul par article.' })}
                {field('description', { maxLength: 50, placeholder: 'Description de l’article', hint: 'Facultatif. 50 caractères maximum.' })}
                {field('kv', {
                  disabled: identifierType !== 'serie_number',
                  placeholder: 'Ex. 20',
                  hint: identifierType === 'serie_number'
                    ? 'Facultatif : indiquez la tension en kV ou laissez ce champ vide.'
                    : 'Disponible uniquement avec un numéro de série.',
                })}
              </div>
            </div>
            <div className="item-form-section">
              <div className="item-section-heading"><span aria-hidden="true">02</span><div><h2>Emplacement & date d’entrée</h2><p>Précisez où se trouve l’article et sa date d’entrée.</p></div></div>
              <div className="item-grid">
                {field('location', { required: true, maxLength: 10, placeholder: 'Ex. 0106100810', hint: 'Exactement 10 chiffres, zéros initiaux inclus. Obligatoire.' })}
                {field('insertion_date', { required: true, type: 'date', hint: 'Date d’entrée de l’article. Obligatoire.' })}
              </div>
              {editing && <div className="item-edit-availability">
                <label htmlFor={`${formId}-availability`}>Disponibilité</label>
                <select id={`${formId}-availability`} name="availlable" value={String(values.availlable)}
                  onChange={event => update('availlable', event.target.value === 'true')}
                  aria-describedby={`${formId}-availability-help`}>
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
                <p id={`${formId}-availability-help`}>Le statut sera mis à jour après l’enregistrement.</p>
              </div>}
            </div>
            <div className="item-actions"><p>Les champs « Facultatif » peuvent rester vides.</p>{editing && <button type="button" onClick={onCancel}>Annuler</button>}<button type="submit">{saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : '＋ Enregistrer l’article'}</button></div>
          </fieldset>
        </form>

        <aside className="item-summary" aria-label="Aperçu de l’article">
          <div className="item-summary-icon" aria-hidden="true">＋</div>
          <h2>{editing ? 'Votre article' : 'Votre nouvel article'}</h2>
          <p>Un aperçu avant l’enregistrement.</p>
          <dl>{[identifierType, 'description', 'kv', 'location', 'insertion_date'].filter(Boolean).map(name => <div key={name}><dt>{labels[name]}</dt><dd>{values[name] || '—'}</dd></div>)}</dl>
          {editing && <p>Statut : {values.availlable ? 'Disponible' : 'Indisponible'}</p>}
          {!editing && <p className="item-owner-note">Cet article sera associé à votre compte.</p>}
        </aside>
      </div>
    </section>
  )
}
