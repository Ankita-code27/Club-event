import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)', textAlign: 'center', maxWidth: 600 }}>
      <div className="kicker-tag" style={{ margin: '0 auto var(--space-4)' }}>
        404 • Page Not Found
      </div>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
        Lost in Campus Space?
      </h1>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-base)', margin: '0 auto var(--space-6)', lineHeight: 1.6 }}>
        The event or page you are looking for might have been moved, renamed, or is currently unavailable.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--primary btn--md">
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/events" className="btn btn--secondary btn--md">
          <Compass size={16} /> Browse Events
        </Link>
      </div>
    </div>
  );
}
