import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const stats = [
  { value: '500+', label: 'Verified Tutors', suffix: '+' },
  { value: '1000+', label: 'Happy Students', suffix: '+' },
  { value: '50+', label: 'Subjects Offered', suffix: '+' },
  { value: '4.9', label: 'Avg. Rating', suffix: '' },
]

const howItWorks = [
  { step: '01', title: 'Register & Set Your Goals', desc: 'Sign up in under 60 seconds. Tell us what your child needs to learn, their class, and preferences.', icon: 'edit' },
  { step: '02', title: 'Get MeritAI Matched', desc: 'Our smart MeritAI engine finds the best tutors matching your child\'s learning style, budget, and goals.', icon: 'sparkles' },
  { step: '03', title: 'Start Learning', desc: 'Review profiles, book a free demo, and start 1-on-1 learning with your perfect tutor.', icon: 'play' },
]

const myAIFeatures = [
  { title: 'Smart Tutor Matching', desc: 'MeritAI analyzes your child\'s requirements, learning style, and goals to recommend the top 3 perfect tutors.', metric: '98%', metricLabel: 'Match Accuracy', icon: 'brain' },
  { title: 'Instant Session Insights', desc: 'Automated recaps with key takeaways and focused review points after every session.', metric: '3x', metricLabel: 'Faster Review', icon: 'insight' },
  { title: 'Predictive Progress Tracking', desc: 'MeritAI-powered predictions on exam readiness with adaptive practice quizzes aligned to JAC, CBSE & ICSE.', metric: '96%', metricLabel: 'Prediction Accuracy', icon: 'chart' },
  { title: 'Real-time Doubt Resolution', desc: 'Ask any question anytime and get instant, contextual answers powered by MeritAI — learning never stops.', metric: '24/7', metricLabel: 'Available', icon: 'help' },
]

