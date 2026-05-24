import { useState, useEffect } from 'react'
import API from '../api/axios'

export default function TutorDashboard() {
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [requirements, setRequirements] = useState([])
  const [form, setForm] = useState({ full_name: '', qualification: '', subjects: [], classes_handled: [], board: 'JAC', teaching_mode: 'home', area_in_ranchi: '', expected_fee: '', experience_years: 0, bio: '' })
  const [subjectInput, setSubjectInput] = useState('')
  const [classInput, setClassInput] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchApplications()
    fetchOpenRequirements()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/tutors/profile/mine')
      setProfile(res.data)
      setForm({
        full_name: res.data.full_name || '',
        qualification: res.data.qualification || '',
        subjects: res.data.subjects || [],
        classes_handled: res.data.classes_handled || [],
        board: res.data.board || 'JAC',
        teaching_mode: res.data.teaching_mode || 'home',
        area_in_ranchi: res.data.area_in_ranchi || '',
        expected_fee: res.data.expected_fee || '',
        experience_years: res.data.experience_years || 0,
        bio: res.data.bio || '',
      })
    } catch (err) { setProfile(null) }
  }

  const fetchApplications = async () => {
    try {
      const res = await API.get('/my-applications')
      setApplications(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchOpenRequirements = async () => {
    try {
      const res = await API.get('/parents/requirements/open')
      setRequirements(res.data)
    } catch (err) { console.error(err) }
  }

  const addSubject = () => {
    if (subjectInput.trim() && !form.subjects.includes(subjectInput.trim())) {
      setForm({ ...form, subjects: [...form.subjects, subjectInput.trim()] })
      setSubjectInput('')
    }
  }

  const removeSubject = (s) => setForm({ ...form, subjects: form.subjects.filter((sub) => sub !== s) })

  const addClass = () => {
    if (classInput.trim() && !form.classes_handled.includes(classInput.trim())) {
      setForm({ ...form, classes_handled: [...form.classes_handled, classInput.trim()] })
      setClassInput('')
    }
  }

  const removeClass = (c) => setForm({ ...form, classes_handled: form.classes_handled.filter((cl) => cl !== c) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.put('/tutors/profile', { ...form, expected_fee: form.expected_fee ? parseFloat(form.expected_fee) : null, experience_years: parseInt(form.experience_years) || 0 })
      setProfile(res.data)
      alert('Profile updated!')
    } catch (err) { alert(err.response?.data?.detail || 'Failed to update profile') }
  }

  const handleApply = async (reqId) => {
    try {
      await API.post(`/apply/${reqId}`, { cover_note: 'I am interested in this requirement.' })
      alert('Applied successfully!')
      fetchApplications()
    } catch (err) { alert(err.response?.data?.detail || 'Failed to apply') }
  }

  const handlePhotoUpload = async (e) => {
    const fd = new FormData()
    fd.append('file', e.target.files[0])
    try {
      await API.post('/tutors/upload-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      fetchProfile()
    } catch (err) { alert('Upload failed') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Tutor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and find opportunities</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary">{profile ? 'Update Your Profile' : 'Complete Your Profile'}</h2>
            </div>
            {!profile?.is_approved && profile && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Your profile is pending admin approval.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" required className="input-field" />
              <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="Qualification (e.g. B.Sc, B.Ed)" required className="input-field" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjects</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.subjects.map((s) => <span key={s} className="bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">{s} <button type="button" onClick={() => removeSubject(s)} className="text-gold hover:text-gold-light font-bold">&times;</button></span>)}
                </div>
                <div className="flex gap-2">
                  <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())} placeholder="Add subject" className="input-field flex-1" />
                  <button type="button" onClick={addSubject} className="btn-primary whitespace-nowrap px-4 text-sm">Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Classes Handled</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.classes_handled.map((c) => <span key={c} className="bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">{c} <button type="button" onClick={() => removeClass(c)} className="text-gold hover:text-gold-light font-bold">&times;</button></span>)}
                </div>
                <div className="flex gap-2">
                  <input value={classInput} onChange={(e) => setClassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addClass())} placeholder="Add class (e.g. 10, Nursery, NEET)" className="input-field flex-1" />
                  <button type="button" onClick={addClass} className="btn-primary whitespace-nowrap px-4 text-sm">Add</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })} className="input-field cursor-pointer">
                  <option value="JAC">JAC</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option>
                </select>
                <select value={form.teaching_mode} onChange={(e) => setForm({ ...form, teaching_mode: e.target.value })} className="input-field cursor-pointer">
                  <option value="home">Home Tuition</option><option value="online">Online</option><option value="both">Both</option>
                </select>
              </div>
              <input value={form.area_in_ranchi} onChange={(e) => setForm({ ...form, area_in_ranchi: e.target.value })} placeholder="Area in Ranchi" className="input-field" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={form.expected_fee} onChange={(e) => setForm({ ...form, expected_fee: e.target.value })} placeholder="Expected fee (₹/month)" className="input-field" />
                <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} placeholder="Years of experience" className="input-field" />
              </div>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio about yourself..." className="input-field" rows={3} />
              <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Profile
              </button>
            </form>
            {profile && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                    {(profile.full_name?.[0] || 'T')}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-primary">My Applications ({applications.length})</h2>
              </div>
            </div>
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications yet. Browse open requirements below.</p>
            ) : (
              <div className="space-y-2">
                {applications.map((app) => (
                  <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <span className="text-sm font-medium text-gray-700">Requirement #{app.requirement_id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : app.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary">Open Requirements</h2>
            </div>
            {requirements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No open requirements available.</p>
            ) : (
              <div className="space-y-3">
                {requirements.map((req) => (
                  <div key={req.id} className="p-4 border border-gray-100 rounded-xl premium-shadow-hover transition bg-white hover:bg-gray-50/50">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-primary text-sm">{isNaN(req.child_class) ? req.child_class : `Class ${req.child_class}`}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {req.subjects_needed.map((s) => (
                            <span key={s} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">{req.board} | {req.teaching_mode} | {req.location_area || 'Any'} | <span className="font-semibold text-primary">₹{req.budget_per_month || 'Neg'}/mo</span></p>
                      </div>
                      <button onClick={() => handleApply(req.id)} className="btn-gold text-xs px-4 py-2 whitespace-nowrap shrink-0">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
