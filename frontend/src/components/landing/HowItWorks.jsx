import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function HowItWorks() {
  return (
    <section className="design-section how-section" id="how-it-works">
      <div className="design-container">
        <SectionHeading
          align="center"
          label="HOW IT WORKS"
          title={
            <>
              Your next teacher is
              <br />a few simple steps away.
            </>
          }
        >
          Less searching. More finding your feet.
        </SectionHeading>
        <div className="journey-grid">
          {[
            {
              icon: "book",
              title: "Tell us what you need.",
              text: "Choose your subject, class and learning mode. Add your location for home tuition.",
              tag: "Your learning, your starting point",
            },
            {
              icon: "spark",
              title: "Find someone who fits.",
              text: "Compare teacher profiles or post a requirement for personalized MeritAI recommendations.",
              tag: "Real profiles. Informed choices.",
            },
            {
              icon: "message",
              title: "Connect. Learn. Grow.",
              text: "Discuss your goals and schedule with your teacher. Keep in touch and revisit your learning.",
              tag: "A human connection that matters",
            },
          ].map((step, i) => (
            <article key={step.title}>
              <div className="journey-top">
                <span>0{i + 1}</span>
                <Icon name={step.icon} size={25} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <small>
                <Icon name="check" size={13} />
                {step.tag}
              </small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
