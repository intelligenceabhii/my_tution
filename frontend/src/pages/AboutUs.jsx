import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";
import Icon from "../components/ui/Icon";
const team = [
  { name: "Abhishek Vishawakarma", role: "Founder", initials: "AV" },
  { name: "Suraj Vishwanat", role: "Head of Academics", initials: "SV" },
];
export default function AboutUs() {
  return (
    <div className="about-page">
      <section className="directory-hero">
        <div className="design-container">
          <span className="eyebrow">OUR STORY</span>
          <h1>
            A good teacher.
            <br />A lasting difference.
          </h1>
          <p>
            We’re bringing families and educators closer together.
            <br />
            Starting in Jharkhand, one learning connection at a time.
          </p>
        </div>
      </section>
      <div className="design-container">
        <section className="design-section about-mission">
          <SectionHeading
            label="WHY WE’RE HERE"
            title="The right guidance changes what feels possible."
          />
          <div>
            <p>
              Every learner is different. So finding a teacher should be about
              more than a name on a list.
            </p>
            <p>
              MY Tuition connects parents and students with tutors whose
              subjects, experience and teaching approach fit their needs. From
              school foundations to exam preparation, we help you find a place
              to start.
            </p>
            <p>
              MeritAI brings useful context to the search: your class, subjects,
              budget, learning mode and location. Technology helps you compare.
              The connection is always human.
            </p>
          </div>
        </section>
        <section className="about-values">
          {[
            [
              "home",
              "Close to home. Or a click away.",
              "Explore home tuition in Ranchi and online teaching options.",
            ],
            [
              "users",
              "Built around people.",
              "Get to know your teacher and discuss what you need before you decide.",
            ],
            [
              "spark",
              "Guidance with context.",
              "Use MeritAI recommendations to make a more informed choice.",
            ],
          ].map(([icon, title, text]) => (
            <article key={title}>
              <span className="icon-tile">
                <Icon name={icon} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <section className="design-section">
          <SectionHeading
            label="THE PEOPLE BEHIND THE PLATFORM"
            title="A shared belief in better learning."
          />
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name}>
                <div className="team-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="directory-cta">
          <div>
            <span className="eyebrow">LET’S TALK</span>
            <h2>Good ideas start with a conversation.</h2>
            <p>Have a question, a suggestion or a story to share?</p>
          </div>
          <Link className="design-button primary" to="/contact">
            Get in touch <Icon name="arrow" size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
