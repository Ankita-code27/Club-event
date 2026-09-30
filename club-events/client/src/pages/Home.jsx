import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar, Compass } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import MissionSection from '../components/MissionSection.jsx';
import EventCard from '../components/EventCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getEvents, pickFeatured, pickUpcoming } from '../services/eventsApi.js';
import './Home.css';

export default function Home() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [events, setEvents] = useState([]);

  const load = () => {
    setStatus('loading');
    getEvents()
      .then((data) => {
        setEvents(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const featured = status === 'ready' ? pickFeatured(events) : null;
  const upcoming = status === 'ready' ? pickUpcoming(events, featured, 3) : [];

  return (
    <div className="home-page animate-fade-in">
      <Hero />

      <MissionSection />

      {/* Featured Event Showcase */}
      {featured && (
        <section id="featured-section" className="home-section home-section--featured">
          <div className="container">
            <div className="home-section__head">
              <div>
                <div className="kicker-tag">
                  <Sparkles size={13} />
                  Spotlight
                </div>
                <h2 className="home-section__title">Featured Event</h2>
              </div>
              <Link to="/events" className="home-section__see-all">
                Explore full calendar <ArrowRight size={15} />
              </Link>
            </div>

            <div className="home-section__featured-container">
              <EventCard event={featured} />
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Grid */}
      <section className="home-section home-section--upcoming">
        <div className="container">
          <div className="home-section__head">
            <div>
              <div className="kicker-tag">
                <Calendar size={13} />
                Calendar
              </div>
              <h2 className="home-section__title">Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn btn--secondary btn--sm">
              View all events <ArrowRight size={15} />
            </Link>
          </div>

          {status === 'loading' && <Spinner label="Loading upcoming events..." />}
          {status === 'error' && <ErrorState onRetry={load} />}
          {status === 'ready' && upcoming.length === 0 && (
            <EmptyState
              title="No upcoming events yet"
              description="New events will show up here as soon as they're scheduled. Check back soon."
            />
          )}
          {status === 'ready' && upcoming.length > 0 && (
            <div className="home-section__grid">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Club CTA Banner */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-card">
            <div className="home-cta-content">
              <div className="home-cta-badge">Join NEXORA</div>
              <h2 className="home-cta-title">Ready to build something unforgettable?</h2>
              <p className="home-cta-desc">
                Whether you are an aspiring engineer, designer, or community creator, NEXORA offers hands-on workshops, hackathons, and a community to grow with.
              </p>
              <div className="home-cta-actions">
                <Link to="/events" className="btn btn--primary btn--lg">
                  Browse Events <ArrowRight size={18} />
                </Link>
                <Link to="/admin/login" className="btn btn--ghost btn--lg home-cta-ghost-btn">
                  Club Organizers Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
