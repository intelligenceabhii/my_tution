import { Link } from 'react-router-dom'

const sections = [
  { title: '1. Overview', content: 'At MY Tuition, we strive to ensure satisfaction with every tutoring engagement. This Refund Policy outlines the circumstances under which refunds may be issued and the process for requesting them.' },
  { title: '2. Eligibility', content: 'Refund requests are considered under the following circumstances: tutor cancellation without rescheduling, significant mismatch between tutor qualifications and stated credentials, technical issues preventing session delivery, and duplicate payments. Each request is reviewed on a case-by-case basis.' },
  { title: '3. Non-Refundable Cases', content: 'Refunds will not be issued for: change of mind after booking, dissatisfaction with tutor teaching style after multiple sessions (we encourage trying a different tutor instead), sessions that have already been completed satisfactorily, and off-platform payments made directly to tutors.' },
  { title: '4. Free Demo Classes', content: 'Most tutors offer a free demo class. We strongly recommend taking advantage of the demo session before committing to paid sessions. This helps ensure the tutor is the right fit for your child\'s learning needs.' },
  { title: '5. Refund Process', content: 'To request a refund, contact us at abhii.intelligence@gmail.com with your account details, tutor name, and reason for the request. We will review and respond within 5-7 business days. Approved refunds are processed within 10 business days to the original payment method.' },
  { title: '6. Chargebacks', content: 'If you believe there has been an unauthorized charge, please contact us before initiating a chargeback with your bank. We will work to resolve any legitimate issues promptly.' },
  { title: '7. Policy Changes', content: 'We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting. We encourage you to review this policy periodically.' },
  { title: '8. Contact', content: 'For refund-related inquiries, please contact us at abhii.intelligence@gmail.com or call +91 79790 37065.' },
]

export default function Refund() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-gold/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12 animate-slide-up">
          <span className="inline-block text-xs font-bold text-primary/70 bg-primary/[0.06] px-4 py-1.5 rounded-full tracking-wider uppercase mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Refund <span className="text-gold">Policy</span></h1>
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
            <p className="text-gray-500 text-sm mb-4">Have a refund question?</p>
            <Link to="/contact" className="text-primary font-semibold hover:underline text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
