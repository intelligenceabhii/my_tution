import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Icon from "../components/ui/Icon";

const fallbackCategories = [
  {
    name: "Academic Tutoring",
    icon: "📚",
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "History",
      "Geography",
      "Computer Science",
      "Accountancy",
      "Economics",
      "Political Science",
    ],
  },
  {
    name: "Languages",
    icon: "🌐",
    subjects: [
      "English Speaking",
      "French",
      "German",
      "Spanish",
      "Japanese",
      "Sanskrit",
      "Tamil",
      "Hindi Grammar",
      "Spoken English",
    ],
  },
  {
    name: "Coding & AI",
    icon: "💻",
    subjects: [
      "Python",
      "Java",
      "Web Development",
      "AI & Machine Learning",
      "Robotics",
      "C++",
      "Data Structures",
      "App Development",
      "Cyber Security",
    ],
  },
  {
    name: "Science & Technology",
    icon: "🔬",
    subjects: [
      "Physics",
      "Chemistry",
      "Biology",
      "Environmental Science",
      "Electronics",
      "Astronomy",
    ],
  },
  {
    name: "Arts & Music",
    icon: "🎨",
    subjects: [
      "Drawing",
      "Guitar",
      "Piano",
      "Singing",
      "Dance",
      "Violin",
      "Tabla",
      "Art & Sketching",
    ],
  },
  {
    name: "Sports & Fitness",
    icon: "🏏",
    subjects: [
      "Cricket",
      "Badminton",
      "Chess",
      "Yoga",
      "Swimming",
      "Football",
      "Martial Arts",
    ],
  },
  {
    name: "Professional Skills",
    icon: "💼",
    subjects: [
      "Public Speaking",
      "Digital Marketing",
      "Video Editing",
      "Excel",
      "Content Writing",
      "Photography",
    ],
  },
  {
    name: "Test Preparation",
    icon: "🎯",
    subjects: [
      "JEE Main",
      "JEE Advanced",
      "NEET",
      "UPSC",
      "IELTS",
      "SAT",
      "GMAT",
      "CLAT",
      "NDA",
      "Banking",
    ],
  },
];

const popularSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Python",
  "JEE",
  "NEET",
  "Guitar",
  "Yoga",
];

