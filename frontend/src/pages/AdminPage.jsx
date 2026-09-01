import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'

const ROLES = ['user', 'admin']
const STATUSES = ['active', 'inactive', 'suspended']
const STATUS_COLOR = { active: '#22c55e', inactive: '#94a3b8', suspended: '#ef4444' }

/* ── Create User Modal ── */
function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'user', status: 'active' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await apiClient.postRaw('/user/create_user', form)
      onCreated(user)
      onClose()
    } catch (err) {
      setError(err?.detail || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={m.modal} onClick={e => e.stopPropagation()}>
        <div style={m.modalHeader}>
          <div style={m.modalTitleRow}>
            <span style={m.modalIcon}>👤</span>
            <div>
              <div style={m.modalTitle}>Nouvel utilisateur</div>
              <div style={m.modalSub}>Remplissez les informations ci-dessous</div>
            </div>
          </div>
          <button style={m.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={m.form}>
          <label style={m.label}>Nom d'utilisateur</label>
          <div style={m.inputWrap}>
            <span style={m.inputIcon}>🔑</span>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="ex: john_doe" required minLength={3} style={m.input} autoComplete="off" />
          </div>

          <label style={m.label}>Mot de passe</label>
          <div style={m.inputWrap}>
            <span style={m.inputIcon}>🔒</span>
            <input name="password" type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={handleChange} placeholder="Min. 6 caractères" required minLength={6}
              style={{ ...m.input, paddingRight: '2.8rem' }} />
            <button type="button" style={m.eyeBtn} onClick={() => setShowPwd(v => !v)}>
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>

          <div style={m.row}>
            <div style={{ flex: 1 }}>
              <label style={m.label}>Rôle</label>
              <select name="role" value={form.role} onChange={handleChange} style={m.select}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={m.label}>Statut</label>
              <select name="status" value={form.status} onChange={handleChange} style={m.select}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {error && <div style={m.error}>⚠️ {error}</div>}
          <div style={m.actions}>
            <button type="button" style={m.cancelBtn} onClick={onClose}>Annuler</button>
            <button type="submit" style={m.submitBtn} disabled={loading}>
              {loading ? <span style={m.spinner} /> : '✚ Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Delete Confirm Modal ── */
function DeleteConfirmModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      await apiClient.postRaw('/user/delete', { username: user.username })
      onDeleted(user)
      onClose()
    } catch (err) {
      setError(err?.detail || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={{ ...m.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div style={d.header}>
          <div style={d.iconWrap}>🗑️</div>
          <div style={d.title}>Supprimer l'utilisateur</div>
          <div style={d.sub}>Cette action est irréversible</div>
        </div>
        <div style={d.body}>
          <div style={d.userCard}>
            <span style={d.userAvatar}>{user.username[0].toUpperCase()}</span>
            <div>
              <div style={d.userName}>{user.username}</div>
              <div style={d.userMeta}>{user.role} · {user.status}</div>
            </div>
          </div>
          <div style={d.warning}>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
          </div>
          {error && <div style={m.error}>⚠️ {error}</div>}
          <div style={m.actions}>
            <button style={m.cancelBtn} onClick={onClose}>Annuler</button>
            <button style={d.deleteBtn} onClick={handleDelete} disabled={loading}>
              {loading ? <span style={m.spinner} /> : '🗑️ Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Admin Page ── */
export default function AdminPage() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    apiClient.get('/user/stats').then(setStats).catch(() => {})
    apiClient.get('/user/list').then(setUsers).catch(() => {})
  }, [])

  function handleLogout() { logout(); navigate('/login') }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function handleCreated(user) {
    setUsers(u => [user, ...u])
    setStats(s => ({
      total: s.total + 1,
      active: user.status === 'active' ? s.active + 1 : s.active,
      admins: user.role === 'admin' ? s.admins + 1 : s.admins,
    }))
    showToast(`✅ Utilisateur "${user.username}" créé avec succès`)
  }

  function handleDeleted(user) {
    setUsers(u => u.filter(x => x.id !== user.id))
    setStats(s => ({
      total: s.total - 1,
      active: user.status === 'active' ? s.active - 1 : s.active,
      admins: user.role === 'admin' ? s.admins - 1 : s.admins,
    }))
    showToast(`🗑️ Utilisateur "${user.username}" supprimé`)
  }

  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      <div style={s.topBar}>
        <div>
          <div style={s.pageTitle}>🛠️ Tableau de bord Admin</div>
          <div style={s.pageSub}>Bienvenue, <strong style={{ color: '#f97316' }}>{auth?.user?.username}</strong></div>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>Se déconnecter</button>
      </div>

      <div style={s.statsRow}>
        {[
          { icon: '👥', label: 'Utilisateurs totaux', value: stats.total },
          { icon: '🟢', label: 'Actifs', value: stats.active },
          { icon: '🛡️', label: 'Admins', value: stats.admins },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <span style={s.statIcon}>{stat.icon}</span>
            <div style={s.statValue}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div>
            <div style={s.sectionTitle}>👥 Gestion des utilisateurs</div>
            <div style={s.sectionSub}>Créez et gérez les comptes utilisateurs</div>
          </div>
          <button style={s.createBtn} onClick={() => setShowModal(true)}>✚ Créer un utilisateur</button>
        </div>

        {users.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>👤</div>
            <div style={s.emptyText}>Aucun utilisateur dans la base de données</div>
            <button style={s.createBtnSm} onClick={() => setShowModal(true)}>Créer le premier</button>
          </div>
        ) : (
          <div style={s.table}>
            <div style={s.tableHead}>
              <span>Utilisateur</span><span>Rôle</span><span>Statut</span><span>ID</span><span></span>
            </div>
            {users.map(u => (
              <div key={u.id} style={s.tableRow}>
                <span style={s.username}>🔑 {u.username}</span>
                <span style={{ ...s.badge, background: u.role === 'admin' ? 'rgba(249,115,22,0.15)' : 'rgba(148,163,184,0.1)', color: u.role === 'admin' ? '#f97316' : '#94a3b8', border: `1px solid ${u.role === 'admin' ? 'rgba(249,115,22,0.3)' : 'rgba(148,163,184,0.2)'}` }}>
                  {u.role}
                </span>
                <span style={{ ...s.badge, background: `${STATUS_COLOR[u.status]}18`, color: STATUS_COLOR[u.status], border: `1px solid ${STATUS_COLOR[u.status]}44` }}>
                  {u.status}
                </span>
                <span style={s.idText}>{String(u.id).slice(0, 8)}…</span>
                {u.role !== 'admin' && (
                  <button style={s.deleteBtn} onClick={() => setDeleteTarget(u)} title="Supprimer">🗑️</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateUserModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
      {deleteTarget && <DeleteConfirmModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />}
    </div>
  )
}

/* ── Page styles ── */
const s = {
  page: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  toast: { position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' },
  pageSub: { color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem' },
  logoutBtn: { padding: '0.45rem 1rem', borderRadius: '999px', border: '1px solid rgba(249,115,22,0.4)', background: 'transparent', color: '#f97316', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' },
  statIcon: { fontSize: '1.6rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 800, color: '#f97316' },
  statLabel: { fontSize: '0.78rem', color: '#64748b', textAlign: 'center' },
  section: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  sectionTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0' },
  sectionSub: { fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' },
  createBtn: { padding: '0.55rem 1.2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' },
  createBtnSm: { padding: '0.5rem 1.1rem', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.4)', background: 'transparent', color: '#f97316', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem', gap: '0.5rem' },
  emptyIcon: { fontSize: '2.5rem', opacity: 0.3 },
  emptyText: { color: '#475569', fontSize: '0.9rem' },
  table: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tableHead: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5rem', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', transition: 'border-color 0.2s' },
  username: { color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' },
  idText: { color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace' },
  deleteBtn: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '7px', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 },
}

/* ── Modal styles ── */
const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#0f2544', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '20px', width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', overflow: 'hidden' },
  modalHeader: { background: 'linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04))', borderBottom: '1px solid rgba(249,115,22,0.15)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalTitleRow: { display: 'flex', alignItems: 'center', gap: '0.85rem' },
  modalIcon: { fontSize: '1.8rem', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '10px', padding: '0.4rem 0.5rem' },
  modalTitle: { color: '#f1f5f9', fontWeight: 800, fontSize: '1.05rem' },
  modalSub: { color: '#64748b', fontSize: '0.78rem', marginTop: '0.15rem' },
  closeBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  form: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '0.75rem', fontSize: '0.9rem', pointerEvents: 'none' },
  input: { width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none' },
  eyeBtn: { position: 'absolute', right: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  select: { width: '100%', padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.25rem' },
  cancelBtn: { flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  submitBtn: { flex: 2, padding: '0.7rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
}

/* ── Delete modal styles ── */
const d = {
  header: { background: 'linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.04))', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center' },
  iconWrap: { fontSize: '2.2rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '0.6rem 0.75rem', marginBottom: '0.25rem' },
  title: { color: '#f1f5f9', fontWeight: 800, fontSize: '1.05rem' },
  sub: { color: '#64748b', fontSize: '0.8rem' },
  body: { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  userCard: { display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.85rem 1rem' },
  userAvatar: { width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0 },
  userName: { color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' },
  userMeta: { color: '#64748b', fontSize: '0.78rem', marginTop: '0.15rem' },
  warning: { color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '0.65rem 0.85rem' },
  deleteBtn: { flex: 2, padding: '0.7rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' },
}
