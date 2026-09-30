import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on resize back to desktop
  useEffect(() => {
    const onResize = () => window.innerWidth > 720 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__row">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <Logo size={32} />
        </NavLink>

        <nav className="navbar__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="navbar__link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/admin/login" className="navbar__admin-link">
            Admin
          </Link>
          <Link to="/events" className="btn btn--primary btn--sm">
            Explore events
          </Link>
        </div>

        <button
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="navbar__mobile animate-fade-in" aria-label="Mobile">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="navbar__mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/login"
            className="navbar__mobile-link"
            onClick={() => setOpen(false)}
          >
            Admin Portal
          </NavLink>
          <Link
            to="/events"
            className="btn btn--primary btn--md navbar__mobile-cta"
            onClick={() => setOpen(false)}
          >
            Explore events
          </Link>
        </nav>
      )}
    </header>
  );
}
