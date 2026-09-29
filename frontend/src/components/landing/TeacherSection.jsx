import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function TeacherSection({ tutors }) {
  return (
    <section className="design-section teacher-section">
      <div className="design-container">
        <div className="section-heading-row">
          <SectionHeading
            label="PEOPLE, NOT JUST PROFILES"
            title="Good guidance starts here."
          >
            Explore the expertise, experience and teaching styles of available
            tutors.
          </SectionHeading>
          <Link to="/find-tutors" className="text-link">
            Find your teacher <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="teacher-preview-grid">
          {tutors.map((tutor) => (
            <TutorPreview key={tutor.id} tutor={tutor} />
          ))}
          <div className="teacher-invite">
            <span className="icon-tile">
              <Icon name="spark" size={23} />
            </span>
            <h3>Not sure where to start?</h3>
            <p>
              Tell us what your child needs. Let MeritAI help you compare the
              possibilities.
            </p>
            <Link to="/parent/dashboard" className="text-link">
              Post a requirement <Icon name="arrow" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
