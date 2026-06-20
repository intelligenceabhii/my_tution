import { Link } from 'react-router-dom'

const sections = [
  { title: '1. Information We Collect', content: 'We collect information you provide during registration (name, email, phone number, role), profile details (qualifications, experience for tutors), and usage data (pages visited, features used). We also collect communication data when you interact with other users on our platform.' },
  { title: '2. How We Use Your Information', content: 'Your information is used to: provide and improve our services, match parents with suitable tutors, process payments, send important updates, personalize your experience, and comply with legal obligations. We use AI (MeritAI) to analyze requirements for better tutor matching.' },
  { title: '3. Data Sharing', content: 'We do not sell your personal information. We may share data with: tutors (to fulfill your tutoring requests), payment processors (for transaction handling), and legal authorities (if required by law). Tutor profiles shared with parents include qualifications, experience, and ratings.' },
  { title: '4. Data Security', content: 'We implement industry-standard security measures including encryption, secure servers, and access controls. However, no online platform is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.' },
  { title: '5. Your Rights', content: 'You have the right to: access your personal data, correct inaccurate data, request deletion of your data, withdraw consent for data processing, and export your data. Contact us at abhii.intelligence@gmail.com to exercise these rights.' },
  { title: '6. Cookies', content: 'We use essential cookies for platform functionality and analytics cookies to improve our services. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features.' },
  { title: '7. Changes to Policy', content: 'We may update this policy from time to time. Changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance of the updated policy.' },
  { title: '8. Contact', content: 'For privacy-related inquiries, contact us at abhii.intelligence@gmail.com.' },
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Privacy <span className="text-gold">Policy</span></h1>
          <p className="text-gray-500 text-sm">Last updated: June 2026</p>
        </div>

        <div className="bg-white premium-shadow rounded-2xl p-8 md:p-12 animate-slide-up">
          <div className="prose max-w-none space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-primary mb-2">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-4">Questions about your privacy?</p>
            <Link to="/contact" className="text-primary font-semibold hover:underline text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
