import { Link } from "react-router-dom";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import TutorPreview from "../ui/TutorPreview";
import TutorFinder from "./TutorFinder";
import Landscape from "./Landscape";
export default function LandingHero({
  categories,
  tutors,
  loading,
  error,
  dashboard,
}) {
  return (
    <section className="landing-hero">
      <div className="hero-intro design-container">
        <a href="#teacher-finder" className="announcement">
          <Icon name="spark" size={14} />
          <span>A personal way to find your teacher</span>
          <Icon name="arrow" size={14} />
        </a>
        <h1>
          Find the right teacher
          <br />
          for the way <span>you learn.</span>
        </h1>
        <p className="hero-description">
          Personalized tutor matching for online and offline learning,
          <br className="desktop-break" /> built around your subject, goals,
          location and schedule.
        </p>
        <div className="hero-actions">
          <a href="#teacher-finder" className="design-button primary">
            Find a Teacher <Icon name="arrow" size={17} />
          </a>
          <Link to="/register" className="design-button secondary">
            Become a Tutor <Icon name="chevron" size={15} />
          </Link>
        </div>
        <div className="hero-assurances">
          <span>
            <Icon name="check" size={14} /> Your subject. Your pace.
          </span>
          <span>
            <Icon name="check" size={14} /> Online or at home
          </span>
        </div>
      </div>
      <div className="hero-product-wrap design-container" id="teacher-finder">
        <div className="product-window">
          <div className="window-toolbar">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>
            <span>
              <Icon name="shield" size={12} /> Your next chapter starts here
            </span>
            <Icon name="more" size={14} />
          </div>
          <div className="product-body">
            <aside className="product-sidebar">
              <Brand />
              <p>YOUR LEARNING SPACE</p>
              <a href="#teacher-finder" className="active">
                <Icon name="search" size={17} /> Find a teacher
              </a>
              <Link to={dashboard}>
                <Icon name="book" size={17} /> My requirements
              </Link>
              <Link to="/messages">
                <Icon name="message" size={17} /> Messages
              </Link>
              <Link to="/learning">
                <Icon name="chart" size={17} /> Learning progress
              </Link>
              <div className="sidebar-note">
                <Icon name="leaf" size={21} />
                <strong>Room to grow.</strong>
                <span>Guidance that starts with you.</span>
              </div>
            </aside>
            <div className="product-main">
              <div className="product-heading">
                <div>
                  <span className="eyebrow">LET’S FIND YOUR FIT</span>
                  <h2>Good teachers. Great possibilities.</h2>
                </div>
                <span className="product-location">
                  <Icon name="pin" size={14} /> Ranchi & online
                </span>
              </div>
              <div className="product-columns">
                <TutorFinder categories={categories} />
                <div className="hero-results">
                  <div className="results-heading">
                    <h3>Meet your next teacher</h3>
                    <Link to="/find-tutors">
                      Explore all <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                  {loading ? (
                    <div className="teacher-loading" role="status">
                      <span />
                      <span />
                      <p>Finding your starting point…</p>
                    </div>
                  ) : tutors.length ? (
                    <>
                      <TutorPreview tutor={tutors[0]} compact />
                      {tutors[1] && (
                        <Link
                          to={`/tutor/profile/${tutors[1].id}`}
                          className="next-teacher"
                        >
                          <span className="mini-avatar">
                            {tutors[1].full_name?.[0]}
                          </span>
                          <span>
                            <strong>{tutors[1].full_name}</strong>
                            <small>
                              {tutors[1].subjects?.slice(0, 2).join(" · ")}
                            </small>
                          </span>
                          <Icon name="arrow" size={17} />
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="teacher-empty">
                      <Icon name="users" size={34} />
                      <h3>Your teacher search starts here.</h3>
                      <p>
                        {error
                          ? "Teacher profiles are temporarily unavailable. You can try browsing again."
                          : "Browse available subjects or tell us what you need."}
                      </p>
                      <Link to="/find-tutors">
                        Explore teachers <Icon name="arrow" size={16} />
                      </Link>
                    </div>
                  )}
                  <div className="matching-note">
                    <span className="icon-tile small">
                      <Icon name="spark" size={17} />
                    </span>
                    <p>
                      <strong>A more personal recommendation?</strong>
                      <Link to="/parent/dashboard">
                        Tell MeritAI what you need{" "}
                        <Icon name="arrow" size={13} />
                      </Link>
                    </p>
                  </div>
                  <p className="availability-note">
                    Discuss availability and timings directly with your teacher.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Landscape />
      <div className="landscape-caption">
        <Icon name="leaf" size={14} /> A good teacher helps you grow.
      </div>
    </section>
  );
}
