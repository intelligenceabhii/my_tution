import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function SubjectPaths({ categories, loading }) {
  return (
    <section className="design-section subject-section">
      <div className="design-container">
        <div className="section-heading-row">
          <SectionHeading
            label="START WITH WHAT INTERESTS YOU"
            title="What do you want to learn?"
          >
            From getting the basics right to preparing for what comes next.
          </SectionHeading>
          <Link className="text-link" to="/subjects">
            Explore all subjects <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="subject-paths">
          {(categories.length ? categories.slice(0, 6) : []).map(
            (category, i) => (
              <Link to="/subjects" className="subject-path" key={category.name}>
                <span className={`subject-symbol tone-${i % 3}`}>
                  <Icon
                    name={
                      ["book", "globe", "monitor", "leaf", "cap", "chart"][i]
                    }
                    size={25}
                  />
                </span>
                <h3>{category.name}</h3>
                <p>{category.subjects?.slice(0, 3).join(" · ")}</p>
                <span className="subject-path-arrow">
                  <Icon name="arrow" size={17} />
                </span>
              </Link>
            ),
          )}
          {!loading && !categories.length && (
            <p className="muted">
              Explore the subject directory to find your starting point.{" "}
              <Link to="/subjects">Browse subjects →</Link>
            </p>
          )}
          {loading && (
            <p role="status" className="muted">
              Loading subjects…
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
