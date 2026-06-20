import { useState } from 'react'

const faqs = [
  { q: 'How do I find a tutor?', a: 'Go to Find Tutors, apply filters like subject, class, budget, and location, and browse verified tutor profiles. You can send a request directly from their profile.' },
  { q: 'How do I become a tutor?', a: 'Sign up with the "Become a Tutor" option, complete your profile with qualifications and experience, upload certificates, and submit for verification.' },
  { q: 'What is the verification process for tutors?', a: 'We verify educational qualifications, identity documents, teaching experience, and conduct a demo session. Only 1 in 5 applicants are approved.' },
  { q: 'How does MeritAI matching work?', a: 'MeritAI analyzes your requirements — subject, class, budget, learning style — and recommends the top 3 most suitable tutors from our verified pool.' },
  { q: 'Can I switch tutors?', a: 'Yes, you can request a different tutor anytime. Simply raise a request from your dashboard, and we\'ll help find a better match.' },
  { q: 'How do I contact support?', a: 'You can email us, call us, or fill out the contact form. We typically respond within 24 hours during business days.' },
]

export default function Support() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">Support</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">How can we <span className="text-gold">help</span>?</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Find answers to common questions or reach out to our support team.</p>
        </div>

        <div className="bg-white premium-shadow rounded-2xl p-8 md:p-12 mb-10 animate-slide-up">
          <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition">
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/[0.03] to-gold/[0.03] rounded-2xl p-8 md:p-12 text-center animate-slide-up">
          <h2 className="text-2xl font-bold text-primary mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Our support team is available Monday to Saturday, 9 AM to 7 PM.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:abhii.intelligence@gmail.com" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Us
            </a>
            <a href="tel:+917979037065" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:shadow-md hover:scale-[1.02] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
