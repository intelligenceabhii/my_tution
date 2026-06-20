import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function HomeIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function OnlineIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function VerifiedIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-green-500 inline-block" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg className={`w-5 h-5 transition-all ${filled ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function StarRating({ rating, size = 'sm', interactive, onClick, currentFilter }) {
  const stars = [1, 2, 3, 4, 5]
  if (interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <button key={star} type="button" onClick={() => onClick(star === currentFilter ? 0 : star)} className={`${size === 'lg' ? 'text-xl' : 'text-sm'} transition ${star <= currentFilter ? 'text-gold' : 'text-gray-300'} hover:text-gold focus:outline-none`} title={`${star}+ stars`}>★</button>
        ))}
        {currentFilter > 0 && <span className="text-xs text-gray-500 ml-1">& up</span>}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <span key={star} className={`${size === 'lg' ? 'text-xl' : 'text-sm'} ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  )
}

function flattenCategories(data) {
  if (!Array.isArray(data)) return []
  const result = []
  data.forEach((item) => {
    if (typeof item === 'string') { result.push(item) }
    else if (item && typeof item === 'object') {
      if (item.name) result.push(item.name)
      if (Array.isArray(item.subcategories)) {
        item.subcategories.forEach((sub) => {
          if (typeof sub === 'string') result.push(sub)
          else if (sub && sub.name) result.push(sub.name)
        })
      }
    }
  })
  return [...new Set(result)].sort()
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl premium-shadow overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex gap-2"><div className="h-5 bg-gray-200 rounded w-16" /><div className="h-5 bg-gray-200 rounded w-20" /><div className="h-5 bg-gray-200 rounded w-14" /></div>
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-full mt-3" />
        </div>
      </div>
    </div>
  )
}

function ModeBadge({ mode }) {
  const config = {
    home: { label: 'Home', icon: <HomeIcon />, color: 'bg-blue-50 text-blue-700 border border-blue-200' },
    online: { label: 'Online', icon: <OnlineIcon />, color: 'bg-purple-50 text-purple-700 border border-purple-200' },
    both: { label: 'Both', icon: <><HomeIcon /><OnlineIcon /></>, color: 'bg-green-50 text-green-700 border border-green-200' },
  }
  const m = config[mode?.toLowerCase()] || { label: mode, icon: null, color: 'bg-gray-50 text-gray-600 border border-gray-200' }
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${m.color}`}>{m.icon}{m.label}</span>
}

