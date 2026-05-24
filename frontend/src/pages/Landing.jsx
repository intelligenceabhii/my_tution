import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

const stats = [
  { value: '500+', label: 'Verified Tutors' },
  { value: '1000+', label: 'Happy Students' },
  { value: '50+', label: 'Subjects Offered' },
  { value: '98%', label: 'Parent Satisfaction' },
]

const howItWorks = [
  { step: '01', title: 'Post Your Requirement', desc: 'Tell us your child\'s class, subjects, and preferences in a simple form.' },
  { step: '02', title: 'Get AI Matched', desc: 'Our smart system connects you with the best tutors matching your needs.' },
  { step: '03', title: 'Start Learning', desc: 'Review profiles, compare, and start learning with your perfect tutor.' },
]

const fallbackCategories = [
  { name: 'Academic', icon: '📚', count: 12 },
  { name: 'Languages', icon: '🌍', count: 8 },
  { name: 'Science & Tech', icon: '🔬', count: 10 },
  { name: 'Arts & Music', icon: '🎨', count: 7 },
  { name: 'Sports & Fitness', icon: '⚽', count: 6 },
  { name: 'Professional Skills', icon: '💼', count: 5 },
  { name: 'Test Preparation', icon: '🎯', count: 4 },
]

const popularSubjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
  'Sanskrit', 'Social Studies', 'Computer Science', 'Accountancy',
  'Economics', 'History', 'Geography', 'Political Science',
]

const testimonials = [
  { quote: 'MyTuition helped us find an amazing Maths tutor for my son in just 2 days. The AI matching is incredible!', author: 'Priya Sharma', location: 'Ranchi', rating: 5 },
  { quote: 'My daughter improved her Chemistry grades from C to A+ in just 3 months. Highly recommend!', author: 'Amit Verma', location: 'Jamshedpur', rating: 5 },
  { quote: 'The tutors are highly qualified and very patient. Great platform for parents in Jharkhand.', author: 'Sunita Gupta', location: 'Bokaro', rating: 5 },
]

