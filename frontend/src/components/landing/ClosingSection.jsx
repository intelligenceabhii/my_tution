import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function ClosingSection() {
  return (
    <section className="closing-section">
      <div className="design-container closing-content">
        <span className="eyebrow">THE NEXT CHAPTER IS YOURS</span>
        <h2>
          The right teacher.
          <br />A world of possibility.
        </h2>
        <p>
          Start with what you want to learn.
          <br />
          We’ll help you find who can guide you.
        </p>
        <div className="hero-actions">
          <Link to="/find-tutors" className="design-button primary">
            Find a Teacher <Icon name="arrow" size={17} />
          </Link>
          <Link to="/register" className="design-button secondary">
            Become a Tutor
          </Link>
        </div>
        <span className="closing-signature">
          <Icon name="leaf" size={16} /> Rooted in Ranchi. Open to possibility.
        </span>
      </div>
      <Landscape />
    </section>
  );
}
