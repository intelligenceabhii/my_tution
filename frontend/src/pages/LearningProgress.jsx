import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function LearningProgress() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDoubt, setShowDoubt] = useState(false)
  const [doubtSubject, setDoubtSubject] = useState('')
  const [doubtQuestion, setDoubtQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [doubtResult, setDoubtResult] = useState(null)
  const [doubtHistory, setDoubtHistory] = useState([])
  const [activeTab, setActiveTab] = useState('sessions')

  useEffect(() => {
    if (!user) return
    Promise.all([
      API.get('/sessions').catch(() => ({ data: [] })),
      API.get('/sessions/recent-context').catch(() => ({ data: null })),
      API.get('/doubt-history').catch(() => ({ data: [] })),
    ]).then(([sRes, cRes, dRes]) => {
      setSessions(sRes.data || [])
      setContext(cRes.data || null)
      setDoubtHistory(dRes.data || [])
    }).finally(() => setLoading(false))
  }, [user])

  const handleAskDoubt = async () => {
    if (!doubtQuestion.trim()) return
    setAsking(true)
    setDoubtResult(null)
    try {
      const reqId = sessions[0]?.requirement_id
      if (!reqId) { alert('No active learning requirement found'); return }
      const res = await API.post('/doubt', {
        requirement_id: reqId,
        question: doubtQuestion,
        subject: doubtSubject || undefined,
      })
      setDoubtResult(res.data)
      setDoubtHistory((prev) => [res.data, ...prev])
      setDoubtQuestion('')
    } catch (err) { alert(err.response?.data?.detail || 'Failed to get answer') }
    finally { setAsking(false) }
  }

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Learning Progress</h1>
        </div>

        {context && (
          <div className="bg-white premium-shadow rounded-2xl p-5 border border-gray-100 mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-500">Class: <strong className="text-primary">{context.child_class}</strong></span>
              <span className="text-gray-500">Board: <strong className="text-primary">{context.board}</strong></span>
              <span className="text-gray-500">Subjects: <strong className="text-primary">{(context.subjects || []).join(', ')}</strong></span>
              {context.recent_topics?.length > 0 && (
                <span className="text-gray-500">Recent topics: <strong className="text-primary">{context.recent_topics.slice(0, 5).join(', ')}</strong></span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['sessions', 'doubt', 'history'].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowDoubt(tab === 'doubt') }} className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200 shadow-sm'}`}>
              {tab === 'sessions' ? '📖 Sessions' : tab === 'doubt' ? '❓ Ask MeritAI' : '📜 Doubt History'}
            </button>
          ))}
        </div>

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white premium-shadow rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-5xl mb-4 text-gray-300">📚</div>
                <p className="text-gray-500 font-medium">No sessions logged yet</p>
                <p className="text-gray-400 text-sm mt-1">Your tutor will log sessions after each class</p>
              </div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="bg-white premium-shadow rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-sm font-bold text-primary">{s.subject}</span>
                        <span className="text-xs text-gray-400">by {s.tutor_name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} {s.duration_minutes ? `· ${s.duration_minutes} min` : ''}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(s.topics_covered || []).map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-medium">{t}</span>
                    ))}
                  </div>
                  {s.notes && <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{s.notes}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'doubt' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white premium-shadow rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-primary mb-2">Ask <span className="text-meritai">MeritAI</span></h2>
              <p className="text-sm text-gray-500 mb-5">MeritAI knows what you're learning — just ask!</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject (optional)</label>
                  <input type="text" value={doubtSubject} onChange={(e) => setDoubtSubject(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Question</label>
                  <textarea rows={4} value={doubtQuestion} onChange={(e) => setDoubtQuestion(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm resize-none" placeholder="Ask anything about what you're learning..." />
                </div>
                <button onClick={handleAskDoubt} disabled={asking || !doubtQuestion.trim()} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm disabled:opacity-50 inline-flex items-center gap-2">
                  {asking ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Asking...</>
                  ) : 'Ask MeritAI'}
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {doubtResult ? (
                <div className="bg-white premium-shadow rounded-2xl p-6 border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">M</div>
                    <span className="font-bold text-sm text-meritai">MeritAI</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Q: {doubtResult.question}</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{doubtResult.answer}</p>
                  {doubtResult.context_topics?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Context used from recent sessions:</p>
                      <div className="flex flex-wrap gap-1">
                        {doubtResult.context_topics.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white premium-shadow rounded-2xl p-8 text-center border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <p className="text-gray-500 text-sm">Ask a question and MeritAI will answer</p>
                  <p className="text-gray-400 text-xs mt-1">It knows your class, board, and what topics you've covered</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {doubtHistory.length === 0 ? (
              <div className="bg-white premium-shadow rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-5xl mb-4 text-gray-300">💭</div>
                <p className="text-gray-500 font-medium">No questions asked yet</p>
                <p className="text-gray-400 text-sm mt-1">Ask MeritAI a doubt and it'll appear here</p>
              </div>
            ) : (
              doubtHistory.map((d) => (
                <div key={d.id} className="bg-white premium-shadow rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">Q</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{d.question}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(d.created_at)}</p>
                    </div>
                  </div>
                  <div className="ml-11">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-cyan-500 rounded flex items-center justify-center text-white text-[8px] font-bold">M</div>
                      <span className="text-xs font-bold text-meritai">MeritAI</span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{d.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