const placeholderTutors = [
  { name: 'Ananya Singh', qualification: 'M.Sc. Mathematics, B.Ed', subjects: 'Mathematics, Physics', rating: 4.9, fee: 450 },
  { name: 'Rahul Kumar', qualification: 'Ph.D. Chemistry', subjects: 'Chemistry, Biology', rating: 4.8, fee: 500 },
  { name: 'Priya Verma', qualification: 'M.A. English, B.Ed', subjects: 'English, Hindi', rating: 4.9, fee: 400 },
  { name: 'Vikram Sharma', qualification: 'B.Tech, M.Tech', subjects: 'Physics, Computer Science', rating: 4.7, fee: 550 },
]

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const numeric = parseInt(value)
    if (isNaN(numeric)) { setCount(value); return }
    let start = 0
    const duration = 2000
    const step = Math.ceil(numeric / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numeric) { setCount(numeric); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{typeof count === 'number' ? count + (value.includes('+') ? '+' : '') : count}</>
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Landing() {
  const [categories, setCategories] = useState(fallbackCategories)
  const [featuredTutors, setFeaturedTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tutorRes] = await Promise.all([
          API.get('/categories'),
          API.get('/tutors', { params: { sort: 'rating', limit: 4 } }),
        ])
        if (catRes.data?.length) setCategories(catRes.data)
        if (tutorRes.data?.length) setFeaturedTutors(tutorRes.data)
      } catch {
        // fallback data already set
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gold rounded-full animate-pulse" />
          <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">Trusted by 1000+ parents in Jharkhand</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 animate-slide-up">
              Find the Perfect{' '}
              <span className="text-gradient-gold">Tutor</span>
              <br />
              for Your Child
            </h1>

            <p className="text-lg md:text-xl text-blue-200/90 mb-10 max-w-3xl mx-auto animate-fade-in stagger-2 leading-relaxed">
              MY Tuition connects parents in Jharkhand with qualified, verified home and online tutors.
              <br />
              Nursery to Class 12 | NEET, JEE | JAC, CBSE, ICSE | All Subjects
            </p>

            <div className="glass rounded-2xl p-4 md:p-6 mb-10 max-w-4xl mx-auto animate-slide-up stagger-3">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="md:col-span-1">
                  <input
                    type="text"
                    placeholder="Subject (e.g. Maths)"
                    className="w-full px-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold transition"
                  />
                </div>
                <div className="md:col-span-1">
                  <input
                    type="text"
                    placeholder="City / Location"
                    className="w-full px-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold transition"
                  />
                </div>
                <div className="md:col-span-1">
                  <select className="w-full px-4 py-3.5 rounded-xl bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gold transition cursor-pointer">
                    <option value="">Online / At home / Both</option>
                    <option value="online">Online</option>
                    <option value="home">At Home</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <button className="w-full bg-gradient-to-r from-gold to-gold-dark text-primary font-bold py-3.5 px-6 rounded-xl hover:shadow-premium hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap animate-fade-in stagger-4">
              <Link to="/register" className="bg-gradient-to-r from-gold to-gold-dark text-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-premium hover:scale-[1.02] transition-all inline-flex items-center gap-2 group">
                Find a Tutor
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/register" className="glass text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 group">
                Become a Tutor
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F9FC] to-transparent" />
      </section>

      <section className="relative -mt-12 z-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white premium-shadow rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold text-gradient-gold group-hover:scale-110 transition-transform">
                    <AnimatedCounter value={s.value} />
                  </div>
                  <div className="text-gray-500 mt-2 text-sm md:text-base font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Simple Process</span>
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle">Getting started is easy. Just three simple steps to find the perfect tutor.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="relative text-center p-8 rounded-2xl bg-gray-50 premium-shadow-hover transition-all duration-300 group border border-gray-100 hover:bg-white animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-gold rounded-full flex items-center justify-center text-lg font-bold shadow-lg">{item.step}</div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 text-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg">
                  {idx === 0 ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Categories</span>
            <h2 className="section-title mb-4">Subject Categories</h2>
            <p className="section-subtitle">Explore a wide range of subjects taught by expert tutors.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {categories.map((cat, idx) => (
              <div key={cat.name} className="bg-white rounded-2xl p-6 text-center border border-gray-100 premium-shadow-hover hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{cat.icon || '📖'}</div>
                <h3 className="font-bold text-primary text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.count || cat.subject_count || 0} subjects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Topics</span>
            <h2 className="section-title mb-4">Popular Subjects</h2>
            <p className="section-subtitle">Most searched subjects by parents in Jharkhand.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSubjects.map((s) => (
              <span key={s} className="bg-blue-50 text-primary px-5 py-2.5 rounded-full font-medium border border-blue-100 hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white hover:border-primary transition-all duration-300 cursor-pointer text-sm shadow-sm hover:shadow-lg">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Top Rated</span>
            <h2 className="section-title mb-4">Featured Tutors</h2>
            <p className="section-subtitle">Top-rated tutors ready to help your child excel.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredTutors.length ? featuredTutors : placeholderTutors).map((tutor, idx) => (
                <div key={tutor.id || idx} className="bg-white rounded-2xl p-6 border border-gray-100 premium-shadow-hover hover:-translate-y-1.5 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all">
                      {tutor.name?.charAt(0) || 'T'}
                    </div>
                    <h3 className="font-bold text-primary text-lg text-center">{tutor.name}</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">{tutor.qualification}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <StarRating rating={tutor.rating || 0} />
                      <span className="text-gray-600 text-sm ml-1 font-medium">{tutor.rating}</span>
                    </div>
                    <p className="text-gray-500 text-xs text-center mt-2">{tutor.subjects}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
                      <span className="text-primary font-bold text-lg">₹{tutor.fee}<span className="text-gray-400 text-sm font-normal">/hr</span></span>
                    </div>
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

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Testimonials</span>
            <h2 className="section-title mb-4">What Parents Say</h2>
            <p className="section-subtitle">Hear from parents who found the perfect tutor through MyTuition.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 premium-shadow-hover transition-all duration-300 group hover:bg-white animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="flex gap-1 text-gold mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">{t.author}</div>
                    <div className="text-gray-400 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-200 text-sm font-medium">Join 1000+ parents today</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-10 text-lg md:text-xl max-w-2xl mx-auto">Join hundreds of parents in Jharkhand who trust MY Tuition for their child&apos;s education. Find your perfect tutor today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-gradient-to-r from-gold to-gold-dark text-primary px-10 py-4 rounded-xl font-bold text-lg hover:shadow-premium hover:scale-[1.02] transition-all inline-flex items-center gap-2 group">
              Find a Tutor Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/register" className="glass text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 group">
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
