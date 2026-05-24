import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-primary/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center shadow-premium group-hover:scale-105 transition-transform">
            <span className="text-primary font-extrabold text-lg">M</span>
          </div>
          <div>
            <span className="text-gold text-xl font-bold tracking-tight">MY</span>
            <span className="text-white text-xl font-bold tracking-tight">Tuition</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/find-tutors" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Find Tutors</Link>
          <Link to="/subjects" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Subjects</Link>
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-gold to-gold-dark text-primary px-5 py-2.5 rounded-xl font-bold hover:shadow-premium hover:scale-[1.02] transition-all ml-2">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'parent' && (
                <Link to="/parent/dashboard" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'tutor' && (
                <Link to="/tutor/dashboard" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">Admin</Link>
              )}
              <Link to="/favorites" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">
                <svg className="w-4 h-4 inline-block -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Saved
              </Link>
              <Link to="/messages" className="px-4 py-2 rounded-xl hover:bg-white/10 transition font-medium">
                <svg className="w-4 h-4 inline-block -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </Link>
              <div className="h-6 w-px bg-white/20 mx-2" />
              <span className="text-gold text-xs font-medium truncate max-w-[100px]">{user.email}</span>
              <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/80 text-white px-3 py-1.5 rounded-xl transition text-sm font-medium ml-1">Logout</button>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition">
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
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-4 space-y-1 text-sm animate-fade-in">
          <Link to="/find-tutors" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Find Tutors</Link>
          <Link to="/subjects" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Subjects</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-gradient-to-r from-gold to-gold-dark text-primary text-center px-4 py-3 rounded-xl font-bold mt-2">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'parent' && (
                <Link to="/parent/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'tutor' && (
                <Link to="/tutor/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">Admin</Link>
              )}
              <Link to="/favorites" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">
                <svg className="w-4 h-4 inline-block -mt-0.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Saved
              </Link>
              <Link to="/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">
                <svg className="w-4 h-4 inline-block -mt-0.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </Link>
              <hr className="border-white/10 my-2" />
              <span className="block px-4 py-1 text-gold text-xs">{user.email}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full bg-white/10 hover:bg-red-500/80 text-white px-4 py-3 rounded-xl transition text-sm font-medium">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
