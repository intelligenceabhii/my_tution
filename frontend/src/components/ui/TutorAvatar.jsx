import { useState } from 'react'

export default function TutorAvatar({ tutor, className = '' }) {
  const [failed, setFailed] = useState(null)
  const photo = tutor.photo_path ? `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}${tutor.photo_path}` : ''
  return <div className={`overflow-hidden bg-primary text-white rounded-full flex items-center justify-center shrink-0 ${className}`}>
    {photo && failed !== photo ? <img className="h-full w-full object-cover" src={photo} alt={tutor.full_name} onError={() => setFailed(photo)}/> : <span aria-label={tutor.full_name}>{tutor.full_name?.[0] || 'T'}</span>}
  </div>
}
