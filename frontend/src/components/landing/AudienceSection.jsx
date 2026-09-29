import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function AudienceSection() {
  return (
    <section className="design-section audience-section">
      <div className="design-container">
        <SectionHeading
          align="center"
          label="DIFFERENT ROLES. ONE SHARED GOAL."
          title={
            <>
              A little more confidence.
              <br />
              For everyone.
            </>
          }
        />
        <div className="audience-grid">
          <article>
            <div className="audience-visual parent-visual">
              <span className="audience-icon">
                <Icon name="users" size={34} />
              </span>
              <div className="visual-caption">
                <Icon name="check" size={16} /> A teacher who understands your
                goals
              </div>
              <div className="visual-caption offset">
                <Icon name="home" size={16} /> At home or online. Your choice.
              </div>
            </div>
            <div className="audience-content">
              <span className="eyebrow">FOR PARENTS & STUDENTS</span>
              <h3>
                The right support.
                <br />A more confident learner.
              </h3>
              <p>
                Find teachers, share your requirements and stay close to your
                child’s learning journey.
              </p>
              <Link to="/register" className="text-link">
                Find your starting point <Icon name="arrow" size={17} />
              </Link>
            </div>
          </article>
          <article>
            <div className="audience-visual tutor-visual">
              <span className="audience-icon">
                <Icon name="cap" size={34} />
              </span>
              <div className="visual-caption">
                <Icon name="book" size={16} /> Share what you know
              </div>
              <div className="visual-caption offset">
                <Icon name="message" size={16} /> Connect with families who need
                it
              </div>
            </div>
            <div className="audience-content">
              <span className="eyebrow">FOR TEACHERS</span>
              <h3>
                Your knowledge.
                <br />
                Someone’s next breakthrough.
              </h3>
              <p>
                Build your teaching profile, explore parent requirements and
                manage your learning connections.
              </p>
              <Link to="/register" className="text-link">
                Become a Tutor <Icon name="arrow" size={17} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
