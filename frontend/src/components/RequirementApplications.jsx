import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { apiErrorMessage } from '../api/errors'

export default function RequirementApplications({ requirement, onClosed }) {
  const [open, setOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function load() {
    setBusy(true); setError('')
    try { setApplications((await API.get(`/parents/requirements/${requirement.id}/applications`)).data) }
    catch (err) { setError(apiErrorMessage(err, 'Could not load applications. Please retry.')) }
    finally { setBusy(false) }
  }
  async function update(id, status) {
    setBusy(true); setError('')
    try { await API.put(`/applications/${id}/status`, { status }); await load() }
    catch (err) { setError(apiErrorMessage(err, 'Could not update application.')) }
    finally { setBusy(false) }
  }
  async function close() {
    if (!window.confirm('Close this requirement to stop new applications?')) return
    setBusy(true); setError('')
    try { await API.put(`/parents/requirements/${requirement.id}/close`); onClosed() }
    catch (err) { setError(apiErrorMessage(err, 'Could not close requirement.')) }
    finally { setBusy(false) }
  }
  return <div className="mt-4 border-t border-gray-100 pt-4">
    <div className="flex flex-wrap gap-3">
      <button className="btn-outline text-sm" disabled={busy} aria-expanded={open} onClick={() => { setOpen(!open); if (!open) load() }}>Applications</button>
      {requirement.status === 'open' && <button className="text-sm text-gray-600 underline" disabled={busy} onClick={close}>Close requirement</button>}
    </div>
    {error && <p role="alert" className="text-red-700 text-sm mt-3">{error}</p>}
    {open && <div className="mt-4 space-y-3">
      {busy ? <p role="status">Loading applications…</p> : <>
        <button className="text-sm text-primary underline" onClick={load}>Refresh applications</button>
        {!error && !applications.length && <p className="text-sm text-gray-500">No applications yet.</p>}
        {applications.map(a => <div key={a.id} className="rounded-xl bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div><Link className="text-primary underline" to={`/tutor/profile/${a.tutor_id}`}>{a.tutor_name}</Link><p className="text-sm text-gray-600">{a.cover_note}</p><span className="text-xs capitalize">{a.status}</span></div>
          {a.status === 'pending' && <div className="flex gap-2"><button className="btn-primary text-sm" onClick={() => update(a.id, 'accepted')}>Accept</button><button className="btn-outline text-sm" onClick={() => update(a.id, 'rejected')}>Reject</button></div>}
        </div>)}
      </>}
    </div>}
  </div>
}
