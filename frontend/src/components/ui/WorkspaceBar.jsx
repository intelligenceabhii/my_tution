import { NavLink } from "react-router-dom";
import Icon from "./Icon";
export default function WorkspaceBar({ role }) {
  const dashboard =
    role === "tutor"
      ? "/tutor/dashboard"
      : role === "admin"
        ? "/admin"
        : "/parent/dashboard";
  const links = role === "admin"
    ? [["chart", "Platform overview", "/admin"]]
    : role === "tutor"
      ? [["book", "Teaching dashboard", dashboard], ["message", "Messages", "/messages"], ["chart", "Learning progress", "/learning"]]
      : [["book", "My requirements", dashboard], ["search", "Find teachers", "/find-tutors"], ["heart", "Saved teachers", "/favorites"], ["message", "Messages", "/messages"], ["chart", "Learning progress", "/learning"]];
  return (
    <div className="workspace-bar">
      <div className="design-container">
        <span className="workspace-label">
          {role === "admin"
            ? "PLATFORM WORKSPACE"
            : role === "tutor"
              ? "YOUR TEACHING SPACE"
              : "YOUR LEARNING SPACE"}
        </span>
        <nav aria-label="Workspace navigation">
          {links.map(([icon, label, to]) => (
            <NavLink key={label} to={to}>
              <Icon name={icon} size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
