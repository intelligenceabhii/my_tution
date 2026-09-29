import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
const features = [
  {
    title: "The right fit, with MeritAI.",
    text: "Post your learning requirements and let MeritAI compare available tutors by subject, class, location, mode and budget.",
    icon: "spark",
    link: "/parent/dashboard",
    linkLabel: "Create a learning requirement",
    heading: "A little context makes a better match.",
    steps: [
      "Your subject & class",
      "Your preferred learning mode",
      "Your location & budget",
    ],
    result: "Tutor recommendations, with reasons",
    note: "You stay in control of who you choose.",
  },
  {
    title: "A conversation before a commitment.",
    text: "Get to know a teacher. Discuss your goals, fees and availability through your messages before making arrangements.",
    icon: "message",
    link: "/messages",
    linkLabel: "Open your messages",
    heading: "Good learning starts with a conversation.",
    steps: [
      "Explore a teacher’s profile",
      "Discuss your learning goals",
      "Agree on timing & fees",
    ],
    result: "A shared understanding from day one",
    note: "Your conversations, together in one place.",
  },
  {
    title: "Keep the bigger picture in view.",
    text: "See logged sessions, revisit topics and use MeritAI for questions connected to your learning.",
    icon: "chart",
    link: "/learning",
    linkLabel: "Explore your learning space",
    heading: "Small steps. Meaningful progress.",
    steps: [
      "Your tutor logs a session",
      "Revisit the topics covered",
      "Ask a question with MeritAI",
    ],
    result: "A clearer picture of your learning",
    note: "Built around actual sessions, not guesswork.",
  },
];
export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const feature = features[active];
  return (
    <section className="design-section feature-section" id="why-my-tuition">
      <div className="design-container feature-grid">
        <div>
          <SectionHeading
            label="A LITTLE TECHNOLOGY. A HUMAN CONNECTION."
            title={
              <>
                More than a search.
                <br />A better starting point.
              </>
            }
          >
            The tools to find your teacher, stay connected and make every lesson
            count.
          </SectionHeading>
          <div className="feature-accordion">
            {features.map((item, index) => (
              <div
                className={`feature-row ${index === active ? "is-active" : ""}`}
                key={item.title}
              >
                <button
                  aria-expanded={index === active}
                  aria-controls={`feature-detail-${index}`}
                  onClick={() => setActive(index)}
                >
                  <span className="feature-number">0{index + 1}</span>
                  {item.title}
                  <Icon name={index === active ? "check" : "plus"} size={18} />
                </button>
                {index === active && (
                  <div id={`feature-detail-${index}`}>
                    <p>{item.text}</p>
                    <Link to={item.link}>
                      {item.linkLabel}
                      <Icon name="arrow" size={15} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="feature-canvas">
          <span className="canvas-caption">YOUR LEARNING, CONNECTED</span>
          <div className="workflow-card" key={active}>
            <div className="workflow-mark">
              <Icon name={feature.icon} size={26} />
            </div>
            <h3>{feature.heading}</h3>
            <div className="workflow-steps">
              {feature.steps.map((step, i) => (
                <div key={step}>
                  <span>0{i + 1}</span>
                  <p>{step}</p>
                  <Icon name="check" size={16} />
                </div>
              ))}
            </div>
            <div className="workflow-result">
              <Icon name={feature.icon} />
              <span>{feature.result}</span>
            </div>
            <p className="workflow-note">{feature.note}</p>
          </div>
          <div className="canvas-footer">
            <span className="small-dot" /> Thoughtful technology. Personal
            guidance.
          </div>
        </div>
      </div>
    </section>
  );
}
