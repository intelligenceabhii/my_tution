import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
export default function TutorFinder({ categories = [] }) {
  const navigate = useNavigate();
  const id = useId();
  const subjects = [
    ...new Set(categories.flatMap((category) => category.subjects || [])),
  ].sort();
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [mode, setMode] = useState("home");
  const [area, setArea] = useState("");
  function findTeachers(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (level) params.set("class_level", level);
    params.set("teaching_mode", mode);
    if (mode !== "online" && area.trim()) params.set("area", area.trim());
    navigate(`/find-tutors?${params}`);
  }
  return (
    <form className="tutor-finder" onSubmit={findTeachers}>
      <div className="finder-heading">
        <span className="icon-tile">
          <Icon name="search" />
        </span>
        <div>
          <h3>Find your kind of teacher</h3>
          <p>A few details. A more personal search.</p>
        </div>
      </div>
      <div className="finder-fields">
        <div>
          <label htmlFor={`${id}-subject`}>What do you want to learn?</label>
          <select
            id={`${id}-subject`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Choose a subject</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-class`}>Class / level</label>
          <select
            id={`${id}-class`}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Choose class</option>
            {[
              "Nursery",
              "LKG",
              "UKG",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "JEE",
              "NEET",
            ].map((c) => (
              <option key={c} value={c}>
                {/^\d+$/.test(c) ? `Class ${c}` : c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <fieldset>
        <legend>How would you like to learn?</legend>
        <div className="mode-options">
          {[
            ["home", "home", "Home tuition"],
            ["online", "monitor", "Online"],
          ].map(([value, icon, label]) => (
            <label
              className={`mode-option ${mode === value ? "is-active" : ""}`}
              key={value}
            >
              <input
                type="radio"
                name={`${id}-mode`}
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
              />
              <Icon name={icon} size={18} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {mode !== "online" ? (
        <div className="location-field">
          <label htmlFor={`${id}-area`}>Your area in Ranchi</label>
          <div>
            <Icon name="pin" size={17} />
            <input
              id={`${id}-area`}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Doranda, Harmu"
            />
          </div>
        </div>
      ) : (
        <p className="online-note">
          <Icon name="globe" size={17} /> Great teaching, wherever you are.
        </p>
      )}
      <button type="submit" className="design-button primary finder-submit">
        Find Teachers <Icon name="arrow" size={18} />
      </button>
      <p className="finder-footnote">
        <Icon name="shield" size={14} /> Explore profiles before you decide.
      </p>
    </form>
  );
}
