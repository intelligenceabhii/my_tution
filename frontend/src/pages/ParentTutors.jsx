import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../api/axios'

export default function ParentTutors() {
  const [tutors, setTutors] = useState([])
  const [filters, setFilters] = useState({ subject: '', class_level: '', area: '', board: '', teaching_mode: '' })

  useEffect(() => { fetchTutors() }, [])

  const fetchTutors = async (f = filters) => {
    try {
      const params = new URLSearchParams()
      if (f.subject) params.append('subject', f.subject)
      if (f.class_level) params.append('class_level', f.class_level)
      if (f.area) params.append('area', f.area)
      if (f.board) params.append('board', f.board)
      if (f.teaching_mode) params.append('teaching_mode', f.teaching_mode)
      const res = await API.get(`/tutors/?${params.toString()}`)
      setTutors(res.data)
    } catch (err) { console.error(err) }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    fetchTutors(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Find Tutors</h1>
        <p className="text-gray-500 text-sm mt-1">Browse available tutors for your requirement</p>
      </div>

      <div className="bg-white premium-shadow rounded-2xl p-4 md:p-5 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input placeholder="Subject" value={filters.subject} onChange={(e) => handleFilterChange('subject', e.target.value)} className="input-field" />
          <input placeholder="Class (e.g. 10, Nursery, NEET)" value={filters.class_level} onChange={(e) => handleFilterChange('class_level', e.target.value)} className="input-field" />
          <input placeholder="Area" value={filters.area} onChange={(e) => handleFilterChange('area', e.target.value)} className="input-field" />
          <select value={filters.board} onChange={(e) => handleFilterChange('board', e.target.value)} className="input-field cursor-pointer">
            <option value="">All Boards</option><option value="JAC">JAC</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option>
          </select>
          <select value={filters.teaching_mode} onChange={(e) => handleFilterChange('teaching_mode', e.target.value)} className="input-field cursor-pointer">
            <option value="">All Modes</option><option value="home">Home</option><option value="online">Online</option><option value="both">Both</option>
          </select>
        </div>
      </div>

      {tutors.length === 0 ? (
        <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">🔍</div>
          <p className="text-xl text-gray-600 font-medium">No tutors found</p>
          <p className="text-gray-400 mt-2">Try broadening your search filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white premium-shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 border border-gray-100 group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-2xl font-bold shrink-0 shadow-md ring-2 ring-primary/10">
                  {tutor.full_name?.[0] || 'T'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-primary truncate">{tutor.full_name}</h3>
                  <p className="text-sm text-gray-600 truncate">{tutor.qualification}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-gold text-sm">{'★'.repeat(Math.round(tutor.rating || 0))}{'☆'.repeat(5 - Math.round(tutor.rating || 0))}</span>
                    <span className="text-xs text-gray-500">({tutor.rating})</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(tutor.subjects || []).map((s) => <span key={s} className="bg-primary/5 text-primary px-2.5 py-1 rounded-full text-xs font-medium border border-primary/10">{s}</span>)}
              </div>
              <p className="text-sm text-gray-600 mt-2">{tutor.experience_years} years exp | {tutor.board} | {tutor.teaching_mode}</p>
              <p className="text-sm text-gray-600">{tutor.area_in_ranchi ? `📍 ${tutor.area_in_ranchi}` : ''} | <span className="font-semibold text-primary">₹{tutor.expected_fee || 'Neg'}/mo</span></p>
              {tutor.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tutor.bio}</p>}
              <Link to={`/tutor/profile/${tutor.id}`} className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition w-full">
                View Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
