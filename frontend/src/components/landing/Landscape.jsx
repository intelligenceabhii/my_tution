import { useId } from "react";
export default function Landscape({ className = "" }) {
  const id = useId();
  return (
    <svg
      className={`learning-landscape ${className}`}
      viewBox="0 0 1440 440"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-back`} x2="0" y2="1">
          <stop stopColor="#D2E8DA" />
          <stop offset="1" stopColor="#EEF5E9" />
        </linearGradient>
        <linearGradient id={`${id}-front`} x2="0" y2="1">
          <stop stopColor="#9FCBB4" />
          <stop offset="1" stopColor="#DAEBD6" />
        </linearGradient>
      </defs>
      <path
        d="M0 125C160 80 242 215 437 236S755 175 963 208 1240 90 1440 135V440H0Z"
        fill={`url(#${id}-back)`}
      />
      <path
        d="M0 232C138 186 214 244 347 300S673 370 884 302 1214 149 1440 255V440H0Z"
        fill={`url(#${id}-front)`}
      />
      <path
        d="M0 334c207-12 294 65 471 56s356-49 547-19 279 51 422 9v60H0Z"
        fill="#E8F1DF"
      />
      <g fill="none" stroke="#739D83" strokeWidth="2" opacity=".6">
        <path d="m58 351 2-28m0 18-8-9m9-1 7-10M1340 320l4-34m-3 18-8-9m10 2 9-12M126 379l-2-19m0 8-6-5m7 1 4-5" />
      </g>
      <g fill="#F7FAEB">
        <circle cx="60" cy="322" r="4" />
        <circle cx="1344" cy="284" r="4" />
        <circle cx="124" cy="357" r="3" />
      </g>
      <path
        d="M0 275c151-25 210 14 360 71M1130 288c144-44 221-23 310 3"
        stroke="#FFF"
        opacity=".3"
        fill="none"
      />
    </svg>
  );
}
