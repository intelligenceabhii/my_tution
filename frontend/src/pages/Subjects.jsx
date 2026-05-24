import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const fallbackCategories = [
  {name: "Academic Tutoring", icon: "📚", subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "History", "Geography", "Computer Science"]},
  {name: "Languages", icon: "🌐", subjects: ["English Speaking", "French", "German", "Spanish", "Japanese", "Sanskrit", "Tamil"]},
  {name: "Science & Technology", icon: "🔬", subjects: ["Python", "Java", "Web Development", "AI & Machine Learning", "Robotics"]},
  {name: "Arts & Music", icon: "🎨", subjects: ["Drawing", "Guitar", "Piano", "Singing", "Dance", "Violin"]},
  {name: "Sports & Fitness", icon: "🏏", subjects: ["Cricket", "Badminton", "Chess", "Yoga", "Swimming"]},
  {name: "Professional Skills", icon: "💼", subjects: ["Public Speaking", "Digital Marketing", "Video Editing", "Excel"]},
  {name: "Test Preparation", icon: "🎯", subjects: ["JEE", "NEET", "UPSC", "IELTS", "SAT", "GMAT"]}
]

function SkeletonCard() {
  return (
    <div className="bg-white premium-shadow rounded-2xl p-6 animate-pulse">
      <div className="w-14 h-14 bg-gray-200 rounded-2xl mx-auto mb-4" />
      <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-7 bg-gray-200 rounded-full w-16" />)}
      </div>
    </div>
  )
}

export default function Subjects() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/categories/')
      .then((res) => { setCategories(Array.isArray(res.data) ? res.data : fallbackCategories) })
      .catch(() => setCategories(fallbackCategories))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h1 className="section-title mb-4">Browse Subjects</h1>
        <p className="section-subtitle">Find the perfect tutor for any subject</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white premium-shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col border border-gray-100 group animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="text-5xl text-center mb-4 group-hover:scale-110 transition-transform">{cat.icon || '📖'}</div>
              <h2 className="text-lg font-bold text-primary text-center mb-4">{cat.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center flex-1">
                {(cat.subjects || []).map((subject) => (
                  <Link key={subject} to={`/find-tutors?subject=${encodeURIComponent(subject)}`} className="inline-block bg-primary/5 text-primary px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary hover:text-white transition border border-primary/10">{subject}</Link>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <Link to={`/find-tutors?subject=${encodeURIComponent((cat.subjects || [])[0] || '')}`} className="text-primary font-semibold text-sm hover:text-primary-light transition inline-flex items-center gap-1">
                  Find Tutors
                  <svg className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