function TutorCard({ tutor, isFavorited, onToggleFavorite, user }) {
  const initial = tutor.full_name?.[0] || 'T'
  const subjects = tutor.subjects || []
  const visibleSubjects = subjects.slice(0, 3)
  const extraCount = subjects.length - 3
  const feeAmount = tutor.fee_per_hour || tutor.expected_fee
  const feeLabel = tutor.fee_type === 'per_hour' ? '/hr' : '/month'

  return (
    <div className="bg-white rounded-xl premium-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {tutor.photo ? (
              <img src={tutor.photo} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-lg font-bold shadow-md">{initial}</div>
            )}
            {tutor.is_verified && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow border-2 border-white"><VerifiedIcon /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-primary truncate text-sm">{tutor.full_name}</h3>
              {user && (
                <button onClick={() => onToggleFavorite(tutor.id)} className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition" title={isFavorited ? 'Remove' : 'Save'}>
                  <HeartIcon filled={isFavorited} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 truncate">{tutor.qualification}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={tutor.rating || 0} />
              <span className="text-xs text-gray-400">({tutor.review_count || 0})</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {visibleSubjects.map((s) => (
            <span key={s} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs font-medium truncate max-w-[100px]">{s}</span>
          ))}
          {extraCount > 0 && <span className="text-xs text-gray-400 font-medium">+{extraCount}</span>}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
          {tutor.board && <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium border border-orange-200">{tutor.board}</span>}
          {tutor.teaching_mode && <ModeBadge mode={tutor.teaching_mode} />}
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-bold text-primary">₹{feeAmount || 'Neg'}{feeAmount ? feeLabel : ''}</span>
          <span className="text-gray-500 text-xs">{tutor.experience_years || 0} yrs</span>
        </div>

        {tutor.offers_free_trial && (
          <div className="mt-2">
            <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded border border-green-200">Free trial</span>
          </div>
        )}

        <div className="mt-auto pt-3">
          <Link to={`/tutor/profile/${tutor.id}`} className="block w-full text-center bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold py-2.5 rounded-xl hover:shadow-lg transition active:scale-[0.98]">View Profile</Link>
        </div>
      </div>
    </div>
  )
}

export default function FindTutors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const limit = 12

  const [filters, setFilters] = useState({
    search: '', subject: '', board: '', teaching_mode: '', area: '',
    min_fee: '', max_fee: '', min_rating: 0, sort: 'rating',
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const subjectRef = useRef(null)

  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState({})

  useEffect(() => {
    API.get('/categories/').then((res) => setCategories(flattenCategories(res.data))).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (subjectRef.current && !subjectRef.current.contains(e.target)) setShowSubjectDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSubjects = categories.filter((s) => s.toLowerCase().includes(subjectSearch.toLowerCase()))

  const fetchTutors = useCallback(async (reset = true) => {
    if (reset) { setSkip(0); setLoading(true); setError('') }
    try {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.subject) params.subject = filters.subject
      if (filters.board) params.board = filters.board
      if (filters.teaching_mode) params.teaching_mode = filters.teaching_mode
      if (filters.area) params.area = filters.area
      if (filters.min_fee) params.min_fee = filters.min_fee
      if (filters.max_fee) params.max_fee = filters.max_fee
      if (filters.min_rating) params.min_rating = filters.min_rating
      if (filters.experience) params.min_experience = filters.experience
      if (filters.sort) params.sort = filters.sort
      params.skip = reset ? 0 : skip
      params.limit = limit

      const res = await API.get('/tutors/', { params })
      const data = res.data
      let newTutors = []
      let newTotal = 0
      if (Array.isArray(data)) { newTutors = data; newTotal = data.length }
      else { newTutors = data.tutors || []; newTotal = data.total || newTutors.length }

      if (reset) { setTutors(newTutors); setSkip(newTutors.length) }
      else { setTutors((prev) => [...prev, ...newTutors]); setSkip((prev) => prev + newTutors.length) }
      setTotal(newTotal)
    } catch (err) { setError(err.response?.data?.detail || 'Failed to load tutors') }
    finally { setLoading(false); setLoadingMore(false) }
  }, [filters, skip, limit])

  useEffect(() => {
    setSkip(0); setTutors([]); setTotal(0)
    const timer = setTimeout(() => fetchTutors(true), 300)
    return () => clearTimeout(timer)
  }, [filters.search, filters.subject, filters.board, filters.teaching_mode, filters.area, filters.min_fee, filters.max_fee, filters.min_rating, filters.sort, filters.experience])

  useEffect(() => {
    if (tutors.length > 0 && user) {
      const ids = tutors.map((t) => t.id)
      Promise.all(ids.map((id) =>
        API.get(`/favorites/check/${id}`).then((r) => ({ id, favorite: r.data.is_favorite ?? r.data })).catch(() => ({ id, favorite: false }))
      )).then((results) => {
        const map = {}; results.forEach((r) => { map[r.id] = r.favorite }); setFavorites((prev) => ({ ...prev, ...map }))
      })
    }
  }, [tutors.length, user])

  const loadMore = () => { if (loadingMore) return; setLoadingMore(true); fetchTutors(false) }
  const clearFilters = () => {
    setFilters({ search: '', subject: '', board: '', teaching_mode: '', area: '', min_fee: '', max_fee: '', min_rating: 0, sort: 'rating', experience: '' })
    setSubjectSearch('')
  }
  const updateFilter = (key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setSidebarOpen(false) }

  const toggleFavorite = async (tutorId) => {
    if (!user) { navigate('/login'); return }
    const wasFavorited = favorites[tutorId]
    setFavorites((prev) => ({ ...prev, [tutorId]: !wasFavorited }))
    try { wasFavorited ? await API.delete(`/favorites/${tutorId}`) : await API.post(`/favorites/${tutorId}`) }
    catch { setFavorites((prev) => ({ ...prev, [tutorId]: wasFavorited })) }
  }

  const hasMore = tutors.length < total
  const verifiedCount = tutors.filter((t) => t.is_verified).length
  const tutorsWithFee = tutors.filter((t) => t.fee_per_hour || t.expected_fee)
  const avgFee = tutorsWithFee.length ? Math.round(tutorsWithFee.reduce((s, t) => s + (t.fee_per_hour || t.expected_fee || 0), 0) / tutorsWithFee.length) : 0
  const avgRating = tutors.length ? (tutors.reduce((s, t) => s + (t.rating || 0), 0) / tutors.length).toFixed(1) : '0.0'

  const languages = [
  'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia', 'Assamese', 'Punjabi',
]

const blogs = [
  { title: '10 Signs Your Child Needs a Tutor', date: '2 days ago', tag: 'Parenting' },
  { title: 'Board Exams to Entrance Prep: A Guide', date: '1 week ago', tag: 'Exams' },
  { title: 'Why Students Lose Interest in Studies', date: '2 weeks ago', tag: 'Learning' },
  { title: 'Are Online Classes Safe for Students?', date: '3 weeks ago', tag: 'Safety' },
]

const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'fee_asc', label: 'Fee: Low to High' },
    { value: 'fee_desc', label: 'Fee: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'newest', label: 'Newest First' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary">Find the Perfect Tutor</h1>
        </div>
        <p className="text-gray-500 text-sm md:text-base">Browse through our verified tutors</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-gray-400 font-medium">Search in:</span>
          {languages.slice(0, 4).map((lang) => (
            <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">{lang}</span>
          ))}
          <span className="text-xs text-gray-400">+{languages.length - 4} more</span>
        </div>
      </div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2.5 rounded-xl text-sm font-semibold mb-4 hover:shadow-lg transition">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
        {sidebarOpen ? 'Close Filters' : 'Filters & Sort'}
      </button>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
          <div className="lg:sticky lg:top-24 space-y-5 bg-white lg:bg-gray-50/50 p-4 lg:p-5 rounded-xl lg:rounded-2xl premium-shadow">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-bold text-primary text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
              <input type="text" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Name or keyword..." className="input-field text-sm py-2.5" />
            </div>

            <div ref={subjectRef} className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
              <input type="text" value={filters.subject || subjectSearch} onChange={(e) => { setSubjectSearch(e.target.value); if (filters.subject) updateFilter('subject', ''); setShowSubjectDropdown(true) }} onFocus={() => setShowSubjectDropdown(true)} placeholder="All subjects" className="input-field text-sm py-2.5" />
              {filters.subject && (
                <button onClick={() => { updateFilter('subject', ''); setSubjectSearch('') }} className="absolute right-2.5 top-[34px] text-gray-400 hover:text-gray-600">&times;</button>
              )}
              {showSubjectDropdown && filteredSubjects.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {filteredSubjects.map((s) => (
                    <button key={s} type="button" onClick={() => { updateFilter('subject', s); setSubjectSearch(s); setShowSubjectDropdown(false) }} className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition ${filters.subject === s ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'}`}>{s}</button>
                  ))}
                </div>
              )}
              {showSubjectDropdown && filteredSubjects.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-3 text-sm text-gray-500">No subjects found</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Board</label>
              <select value={filters.board} onChange={(e) => updateFilter('board', e.target.value)} className="input-field text-sm py-2.5 cursor-pointer">
                <option value="">All Boards</option>
                <option value="JAC">JAC</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Teaching Mode</label>
              <select value={filters.teaching_mode} onChange={(e) => updateFilter('teaching_mode', e.target.value)} className="input-field text-sm py-2.5 cursor-pointer">
                <option value="">All Modes</option>
                <option value="home">Home</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
              <input type="text" value={filters.area} onChange={(e) => updateFilter('area', e.target.value)} placeholder="e.g. Ranchi, Doranda" className="input-field text-sm py-2.5" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fee Range (₹)</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={filters.min_fee} onChange={(e) => updateFilter('min_fee', e.target.value)} placeholder="Min" className="input-field text-sm py-2.5" />
                <span className="text-gray-300">-</span>
                <input type="number" min="0" value={filters.max_fee} onChange={(e) => updateFilter('max_fee', e.target.value)} placeholder="Max" className="input-field text-sm py-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Experience (Years)</label>
              <select value={filters.experience || ''} onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))} className="input-field text-sm py-2.5 cursor-pointer">
                <option value="">Any Experience</option>
                <option value="1">1+ year</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Min Rating</label>
              <StarRating interactive onClick={(val) => updateFilter('min_rating', val)} currentFilter={filters.min_rating} size="lg" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field text-sm py-2.5 cursor-pointer">
                {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <button onClick={clearFilters} className="w-full bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition">Clear All Filters</button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {!loading && tutors.length > 0 && (
            <>
              <div className="flex items-center gap-3 flex-wrap mb-5 text-sm text-gray-600 bg-white premium-shadow rounded-2xl px-5 py-3">
                <span className="font-bold text-primary">{total} tutor{total !== 1 ? 's' : ''}</span>
                <span className="w-px h-4 bg-gray-200" />
                <span className="flex items-center gap-1"><VerifiedIcon /> {verifiedCount} verified</span>
                <span className="w-px h-4 bg-gray-200 hidden sm:block" />
                <span>Avg ₹{avgFee}/mo</span>
                <span className="w-px h-4 bg-gray-200 hidden sm:block" />
                <span>{avgRating} avg rating</span>
              </div>
            </>
          )}

          {!loading && tutors.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
                <div className="text-primary font-extrabold text-lg">{total}</div>
                <div className="text-gray-500 text-xs font-medium">Total Tutors</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
                <div className="text-green-600 font-extrabold text-lg">{verifiedCount}</div>
                <div className="text-gray-500 text-xs font-medium">Verified</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
                <div className="text-primary font-extrabold text-lg">₹{avgFee}</div>
                <div className="text-gray-500 text-xs font-medium">Avg Fee/mo</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
                <div className="text-gold-dark font-extrabold text-lg">{avgRating}</div>
                <div className="text-gray-500 text-xs font-medium">Avg Rating</div>
              </div>
            </div>
          )}

          {loading && tutors.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !loading && tutors.length === 0 && (
            <div className="text-center py-20 bg-white premium-shadow rounded-2xl">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg></div>
              <p className="text-gray-600 font-medium">{error}</p>
              <button onClick={() => fetchTutors(true)} className="btn-primary mt-4">Try Again</button>
            </div>
          )}

          {!loading && !error && tutors.length === 0 && (
            <div className="text-center py-20 bg-white premium-shadow rounded-2xl">
              <div className="text-5xl mb-4 text-gray-300">🔍</div>
              <p className="text-xl text-gray-600 font-medium">No tutors found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary mt-6">Clear All Filters</button>
            </div>
          )}

          {tutors.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {tutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} isFavorited={!!favorites[tutor.id]} onToggleFavorite={toggleFavorite} user={user} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button onClick={loadMore} disabled={loadingMore} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingMore ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Loading...</>
                    ) : `Load More (${total - tutors.length} remaining)`}
                  </button>
                </div>
              )}

              {/* Blog sidebar */}
              <div className="mt-10 bg-white rounded-2xl premium-shadow border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-primary text-lg">Today's Blogs</h3>
                  <a href="#" className="text-sm text-primary font-medium hover:underline">Show more →</a>
                </div>
                <div className="space-y-4">
                  {blogs.map((blog, idx) => (
                    <div key={idx} className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        {blog.title.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">{blog.tag}</span>
                          <span className="text-xs text-gray-400">{blog.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
