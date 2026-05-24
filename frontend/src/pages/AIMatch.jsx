import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../api/axios'

export default function AIMatch() {
  const { reqId } = useParams()
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runMatch = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.post(`/ai/match/${reqId}`)
      setMatches(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'AI matching failed. Make sure GEMINI_API_KEY is set.')
    }
    setLoading(false)
  }

  useEffect(() => { runMatch() }, [reqId])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">AI Tutor Match</h1>
        <p className="text-gray-500 mt-2">Powered by Google Gemini — finding the best tutors for requirement #{reqId}</p>
      </div>

      {loading && (
        <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
          <div className="w-16 h-16 border-4 border-primary border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <p className="text-2xl font-bold text-primary">Analyzing Tutors...</p>
          <p className="text-gray-500 mt-2">Gemini is matching your requirement with available tutors</p>
          <div className="flex justify-center gap-1.5 mt-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <p className="font-bold">Matching Error</p>
          </div>
          <p className="text-sm ml-9">{error}</p>
          <button onClick={runMatch} className="btn-primary mt-4 ml-9 inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Retry
          </button>
        </div>
      )}

      {matches && !loading && (
        <>
          {matches.matches && matches.matches.length > 0 ? (
            <div className="space-y-5">
              {matches.matches.map((m, i) => (
                <div key={i} className={`bg-white premium-shadow rounded-2xl p-6 md:p-8 border-l-8 transition hover:shadow-lg ${i === 0 ? 'border-gold' : i === 1 ? 'border-gray-400' : 'border-amber-600'} animate-slide-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md ${i === 0 ? 'bg-gradient-to-br from-gold to-gold-dark text-primary' : 'bg-gradient-to-br from-primary to-primary-light text-gold'}`}>#{m.rank}</div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">{m.tutor_name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-32 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all duration-1000" style={{ width: `${m.match_score}%` }} />
                          </div>
                          <span className="font-extrabold text-primary text-lg">{m.match_score}%</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/tutor/profile/${m.tutor_id}`} className="btn-primary text-sm whitespace-nowrap shrink-0">View Profile</Link>
                  </div>
                  <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 leading-relaxed">{m.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4 text-gray-300">🔍</div>
              <p className="text-xl text-gray-600 font-medium">No matches found</p>
              <p className="text-gray-400 mt-2">Try posting a different requirement or check back later.</p>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button onClick={runMatch} className="btn-gold inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Re-run AI Match
            </button>
            <Link to="/parent/dashboard" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
