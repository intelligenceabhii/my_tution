import { useState, useEffect } from 'react'
import API from '../api/axios'

function StatCard({ label, value, icon, gradient }) {
  return (
    <div className="bg-white premium-shadow rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
            {icon === 'tutors' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />}
            {icon === 'pending' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {icon === 'open' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
            {icon === 'apps' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            {icon === 'parents' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
          </svg>
        </div>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, icon, gradient }) {
  return (
    <div className="bg-white premium-shadow rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
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

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', icon: '', subjectInput: '', subjects: [] })

  const fetchData = () => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    API.get('/admin/tutors/pending').then(r => setPendingTutors(r.data)).catch(() => {})
    API.get('/admin/tutors/all').then(r => setAllTutors(r.data)).catch(() => {})
    API.get('/admin/users').then(r => setUsers(r.data)).catch(() => {})
    API.get('/admin/applications').then(r => setApplications(r.data)).catch(() => {})
    API.get('/admin/requirements').then(r => setRequirements(r.data)).catch(() => {})
    API.get('/admin/reviews').then(r => setReviews(r.data)).catch(() => {})
    API.get('/admin/categories').then(r => setCategories(r.data)).catch(() => {})
  }

  useEffect(() => { fetchData() }, [])

  const approveTutor = async (id) => { try { await API.put(`/admin/tutors/${id}/approve`); fetchData() } catch (e) { alert('Failed') } }
  const declineTutor = async (id) => { if (!window.confirm('Decline this tutor?')) return; try { await API.put(`/admin/tutors/${id}/decline`); fetchData() } catch (e) { alert('Failed') } }
  const deleteUser = async (user) => { if (!window.confirm(`Delete ${user.email}?`)) return; try { await API.delete(`/admin/users/${user.id}`); fetchData() } catch (e) { alert('Failed') } }
  const toggleUserActive = async (user, activate) => {
    try { activate ? await API.put(`/admin/users/${user.id}/activate`) : (window.confirm(`Deactivate ${user.email}?`) && await API.put(`/admin/users/${user.id}/deactivate`)); fetchData() }
    catch (e) { alert('Failed') }
  }
  const updateApplicationStatus = async (id, status) => { try { await API.put(`/admin/applications/${id}/status`, { status }); fetchData() } catch (e) { alert('Failed') } }
  const closeRequirement = async (id) => { if (!window.confirm('Close this requirement?')) return; try { await API.put(`/admin/requirements/${id}/close`); fetchData() } catch (e) { alert('Failed') } }

  const createAdmin = async (e) => {
    e.preventDefault(); setAdminMsg('')
    try { await API.post('/admin/admins', { email: newAdminEmail, password: newAdminPass }); setAdminMsg('Admin created!'); setNewAdminEmail(''); setNewAdminPass(''); setShowAddAdmin(false); fetchData() }
    catch (err) { setAdminMsg(err.response?.data?.detail || 'Failed') }
  }

  const openNewCategory = () => { setEditingCategory(null); setCatForm({ name: '', icon: '', subjectInput: '', subjects: [] }); setShowCategoryModal(true) }
  const openEditCategory = (cat) => { setEditingCategory(cat); setCatForm({ name: cat.name, icon: cat.icon, subjectInput: '', subjects: [...cat.subjects] }); setShowCategoryModal(true) }

  const addCatSubject = () => {
    const s = catForm.subjectInput.trim()
    if (s && !catForm.subjects.includes(s)) {
      setCatForm({ ...catForm, subjects: [...catForm.subjects, s], subjectInput: '' })
    }
  }

  const removeCatSubject = (s) => setCatForm({ ...catForm, subjects: catForm.subjects.filter((x) => x !== s) })

  const saveCategory = async () => {
    if (!catForm.name.trim() || !catForm.icon.trim()) return alert('Name and icon are required')
    try {
      if (editingCategory) {
        await API.put(`/admin/categories/${editingCategory.id}`, { name: catForm.name, icon: catForm.icon, subjects: catForm.subjects })
      } else {
        await API.post('/admin/categories', { name: catForm.name, icon: catForm.icon, subjects: catForm.subjects })
      }
      setShowCategoryModal(false)
      fetchData()
    } catch (err) { alert(err.response?.data?.detail || 'Failed to save category') }
  }

  const deleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return
    try { await API.delete(`/admin/categories/${id}`); fetchData() }
    catch (err) { alert('Failed to delete category') }
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { key: 'categories', label: `Categories (${categories.length})`, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { key: 'applications', label: `Applications (${applications.length})`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'requirements', label: `Requirements (${requirements.length})`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { key: 'reviews', label: `Reviews (${reviews.length})`, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { key: 'users', label: `Users (${users.length})`, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ]

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: 'users', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Tutors', value: stats.total_tutors, icon: 'tutors', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Parents', value: stats.total_parents, icon: 'parents', gradient: 'from-green-500 to-teal-500' },
    { label: 'Pending', value: stats.pending_tutors, icon: 'pending', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Open Reqs', value: stats.open_requirements, icon: 'open', gradient: 'from-cyan-500 to-blue-500' },
    { label: 'Applications', value: stats.total_applications, icon: 'apps', gradient: 'from-primary to-primary-light' },
  ] : []

  const subjectCategoriesIcon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your platform</p>
        </div>
        <button onClick={() => setShowAddAdmin(!showAddAdmin)} className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${showAddAdmin ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg'}`}>
          {showAddAdmin ? 'Cancel' : '+ Add Admin'}
        </button>
      </div>

      {showAddAdmin && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-6 rounded-2xl mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-purple-800 mb-4">Create New Admin</h2>
          <form onSubmit={createAdmin} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full"><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} required className="input-field" placeholder="admin@example.com" /></div>
            <div className="flex-1 w-full"><label className="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} required className="input-field" placeholder="••••••••" /></div>
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full sm:w-auto">Create</button>
          </form>
          {adminMsg && <p className="mt-2 text-sm text-purple-700 font-medium">{adminMsg}</p>}
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.key ? 'tab-active' : 'tab-inactive'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">{statCards.map(s => <StatCard key={s.label} {...s} />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">{[1,2,3,4,5,6].map(i => <div key={i} className="bg-white premium-shadow rounded-xl p-5 border border-gray-100 animate-pulse"><div className="h-16 bg-gray-100 rounded-lg" /></div>)}</div>
          )}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Section title={`Pending Approvals (${pendingTutors.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} gradient="from-amber-500 to-orange-500">
              {pendingTutors.length === 0 ? <p className="text-gray-500 text-center py-6">No pending tutors.</p> : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {pendingTutors.map(t => (
                    <div key={t.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div><h3 className="font-bold text-primary">{t.full_name}</h3><p className="text-xs text-gray-500">{t.qualification} | {t.board}</p></div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{(t.subjects || []).join(', ')} | {t.teaching_mode} | {t.area_in_ranchi || 'Any'}</p>
                      <div className="flex gap-2"><button onClick={() => approveTutor(t.id)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition">Approve</button><button onClick={() => declineTutor(t.id)} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition">Decline</button></div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
            <Section title={`All Tutors (${allTutors.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />} gradient="from-primary to-primary-light">
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">{allTutors.map(t => (
                <div key={t.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center hover:bg-gray-100 transition">
                  <div className="min-w-0"><span className="font-bold text-primary text-sm">{t.full_name}</span><span className="text-xs text-gray-500 ml-2">{(t.subjects || []).slice(0, 3).join(', ')}</span></div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${t.is_approved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{t.is_approved ? 'Approved' : 'Pending'}</span>
                </div>
              ))}</div>
            </Section>
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <Section title={`Subject Categories (${categories.length})`} icon={subjectCategoriesIcon} gradient="from-primary to-primary-light">
          <div className="mb-5 flex justify-between items-center">
            <p className="text-sm text-gray-500">Manage subject categories and their subjects</p>
            <button onClick={openNewCategory} className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Category
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No categories yet. Create your first category.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(cat => (
                <div key={cat.id} className="border border-gray-100 rounded-xl p-5 premium-shadow-hover transition bg-white hover:bg-gray-50/50 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-primary">{cat.name}</h3>
                        <p className="text-xs text-gray-400">{cat.subjects?.length || 0} subjects</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEditCategory(cat)} className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-500 hover:text-primary transition" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subjects?.slice(0, 6).map(s => (
                      <span key={s} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                    ))}
                    {(cat.subjects?.length || 0) > 6 && <span className="text-xs text-gray-400 font-medium">+{cat.subjects.length - 6} more</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {activeTab === 'applications' && (
        <Section title={`All Applications (${applications.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} gradient="from-green-500 to-teal-500">
          {applications.length === 0 ? <p className="text-gray-500 text-center py-8">No applications yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm"><thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-4 font-semibold">Tutor</th><th className="pb-3 pr-4 font-semibold">Requirement</th><th className="pb-3 pr-4 font-semibold">Parent</th><th className="pb-3 pr-4 font-semibold">Status</th><th className="pb-3 pr-4 font-semibold">Date</th><th className="pb-3 pr-4 font-semibold">Actions</th></tr></thead>
                <tbody>{applications.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50/50 transition"><td className="py-3 pr-4 font-medium text-primary">{a.tutor_name}</td><td className="py-3 pr-4 text-gray-600">{isNaN(a.requirement_class) ? a.requirement_class : `Class ${a.requirement_class}`} {a.requirement_board} — {(a.requirement_subjects || []).slice(0, 3).join(', ')}</td><td className="py-3 pr-4 text-gray-500">{a.parent_email}</td><td className="py-3 pr-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' : a.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{a.status}</span></td><td className="py-3 pr-4 text-gray-500">{new Date(a.applied_at).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{a.status === 'pending' && <div className="flex gap-1"><button onClick={() => updateApplicationStatus(a.id, 'accepted')} className="bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition">Accept</button><button onClick={() => updateApplicationStatus(a.id, 'rejected')} className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition">Reject</button></div>}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {activeTab === 'requirements' && (
        <Section title={`All Requirements (${requirements.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />} gradient="from-cyan-500 to-blue-500">
          {requirements.length === 0 ? <p className="text-gray-500 text-center py-8">No requirements yet.</p> : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-4 font-semibold">Parent</th><th className="pb-3 pr-4 font-semibold">Class</th><th className="pb-3 pr-4 font-semibold">Subjects</th><th className="pb-3 pr-4 font-semibold">Mode</th><th className="pb-3 pr-4 font-semibold">Status</th><th className="pb-3 pr-4 font-semibold">Date</th><th className="pb-3 pr-4 font-semibold">Actions</th></tr></thead>
                <tbody>{requirements.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50/50 transition"><td className="py-3 pr-4 font-medium text-primary">{r.parent_email}</td><td className="py-3 pr-4">{r.child_class}</td><td className="py-3 pr-4 text-gray-600">{(r.subjects_needed || []).slice(0, 3).join(', ')}</td><td className="py-3 pr-4">{r.teaching_mode}</td><td className="py-3 pr-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>{r.status}</span></td><td className="py-3 pr-4 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{r.status === 'open' && <button onClick={() => closeRequirement(r.id)} className="bg-orange-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-600 transition">Close</button>}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {activeTab === 'reviews' && (
        <Section title={`All Reviews (${reviews.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />} gradient="from-gold to-gold-dark">
          {reviews.length === 0 ? <p className="text-gray-500 text-center py-8">No reviews yet.</p> : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-4 font-semibold">Tutor</th><th className="pb-3 pr-4 font-semibold">Parent</th><th className="pb-3 pr-4 font-semibold">Rating</th><th className="pb-3 pr-4 font-semibold">Comment</th><th className="pb-3 pr-4 font-semibold">Date</th></tr></thead>
                <tbody>{reviews.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50/50 transition"><td className="py-3 pr-4 font-medium text-primary">{r.tutor_name}</td><td className="py-3 pr-4 text-gray-500">{r.parent_email}</td><td className="py-3 pr-4"><span className="text-gold font-semibold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td><td className="py-3 pr-4 text-gray-600 max-w-xs truncate">{r.comment || '—'}</td><td className="py-3 pr-4 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {activeTab === 'users' && (
        <Section title={`All Users (${users.length})`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />} gradient="from-blue-500 to-indigo-500">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-4 font-semibold">Email</th><th className="pb-3 pr-4 font-semibold">Role</th><th className="pb-3 pr-4 font-semibold">Status</th><th className="pb-3 pr-4 font-semibold">Joined</th><th className="pb-3 pr-4 font-semibold">Actions</th></tr></thead>
              <tbody>{users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50/50 transition"><td className="py-3 pr-4 font-medium">{u.email}</td><td className="py-3 pr-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : u.role === 'tutor' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{u.role}</span></td><td className="py-3 pr-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td><td className="py-3 pr-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3 pr-4"><div className="flex gap-1">{u.role !== 'admin' ? (u.is_active ? <button onClick={() => toggleUserActive(u, false)} className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition">Deactivate</button> : <button onClick={() => toggleUserActive(u, true)} className="bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition">Activate</button>) : <span className="text-xs text-gray-400">—</span>}{u.role !== 'admin' && <button onClick={() => deleteUser(u)} className="bg-gray-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition">Delete</button>}</div></td></tr>
              ))}</tbody>
            </table>
          </div>
          {users.length === 0 && <p className="text-gray-500 text-center py-4">No users found.</p>}
        </Section>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-4 animate-scale-in">
            <h3 className="text-2xl font-bold text-primary mb-6">{editingCategory ? `Edit "${editingCategory.name}"` : 'New Category'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Academic Tutoring" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
                <div className="flex gap-3">
                  <input type="text" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="e.g. 📚" maxLength={2} className="input-field w-20 text-center text-2xl" />
                  <span className="flex items-center text-gray-400 text-sm">Pick an emoji</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjects</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {catForm.subjects.map((s) => (
                    <span key={s} className="bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">{s} <button type="button" onClick={() => removeCatSubject(s)} className="text-gold hover:text-gold-light font-bold">&times;</button></span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={catForm.subjectInput} onChange={(e) => setCatForm({ ...catForm, subjectInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCatSubject())} placeholder="Type a subject and press Add" className="input-field flex-1" />
                  <button type="button" onClick={addCatSubject} className="btn-primary whitespace-nowrap px-4 text-sm">Add</button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowCategoryModal(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition">Cancel</button>
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
