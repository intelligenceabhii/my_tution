import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
const faqs = [
  [
    "How do I find the right tutor?",
    "Start with your subject, class and preferred learning mode. Browse teacher profiles, or create a parent account and post a requirement to get MeritAI recommendations.",
  ],
  [
    "Can I choose between home and online tuition?",
    "Yes. Filter by home tuition or online learning. For home tuition, add your area in Ranchi and discuss travel and timings with the tutor.",
  ],
  [
    "How does MeritAI matching work?",
    "MeritAI compares your posted requirement with available approved tutors and provides recommendations with reasons. You can review their profiles and decide who fits your needs.",
  ],
  [
    "Where can I see fees and availability?",
    "Tutors can include their expected monthly fee on their profile. Confirm the final fee, schedule and availability directly with the tutor before starting.",
  ],
  [
    "How do I join as a tutor?",
    "Create an account, choose Tutor, and complete your teaching profile. Once your profile is approved, you can appear in discovery and apply to parent requirements.",
  ],
];
export default function LandingFAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <section className="design-section faq-section">
      <div className="design-container faq-grid">
        <SectionHeading
          label="A FEW THINGS YOU MIGHT WONDER"
          title={
            <>
              Good questions.
              <br />
              Clear answers.
            </>
          }
        >
          Still have something on your mind?{" "}
          <Link to="/contact">We’re here to help.</Link>
        </SectionHeading>
        <div className="design-faq">
          {faqs.map(([question, answer], index) => (
            <div key={question}>
              <h3>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}`}
                >
                  {question}
                  <Icon name={openFaq === index ? "close" : "plus"} size={18} />
                </button>
              </h3>
              {openFaq === index && <p id={`faq-${index}`}>{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
