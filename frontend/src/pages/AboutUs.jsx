import { Link } from 'react-router-dom'

const team = [
  { name: 'Abhishek', role: 'Founder & CEO', initials: 'A', color: 'from-primary to-primary-light' },
  { name: 'Priya Sharma', role: 'Head of Academics', initials: 'PS', color: 'from-pink-500 to-rose-500' },
  { name: 'Amit Verma', role: 'CTO', initials: 'AV', color: 'from-blue-500 to-cyan-500' },
  { name: 'Sunita Gupta', role: 'Tutor Relations', initials: 'SG', color: 'from-purple-500 to-indigo-500' },
]

const milestones = [
  { year: '2023', title: 'The Beginning', desc: 'MY Tuition was founded with a vision to transform education in Jharkhand.' },
  { year: '2024', title: '500+ Tutors', desc: 'Crossed 500 verified tutors and 1000+ happy students across the state.' },
  { year: '2025', title: 'AI Integration', desc: 'Launched MyAI smart matching engine for personalized tutor recommendations.' },
  { year: '2026', title: 'Expanding Horizons', desc: 'Now serving 10+ cities with plans to expand pan-India.' },
]

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">About Us</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Empowering Education in <span className="text-gold">Jharkhand</span></h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We connect parents with the best verified tutors, making quality education accessible to every child — from Nursery to Class 12 and beyond.</p>
        </div>

        <div className="bg-white premium-shadow rounded-2xl p-8 md:p-12 mb-12 animate-slide-up">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">At MY Tuition, we believe every child deserves access to quality education. Founded in Jharkhand, we are on a mission to bridge the gap between parents seeking the best tutors and qualified educators looking to make a difference.</p>
          <p className="text-gray-600 leading-relaxed mb-6">Our AI-powered platform, MyAI, analyzes each student's unique needs — learning style, syllabus (JAC, CBSE, ICSE), budget, and goals — to recommend the perfect tutor. We combine technology with a human touch to ensure every match is a success.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { value: '500+', label: 'Verified Tutors' },
              { value: '1000+', label: 'Happy Students' },
              { value: '50+', label: 'Subjects' },
              { value: '4.9', label: 'Avg Rating' },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 bg-blue-50/50 rounded-xl">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 animate-slide-up">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-gold/20 to-primary/20 hidden md:block" />
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative flex items-center gap-8 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block flex-1" />
                <div className="hidden md:flex w-10 h-10 bg-white border-2 border-primary/20 rounded-full items-center justify-center shrink-0 z-10 shadow-md">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
                <div className="flex-1 bg-white premium-shadow rounded-xl p-6">
                  <span className="text-xs font-bold text-gold">{m.year}</span>
                  <h3 className="text-lg font-bold text-primary mt-1">{m.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="bg-white premium-shadow rounded-xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${t.color} text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-md`}>
                  {t.initials}
                </div>
                <h3 className="font-bold text-primary text-sm">{t.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all">
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