export default function Subjects() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    API.get("/categories/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : fallbackCategories;
        setCategories(data);
        setActiveCat(0);
      })
      .catch(() => {
        setCategories(fallbackCategories);
        setActiveCat(0);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const allSubjects = categories.flatMap((cat) =>
    (cat.subjects || []).map((s) => ({
      name: s,
      category: cat.name,
      icon: cat.icon,
    })),
  );
  const uniqueSubjects = [
    ...new Map(allSubjects.map((s) => [s.name, s])).values(),
  ];

  const filteredSubjects = uniqueSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCategory = categories[activeCat];
  const activeSubjects = activeCategory?.subjects || [];

  const totalSubjects = uniqueSubjects.length;
  const totalCategories = categories.length;

  return (
    <div className="subjects-directory">
      <section className="directory-hero">
        <div className="design-container">
          <span className="eyebrow">FIND YOUR NEXT CHAPTER</span>
          <h1>Curiosity starts here.</h1>
          <p>
            One subject. A new perspective. Find a teacher who helps it all make
            sense.
          </p>
          <div className="directory-search">
            <Icon name="search" />
            <label className="sr-only" htmlFor="subject-directory-search">
              Search subjects and categories
            </label>
            <input
              id="subject-directory-search"
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any subject..."
            />
            {searchQuery && (
              <button
                aria-label="Clear subject search"
                onClick={() => setSearchQuery("")}
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
          <div className="directory-meta">
            {loading ? (
              <span role="status">Loading subjects…</span>
            ) : (
              <>
                <span>{totalCategories} categories</span>
                <span>{totalSubjects} subjects to explore</span>
              </>
            )}
            <span>Home & online tuition</span>
          </div>
        </div>
      </section>
      <div className="design-container directory-content">
        {usingFallback && (
          <p role="status" className="directory-notice">
            The live directory is temporarily unavailable. Showing our general
            subject guide.
          </p>
        )}
        <div className="popular-subjects">
          <span>Popular starting points</span>
          {popularSubjects.slice(0, 6).map((subject) => (
            <Link
              key={subject}
              to={`/find-tutors?subject=${encodeURIComponent(subject)}`}
            >
              {subject}
              <Icon name="arrow" size={13} />
            </Link>
          ))}
        </div>
        {searchQuery ? (
          <section className="directory-results">
            <div className="directory-heading">
              <h2>Results for “{searchQuery}”</h2>
              <span>{filteredSubjects.length} found</span>
            </div>
            {filteredSubjects.length ? (
              <div className="directory-subject-grid">
                {filteredSubjects.map((subject) => (
                  <Link
                    key={subject.name}
                    to={`/find-tutors?subject=${encodeURIComponent(subject.name)}`}
                  >
                    <span className="icon-tile">
                      <Icon name="book" />
                    </span>
                    <span>
                      <strong>{subject.name}</strong>
                      <small>{subject.category}</small>
                    </span>
                    <Icon name="arrow" size={17} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="directory-empty">
                <Icon name="search" size={32} />
                <h3>No subjects found</h3>
                <p>Try another subject or category.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="design-button secondary"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        ) : loading ? (
          <p role="status" className="directory-empty">
            Loading your possibilities…
          </p>
        ) : (
          <>
            <div
              className="directory-tabs"
              role="tablist"
              aria-label="Subject categories"
            >
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  role="tab"
                  tabIndex={activeCat === index ? 0 : -1}
                  onKeyDown={(e) => {
                    let next;
                    if (e.key === "ArrowRight")
                      next = (index + 1) % categories.length;
                    else if (e.key === "ArrowLeft")
                      next =
                        (index - 1 + categories.length) % categories.length;
                    else if (e.key === "Home") next = 0;
                    else if (e.key === "End") next = categories.length - 1;
                    else return;
                    e.preventDefault();
                    setActiveCat(next);
                    document.getElementById(`category-tab-${next}`)?.focus();
                  }}
                  id={`category-tab-${index}`}
                  aria-selected={activeCat === index}
                  aria-controls="category-subjects"
                  onClick={() => setActiveCat(index)}
                  className={activeCat === index ? "active" : ""}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {activeCategory && (
              <section
                id="category-subjects"
                role="tabpanel"
                aria-labelledby={`category-tab-${activeCat}`}
                className="directory-results"
              >
                <div className="directory-heading">
                  <div>
                    <span className="eyebrow">
                      YOUR SUBJECT, YOUR STARTING POINT
                    </span>
                    <h2>{activeCategory.name}</h2>
                  </div>
                  <span>{activeSubjects.length} subjects</span>
                </div>
                <div className="directory-subject-grid">
                  {activeSubjects.map((subject) => (
                    <Link
                      key={subject}
                      to={`/find-tutors?subject=${encodeURIComponent(subject)}`}
                    >
                      <span className="subject-letter">{subject[0]}</span>
                      <strong>{subject}</strong>
                      <Icon name="arrow" size={17} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section className="directory-category-section">
              <div className="directory-heading">
                <h2>A whole world to explore.</h2>
                <span>All categories</span>
              </div>
              <div className="subject-paths">
                {categories.map((category, index) => (
                  <button
                    className="subject-path text-left"
                    key={category.name}
                    onClick={() => {
                      setActiveCat(index);
                      document
                        .getElementById("category-subjects")
                        ?.scrollIntoView({
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "auto"
                            : "smooth",
                          block: "center",
                        });
                    }}
                  >
                    <span className={`subject-symbol tone-${index % 3}`}>
                      <Icon
                        name={
                          ["book", "globe", "monitor", "leaf", "cap", "chart"][
                            index % 6
                          ]
                        }
                        size={25}
                      />
                    </span>
                    <h3>{category.name}</h3>
                    <p>
                      {category.subjects?.length || 0} subjects ·{" "}
                      {category.subjects?.slice(0, 2).join(", ")}
                    </p>
                    <span className="subject-path-arrow">
                      <Icon name="arrow" size={17} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
        <section className="directory-cta">
          <div>
            <span className="eyebrow">LET’S FIND YOUR FIT</span>
            <h2>Not sure where to start?</h2>
            <p>
              Share your learning requirements and let MeritAI help you compare
              teachers.
            </p>
          </div>
          <Link to="/parent/dashboard" className="design-button primary">
            Post a requirement <Icon name="arrow" size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
