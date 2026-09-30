import { Link } from "react-router-dom";
import { AtSign, Globe, Mail, Sparkles, Heart } from "lucide-react";
import Logo from "./Logo.jsx";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo size={32} />
          <p className="footer__tagline">Connect • Create • Celebrate</p>
          <p className="footer__bio">
            NEXORA is a premier student-run organization fostering innovation,
            engineering, design, and collaborative campus leadership.
          </p>
        </div>

        <nav className="footer__col" aria-label="Navigation">
          <h4 className="footer__heading">Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Events Directory</Link>
          <Link to="/about">About NEXORA</Link>
          <Link to="/contact">Contact & Team</Link>
          <Link to="/admin/login" className="footer__admin-pill">
            Admin Portal
          </Link>
        </nav>

        <div className="footer__col">
          <h4 className="footer__heading">Community & Links</h4>
          <a
            href="#"
            aria-label="NEXORA on Instagram"
            className="footer__icon-link"
          >
            <AtSign size={16} /> Instagram
          </a>
          <a
            href="#"
            aria-label="NEXORA on LinkedIn"
            className="footer__icon-link"
          >
            <Globe size={16} /> LinkedIn
          </a>
          <a href="mailto:hello@nexora.club" className="footer__icon-link">
            <Mail size={16} /> hello@nexora.club
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <p className="footer__copyright">
          © {year} NEXORA Club. All rights reserved.
        </p>
        <p className="footer__built-with">
          Designed with precision & community spirit
        </p>
      </div>
    </footer>
  );
}