const subjectCategories = [
  { name: 'Academic', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Sanskrit', 'History', 'Geography', 'Political Science', 'Economics', 'Accountancy'] },
  { name: 'Coding & AI', subjects: ['Python', 'Web Development', 'AI & ML', 'C++', 'Java', 'Data Structures', 'Robotics', 'App Development'] },
  { name: 'Languages', subjects: ['English Speaking', 'Hindi Grammar', 'Sanskrit', 'French', 'German', 'Spoken English', 'Communication Skills'] },
  { name: 'Music & Dance', subjects: ['Guitar', 'Piano', 'Vocal Music', 'Tabla', 'Classical Dance', 'Western Dance', 'Art & Sketching'] },
  { name: 'Exams', subjects: ['JEE Main', 'JEE Advanced', 'NEET', 'CLAT', 'NDA', 'SSC', 'Banking', 'UPSC'] },
]

const testimonials = [
  { quote: 'MyTuition helped us find an amazing Maths tutor for my son in just 2 days. The MeritAI matching is incredible!', author: 'Priya Sharma', location: 'Ranchi', rating: 5, initials: 'PS', color: 'from-pink-500 to-rose-500' },
  { quote: 'My daughter improved her Chemistry grades from C to A+ in just 3 months. Highly recommend!', author: 'Amit Verma', location: 'Jamshedpur', rating: 5, initials: 'AV', color: 'from-blue-500 to-cyan-500' },
  { quote: 'The tutors are highly qualified and very patient. Great platform for parents in Jharkhand.', author: 'Sunita Gupta', location: 'Bokaro', rating: 5, initials: 'SG', color: 'from-purple-500 to-indigo-500' },
  { quote: 'Found the perfect Physics tutor for NEET preparation. My son\'s confidence has improved drastically.', author: 'Rajesh Kumar', location: 'Dhanbad', rating: 5, initials: 'RK', color: 'from-orange-500 to-red-500' },
  { quote: 'Very happy with the platform. Easy to use, great tutors, and the MeritAI match was spot on!', author: 'Meera Singh', location: 'Ranchi', rating: 4, initials: 'MS', color: 'from-green-500 to-emerald-500' },
  { quote: 'MY Tuition made it so simple to find a tutor for my child. The whole process took just one day.', author: 'Vikram Pandey', location: 'Hazaribagh', rating: 5, initials: 'VP', color: 'from-teal-500 to-cyan-500' },
]

const faqs = [
  { q: 'What subjects do you cover?', a: 'We cover over 50 subjects across Academics (Maths, Science, English, etc.), Coding & AI, Languages, Music & Dance, and competitive exams like JEE, NEET, CLAT. If you don\'t see your subject, just ask us!' },
  { q: 'How are tutors verified?', a: 'Every tutor on MY Tuition goes through a rigorous verification process — background check, qualification verification, and a teaching demo. Only 1 in 5 applicants make it through.' },
  { q: 'What is MeritAI matching?', a: 'MeritAI is our intelligent matching engine that analyzes your child\'s specific needs — class, subjects, learning style, budget, and location — to recommend the top 3 most suitable tutors. It\'s like having a personal education counselor.' },
  { q: 'Can I try a tutor before committing?', a: 'Yes! Many of our tutors offer a free demo class. You can try the session, see if it\'s a good fit, and then decide. No commitment needed.' },
  { q: 'How do I become a tutor?', a: 'Simply sign up as a tutor, complete your profile with qualifications and experience, upload your certificates, and once approved by our team, you can start receiving student requests.' },
  { q: 'What is the pricing?', a: 'Pricing varies by tutor and is set by them based on their experience and qualifications. You can filter by budget and compare profiles to find the best fit for your needs.' },
]

const trustBadges = [
  { name: 'Merit Yard', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMTBBQjYwIi8+PHRleHQgeD0iOCIgeT0iMjYiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+U0k8L3RleHQ+PC9zdmc+' },
]

const facedAvatars = [
  { initials: 'PS', color: 'from-pink-500 to-rose-500' },
  { initials: 'AV', color: 'from-blue-500 to-cyan-500' },
  { initials: 'SG', color: 'from-purple-500 to-indigo-500' },
  { initials: 'RK', color: 'from-orange-500 to-red-500' },
  { initials: 'MS', color: 'from-green-500 to-emerald-500' },
]

function AnimatedCounter({ value, suffix = '+', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const numeric = parseInt(value)
    if (isNaN(numeric)) { setCount(value); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        let start = 0
        const step = Math.ceil(numeric / (duration / 16))
        const timer = setInterval(() => {
          start += step
          if (start >= numeric) { setCount(numeric); clearInterval(timer) }
          else setCount(start)
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{typeof count === 'number' ? count + suffix : count}</span>
}

function StarRating({ rating, size = 'sm' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-soft">
      <button onClick={onClick} className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50/50 transition-all duration-200">
        <span className="font-semibold text-primary text-sm md:text-base pr-4">{q}</span>
        <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`faq-answer ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

function HowItWorksStep({ item, idx, activeStep, setActiveStep }) {
  const icons = {
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    sparkles: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></>,
    play: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />,
  }

  return (
    <div className="relative flex items-start gap-5 group cursor-pointer" onClick={() => setActiveStep(idx)}>
      <div className="relative flex flex-col items-center">
        <div className={`step-number ${activeStep >= idx ? 'bg-gradient-to-br from-primary to-primary-light text-gold' : 'bg-gray-100 text-gray-400'} transition-all duration-500`}>
          {idx + 1}
        </div>
        {idx < 2 && <div className="w-0.5 h-16 bg-gradient-to-b from-primary/20 to-transparent" />}
      </div>
      <div className={`flex-1 pt-1.5 pb-8 ${activeStep >= idx ? 'opacity-100' : 'opacity-50'}`}>
        <h3 className={`font-bold text-lg mb-1.5 ${activeStep >= idx ? 'text-primary' : 'text-gray-500'}`}>{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        {activeStep === idx && (
          <div className="mt-4 flex gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full animate-progress" style={{ width: `${((idx + 1) / 3) * 100}%` }} />
            </div>
            <span className="text-xs text-primary font-semibold">{Math.round(((idx + 1) / 3) * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SubjectBrowser() {
  const [activeCat, setActiveCat] = useState(0)

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {subjectCategories.map((cat, idx) => (
          <button key={cat.name} onClick={() => setActiveCat(idx)} className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeCat === idx ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}>
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subjectCategories[activeCat].subjects.map((s, i) => (
          <Link key={s} to={`/find-tutors?subject=${encodeURIComponent(s)}`} className="group bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
              {s.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate">{s}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ t, idx }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 premium-shadow-hover transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={t.rating} size="lg" />
        <span className="inline-flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full text-xs text-green-700 font-medium">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
          Verified
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
          {t.initials}
        </div>
        <div>
          <p className="font-semibold text-primary text-sm">{t.author}</p>
          <p className="text-gray-400 text-xs">{t.location}</p>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [categories, setCategories] = useState([])
  const [featuredTutors, setFeaturedTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tutorRes] = await Promise.all([
          API.get('/categories'),
          API.get('/tutors', { params: { sort: 'rating', limit: 4 } }),
        ])
        if (catRes.data?.length) setCategories(catRes.data)
        if (tutorRes.data?.length) setFeaturedTutors(tutorRes.data)
      } catch {} finally { setLoading(false) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % 3), 3500)
    return () => clearInterval(timer)
  }, [])

  const placeholderTutors = [
    { name: 'Ananya Singh', qualification: 'M.Sc. Mathematics, B.Ed', subjects: 'Mathematics, Physics', rating: 4.9, fee: 450 },
    { name: 'Rahul Kumar', qualification: 'Ph.D. Chemistry', subjects: 'Chemistry, Biology', rating: 4.8, fee: 500 },
    { name: 'Priya Verma', qualification: 'M.A. English, B.Ed', subjects: 'English, Hindi', rating: 4.9, fee: 400 },
    { name: 'Vikram Sharma', qualification: 'B.Tech, M.Tech', subjects: 'Physics, Computer Science', rating: 4.7, fee: 550 },
  ]

  const displayTutors = featuredTutors.length ? featuredTutors : placeholderTutors

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-gold/[0.04] to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/[0.03] to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-28 md:pb-36">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">Trusted by 1,000+ parents across Jharkhand</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 animate-slide-up">
              Find the Perfect{' '}
              <span className="text-gradient-gold">Tutor</span>
              <br />
              for Your Child
            </h1>

            <p className="text-lg md:text-xl text-blue-200/90 mb-8 max-w-3xl mx-auto animate-fade-in animate-delay-200 leading-relaxed">
              MY Tuition connects parents in Jharkhand with qualified, verified tutors.
              <br />
              Nursery to Class 12 | NEET, JEE | JAC, CBSE, ICSE | All Subjects
            </p>

            <div className="flex gap-4 justify-center flex-wrap animate-fade-in animate-delay-300">
              <Link to="/find-tutors" className="bg-gradient-to-r from-gold to-gold-dark text-primary px-9 py-4 rounded-xl font-bold text-lg hover:shadow-premium hover:scale-[1.02] transition-all inline-flex items-center gap-2 group shadow-lg shadow-gold/20">
                Find a Tutor
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/register" className="glass text-white px-9 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 group border border-white/20">
                Become a Tutor
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center justify-center gap-6 animate-fade-in animate-delay-500">
              <div className="flex -space-x-3">
                {facedAvatars.map((a, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md animate-bounce-gentle`} style={{ animationDelay: `${i * 0.2}s` }}>
                    {a.initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <StarRating rating={5} />
                  <span className="text-gold font-bold text-sm">4.9</span>
                </div>
                <p className="text-blue-200/80 text-xs">Loved by 1,000+ parents</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex items-center justify-center gap-6 flex-wrap animate-fade-in animate-delay-700">
              <span className="text-blue-300/60 text-xs font-medium uppercase tracking-wider">Recognised By</span>
              {trustBadges.map((b) => (
                <div key={b.name} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5">
                  <img src={b.src} alt={b.name} className="w-6 h-6 rounded" />
                  <span className="text-blue-200/70 text-xs font-medium">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F9FC] to-transparent" />
      </section>

      {/* ── STATS ── */}
      <section className="relative -mt-14 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white premium-shadow rounded-2xl p-8 md:p-10 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold text-gradient-gold">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-gray-500 mt-2 text-sm md:text-base font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── YOUR JOURNEY ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="section-label">Simple Process</span>
              <h2 className="section-title mb-4">Your Learning Journey</h2>
              <p className="section-subtitle">Three simple steps from sign-up to your child's first personalised class.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {howItWorks.map((item, idx) => (
                <HowItWorksStep key={item.step} item={item} idx={idx} activeStep={activeStep} setActiveStep={setActiveStep} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── MeritAI FEATURES ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#F8F9FC] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                MeritAI-Powered
              </span>
              <h2 className="section-title mb-4">Meet <span className="text-meritai">MeritAI</span></h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">Save hours, learn smarter. Intelligent features designed for your child's success.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {myAIFeatures.map((f, idx) => (
                <div key={f.title} className="group bg-white rounded-2xl p-7 border border-gray-100 premium-shadow-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-bl-full -z-0" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.893 13.393l-3.1-3.1a2.25 2.25 0 01-.839-1.444l-.416-3.742a2.25 2.25 0 00-2.63-1.982l-5.13.706a2.25 2.25 0 00-1.49.888l-.416.416a2.25 2.25 0 01-1.772.744l-3.742-.416a2.25 2.25 0 00-2.13 3.432l2.192 3.438a.75.75 0 01.09.528l-.38 2.19a2.25 2.25 0 001.978 2.622l1.885.251a.75.75 0 01.564.476l.68 2.03a2.25 2.25 0 002.63 1.478l2.37-.319a2.25 2.25 0 001.582-1.076l1.135-2.012a.75.75 0 01.79-.36l2.2.414a2.25 2.25 0 002.168-3.206l-1.6-3.13a.75.75 0 01.026-.71z" />}
                          {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />}
                          {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />}
                          {idx === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />}
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl md:text-3xl font-extrabold text-meritai">{f.metric}</div>
                        <div className="text-xs text-gray-500 font-medium">{f.metricLabel}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── SUBJECT BROWSER ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="section-label">Topics</span>
              <h2 className="section-title mb-4">What Can You Learn?</h2>
              <p className="section-subtitle">Real subjects, real tutors — explore what students are learning right now.</p>
            </div>
            <SubjectBrowser />
          </div>
        </section>
      </ScrollReveal>

      {/* ── FEATURED TUTORS ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="section-label">Top Rated</span>
              <h2 className="section-title mb-4">Featured Tutors</h2>
              <p className="section-subtitle">Top-rated tutors ready to help your child excel.</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-gold rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayTutors.map((tutor, idx) => (
                  <div key={tutor.id || idx} className="bg-white rounded-2xl p-6 border border-gray-100 premium-shadow-hover hover:-translate-y-1.5 transition-all duration-300 group text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all">
                      {tutor.name?.charAt(0) || 'T'}
                    </div>
                    <h3 className="font-bold text-primary text-lg">{tutor.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{tutor.qualification}</p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                      <StarRating rating={tutor.rating || 0} />
                      <span className="text-gray-600 text-sm ml-1 font-medium">{tutor.rating}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">{tutor.subjects}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-primary font-bold text-lg">₹{tutor.fee}<span className="text-gray-400 text-sm font-normal">/hr</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <Link to="/find-tutors" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-md hover:shadow-lg group">
                View All Tutors
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── TESTIMONIALS ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="section-label">4.9 / 5 on Google</span>
              <h2 className="section-title mb-4">Real Stories, Real Results</h2>
              <p className="section-subtitle">Verified reviews from parents who found their perfect tutor on MY Tuition.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t, idx) => (
                <TestimonialCard key={idx} t={t} idx={idx} />
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition">
                Show More Reviews
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── BECOME A TUTOR ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
                  <div className="w-40 h-40 lg:w-52 lg:h-52 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <svg className="w-20 h-20 lg:w-24 lg:h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <span className="section-label">Join Us</span>
                <h2 className="section-title mb-4">Become a Tutor</h2>
                <p className="text-gray-500 text-lg mb-6">Earn money sharing your expert knowledge with students. Sign up to start tutoring on MY Tuition.</p>
                <ul className="space-y-3 mb-8">
                  {['Get students directly in your area', 'Flexible teaching hours', 'On-time payments', 'Verified profiles & support'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md group">
                  Become a Tutor
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FAQ ── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="section-label">FAQs</span>
              <h2 className="section-title mb-4">Frequently Asked Questions</h2>
              <p className="section-subtitle">Got questions? We've got answers.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <FaqItem key={idx} q={faq.q} a={faq.a} isOpen={openFaq === idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── CTA ── */}
      <section className="relative bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-gold/[0.03] to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-primary/40 rounded-full" />
            <span className="text-primary/60 text-sm font-medium">Join 1,000+ parents today</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-primary mb-6">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-10 text-lg md:text-xl max-w-2xl mx-auto">Join hundreds of parents in Jharkhand who trust MY Tuition for their child's education. Find your perfect tutor today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/find-tutors" className="bg-gradient-to-r from-primary to-primary-light text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all inline-flex items-center gap-2 group shadow-md">
              Find a Tutor Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all inline-flex items-center gap-2 group border-2 border-primary/20 shadow-sm hover:border-primary/40">
              Register as Tutor
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
