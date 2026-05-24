import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

export default function ParentDashboard() {
  const [requirements, setRequirements] = useState([])
  const [form, setForm] = useState({ child_class: '9', subjects_needed: [], board: 'JAC', preferred_timing: '', location_area: '', budget_per_month: '', teaching_mode: 'home', special_notes: '' })
  const [showForm, setShowForm] = useState(false)
  const [subjectInput, setSubjectInput] = useState('')

  useEffect(() => { fetchRequirements() }, [])

  const fetchRequirements = async () => {
    try {
      const res = await API.get('/parents/requirements/mine')
      setRequirements(res.data)
    } catch (err) { console.error(err) }
  }

  const addSubject = () => {
    if (subjectInput.trim() && !form.subjects_needed.includes(subjectInput.trim())) {
      setForm({ ...form, subjects_needed: [...form.subjects_needed, subjectInput.trim()] })
      setSubjectInput('')
    }
  }

  const removeSubject = (sub) => {
    setForm({ ...form, subjects_needed: form.subjects_needed.filter((s) => s !== sub) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/parents/requirements', { ...form, budget_per_month: form.budget_per_month ? parseFloat(form.budget_per_month) : null })
      setShowForm(false)
      setForm({ child_class: '9', subjects_needed: [], board: 'JAC', preferred_timing: '', location_area: '', budget_per_month: '', teaching_mode: 'home', special_notes: '' })
      fetchRequirements()
    } catch (err) { alert(err.response?.data?.detail || 'Failed to create requirement') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Parent Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your tutoring requirements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-gold to-gold-dark text-primary hover:shadow-premium hover:scale-[1.02]'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancel' : 'New Requirement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white premium-shadow rounded-2xl p-6 md:p-8 mb-8 animate-slide-up border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary">Post a New Requirement</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Child's Class</label>
              <select value={form.child_class} onChange={(e) => setForm({ ...form, child_class: e.target.value })} className="input-field cursor-pointer">
                {['Nursery','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12','NEET','JEE'].map((c) => (
                  <option key={c} value={c}>{isNaN(c) ? c : `Class ${c}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Board</label>
              <select value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })} className="input-field cursor-pointer">
                <option value="JAC">JAC</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjects Needed</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.subjects_needed.map((s) => (
                  <span key={s} className="bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">{s} <button type="button" onClick={() => removeSubject(s)} className="text-gold hover:text-gold-light font-bold">&times;</button></span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())} placeholder="Type a subject and press Add" className="input-field flex-1" />
                <button type="button" onClick={addSubject} className="btn-primary whitespace-nowrap px-5">Add</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teaching Mode</label>
              <select value={form.teaching_mode} onChange={(e) => setForm({ ...form, teaching_mode: e.target.value })} className="input-field cursor-pointer">
                <option value="home">Home Tuition</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location Area (Ranchi)</label>
              <input value={form.location_area} onChange={(e) => setForm({ ...form, location_area: e.target.value })} className="input-field" placeholder="e.g. Doranda, Harmu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget (₹/month)</label>
              <input type="number" value={form.budget_per_month} onChange={(e) => setForm({ ...form, budget_per_month: e.target.value })} className="input-field" placeholder="e.g. 3000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Timing</label>
              <input value={form.preferred_timing} onChange={(e) => setForm({ ...form, preferred_timing: e.target.value })} className="input-field" placeholder="e.g. Evening 5-7 PM" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Notes</label>
              <textarea value={form.special_notes} onChange={(e) => setForm({ ...form, special_notes: e.target.value })} className="input-field" rows={2} placeholder="Any specific requirements..." />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Post Requirement
          </button>
        </form>
      )}

      {requirements.length === 0 ? (
        <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">📋</div>
          <p className="text-xl text-gray-600 font-medium mb-2">No requirements yet</p>
          <p className="text-gray-400">Click "New Requirement" to find tutors for your child</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white premium-shadow rounded-2xl p-6 premium-shadow-hover transition-all duration-300 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-primary">{isNaN(req.child_class) ? req.child_class : `Class ${req.child_class}`}</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {req.subjects_needed.map((s) => (
                        <span key={s} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {req.board}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {req.teaching_mode}
                    </span>
                    <span>📍 {req.location_area || 'Any area'}</span>
                    <span className="font-semibold text-primary">₹{req.budget_per_month || 'Negotiable'}/mo</span>
                  </div>
                  {req.special_notes && <p className="text-gray-500 text-sm mt-2 italic bg-gray-50 p-2 rounded-lg">"{req.special_notes}"</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${req.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>{req.status}</span>
                </div>
              </div>
              {req.status === 'open' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Link to={`/ai-match/${req.id}`} className="btn-gold text-sm px-5 py-2.5 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Match
                  </Link>
                  <Link to={`/parent/tutors?requirement=${req.id}`} className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Browse Tutors
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
