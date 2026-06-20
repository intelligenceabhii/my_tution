import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ParentDashboard from './pages/ParentDashboard'
import ParentTutors from './pages/ParentTutors'
import TutorDashboard from './pages/TutorDashboard'
import TutorProfile from './pages/TutorProfile'
import AdminDashboard from './pages/AdminDashboard'
import AIMatch from './pages/AIMatch'
import FindTutors from './pages/FindTutors'
import Subjects from './pages/Subjects'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Support from './pages/Support'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'
import Favorites from './pages/Favorites'
import Messages from './pages/Messages'
import LearningProgress from './pages/LearningProgress'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-gold rounded-full animate-spin" />
        <div className="flex items-center gap-2">
          <span className="text-gold text-2xl font-bold">MY</span>
          <span className="text-primary text-2xl font-bold">Tuition</span>
        </div>
        <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to={getDashboard(user.role)} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={getDashboard(user.role)} /> : <Register />} />
          <Route path="/parent/dashboard" element={<ProtectedRoute roles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/tutors" element={<ProtectedRoute roles={['parent']}><ParentTutors /></ProtectedRoute>} />
          <Route path="/tutor/dashboard" element={<ProtectedRoute roles={['tutor']}><TutorDashboard /></ProtectedRoute>} />
          <Route path="/tutor/profile/:id" element={<TutorProfile />} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/ai-match/:reqId" element={<ProtectedRoute roles={['parent', 'admin']}><AIMatch /></ProtectedRoute>} />
          <Route path="/find-tutors" element={<FindTutors />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/favorites" element={<ProtectedRoute roles={['parent', 'tutor']}><Favorites /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute roles={['parent', 'tutor']}><Messages /></ProtectedRoute>} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/learning" element={<ProtectedRoute roles={['parent', 'tutor']}><LearningProgress /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function getDashboard(role) {
  if (role === 'parent') return '/parent/dashboard'
  if (role === 'tutor') return '/tutor/dashboard'
  if (role === 'admin') return '/admin'
  return '/'
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
