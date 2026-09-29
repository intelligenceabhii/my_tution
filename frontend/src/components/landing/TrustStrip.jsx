import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="design-container">
        <p>Big goals. Everyday support.</p>
        <div>
          <span>
            <Icon name="book" /> School & exam preparation
          </span>
          <span>
            <Icon name="shield" /> Reviewed tutor profiles
          </span>
          <span>
            <Icon name="home" /> Home tuition in Ranchi
          </span>
          <span>
            <Icon name="monitor" /> Learn online
          </span>
        </div>
      </div>
    </section>
  );
}
