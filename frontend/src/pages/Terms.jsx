import { Link } from 'react-router-dom'

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using MY Tuition ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services. These terms may be updated at any time, and continued use constitutes acceptance of changes.' },
  { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current information during registration. Accounts found to be using false information may be suspended.' },
  { title: '3. Tutor Verification', content: 'While we verify tutor qualifications and backgrounds, we do not guarantee the accuracy of all information provided by tutors. Parents should exercise due diligence and communicate directly with tutors before finalizing arrangements.' },
  { title: '4. Payments & Refunds', content: 'Payments are processed through our platform. Tutors set their own rates. Refund requests are handled on a case-by-case basis as per our Refund Policy. We are not responsible for any off-platform payments.' },
  { title: '5. User Conduct', content: 'Users agree not to misuse the platform, harass other users, post false information, or engage in any activity that disrupts the platform\'s operations. Violation may result in account termination.' },
  { title: '6. Limitation of Liability', content: 'MY Tuition acts as a marketplace connecting parents and tutors. We are not liable for any direct, indirect, or consequential damages arising from your use of the platform or interactions with other users.' },
  { title: '7. Privacy', content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.' },
  { title: '8. Contact', content: 'For questions about these terms, please contact us at abhii.intelligence@gmail.com.' },
]

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Terms & <span className="text-gold">Conditions</span></h1>
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
            <p className="text-gray-500 text-sm mb-4">If you have questions, reach out to us.</p>
            <Link to="/contact" className="text-primary font-semibold hover:underline text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
