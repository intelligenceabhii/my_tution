import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Brand from "./ui/Brand";
import Icon from "./ui/Icon";
const informationColumns = [
  {
    title: "A little about us",
    links: [
      ["Our story", "/about-us"],
      ["Get in touch", "/contact"],
      ["Help & support", "/support"],
    ],
  },
  {
    title: "The important details",
    links: [
      ["Terms & conditions", "/terms"],
      ["Privacy policy", "/privacy"],
      ["Refund policy", "/refund"],
    ],
  },
];

function accountColumns(role) {
  if (role === "parent") return [
    { title: "Your learning", links: [["Parent dashboard", "/parent/dashboard"], ["Find a Teacher", "/find-tutors"], ["Explore subjects", "/subjects"], ["Saved tutors", "/favorites"], ["Learning progress", "/learning"]] },
    { title: "Stay connected", links: [["Messages", "/messages"], ["Help & support", "/support"], ["Get in touch", "/contact"]] },
  ];
  if (role === "tutor") return [
    { title: "Tutor workspace", links: [["Tutor dashboard", "/tutor/dashboard"], ["Learning progress", "/learning"], ["Messages", "/messages"]] },
    { title: "Teaching resources", links: [["Explore subjects", "/subjects"], ["Help & support", "/support"], ["Get in touch", "/contact"]] },
  ];
  if (role === "admin") return [
    { title: "Admin workspace", links: [["Admin dashboard", "/admin"], ["Messages", "/admin?tab=messages"]] },
    { title: "Platform", links: [["Explore subjects", "/subjects"], ["Help & support", "/support"], ["Get in touch", "/contact"]] },
  ];
  return [
    { title: "Find your guidance", links: [["Find a Teacher", "/find-tutors"], ["Explore subjects", "/subjects"], ["For parents", "/register"]] },
    { title: "Share your knowledge", links: [["Become a Tutor", "/register"], ["Sign in", "/login"], ["Help & support", "/support"]] },
  ];
}

export default function Footer() {
  const { user } = useAuth();
  const columns = [...accountColumns(user?.role), ...informationColumns];
  return (
    <footer className="site-footer">
      <div className="design-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>
              The right teacher can change everything.
              <br />
              Find yours, online or close to home.
            </p>
            <span className="footer-location">
              <Icon name="pin" size={15} /> Rooted in Ranchi, Jharkhand.
            </span>
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/merit_yard/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <Icon name="arrow" size={12} />
              </a>
              <a
                href="https://www.youtube.com/@merit_yard"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube <Icon name="arrow" size={12} />
              </a>
            </div>
          </div>
          <div className="footer-columns">
            {columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map(([title, to]) => (
                    <li key={title}>
                      <Link to={to}>{title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} MY Tuition. Made for meaningful
            learning.
          </p>
          <div>
            <a href="mailto:abhii.intelligence@gmail.com">
              Say hello <Icon name="mail" size={14} />
            </a>
            <a href="tel:+917979037065">+91 79790 37065</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
