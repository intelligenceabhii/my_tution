import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/90 backdrop-blur-xl text-gray-800 sticky top-0 z-50 shadow-soft border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
            <span className="text-gold font-extrabold text-lg">M</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-primary text-xl font-bold tracking-tight">MY</span>
            <span className="text-primary/70 text-xl font-light tracking-tight">Tuition</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/find-tutors" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Find Tutors</Link>
          <Link to="/subjects" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Subjects</Link>
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all ml-2 shadow-md">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'parent' && (
                <Link to="/parent/dashboard" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Dashboard</Link>
              )}
              {user.role === 'tutor' && (
                <Link to="/tutor/dashboard" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all font-medium">Admin</Link>
              )}
              <Link to="/favorites" className="px-3 py-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all font-medium" title="Saved">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Link>
              <Link to="/messages" className="px-3 py-2 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all font-medium" title="Messages">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </Link>
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-all">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <div className="py-1">
                        {user.role === 'parent' && (
                          <Link to="/parent/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 transition">Dashboard</Link>
                        )}
                        {user.role === 'tutor' && (
                          <Link to="/tutor/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 transition">Dashboard</Link>
                        )}
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 transition">Admin Panel</Link>
                        )}
                        <Link to="/favorites" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 transition">Saved Tutors</Link>
                        <Link to="/messages" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 transition">Messages</Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button onClick={() => { handleLogout(); setDropdownOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium">Logout</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-600">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 text-sm animate-fade-in shadow-lg">
          <Link to="/find-tutors" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Find Tutors</Link>
          <Link to="/subjects" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Subjects</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-gradient-to-r from-primary to-primary-light text-white text-center px-4 py-3 rounded-xl font-semibold mt-2 shadow-md">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'parent' && (
                <Link to="/parent/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'tutor' && (
                <Link to="/tutor/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">Admin</Link>
              )}
              <Link to="/favorites" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">
                <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Saved
              </Link>
              <Link to="/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 transition font-medium">
                <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </Link>
              <hr className="border-gray-100 my-2" />
              <span className="block px-4 py-1 text-gray-500 text-xs">{user.email}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition text-sm font-medium">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
