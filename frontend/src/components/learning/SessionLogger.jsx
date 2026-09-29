import { useEffect, useState } from 'react'
import API from '../../api/axios'
import { apiErrorMessage } from '../../api/errors'

export default function SessionLogger({ onSaved }) {
  const [requirements, setRequirements] = useState([])
  const [form, setForm] = useState({ requirement_id: '', subject: '', topics: '', notes: '', duration_minutes: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    API.get('/tutor/my-accepted-requirements').then(({ data }) => {
      setRequirements(data)
      if (data.length) setForm(f => ({ ...f, requirement_id: String(data[0].id), subject: data[0].subjects_needed[0] || '' }))
    }).catch(err => setError(apiErrorMessage(err, 'Could not load accepted requirements.')))
  }, [])
  async function submit(e) {
    e.preventDefault(); if (busy) return
    setBusy(true); setError(''); setSaved(false)
    try {
      const { data } = await API.post('/sessions', { requirement_id: Number(form.requirement_id), subject: form.subject, topics_covered: form.topics.split(',').map(t => t.trim()).filter(Boolean), notes: form.notes || null, duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null })
      onSaved(data); setSaved(true); setForm(f => ({ ...f, topics: '', notes: '', duration_minutes: '' }))
    } catch (err) { setError(apiErrorMessage(err, 'Could not save session. Please retry.')) }
    finally { setBusy(false) }
  }
  return <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
    <h2 className="text-lg font-semibold text-primary mb-3">Log a learning session</h2>
    {error && <p role="alert" className="text-red-700 mb-3">{error}</p>}
    {saved && <p role="status" className="text-green-700 mb-3">Session saved. The parent can now see it.</p>}
    {requirements.length ? <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <label className="text-sm">Learning requirement<select className="input-field mt-1" value={form.requirement_id} onChange={e => { const r = requirements.find(r => r.id === Number(e.target.value)); setForm({ ...form, requirement_id: e.target.value, subject: r.subjects_needed[0] || '' }) }}>{requirements.map(r => <option key={r.id} value={r.id}>Class {r.child_class} · {r.parent_email}</option>)}</select></label>
      <label className="text-sm">Session subject<input required className="input-field mt-1" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}/></label>
      <label className="text-sm">Topics covered (comma separated)<input required className="input-field mt-1" value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })}/></label>
      <label className="text-sm">Duration in minutes<input type="number" min="1" step="1" className="input-field mt-1" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })}/></label>
      <label className="text-sm sm:col-span-2">Session notes<textarea className="input-field mt-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/></label>
      <button className="btn-primary justify-self-start" disabled={busy}>{busy ? 'Saving…' : 'Save session'}</button>
    </form> : !error && <p className="text-sm text-gray-600">A parent must accept your application before you can log their sessions.</p>}
  </section>
}
