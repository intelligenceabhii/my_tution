import { useState } from 'react'
import API from '../api/axios'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await API.post('/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">Contact</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Get in <span className="text-gold">Touch</span></h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Have a question, suggestion, or feedback? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-white premium-shadow rounded-2xl p-8 animate-slide-up">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="text-primary font-semibold hover:underline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 resize-none" placeholder="Tell us more..." />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed">{sending ? 'Sending...' : 'Send Message'}</button>
              </form>
            )}
          </div>

          <div className="space-y-6 animate-slide-up">
            <div className="bg-white premium-shadow rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/[0.08] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-primary">Email</h3>
                <p className="text-gray-600 text-sm mt-0.5">abhii.intelligence@gmail.com</p>
                <p className="text-gray-400 text-xs mt-0.5">We respond within 24 hours</p>
              </div>
            </div>
            <div className="bg-white premium-shadow rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/[0.08] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-primary">Phone</h3>
                <p className="text-gray-600 text-sm mt-0.5">+91 79790 37065</p>
                <p className="text-gray-400 text-xs mt-0.5">Mon-Sat, 9 AM - 7 PM</p>
              </div>
            </div>
            <div className="bg-white premium-shadow rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/[0.08] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-primary">Location</h3>
                <p className="text-gray-600 text-sm mt-0.5">Ranchi, Jharkhand, India</p>
                <p className="text-gray-400 text-xs mt-0.5">Serving across Jharkhand</p>
              </div>
            </div>
            <div className="bg-white premium-shadow rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/[0.08] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-primary">Social</h3>
                <div className="flex gap-3 mt-1.5">
                  <a href="https://www.instagram.com/merit_yard/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition text-sm">Instagram</a>
                  <a href="https://www.youtube.com/@merit_yard" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition text-sm">YouTube</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
