import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const fallbackCategories = [
  {name: "Academic Tutoring", icon: "📚", subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "History", "Geography", "Computer Science", "Accountancy", "Economics", "Political Science"]},
  {name: "Languages", icon: "🌐", subjects: ["English Speaking", "French", "German", "Spanish", "Japanese", "Sanskrit", "Tamil", "Hindi Grammar", "Spoken English"]},
  {name: "Coding & AI", icon: "💻", subjects: ["Python", "Java", "Web Development", "AI & Machine Learning", "Robotics", "C++", "Data Structures", "App Development", "Cyber Security"]},
  {name: "Science & Technology", icon: "🔬", subjects: ["Physics", "Chemistry", "Biology", "Environmental Science", "Electronics", "Astronomy"]},
  {name: "Arts & Music", icon: "🎨", subjects: ["Drawing", "Guitar", "Piano", "Singing", "Dance", "Violin", "Tabla", "Art & Sketching"]},
  {name: "Sports & Fitness", icon: "🏏", subjects: ["Cricket", "Badminton", "Chess", "Yoga", "Swimming", "Football", "Martial Arts"]},
  {name: "Professional Skills", icon: "💼", subjects: ["Public Speaking", "Digital Marketing", "Video Editing", "Excel", "Content Writing", "Photography"]},
  {name: "Test Preparation", icon: "🎯", subjects: ["JEE Main", "JEE Advanced", "NEET", "UPSC", "IELTS", "SAT", "GMAT", "CLAT", "NDA", "Banking"]},
]

