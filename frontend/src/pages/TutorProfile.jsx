import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function TutorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tutor, setTutor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState('')
  const [isFavorited, setIsFavorited] = useState(false)
  const [messageModal, setMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [reportModal, setReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('Spam')
  const [reportDescription, setReportDescription] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    API.get(`/tutors/${id}`).then((res) => setTutor(res.data)).catch(() => navigate('/'))
    API.get(`/reviews/tutors/${id}`).then((res) => setReviews(res.data)).catch(() => {})
    if (user) {
      API.get(`/favorites/check/${id}`).then((res) => setIsFavorited(res.data.is_favorited)).catch(() => {})
    }
  }, [id, user, navigate])

  const scrollToReviews = () => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })

  const summarize = async () => {
    try { const res = await API.post(`/ai/summarize-tutor/${id}`); setSummary(res.data.summary) }
    catch (err) { alert('MeritAI summary failed') }
  }

  const toggleFavorite = async () => {
    if (!user) return navigate('/login')
    try {
      if (isFavorited) { await API.delete(`/favorites/${id}`); setIsFavorited(false) }
      else { await API.post(`/favorites/${id}`); setIsFavorited(true) }
    } catch (err) { alert('Failed to update favorite') }
  }

  const sendMessage = async () => {
    if (!messageText.trim()) return
    try {
      await API.post('/messages', { receiver_id: tutor.user_id, tutor_profile_id: tutor.id, message: messageText })
      setMessageModal(false); setMessageText(''); alert('Message sent!')
    } catch (err) { alert('Failed to send message') }
  }

  const submitReport = async () => {
    try {
      await API.post('/reports', { tutor_id: parseInt(id), reason: reportReason, description: reportDescription })
      setReportModal(false); setReportReason('Spam'); setReportDescription(''); alert('Report submitted!')
    } catch (err) { alert('Failed to submit report') }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      await API.post('/reviews/', { tutor_id: parseInt(id), rating: reviewForm.rating, comment: reviewForm.comment })
      const res = await API.get(`/reviews/tutors/${id}`)
      setReviews(res.data); setReviewForm({ rating: 5, comment: '' })
    } catch (err) { alert(err.response?.data?.detail || 'Review failed') }
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-primary font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  const rating = Math.round(tutor.rating || 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-5xl font-bold shrink-0 shadow-xl ring-4 ring-primary/10">
            {tutor.full_name?.[0] || 'T'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary">{tutor.full_name}</h1>
              {tutor.is_verified && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              )}
              {tutor.offers_free_trial && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full border border-purple-200">Free Trial</span>
              )}
            </div>
            <p className="text-lg text-gray-600 mt-1">{tutor.qualification}</p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-gold text-xl">{[1, 2, 3, 4, 5].map((n) => <span key={n}>{n <= rating ? '\u2605' : '\u2606'}</span>)}</div>
              <span className="text-gray-500 font-medium">{tutor.rating || 'N/A'}</span>
              <button onClick={scrollToReviews} className="text-primary underline text-sm hover:text-primary-light transition font-medium">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {(tutor.subjects || []).map((s) => (
                <span key={s} className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/10">{s}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button onClick={toggleFavorite} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border ${isFavorited ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {isFavorited ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => setMessageModal(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Message
              </button>
              <button onClick={() => setReportModal(true)} className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Board', value: tutor.board || 'N/A', color: 'from-orange-500 to-red-500' },
          { label: 'Teaching Mode', value: (tutor.teaching_mode || 'N/A').charAt(0).toUpperCase() + (tutor.teaching_mode || 'N/A').slice(1), color: 'from-blue-500 to-indigo-500' },
          { label: 'Location', value: tutor.area_in_ranchi || 'Any', color: 'from-green-500 to-teal-500' },
          { label: 'Fee', value: `₹${tutor.expected_fee || 'Negotiable'}/mo`, color: 'from-gold to-gold-dark' },
          { label: 'Experience', value: `${tutor.experience_years || 0} years`, color: 'from-purple-500 to-pink-500' },
          { label: 'Classes Handled', value: (tutor.classes_handled || []).join(', ') || 'N/A', color: 'from-cyan-500 to-blue-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white premium-shadow rounded-xl p-4 border border-gray-100 hover:shadow-lg transition">
            <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-2`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            </div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">{item.label}</p>
            <p className="text-base font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-primary">About</h2>
        </div>
        {tutor.bio ? (
          <p className="text-gray-700 leading-relaxed text-lg">{tutor.bio}</p>
        ) : (
          <p className="text-gray-400 italic">No bio provided.</p>
        )}
      </div>

      <div className="bg-white premium-shadow rounded-2xl p-6 md:p-8 mb-6 border border-gray-100">
        <button onClick={summarize} className="bg-gradient-to-r from-gold to-gold-dark text-primary px-6 py-3 rounded-xl font-bold hover:shadow-premium hover:scale-[1.02] transition-all inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          MeritAI Summary
        </button>
        {summary && (
          <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-gray-700 italic leading-relaxed border border-blue-100 shadow-inner">{summary}</div>
        )}
      </div>

      <div id="reviews-section" className="bg-white premium-shadow rounded-2xl p-6 md:p-8 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-primary">Reviews ({reviews.length})</h2>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition">
                <div className="flex text-gold text-lg">{[1, 2, 3, 4, 5].map((n) => <span key={n}>{n <= r.rating ? '\u2605' : '\u2606'}</span>)}</div>
                {r.comment && <p className="text-gray-700 mt-2 leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {user?.role === 'parent' && (
          <form onSubmit={submitReview} className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold text-primary mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${n <= reviewForm.rating ? 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-md scale-110' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{n}</button>
              ))}
            </div>
            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." className="input-field mb-4" rows={3} />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}
      </div>

      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-4 animate-scale-in">
            <h3 className="text-2xl font-bold text-primary mb-4">Send Message to {tutor.full_name}</h3>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type your message..." className="input-field mb-4" rows={5} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setMessageModal(false); setMessageText('') }} className="px-6 py-2.5 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition">Cancel</button>
              <button onClick={sendMessage} className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}

      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-4 animate-scale-in">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Report {tutor.full_name}</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="input-field cursor-pointer">
                <option value="Spam">Spam</option>
                <option value="Inappropriate">Inappropriate</option>
                <option value="Fake Profile">Fake Profile</option>
                <option value="Wrong Info">Wrong Info</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
              <textarea value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} placeholder="Provide additional details..." className="input-field" rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setReportModal(false); setReportReason('Spam'); setReportDescription('') }} className="px-6 py-2.5 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition">Cancel</button>
              <button onClick={submitReport} className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition shadow-md">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
