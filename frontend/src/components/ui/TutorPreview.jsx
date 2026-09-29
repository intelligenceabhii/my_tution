import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export default function TutorPreview({ tutor, compact = false }) {
  const [failedPhoto, setFailedPhoto] = useState(null);
  const photo = tutor.photo_path
    ? `${apiOrigin}${tutor.photo_path}`
    : tutor.photo;
  return (
    <article className={`teacher-preview ${compact ? "compact" : ""}`}>
      <div className="teacher-top">
        <div className="teacher-avatar">
          {photo && failedPhoto !== photo ? (
            <img
              src={photo}
              alt={tutor.full_name}
              loading="lazy"
              onError={() => setFailedPhoto(photo)}
            />
          ) : (
            <span>
              {tutor.full_name
                ?.split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </span>
          )}
        </div>
        <div>
          <h3>{tutor.full_name}</h3>
          <p>{tutor.qualification}</p>
        </div>
        {tutor.is_verified && (
          <span className="verified-tag">
            <Icon name="shield" size={15} /> Verified
          </span>
        )}
      </div>
      <div className="teacher-subjects">
        {(tutor.subjects || []).slice(0, 3).map((subject) => (
          <span key={subject}>{subject}</span>
        ))}
      </div>
      <div className="teacher-facts">
        <span>
          <Icon name="cap" size={15} />
          {tutor.experience_years || 0} years’ experience
        </span>
        <span>
          <Icon
            name={tutor.teaching_mode === "online" ? "monitor" : "pin"}
            size={15}
          />
          {tutor.teaching_mode === "online"
            ? "Online tuition"
            : tutor.area_in_ranchi || "Location on profile"}
        </span>
      </div>
      {tutor.rating > 0 && (
        <div className="teacher-rating">
          <Icon name="star" size={14} /> {Number(tutor.rating).toFixed(1)}
          {tutor.review_count
            ? ` · ${tutor.review_count} review${tutor.review_count === 1 ? "" : "s"}`
            : ""}
        </div>
      )}
      <div className="teacher-bottom">
        <span>
          {tutor.expected_fee != null ? (
            <>
              <strong>
                ₹{Number(tutor.expected_fee).toLocaleString("en-IN")}
              </strong>
              <small> / month</small>
            </>
          ) : (
            <small>Discuss fees with tutor</small>
          )}
        </span>
        <Link to={`/tutor/profile/${tutor.id}`}>
          View profile <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
