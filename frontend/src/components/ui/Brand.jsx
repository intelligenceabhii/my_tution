import { Link } from "react-router-dom";
export default function Brand({ compact = false }) {
  return (
    <Link to="/" className="brand" aria-label="MY Tuition home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M7 23V10l9 7 9-7v13M7 8l9 7 9-7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span>
          MY<span className="brand-light">Tuition</span>
          <span className="brand-dot">.</span>
        </span>
      )}
    </Link>
  );
}
