import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  )
}

function FavoriteCard({ tutor, onRemove }) {
  const initial = tutor.full_name?.[0] || tutor.name?.[0] || 'T'
  const subjects = tutor.subjects || []
  const feeAmount = tutor.fee_per_hour || tutor.expected_fee
  const feeLabel = tutor.fee_type === 'per_hour' ? '/hr' : '/month'

  return (
    <div className="bg-white premium-shadow rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col border border-gray-100">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {tutor.photo ? (
              <img src={tutor.photo} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-lg font-bold shadow-md">{initial}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-primary text-sm truncate">{tutor.full_name || tutor.name}</h3>
            <p className="text-xs text-gray-600 truncate">{tutor.qualification}</p>
            <StarRating rating={tutor.rating || 0} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {subjects.slice(0, 3).map((s) => (
            <span key={s} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs font-medium truncate max-w-[100px]">{s}</span>
          ))}
          {subjects.length > 3 && <span className="text-xs text-gray-400 font-medium">+{subjects.length - 3}</span>}
        </div>

        <div className="mt-2 text-sm"><span className="font-bold text-primary">₹{feeAmount || 'Neg'}{feeAmount ? feeLabel : ''}</span></div>

        <div className="mt-auto pt-3 flex gap-2">
          <Link to={`/tutor/profile/${tutor.id}`} className="flex-1 text-center bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold py-2.5 rounded-xl hover:shadow-lg transition">View Profile</Link>
          <button onClick={() => onRemove(tutor.id)} className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-100 transition border border-red-100">Remove</button>
        </div>
      </div>
    </div>
  )
}

export default function Favorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    try { const res = await API.get('/favorites/'); setFavorites(Array.isArray(res.data) ? res.data : []) }
    catch { setFavorites([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (user) fetchFavorites() }, [user, fetchFavorites])

  const handleRemove = async (tutorId) => {
    try { await API.delete('/favorites/' + tutorId); setFavorites((prev) => prev.filter((f) => f.id !== tutorId)) }
    catch {}
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-primary mb-8">My Saved Tutors</h1>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary border-t-gold rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-primary">My Saved Tutors</h1>
            <p className="text-gray-500 text-sm">{favorites.length} saved tutor{favorites.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">💔</div>
          <p className="text-xl text-gray-600 font-medium mb-2">No saved tutors yet</p>
          <p className="text-sm text-gray-400 mb-6">Browse tutors and save your favorites!</p>
          <Link to="/find-tutors" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Browse Tutors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {favorites.map((tutor) => <FavoriteCard key={tutor.id} tutor={tutor} onRemove={handleRemove} />)}
        </div>
      )}
    </div>
  )
}