const categoryGradients = [
  { from: 'from-blue-500', to: 'to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { from: 'from-emerald-500', to: 'to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { from: 'from-purple-500', to: 'to-violet-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  { from: 'from-cyan-500', to: 'to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  { from: 'from-pink-500', to: 'to-rose-600', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  { from: 'from-orange-500', to: 'to-red-600', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  { from: 'from-teal-500', to: 'to-cyan-600', light: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
  { from: 'from-indigo-500', to: 'to-purple-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
]

const popularSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Python", "JEE", "NEET", "Guitar", "Yoga"
]

function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function Subjects() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    API.get('/categories/')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : fallbackCategories
        setCategories(data)
        setActiveCat(0)
      })
      .catch(() => { setCategories(fallbackCategories); setActiveCat(0) })
      .finally(() => setLoading(false))
  }, [])

  const allSubjects = categories.flatMap((cat) => (cat.subjects || []).map((s) => ({ name: s, category: cat.name, icon: cat.icon })))
  const uniqueSubjects = [...new Map(allSubjects.map((s) => [s.name, s])).values()]

  const filteredSubjects = uniqueSubjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCategory = categories[activeCat]
  const activeSubjects = activeCategory?.subjects || []

  const totalSubjects = uniqueSubjects.length
  const totalCategories = categories.length

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-gold/[0.04] to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/[0.03] to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6 animate-fade-in">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-blue-200 text-sm font-medium">Explore {totalCategories} categories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] mb-6 animate-slide-up">
              What Can You{' '}
              <span className="text-gradient-gold">Learn?</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200/90 mb-8 max-w-2xl mx-auto animate-fade-in animate-delay-200">
              Real subjects, real tutors — explore {totalSubjects}+ subjects across {totalCategories} categories.
              <br />Nursery to Class 12 | NEET, JEE | JAC, CBSE, ICSE
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto animate-fade-in animate-delay-300" ref={searchRef}>
              <div className="glass rounded-2xl overflow-hidden border border-white/20">
                <div className="flex items-center px-5">
                  <svg className="w-5 h-5 text-blue-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any subject..."
                    className="w-full bg-transparent text-white placeholder-blue-300/60 px-4 py-4 outline-none text-base"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-blue-300 hover:text-white transition p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F9FC] to-transparent" />
      </section>

      {/* ── STATS ── */}
      <section className="relative -mt-10 z-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: totalCategories, label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-primary' },
                { value: totalSubjects, label: 'Subjects', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'text-gold-dark' },
                { value: '500+', label: 'Tutors Available', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-green-600' },
                { value: '4.9', label: 'Avg Tutor Rating', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-gold-dark' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${stat.color}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div className={`text-2xl md:text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-500 text-xs md:text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR SUBJECTS STRIP ── */}
      {!searchQuery && (
        <ScrollReveal>
          <section className="pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Popular Subjects
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSubjects.map((s, idx) => (
                  <Link
                    key={s}
                    to={`/find-tutors?subject=${encodeURIComponent(s)}`}
                    className="group inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:border-primary/40 hover:shadow-soft transition-all duration-300"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{s}</span>
                    <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ── SEARCH RESULTS OR CATEGORY BROWSER ── */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {searchQuery ? (
            /* Search Results View */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">
                  Results for "<span className="text-myai">{searchQuery}</span>"
                </h2>
                <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  {filteredSubjects.length} found
                </span>
              </div>
              {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredSubjects.map((s, idx) => (
                    <Link
                      key={s.name}
                      to={`/find-tutors?subject=${encodeURIComponent(s.name)}`}
                      className="group bg-white border border-gray-100 rounded-xl px-4 py-4 hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 text-center"
                    >
                      <div className="text-2xl mb-2">{s.icon || '📖'}</div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.category}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white premium-shadow rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-xl text-gray-600 font-medium">No subjects found</p>
                  <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
                  <button onClick={() => setSearchQuery('')} className="btn-primary mt-6">Clear Search</button>
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white premium-shadow rounded-2xl p-6 animate-pulse border border-gray-100">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl mx-auto mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-7 bg-gray-200 rounded-full w-16" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Category Tabs + Grid View */
            <div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCat(idx)}
                    className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeCat === idx
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <span className="text-base">{cat.icon || '📖'}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {activeCategory && (
                <ScrollReveal key={activeCat}>
                  <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{activeCategory.icon || '📖'}</div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-primary">{activeCategory.name}</h2>
                          <p className="text-sm text-gray-500">{activeSubjects.length} subjects</p>
                        </div>
                      </div>
                      <Link
                        to={`/find-tutors?subject=${encodeURIComponent(activeSubjects[0] || '')}`}
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition"
                      >
                        Browse All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {activeSubjects.map((subject, idx) => (
                        <Link
                          key={subject}
                          to={`/find-tutors?subject=${encodeURIComponent(subject)}`}
                          className="group relative overflow-hidden bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300"
                          style={{ animationDelay: `${idx * 0.04}s` }}
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-2xl -z-0" />
                          <div className="relative z-10 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                              {subject.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate">{subject}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Category Mini Cards Grid */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    All Categories
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((cat, idx) => {
                    const g = categoryGradients[idx % categoryGradients.length]
                    return (
                      <button
                        key={cat.name}
                        onClick={() => { setActiveCat(idx); window.scrollTo({ top: 600, behavior: 'smooth' }) }}
                        className={`group bg-white border border-gray-100 rounded-2xl p-5 premium-shadow-hover hover:-translate-y-1 transition-all duration-300 text-left ${activeCat === idx ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                            {cat.icon || '📖'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-primary text-sm truncate">{cat.name}</h3>
                            <p className="text-xs text-gray-400">{cat.subjects?.length || 0} subjects</p>
                          </div>
                          <svg className={`w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all ${activeCat === idx ? 'text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(cat.subjects || []).slice(0, 3).map((s) => (
                            <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${g.light} ${g.text} border ${g.border} font-medium`}>{s}</span>
                          ))}
                          {(cat.subjects?.length || 0) > 3 && (
                            <span className="text-xs text-gray-400 px-1">+{cat.subjects.length - 3}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-gold/[0.03] to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2 mb-6">
            <span className="w-2 h-2 bg-primary/40 rounded-full" />
            <span className="text-primary/60 text-sm font-medium">Ready to start learning?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Not Sure Where to Start?</h2>
          <p className="text-gray-500 mb-8 text-lg max-w-xl mx-auto">Tell us what your child needs, and we'll find the perfect tutor — for free.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/find-tutors" className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3.5 rounded-xl font-bold text-base hover:shadow-lg hover:scale-[1.02] transition-all inline-flex items-center gap-2 shadow-md">
              Browse All Tutors
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/register" className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold text-base hover:bg-gray-50 transition-all inline-flex items-center gap-2 border-2 border-primary/20 shadow-sm hover:border-primary/40">
              Post a Requirement
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
