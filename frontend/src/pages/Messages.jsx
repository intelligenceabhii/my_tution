import { useState, useEffect, useCallback } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
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

export default function Messages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [reading, setReading] = useState(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await API.get('/messages/')
      const data = Array.isArray(res.data) ? res.data : res.data?.messages || []
      setMessages(data)
    } catch { setMessages([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (user) fetchMessages() }, [user, fetchMessages])

  const markAsRead = async (id) => {
    setReading(id)
    try {
      await API.put('/messages/' + id + '/read')
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)))
    } catch {}
    finally { setReading(null) }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-primary mb-8">Messages</h1>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary border-t-gold rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5l-1 1V5a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-primary">Messages</h1>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white premium-shadow rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4 text-gray-300">💬</div>
          <p className="text-xl text-gray-600 font-medium">No messages yet</p>
          <p className="text-sm text-gray-400 mt-2">When you connect with a tutor, your messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white premium-shadow rounded-xl overflow-hidden border border-gray-100 transition hover:shadow-lg">
              <button onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className="w-full text-left p-4 flex items-start gap-3">
                <div className="shrink-0 mt-1">
                  {!msg.is_read ? (
                    <span className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full block shadow-sm" />
                  ) : (
                    <span className="w-3 h-3 text-green-400 block"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-primary text-sm truncate">{msg.sender_name || 'Unknown'}</span>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(msg.created_at || msg.timestamp)}</span>
                  </div>
                  <p className={`text-sm mt-0.5 text-gray-600 ${expandedId === msg.id ? '' : 'truncate'}`}>
                    {expandedId === msg.id ? msg.message || msg.content : (msg.message || msg.content || '').substring(0, 60)}
                  </p>
                  {expandedId === msg.id && !msg.is_read && (
                    <div className="mt-3">
                      <button onClick={(e) => { e.stopPropagation(); markAsRead(msg.id) }} disabled={reading === msg.id} className="bg-gradient-to-r from-primary to-primary-light text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:shadow-md transition disabled:opacity-50">
                        {reading === msg.id ? 'Marking...' : 'Mark as read'}
                      </button>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
