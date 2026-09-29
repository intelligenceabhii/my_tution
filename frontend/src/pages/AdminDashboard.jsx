import { useState, useEffect, useRef } from 'react'
import API from '../api/axios'
import { useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '../api/errors'
import { serverDate } from '../utils/dates'

const CATEGORY_EMOJIS = ['📚', '🧮', '🔬', '💻', '🎨', '🎵', '🌍', '🗣️', '🏆', '🧠', '✍️', '📖']

function UserButton({ children, onClick, className = '' }) {
  return <button type="button" onClick={onClick} className={`text-left text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded ${className}`}>{children}</button>
}

function StatCard({ label, value, icon, gradient, color, onClick }) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component type={onClick ? 'button' : undefined} onClick={onClick} className={`w-full text-left bg-white premium-shadow rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-100 transition-transform duration-300 shrink-0`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
            {icon === 'tutors' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
            {icon === 'pending' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {icon === 'open' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
            {icon === 'apps' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {icon === 'parents' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a4 4 0 11-6 0 4 4 0 016 0z" />}
            {icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
          </svg>
        </div>
        <div>
          <div className={`text-2xl md:text-3xl font-semibold ${color}`}>{value}</div>
          <div className="text-gray-500 text-xs md:text-sm font-medium">{label}</div>
          {onClick && <div className="text-primary text-[11px] font-semibold mt-1">View details →</div>}
        </div>
      </div>
    </Component>
  )
}

function Section({ title, children, icon, gradient, action, id }) {
  return (
    <div id={id} className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100 animate-fade-in scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-primary">{title}</h2>
          </div>
        </div>
        {action && action}
      </div>
      {children}
    </div>
  )
}

function StatusBadge({ status, type = 'default' }) {
  const configs = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    accepted: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    open: 'bg-green-50 text-green-700 border border-green-200',
    closed: 'bg-gray-50 text-gray-500 border border-gray-200',
    active: 'bg-green-50 text-green-700 border border-green-200',
    inactive: 'bg-red-50 text-red-700 border border-red-200',
    approved: 'bg-green-50 text-green-700 border border-green-200',
    admin: 'bg-purple-50 text-purple-700 border border-purple-200',
    tutor: 'bg-blue-50 text-blue-700 border border-blue-200',
    parent: 'bg-green-50 text-green-700 border border-green-200',
  }
  const s = status?.toLowerCase() || ''
  const cls = configs[s] || `bg-gray-50 text-gray-600 border border-gray-200`
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>
}

function Table({ headers, rows, emptyMsg = 'No data yet.' }) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">{emptyMsg}</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h, i) => (
              <th key={i} className={`pb-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${i === headers.length - 1 ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              {row.cells.map((cell, ci) => (
                <td key={ci} className={`py-3 pr-4 ${ci === row.cells.length - 1 ? 'text-right' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab = ['overview', 'categories', 'applications', 'requirements', 'reviews', 'users', 'ai', 'messages'].includes(requestedTab) ? requestedTab : 'overview'
  const setActiveTab = tab => setSearchParams({ tab }, { replace: true })
  const activeFilter = searchParams.get('filter') || 'all'
  const [stats, setStats] = useState(null)
  const [pendingTutors, setPendingTutors] = useState([])
  const [allTutors, setAllTutors] = useState([])
  const [users, setUsers] = useState([])
  const [applications, setApplications] = useState([])
  const [requirements, setRequirements] = useState([])
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const [adminCreating, setAdminCreating] = useState(false)
  const [passwordUser, setPasswordUser] = useState(null)
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailLoading, setUserDetailLoading] = useState(false)
  const [userDetailError, setUserDetailError] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', icon: '', subjectInput: '', subjects: [] })
  const [catError, setCatError] = useState('')

  const [conversations, setConversations] = useState([])
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [convoMessages, setConvoMessages] = useState([])
  const [convoError, setConvoError] = useState('')
  const [convoLoading, setConvoLoading] = useState(false)
  const convoRequest = useRef(0)
  const openAdminConversation = async id => {
    const version = ++convoRequest.current
    setSelectedConvo(id); setConvoMessages([]); setConvoError(''); setConvoLoading(true)
    try {
      const { data } = await API.get(`/admin/conversations/${id}/messages`)
      if (version === convoRequest.current) setConvoMessages(data || [])
    } catch (err) {
      if (version === convoRequest.current) setConvoError(apiErrorMessage(err, 'Could not load messages. Please refresh the conversation.'))
    } finally { if (version === convoRequest.current) setConvoLoading(false) }
  }
  const [aiConfig, setAiConfig] = useState(null)
  const [aiForm, setAiForm] = useState({ ai_provider: 'gemini', gemini_api_key: '', model_name: 'gemini-2.0-flash', groq_api_key: '', groq_model: 'llama3-70b-8192', temperature: 0.7, max_tokens: 2048, top_p: 0.95, match_enabled: true, summarize_enabled: true, match_prompt_template: '', summarize_prompt_template: '' })
  const [aiSaving, setAiSaving] = useState(false)
  const [aiTestResult, setAiTestResult] = useState(null)
  const [aiTestLoading, setAiTestLoading] = useState(false)
  const [aiMsg, setAiMsg] = useState('')

  const [loadErrors, setLoadErrors] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const fetchData = async () => {
    setLoadErrors([])
    setRefreshing(true)
    await Promise.allSettled([
    API.get('/admin/stats').then(r => setStats(r.data)).catch(err => setLoadErrors(prev => [...prev, 'stats: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/tutors/pending').then(r => setPendingTutors(r.data)).catch(err => setLoadErrors(prev => [...prev, 'tutors/pending: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/tutors/all').then(r => setAllTutors(r.data)).catch(err => setLoadErrors(prev => [...prev, 'tutors/all: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/users').then(r => setUsers(r.data)).catch(err => setLoadErrors(prev => [...prev, 'users: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/applications').then(r => setApplications(r.data)).catch(err => setLoadErrors(prev => [...prev, 'applications: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/requirements').then(r => setRequirements(r.data)).catch(err => setLoadErrors(prev => [...prev, 'requirements: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/reviews').then(r => setReviews(r.data)).catch(err => setLoadErrors(prev => [...prev, 'reviews: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/categories').then(r => setCategories(r.data)).catch(err => setLoadErrors(prev => [...prev, 'categories: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/ai-config').then(r => { setAiConfig(r.data); setAiForm({ ai_provider: r.data.ai_provider || 'gemini', gemini_api_key: r.data.gemini_api_key || '', model_name: r.data.model_name || 'gemini-2.0-flash', groq_api_key: r.data.groq_api_key || '', groq_model: r.data.groq_model || 'llama3-70b-8192', temperature: r.data.temperature ?? 0.7, max_tokens: r.data.max_tokens ?? 2048, top_p: r.data.top_p ?? 0.95, match_enabled: r.data.match_enabled ?? true, summarize_enabled: r.data.summarize_enabled ?? true, match_prompt_template: r.data.match_prompt_template || '', summarize_prompt_template: r.data.summarize_prompt_template || '' }) }).catch(err => setLoadErrors(prev => [...prev, 'ai-config: ' + apiErrorMessage(err, 'Could not load data')])),
    API.get('/admin/conversations').then(r => setConversations(r.data || [])).catch(err => setLoadErrors(prev => [...prev, 'conversations: ' + apiErrorMessage(err, 'Could not load data')])),
    ])
    setRefreshing(false)
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    if (activeTab === 'overview' && activeFilter === 'pending') {
      window.requestAnimationFrame(() => document.getElementById('pending-approvals')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [activeTab, activeFilter, pendingTutors.length])

  const approveTutor = async (id) => { try { await API.put(`/admin/tutors/${id}/approve`); fetchData() } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) } }
  const declineTutor = async (id) => { if (!window.confirm('Decline this tutor?')) return; try { await API.put(`/admin/tutors/${id}/decline`); fetchData() } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) } }
  const deleteUser = async (user) => { if (!window.confirm(`Delete ${user.email}?`)) return; try { await API.delete(`/admin/users/${user.id}`); fetchData() } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) } }
  const toggleUserActive = async (user, activate) => {
    try {
      activate
        ? await API.put(`/admin/users/${user.id}/activate`)
        : window.confirm(`Deactivate ${user.email}?`) && await API.put(`/admin/users/${user.id}/deactivate`)
      fetchData()
    } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) }
  }

  const openPasswordReset = user => {
    setPasswordUser(user)
    setPasswordForm({ password: '', confirm: '' })
    setPasswordError('')
  }

  const resetPassword = async e => {
    e.preventDefault()
    if (passwordForm.password.length < 8) return setPasswordError('Password must be at least 8 characters.')
    if (passwordForm.password !== passwordForm.confirm) return setPasswordError('Passwords do not match.')
    setPasswordSaving(true); setPasswordError('')
    try {
      const { data } = await API.put(`/admin/users/${passwordUser.id}/password`, { new_password: passwordForm.password })
      setAdminMsg(data.message)
      setPasswordUser(null)
    } catch (err) { setPasswordError(apiErrorMessage(err, 'Could not update the password.')) }
    finally { setPasswordSaving(false) }
  }

  const openStatDetails = card => setSearchParams({ tab: card.tab, ...(card.filter && { filter: card.filter }) }, { replace: true })
  const filteredUsers = users.filter(user => activeFilter === 'all' || user.role === activeFilter || (activeFilter === 'active' ? user.is_active : activeFilter === 'inactive' ? !user.is_active : false))
  const filteredRequirements = requirements.filter(requirement => activeFilter === 'all' || requirement.status === activeFilter)
  const openUserDetails = async ({ userId, email, tutorId } = {}) => {
    const user = users.find(candidate =>
      (userId != null && candidate.id === userId) ||
      (email != null && candidate.email === email) ||
      (tutorId != null && candidate.tutor_profile?.id === tutorId)
    )
    setSelectedUser(user || { id: userId, email: email || 'User details' })
    setUserDetailError('')
    if (!user?.id && !userId) {
      setUserDetailError('This user account could not be matched to the displayed record.')
      return
    }
    setUserDetailLoading(true)
    try {
      const { data } = await API.get(`/admin/users/${user?.id || userId}`)
      setSelectedUser(data)
    } catch (err) { setUserDetailError(apiErrorMessage(err, 'Could not load user details.')) }
    finally { setUserDetailLoading(false) }
  }
  const updateApplicationStatus = async (id, status) => { try { await API.put(`/admin/applications/${id}/status`, { status }); fetchData() } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) } }
  const closeRequirement = async (id) => { if (!window.confirm('Close this requirement?')) return; try { await API.put(`/admin/requirements/${id}/close`); fetchData() } catch (err) { alert(apiErrorMessage(err, 'Action failed. Please retry.')) } }

  const createAdmin = async (e) => {
    e.preventDefault(); if (adminCreating) return; setAdminMsg(''); setAdminCreating(true)
    try { await API.post('/admin/admins', { email: newAdminEmail, password: newAdminPass }); setAdminMsg('Admin created!'); setNewAdminEmail(''); setNewAdminPass(''); setShowAddAdmin(false); fetchData() }
    catch (err) { setAdminMsg(apiErrorMessage(err, 'Action failed. Please retry.')) }
    finally { setAdminCreating(false) }
  }

  const openNewCategory = () => { setEditingCategory(null); setCatError(''); setCatForm({ name: '', icon: '📚', subjectInput: '', subjects: [] }); setShowCategoryModal(true) }
  const openEditCategory = (cat) => { setEditingCategory(cat); setCatError(''); setCatForm({ name: cat.name, icon: cat.icon || '📚', subjectInput: '', subjects: [...cat.subjects] }); setShowCategoryModal(true) }
  const addCatSubject = () => {
    const s = catForm.subjectInput.trim()
    if (s && !catForm.subjects.includes(s)) setCatForm({ ...catForm, subjects: [...catForm.subjects, s], subjectInput: '' })
  }
  const removeCatSubject = (s) => setCatForm({ ...catForm, subjects: catForm.subjects.filter((x) => x !== s) })

  const saveCategory = async () => {
    if (!catForm.name.trim()) return setCatError('Enter a category name.')
    if (!catForm.icon.trim()) return setCatError('Choose or enter an icon.')
    setCatError('')
    try {
      const payload = { name: catForm.name.trim(), icon: catForm.icon.trim(), subjects: catForm.subjects }
      editingCategory
        ? await API.put(`/admin/categories/${editingCategory.id}`, payload)
        : await API.post('/admin/categories', payload)
      setShowCategoryModal(false)
      fetchData()
    } catch (err) { setCatError(apiErrorMessage(err, 'Failed to save category')) }
  }

  const deleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return
    try { await API.delete(`/admin/categories/${id}`); fetchData() } catch { alert('Failed to delete category') }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { key: 'categories', label: `Categories`, count: categories.length, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { key: 'applications', label: `Applications`, count: applications.length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'requirements', label: `Requirements`, count: requirements.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { key: 'reviews', label: `Reviews`, count: reviews.length, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { key: 'users', label: `Users`, count: users.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { key: 'ai', label: `MeritAI Settings`, icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' },
    { key: 'messages', label: `Messages`, count: conversations.length, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5l-1 1V5a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-5l-5 5v-5z' },
  ]

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: 'users', gradient: 'from-blue-500 to-indigo-600', color: 'text-blue-600', tab: 'users' },
    { label: 'Total Tutors', value: stats.total_tutors, icon: 'tutors', gradient: 'from-purple-500 to-pink-600', color: 'text-purple-600', tab: 'users', filter: 'tutor' },
    { label: 'Parents', value: stats.total_parents, icon: 'parents', gradient: 'from-green-500 to-teal-600', color: 'text-green-600', tab: 'users', filter: 'parent' },
    { label: 'Pending Approval', value: stats.pending_tutors, icon: 'pending', gradient: 'from-amber-500 to-orange-600', color: 'text-amber-600', tab: 'overview', filter: 'pending' },
    { label: 'Open Reqs', value: stats.open_requirements, icon: 'open', gradient: 'from-cyan-500 to-blue-600', color: 'text-cyan-600', tab: 'requirements', filter: 'open' },
    { label: 'Applications', value: stats.total_applications, icon: 'apps', gradient: 'from-primary to-primary-light', color: 'text-primary', tab: 'applications' },
  ] : []

  const reviewsStatCards = stats ? [
    { label: 'Total Reviews', value: stats.total_reviews ?? reviews.length, icon: 'star', gradient: 'from-gold to-gold-dark', color: 'text-gold-dark' },
    { label: 'Avg Rating', value: stats.avg_rating ?? 0, icon: 'star', gradient: 'from-pink-500 to-rose-600', color: 'text-pink-600' },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <button className="btn-outline text-sm" disabled={refreshing} onClick={fetchData}>{refreshing ? 'Refreshing…' : 'Refresh dashboard'}</button>
        {loadErrors.length > 0 && <div role="alert" className="mt-3 p-3 bg-red-50 text-red-800 rounded-xl"><p>Some dashboard data could not be loaded. Refresh to retry.</p>{loadErrors.map((message, i) => <p key={i} className="text-sm">{message}</p>)}</div>}
      </div>
      {/* ── HERO ── */}
      <div className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-gradient-to-bl from-gold/[0.04] to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/[0.03] to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-xs font-medium">Admin Panel</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold">Admin Dashboard</h1>
              <p className="text-blue-200/80 text-sm mt-1">Manage your platform — tutors, users, categories & more</p>
            </div>
            <button onClick={() => setShowAddAdmin(!showAddAdmin)} className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${showAddAdmin ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:scale-[1.00] shadow-md'}`}>
              {showAddAdmin ? 'Cancel' : '+ Add Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD ADMIN FORM ── */}
      {showAddAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 mb-6 relative z-10">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-6 rounded-2xl animate-slide-up shadow-md">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create New Admin
            </h2>
            <form onSubmit={createAdmin} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label htmlFor="admindashboard-field-0" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input id="admindashboard-field-0" type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required className="input-field" placeholder="admin@example.com" />
              </div>
              <div className="flex-1 w-full">
                <label htmlFor="admindashboard-field-1" className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                <input id="admindashboard-field-1" type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} required className="input-field" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={adminCreating} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all w-full sm:w-auto hover:scale-[1.00]">Create</button>
            </form>

          </div>
        </div>
      )}

      {adminMsg && <p role="status" className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 text-sm text-primary">{adminMsg}</p>}
      {/* ── TABS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2 mb-6" role="tablist" aria-label="Admin sections">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`min-w-0 w-full px-2.5 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm xl:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map(s => <StatCard key={s.label} {...s} onClick={() => openStatDetails(s)} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white premium-shadow rounded-xl p-5 border border-gray-100 animate-pulse"><div className="h-16 bg-gray-100 rounded-lg" /></div>)}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Section
                id="pending-approvals"
                title={`Pending Approvals`}
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                gradient="from-amber-500 to-orange-500"
                action={<span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-200">{pendingTutors.length} pending</span>}
              >
                {pendingTutors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No pending tutors. All caught up!</p>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
                    {pendingTutors.map(t => (
                      <div key={t.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <UserButton onClick={() => openUserDetails({ tutorId: t.id })}>{t.full_name}</UserButton>
                            <p className="text-xs text-gray-500">{t.qualification} | {t.board}</p>
                          </div>
                          <StatusBadge status="Pending" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{(t.subjects || []).join(', ')} | {t.teaching_mode} | {t.area_in_ranchi || 'Any'}</p>
                        <div className="flex gap-2">
                          <button onClick={() => approveTutor(t.id)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md hover:from-green-600 hover:to-green-700 transition-all">Approve</button>
                          <button onClick={() => declineTutor(t.id)} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md hover:from-red-600 hover:to-red-700 transition-all">Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section
                title="All Tutors"
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
                gradient="from-primary to-primary-light"
                action={<span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{allTutors.length} total</span>}
              >
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
                  {allTutors.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 text-sm">No tutors registered yet.</p>
                  ) : (
                    allTutors.map(t => (
                      <div key={t.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition group">
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                            {t.full_name?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <UserButton onClick={() => openUserDetails({ tutorId: t.id })} className="text-sm">{t.full_name}</UserButton>
                            <p className="text-xs text-gray-400 truncate">{(t.subjects || []).slice(0, 3).join(', ')}</p>
                          </div>
                        </div>
                        <StatusBadge status={t.is_approved ? 'Approved' : 'Pending'} />
                      </div>
                    ))
                  )}
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab === 'categories' && (
          <Section
            title="Subject Categories"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
            gradient="from-primary to-primary-light"
            action={
              <button onClick={openNewCategory} className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:scale-[1.00] inline-flex items-center gap-2 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Category
              </button>
            }
          >
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">No categories yet. Create your first category.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map(cat => {
                  const colors = [
                    { from: 'from-blue-500', to: 'to-indigo-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                    { from: 'from-emerald-500', to: 'to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                    { from: 'from-purple-500', to: 'to-violet-600', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                    { from: 'from-cyan-500', to: 'to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
                    { from: 'from-pink-500', to: 'to-rose-600', light: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
                    { from: 'from-orange-500', to: 'to-red-600', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
                  ]
                  const g = colors[categories.indexOf(cat) % colors.length]
                  return (
                    <div key={cat.id} className="border border-gray-100 rounded-xl p-5 premium-shadow-hover transition-all bg-white hover:bg-gray-50/50 group hover:-translate-y-0.5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${g.from} ${g.to} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                            {cat.icon || '📖'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary">{cat.name}</h3>
                            <p className="text-xs text-gray-400">{cat.subjects?.length || 0} subjects</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button onClick={() => openEditCategory(cat)} className="p-2 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => deleteCategory(cat.id, cat.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subjects?.slice(0, 6).map(s => (
                          <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${g.light} ${g.text} border ${g.border} font-medium`}>{s}</span>
                        ))}
                        {(cat.subjects?.length || 0) > 6 && (
                          <span className="text-xs text-gray-400 font-medium">+{cat.subjects.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>
        )}

        {/* ── APPLICATIONS ── */}
        {activeTab === 'applications' && (
          <Section
            title="All Applications"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            gradient="from-green-500 to-teal-500"
            action={<span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">{applications.length} total</span>}
          >
            <Table
              headers={['Tutor', 'Requirement', 'Parent', 'Status', 'Date', 'Actions']}
              emptyMsg="No applications yet."
              rows={applications.map(a => ({
                cells: [
                  <UserButton onClick={() => openUserDetails({ tutorId: a.tutor_id })}>{a.tutor_name}</UserButton>,
                  <span className="text-gray-600 text-xs">{isNaN(a.requirement_class) ? a.requirement_class : `Class ${a.requirement_class}`} {a.requirement_board} — {(a.requirement_subjects || []).slice(0, 3).join(', ')}</span>,
                  <UserButton onClick={() => openUserDetails({ email: a.parent_email })} className="text-xs">{a.parent_email}</UserButton>,
                  <StatusBadge status={a.status} />,
                  <span className="text-gray-500 text-xs">{new Date(a.applied_at).toLocaleDateString()}</span>,
                  a.status === 'pending' ? (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => updateApplicationStatus(a.id, 'accepted')} className="bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition">Accept</button>
                      <button onClick={() => updateApplicationStatus(a.id, 'rejected')} className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition">Reject</button>
                    </div>
                  ) : <span className="text-xs text-gray-400">—</span>,
                ]
              }))}
            />
          </Section>
        )}

        {/* ── REQUIREMENTS ── */}
        {activeTab === 'requirements' && (
          <Section
            title="All Requirements"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
            gradient="from-cyan-500 to-blue-500"
            action={<span className="text-xs bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full font-medium border border-cyan-200">{requirements.length} total</span>}
          >
            <div className="flex flex-wrap gap-2 mb-5" aria-label="Filter requirements">
              {['all', 'open', 'closed'].map(filter => (
                <button key={filter} onClick={() => setSearchParams({ tab: 'requirements', filter }, { replace: true })} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${activeFilter === filter ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'}`}>{filter}</button>
              ))}
            </div>
            <Table
              headers={['Parent', 'Class', 'Subjects', 'Mode', 'Status', 'Date', 'Actions']}
              emptyMsg="No requirements posted yet."
              rows={filteredRequirements.map(r => ({
                cells: [
                  <UserButton onClick={() => openUserDetails({ userId: r.parent_id, email: r.parent_email })}>{r.parent_email}</UserButton>,
                  <span>{r.child_class}</span>,
                  <span className="text-gray-600 text-xs">{(r.subjects_needed || []).slice(0, 3).join(', ')}</span>,
                  <span className="capitalize text-xs">{r.teaching_mode}</span>,
                  <StatusBadge status={r.status} />,
                  <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>,
                  r.status === 'open' ? (
                    <button onClick={() => closeRequirement(r.id)} className="bg-orange-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-600 transition">Close</button>
                  ) : <span className="text-xs text-gray-400">—</span>,
                ]
              }))}
            />
          </Section>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {reviewsStatCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <Section
              title="All Reviews"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
              gradient="from-gold to-gold-dark"
              action={<span className="text-xs bg-gold/20 text-gold-dark px-2.5 py-1 rounded-full font-medium">{reviews.length} reviews</span>}
            >
              <Table
                headers={['Tutor', 'Parent', 'Rating', 'Comment', 'Date']}
                emptyMsg="No reviews yet."
                rows={reviews.map(r => ({
                  cells: [
                    <UserButton onClick={() => openUserDetails({ tutorId: r.tutor_id })}>{r.tutor_name}</UserButton>,
                    <UserButton onClick={() => openUserDetails({ email: r.parent_email })} className="text-xs">{r.parent_email}</UserButton>,
                    <span className="text-amber-700 font-semibold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>,
                    <span className="text-gray-600 text-xs max-w-[200px] truncate block">{r.comment || '—'}</span>,
                    <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>,
                  ]
                }))}
              />
            </Section>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <Section
            title="All Users"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
            gradient="from-blue-500 to-indigo-500"
            action={<span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">{users.length} users</span>}
          >
            {adminMsg && <p role="status" className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">{adminMsg}</p>}
            <div className="flex flex-wrap gap-2 mb-5" aria-label="Filter users">
              {['all', 'parent', 'tutor', 'admin', 'active', 'inactive'].map(filter => (
                <button key={filter} onClick={() => setSearchParams({ tab: 'users', filter }, { replace: true })} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${activeFilter === filter ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'}`}>{filter}</button>
              ))}
            </div>
            <Table
              headers={['Email', 'Role', 'Status', 'Joined', 'Actions']}
              emptyMsg="No users found."
              rows={filteredUsers.map(u => ({
                cells: [
                  <UserButton onClick={() => openUserDetails({ userId: u.id })}>{u.email}</UserButton>,
                  <StatusBadge status={u.role} />,
                  <StatusBadge status={u.is_active ? 'Active' : 'Inactive'} />,
                  <span className="text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</span>,
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openPasswordReset(u)} className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">Reset password</button>
                    {u.role !== 'admin' ? (
                      u.is_active
                        ? <button onClick={() => toggleUserActive(u, false)} className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition">Deactivate</button>
                        : <button onClick={() => toggleUserActive(u, true)} className="bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition">Activate</button>
                    ) : <span className="text-xs text-gray-400">—</span>}
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u)} className="bg-gray-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition">Delete</button>
                    )}
                  </div>,
                ]
              }))}
            />
          </Section>
        )}

        {/* ── AI SETTINGS ── */}
        {activeTab === 'ai' && (
          <Section
            title="MeritAI Configuration"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />}
            gradient="from-primary to-primary-light"
            action={
              <button
                onClick={async () => {
                  setAiSaving(true); setAiMsg('')
                  try {
                    await API.put('/admin/ai-config', aiForm)
                    setAiMsg('MeritAI config saved!')
                    const fresh = await API.get('/admin/ai-config')
                    setAiConfig(fresh.data)
                  } catch (err) { setAiMsg(apiErrorMessage(err, 'Failed to save')) }
                  finally { setAiSaving(false) }
                }}
                disabled={aiSaving}
                className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 shadow-md"
              >
                {aiSaving ? 'Saving...' : 'Save Config'}
              </button>
            }
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  API & Model
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">MeritAI Provider</label>
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${aiForm.ai_provider === 'gemini' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="ai_provider" value="gemini" checked={aiForm.ai_provider === 'gemini'} onChange={e => setAiForm({ ...aiForm, ai_provider: e.target.value })} className="sr-only" />
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      Gemini
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${aiForm.ai_provider === 'groq' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="ai_provider" value="groq" checked={aiForm.ai_provider === 'groq'} onChange={e => setAiForm({ ...aiForm, ai_provider: e.target.value })} className="sr-only" />
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      Groq
                    </label>
                  </div>
                </div>

                {aiForm.ai_provider === 'gemini' ? (
                  <>
                    <div>
                      <label htmlFor="admindashboard-field-3" className="block text-xs font-medium text-gray-500 mb-1">Gemini API Key</label>
                      <input id="admindashboard-field-3" type="password" value={aiForm.gemini_api_key} onChange={e => setAiForm({ ...aiForm, gemini_api_key: e.target.value })} className="input-field text-sm font-mono" placeholder="sk-..." />
                      <p className="text-xs text-gray-400 mt-1">Leave empty to use the key from .env file</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>*]:min-w-0">
                      <div>
                        <label htmlFor="admindashboard-field-4" className="block text-xs font-medium text-gray-500 mb-1">Model Name</label>
                        <input id="admindashboard-field-4" type="text" value={aiForm.model_name} onChange={e => setAiForm({ ...aiForm, model_name: e.target.value })} className="input-field text-sm" placeholder="gemini-2.0-flash" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="admindashboard-field-5" className="block text-xs font-medium text-gray-500 mb-1">Groq API Key</label>
                      <input id="admindashboard-field-5" type="password" value={aiForm.groq_api_key} onChange={e => setAiForm({ ...aiForm, groq_api_key: e.target.value })} className="input-field text-sm font-mono" placeholder="gsk_..." />
                      <p className="text-xs text-gray-400 mt-1">Leave empty to use the key from .env file</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>*]:min-w-0">
                      <div>
                        <label htmlFor="admindashboard-field-6" className="block text-xs font-medium text-gray-500 mb-1">Groq Model</label>
                        <input id="admindashboard-field-6" type="text" value={aiForm.groq_model} onChange={e => setAiForm({ ...aiForm, groq_model: e.target.value })} className="input-field text-sm" placeholder="llama3-70b-8192" />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>*]:min-w-0">
                  <div>
                    <label htmlFor="admindashboard-field-7" className="block text-xs font-medium text-gray-500 mb-1">Max Tokens</label>
                    <input id="admindashboard-field-7" type="number" value={aiForm.max_tokens} onChange={e => setAiForm({ ...aiForm, max_tokens: parseInt(e.target.value) || 2048 })} className="input-field text-sm" min={1} max={8192} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>*]:min-w-0">
                  <div>
                    <label htmlFor="admindashboard-field-8" className="block text-xs font-medium text-gray-500 mb-1">Temperature</label>
                    <div className="flex items-center gap-3">
                      <input id="admindashboard-field-8" type="range" min="0" max="2" step="0.1" value={aiForm.temperature} onChange={e => setAiForm({ ...aiForm, temperature: parseFloat(e.target.value) })} className="min-w-0 w-full flex-1 accent-primary" />
                      <span className="text-sm font-semibold text-primary w-8 text-right">{aiForm.temperature}</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="admindashboard-field-9" className="block text-xs font-medium text-gray-500 mb-1">Top P</label>
                    <div className="flex items-center gap-3">
                      <input id="admindashboard-field-9" type="range" min="0" max="1" step="0.05" value={aiForm.top_p} onChange={e => setAiForm({ ...aiForm, top_p: parseFloat(e.target.value) })} className="min-w-0 w-full flex-1 accent-primary" />
                      <span className="text-sm font-semibold text-primary w-8 text-right">{aiForm.top_p}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={aiForm.match_enabled} onChange={e => setAiForm({ ...aiForm, match_enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">MeritAI Matching</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={aiForm.summarize_enabled} onChange={e => setAiForm({ ...aiForm, summarize_enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">MeritAI Summaries</span>
                  </label>
                </div>

                <div>
                  <button
                    onClick={async () => {
                      setAiTestLoading(true); setAiTestResult(null)
                      try {
                        const res = await API.post('/admin/ai-config/test')
                        setAiTestResult({ ok: true, message: res.data.message })
                      } catch (err) { setAiTestResult({ ok: false, message: err.response?.data?.detail || 'Connection failed' }) }
                      finally { setAiTestLoading(false) }
                    }}
                    disabled={aiTestLoading}
                    className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-md"
                  >
                    {aiTestLoading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Testing...</>
                    ) : 'Test Connection'}
                  </button>
                  {aiTestResult && (
                    <div className={`mt-3 p-3 rounded-xl text-sm ${aiTestResult.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {aiTestResult.ok ? '✓ ' : '✗ '}{aiTestResult.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  Prompt Templates (Optional)
                </h3>
                <div>
                  <label htmlFor="admindashboard-field-10" className="block text-xs font-medium text-gray-500 mb-1">Match Prompt Template</label>
                  <textarea id="admindashboard-field-10"
                    value={aiForm.match_prompt_template}
                    onChange={e => setAiForm({ ...aiForm, match_prompt_template: e.target.value })}
                    className="input-field text-xs font-mono leading-relaxed"
                    rows={8}
                    placeholder="Leave empty to use the default prompt. Available variables: {req_child_class}, {req_subjects_needed}, {req_board}, {req_location_area}, {req_budget}, {req_teaching_mode}, {tutors_json}"
                  />
                </div>
                <div>
                  <label htmlFor="admindashboard-field-11" className="block text-xs font-medium text-gray-500 mb-1">Summarize Prompt Template</label>
                  <textarea id="admindashboard-field-11"
                    value={aiForm.summarize_prompt_template}
                    onChange={e => setAiForm({ ...aiForm, summarize_prompt_template: e.target.value })}
                    className="input-field text-xs font-mono leading-relaxed"
                    rows={6}
                    placeholder="Leave empty to use the default prompt. Available variables: {tutor_name}, {tutor_qualification}, {tutor_subjects}, {tutor_classes}, {tutor_board}, {tutor_mode}, {tutor_area}, {tutor_fee}, {tutor_experience}, {tutor_rating}"
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl border border-purple-100 text-sm">
                  <p className="font-semibold text-purple-800 mb-1">Current Status</p>
                  <div className="flex flex-wrap gap-4 text-xs text-purple-700">
                    <span>Provider: <strong>{aiForm.ai_provider === 'groq' ? 'Groq' : 'Gemini'}</strong></span>
                    <span>Model: <strong>{aiForm.ai_provider === 'groq' ? (aiForm.groq_model || 'llama3-70b-8192') : (aiConfig?.model_name || 'gemini-2.0-flash')}</strong></span>
                    <span>Matching: <strong>{aiForm.match_enabled ? 'ON' : 'OFF'}</strong></span>
                    <span>Summaries: <strong>{aiForm.summarize_enabled ? 'ON' : 'OFF'}</strong></span>
                    <span>Custom Prompt: <strong>{aiForm.match_prompt_template ? 'Custom' : 'Default'}</strong></span>
                  </div>
                </div>
                {aiMsg && (
                  <div className="p-3 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200">{aiMsg}</div>
                )}
              </div>
            </div>
          </Section>
        )}
      </div>

        {/* ── MESSAGES ── */}
        {activeTab === 'messages' && (
          <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 pb-8">
            <Section
              title="All Conversations"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5l-1 1V5a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-5l-5 5v-5z" />}
              gradient="from-blue-500 to-cyan-500"
              action={<span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">{conversations.length} conversations</span>}
            >
              {selectedConvo ? (
                <div>
                  <button onClick={() => { convoRequest.current++; setSelectedConvo(null); setConvoMessages([]); setConvoError('') }} className="text-sm text-primary font-semibold hover:underline mb-4 inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to conversations
                  </button>
                  <button className="block mb-3 text-sm text-primary underline" disabled={convoLoading} onClick={() => openAdminConversation(selectedConvo)}>Refresh conversation</button>
                  {convoError && <p role="alert" className="text-red-700 text-sm mb-3">{convoError}</p>}
                  <div className="bg-gray-50 rounded-xl p-2.5 sm:p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {convoLoading ? <p role="status">Loading messages…</p> : convoError ? null : convoMessages.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-8">No messages in this conversation.</p>
                    ) : (
                      convoMessages.map((m) => (
                        <div key={m.id} className="bg-white p-3 rounded-xl border border-gray-100">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <UserButton onClick={() => openUserDetails({ email: m.sender_email })} className="text-xs break-all">{m.sender_email}</UserButton>
                            <span className="text-[10px] text-gray-400">{serverDate(m.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{m.message}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${m.is_read ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{m.is_read ? 'Read' : 'Unread'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {conversations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 text-sm">No conversations yet.</p>
                  ) : (
                    conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openAdminConversation(c.id)}
                        className="w-full text-left p-3 sm:p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition flex items-start gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                            <span className="font-semibold text-primary text-sm break-words">{(c.participant_names || []).join(', ')}</span>
                            <span className="text-xs text-gray-400 shrink-0">{c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ''}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{c.last_message_preview || 'No messages'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">{c.message_count} messages</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ── USER DETAILS MODAL ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4" role="dialog" aria-modal="true" aria-labelledby="user-detail-title">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between gap-4 z-10">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">User account</p>
                <h3 id="user-detail-title" className="text-xl font-semibold text-primary break-all">{selectedUser.email}</h3>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} aria-label="Close user details" className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-xl shrink-0">×</button>
            </div>
            <div className="p-6">
              {userDetailLoading ? <p role="status" className="py-12 text-center text-gray-500">Loading user details…</p> : userDetailError ? (
                <p role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">{userDetailError}</p>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Role</p><div className="mt-1"><StatusBadge status={selectedUser.role} /></div></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Status</p><div className="mt-1"><StatusBadge status={selectedUser.is_active ? 'Active' : 'Inactive'} /></div></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">User ID</p><p className="font-semibold text-primary mt-1">#{selectedUser.id}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Joined</p><p className="font-semibold text-primary text-sm mt-1">{selectedUser.created_at ? serverDate(selectedUser.created_at).toLocaleDateString() : '—'}</p></div>
                  </div>

                  {selectedUser.activity && <div className="grid grid-cols-3 gap-3">
                    {[['Requirements', selectedUser.activity.requirements], ['Applications', selectedUser.activity.applications], ['Reviews', selectedUser.activity.reviews]].map(([label, value]) => <div key={label} className="border border-gray-100 rounded-xl p-3 text-center"><p className="text-xl font-semibold text-primary">{value}</p><p className="text-xs text-gray-500">{label}</p></div>)}
                  </div>}

                  {selectedUser.tutor_profile && <div className="border border-gray-100 rounded-xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tutor profile</p><h4 className="text-lg font-semibold text-primary">{selectedUser.tutor_profile.full_name}</h4></div>
                      <StatusBadge status={selectedUser.tutor_profile.is_approved ? 'Approved' : 'Pending'} />
                    </div>
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div><dt className="text-gray-400">Qualification</dt><dd className="font-medium text-gray-700">{selectedUser.tutor_profile.qualification}</dd></div>
                      <div><dt className="text-gray-400">Experience</dt><dd className="font-medium text-gray-700">{selectedUser.tutor_profile.experience_years || 0} years</dd></div>
                      <div><dt className="text-gray-400">Board</dt><dd className="font-medium text-gray-700">{selectedUser.tutor_profile.board}</dd></div>
                      <div><dt className="text-gray-400">Teaching mode</dt><dd className="font-medium text-gray-700 capitalize">{selectedUser.tutor_profile.teaching_mode}</dd></div>
                      <div><dt className="text-gray-400">Location</dt><dd className="font-medium text-gray-700">{selectedUser.tutor_profile.area_in_ranchi || 'Not provided'}</dd></div>
                      <div><dt className="text-gray-400">Expected fee</dt><dd className="font-medium text-gray-700">{selectedUser.tutor_profile.expected_fee != null ? `₹${selectedUser.tutor_profile.expected_fee}` : 'Not provided'}</dd></div>
                      <div className="sm:col-span-2"><dt className="text-gray-400">Subjects</dt><dd className="font-medium text-gray-700">{(selectedUser.tutor_profile.subjects || []).join(', ') || 'Not provided'}</dd></div>
                      <div className="sm:col-span-2"><dt className="text-gray-400">Classes</dt><dd className="font-medium text-gray-700">{(selectedUser.tutor_profile.classes_handled || []).join(', ') || 'Not provided'}</dd></div>
                      {selectedUser.tutor_profile.bio && <div className="sm:col-span-2"><dt className="text-gray-400">Bio</dt><dd className="text-gray-700 whitespace-pre-wrap">{selectedUser.tutor_profile.bio}</dd></div>}
                    </dl>
                  </div>}

                  {(selectedUser.requirements || []).length > 0 && <div>
                    <h4 className="font-semibold text-primary mb-3">Recent requirements</h4>
                    <div className="space-y-2">{selectedUser.requirements.map(requirement => <div key={requirement.id} className="border border-gray-100 rounded-xl p-3 flex items-start justify-between gap-3"><div><p className="font-medium text-gray-800">Class {requirement.child_class} · {(requirement.subjects_needed || []).join(', ')}</p><p className="text-xs text-gray-500 mt-1">{requirement.board} · {requirement.teaching_mode}{requirement.location_area ? ` · ${requirement.location_area}` : ''}</p></div><StatusBadge status={requirement.status} /></div>)}</div>
                  </div>}

                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => { openPasswordReset(selectedUser); setSelectedUser(null) }} className="btn-primary">Reset password</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* ── PASSWORD RESET MODAL ── */}
      {passwordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4" role="dialog" aria-modal="true" aria-labelledby="password-reset-title">
          <form onSubmit={resetPassword} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto animate-scale-in">
            <h3 id="password-reset-title" className="text-2xl font-semibold text-primary">Reset password</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">Set a new password for <span className="font-semibold text-gray-700 break-all">{passwordUser.email}</span>. Existing passwords cannot be viewed.</p>
            {passwordError && <p role="alert" className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{passwordError}</p>}
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-new-password" className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <input id="admin-new-password" autoFocus type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={passwordForm.password} onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })} className="input-field" />
              </div>
              <div>
                <label htmlFor="admin-confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <input id="admin-confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-100">
              <button type="button" onClick={() => setPasswordUser(null)} disabled={passwordSaving} className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
              <button type="submit" disabled={passwordSaving} className="btn-primary disabled:opacity-50">{passwordSaving ? 'Updating…' : 'Update password'}</button>
            </div>
          </form>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto animate-scale-in">
            <h3 className="text-2xl font-semibold text-primary mb-6">{editingCategory ? `Edit "${editingCategory.name}"` : 'New Category'}</h3>
            {catError && <p role="alert" className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{catError}</p>}
            <div className="space-y-4">
              <div>
                <label htmlFor="admindashboard-field-12" className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input id="admindashboard-field-12" type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Academic Tutoring" className="input-field" />
              </div>
              <div>
                <label htmlFor="admindashboard-field-13" className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
                <div className="flex gap-3 items-center mb-3">
                  <input id="admindashboard-field-13" type="text" value={catForm.icon} onChange={(e) => { setCatForm({ ...catForm, icon: e.target.value }); setCatError('') }} aria-describedby="category-icon-help" maxLength={12} className="input-field w-20 text-center text-2xl" />
                  <span id="category-icon-help" className="text-gray-500 text-sm">Selected icon: <span className="text-2xl" aria-hidden="true">{catForm.icon || '—'}</span></span>
                </div>
                <div className="flex flex-wrap gap-2" aria-label="Choose a category icon">
                  {CATEGORY_EMOJIS.map(emoji => (
                    <button key={emoji} type="button" aria-label={`Use ${emoji} icon`} aria-pressed={catForm.icon === emoji} onClick={() => { setCatForm({ ...catForm, icon: emoji }); setCatError('') }} className={`w-10 h-10 rounded-xl text-xl border transition ${catForm.icon === emoji ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'}`}>{emoji}</button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="admindashboard-field-14" className="block text-sm font-medium text-gray-700 mb-1.5">Subjects</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {catForm.subjects.map((s) => (
                    <span key={s} className="bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">
                      {s}
                      <button type="button" onClick={() => removeCatSubject(s)} className="text-gold hover:text-gold-light font-semibold leading-none">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="admindashboard-field-14" type="text" value={catForm.subjectInput} onChange={(e) => setCatForm({ ...catForm, subjectInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCatSubject())} placeholder="Type a subject and press Add" className="input-field flex-1" />
                  <button type="button" onClick={addCatSubject} className="btn-primary whitespace-nowrap px-5 text-sm">Add</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-100">
              <button onClick={() => setShowCategoryModal(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition hover:bg-gray-50">Cancel</button>
              <button onClick={saveCategory} className="btn-primary inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
