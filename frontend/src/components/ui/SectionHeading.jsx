export default function SectionHeading({
  label,
  title,
  children,
  align = "left",
  id,
}) {
  return (
    <div
      className={`section-heading ${align === "center" ? "is-centered" : ""}`}
      id={id}
    >
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
