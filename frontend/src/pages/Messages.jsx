import { useState, useEffect, useCallback, useRef } from 'react'
import API from '../api/axios'
import { useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '../api/errors'
import { serverDate } from '../utils/dates'
import { useAuth } from '../context/AuthContext'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = serverDate(dateStr)
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

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = serverDate(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConvo, setActiveConvo] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [composeEmail, setComposeEmail] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeMessage, setComposeMessage] = useState('')
  const [composing, setComposing] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const chatEnd = useRef(null)
  const activeRef = useRef(null)
  const requestVersion = useRef(0)
  const sendLock = useRef(false)
  const searchVersion = useRef(0)
  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [error, setError] = useState('')
  const [listError, setListError] = useState('')
  const [threadLoading, setThreadLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const fetchConversations = useCallback(async () => {
    try {
      const res = await API.get('/conversations')
      setConversations(res.data || [])
      setListError('')
    } catch (err) { setListError(apiErrorMessage(err, 'Could not load conversations. Please retry.')) }
    finally { setLoading(false) }
  }, [])

  const loadMessages = useCallback(async (convoId) => {
    const version = ++requestVersion.current
    try {
      const res = await API.get(`/conversations/${convoId}/messages`)
      if (activeRef.current !== convoId || version !== requestVersion.current) return
      setMessages(res.data || [])
      if (res.data.some(m => m.receiver_id === user.id && !m.is_read)) {
        await API.put(`/conversations/${convoId}/read`)
        setConversations(prev => prev.map(c => c.id === convoId ? { ...c, unread_count: 0 } : c))
        window.dispatchEvent(new Event('messages-read'))
      }
    } catch (err) {
      if (activeRef.current === convoId && version === requestVersion.current) setError(apiErrorMessage(err, 'Could not load this conversation. Please retry.'))
    } finally {
      if (activeRef.current === convoId && version === requestVersion.current) setThreadLoading(false)
    }
  }, [user.id])

  const openConversation = useCallback(async (convoId) => {
    activeRef.current = convoId
    setActiveConvo(convoId)
    setShowCompose(false)
    setMessages([])
    setNewMsg('')
    setError('')
    setThreadLoading(true)
    await loadMessages(convoId)
  }, [loadMessages])

  useEffect(() => {
    const requested = Number(searchParams.get('conversation'))
    if (requested > 0) openConversation(requested)
  }, [searchParams, openConversation])

  useEffect(() => {
    fetchConversations()
    const refresh = () => {
      if (document.visibilityState === 'hidden') return
      fetchConversations()
      if (activeRef.current && !sendLock.current) loadMessages(activeRef.current)
    }
    const timer = setInterval(refresh, 4000)
    window.addEventListener('focus', refresh)
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); requestVersion.current++ }
  }, [fetchConversations, loadMessages])

  const lastMessageId = messages[messages.length - 1]?.id
  useEffect(() => {
    const container = chatEnd.current?.parentElement
    container?.scrollTo({ top: container.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [lastMessageId, activeConvo])

  const handleSend = async () => {
    if (!newMsg.trim() || !activeRef.current || sendLock.current) return
    const convoId = activeRef.current
    sendLock.current = true
    requestVersion.current++
    setSending(true)
    setError('')
    try {
      const res = await API.post(`/conversations/${convoId}/messages`, { conversation_id: convoId, message: newMsg.trim() })
      if (activeRef.current === convoId) {
        setMessages(prev => [...prev.filter(m => m.id !== res.data.id), res.data])
        setNewMsg('')
      }
      await fetchConversations()
    } catch (err) { setError(apiErrorMessage(err, 'Failed to send. Your draft has been kept.')) }
    finally { sendLock.current = false; setSending(false) }
  }

  const searchUsers = async (q) => {
    const version = ++searchVersion.current
    if (!q.trim()) { setSearchResults([]); setSearching(false); return }
    setSearching(true)
    try {
      const res = await API.get('/users/search', { params: { q: q.trim() } })
      if (version === searchVersion.current) setSearchResults(res.data || [])
    } catch (err) {
      if (version === searchVersion.current) { setSearchResults([]); setError(apiErrorMessage(err, 'User search failed. Please retry.')) }
    } finally { if (version === searchVersion.current) setSearching(false) }
  }

  const startConversation = async () => {
    if (composing) return
    setComposing(true)
    setError('')
    try {
      let id = selectedRecipient?.id
      if (!id) {
        const { data } = await API.get('/users/search', { params: { q: composeEmail.trim() } })
        const exact = data.find(u => u.email.toLowerCase() === composeEmail.trim().toLowerCase())
        if (!exact) { setError('Select a recipient from the search results or enter their complete email address.'); return }
        id = exact.id
      }
      const { data } = await API.post('/conversations', { receiver_id: id, subject: composeSubject || undefined })
      if (composeMessage.trim()) await API.post(`/conversations/${data.id}/messages`, { conversation_id: data.id, message: composeMessage.trim() })
      await fetchConversations()
      await openConversation(data.id)
      setComposeEmail(''); setComposeSubject(''); setComposeMessage(''); setSearchResults([]); setSelectedRecipient(null)
    } catch (err) { setError(apiErrorMessage(err, 'Failed to start conversation. Your draft has been kept.')) }
    finally { setComposing(false) }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); handleSend() }
  }

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[90vh] bg-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5l-1 1V5a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h1 className="text-2xl font-semibold text-primary">Messages</h1>
        </div>

        {(error || listError) && <div role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error || listError} <button className="underline" onClick={() => { setError(''); fetchConversations(); if(activeRef.current) loadMessages(activeRef.current) }}>Retry</button></div>}
        <div className="flex-1 flex gap-4 min-h-0 min-w-0">
          <div className={`${activeConvo || showCompose ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 bg-white premium-shadow rounded-2xl border border-gray-100 flex-col overflow-hidden`}>
            <div className="p-3 border-b border-gray-100">
              <button onClick={() => { setShowCompose(!showCompose); activeRef.current = null; requestVersion.current++; setActiveConvo(null); setError(''); setMessages([]) }} className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition">
                + New Conversation
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-4xl mb-3 text-gray-300">💬</div>
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map((c) => (
                  <button key={c.id} onClick={() => openConversation(c.id)} className={`w-full text-left p-4 border-b border-gray-50 hover:bg-primary/[0.02] transition flex items-start gap-3 ${activeConvo === c.id ? 'bg-primary/[0.04]' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 bg-gradient-to-br ${c.unread_count > 0 ? 'from-primary to-primary-light' : 'from-gray-400 to-gray-300'}`}>
                      {c.other_user_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${c.unread_count > 0 ? 'font-semibold text-primary' : 'font-medium text-gray-700'}`}>{c.other_user_name || 'Unknown'}</span>
                        <span className="text-xs text-gray-400 shrink-0">{timeAgo(c.last_message_at)}</span>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${c.unread_count > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{c.last_message || 'No messages yet'}</p>
                      {c.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-semibold rounded-full mt-1">{c.unread_count}</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`${activeConvo || showCompose ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 bg-white premium-shadow rounded-2xl border border-gray-100 flex-col overflow-hidden`}>
            <div className="md:hidden p-3 border-b border-gray-100 shrink-0">
              <button type="button" onClick={() => { activeRef.current = null; requestVersion.current++; setActiveConvo(null); setError(''); setShowCompose(false); setMessages([]) }} className="text-sm font-semibold text-primary py-1">
                ← Back to conversations
              </button>
            </div>
            {showCompose ? (
              <div className="p-6 overflow-y-auto">
                <h2 className="text-lg font-semibold text-primary mb-4">New Conversation</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="messages-field-0" className="block text-sm font-medium text-gray-700 mb-1.5">Search user by email</label>
                    <input id="messages-field-0" type="text" value={composeEmail} onChange={(e) => { setComposeEmail(e.target.value); setSelectedRecipient(null); searchUsers(e.target.value) }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" aria-label="Type email to search..." placeholder="Type email to search..." />
                    {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                    {searchResults.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                        {searchResults.map((u) => (
                          <button key={u.id} disabled={composing} onClick={() => { searchVersion.current++; setSearching(false); setComposeEmail(u.email); setSelectedRecipient(u); setSearchResults([]) }} className="w-full text-left px-4 py-2.5 hover:bg-primary/[0.03] text-sm text-gray-700 border-b border-gray-50 last:border-0 transition">{u.email} <span className="text-gray-400 text-xs capitalize">({u.role})</span></button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="messages-field-1" className="block text-sm font-medium text-gray-700 mb-1.5">Subject (optional)</label>
                    <input id="messages-field-1" type="text" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" placeholder="What's this about?" />
                  </div>
                  <div>
                    <label htmlFor="messages-field-2" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea id="messages-field-2" rows={4} value={composeMessage} onChange={(e) => setComposeMessage(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm resize-none" aria-label="Write your message..." placeholder="Write your message..." />
                  </div>
                  <button onClick={() => { if (composeEmail) startConversation() }} disabled={composing || !composeEmail} className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition text-sm disabled:opacity-50">{composing ? 'Starting...' : 'Start Conversation'}</button>
                </div>
              </div>
            ) : activeConvo ? (
              <>
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {conversations.find((c) => c.id === activeConvo)?.other_user_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">{conversations.find((c) => c.id === activeConvo)?.other_user_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{messages.length} messages</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                  {threadLoading ? <p role="status" className="text-gray-500 text-sm">Loading conversation…</p> : messages.length === 0 ? (
                    <div className="text-center py-12"><p className="text-gray-400 text-sm">No messages yet. Send the first one!</p></div>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] min-w-0 p-3 rounded-2xl ${m.sender_id === user.id ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-[10px] ${m.sender_id === user.id ? 'text-white/70' : 'text-gray-400'}`}>{formatDate(m.created_at)}</span>
                            {m.sender_id === user.id && (
                              <svg className={`w-3 h-3 ${m.is_read ? 'text-blue-300' : 'text-white/50'}`} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEnd} />
                </div>
                <div className="p-4 border-t border-gray-100 shrink-0">
                  <div className="flex gap-3">
                    <input type="text" disabled={sending || threadLoading} value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={handleKeyDown} className="min-w-0 flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" aria-label="Type a message..." placeholder="Type a message..." />
                    <button onClick={handleSend} disabled={sending || threadLoading || !newMsg.trim()} className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm">{sending ? 'Sending...' : 'Send'}</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium">Select a conversation</p>
                  <p className="text-gray-400 text-sm mt-1">or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
