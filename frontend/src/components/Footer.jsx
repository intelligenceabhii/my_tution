import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary-dark text-white mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                <span className="text-primary font-extrabold text-lg">M</span>
              </div>
              <div>
                <span className="text-gold text-xl font-bold">MY</span>
                <span className="text-white text-xl font-bold">Tuition</span>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Empowering education in Jharkhand — connecting parents with the best verified tutors for Classes 9-12.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link to="/find-tutors" className="text-blue-200 hover:text-gold transition text-sm">Find Tutors</Link></li>
              <li><Link to="/subjects" className="text-blue-200 hover:text-gold transition text-sm">Subjects</Link></li>
              <li><Link to="/register" className="text-blue-200 hover:text-gold transition text-sm">Become a Tutor</Link></li>
              <li><Link to="/login" className="text-blue-200 hover:text-gold transition text-sm">Parent Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-4">For Parents</h3>
            <ul className="space-y-2.5">
              <li><Link to="/find-tutors" className="text-blue-200 hover:text-gold transition text-sm">Search Tutors</Link></li>
              <li><Link to="/register" className="text-blue-200 hover:text-gold transition text-sm">Post Requirement</Link></li>
              <li><Link to="/subjects" className="text-blue-200 hover:text-gold transition text-sm">Browse Subjects</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-4">For Tutors</h3>
            <ul className="space-y-2.5">
              <li><Link to="/register" className="text-blue-200 hover:text-gold transition text-sm">Register as Tutor</Link></li>
              <li><Link to="/tutor/dashboard" className="text-blue-200 hover:text-gold transition text-sm">Tutor Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-sm">&copy; {new Date().getFullYear()} MY Tuition. All rights reserved.</p>
          <p className="text-blue-400 text-xs">Made with ❤️ for education in Jharkhand</p>
        </div>
      </div>
    </footer>
  )
}
