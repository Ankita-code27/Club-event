import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, ShieldCheck, Users, Sparkles, Share2 } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { getEvent } from '../services/eventsApi.js';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', event: null }); // 'loading' | 'error' | 'notfound' | 'ready'
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setState({ status: 'loading', event: null });
    getEvent(id)
      .then((event) => setState({ status: 'ready', event }))
      .catch((err) => setState({ status: err.status === 404 ? 'notfound' : 'error', event: null }));
  };

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', event: null });
    getEvent(id)
      .then((event) => !cancelled && setState({ status: 'ready', event }))
      .catch((err) => !cancelled && setState({ status: err.status === 404 ? 'notfound' : 'error', event: null }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { event } = state;

  if (state.status === 'loading') {
    return (
      <div className="container event-details-page">
        <Spinner label="Loading event..." />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="container event-details-page">
        <ErrorState title="Couldn't load this event" onRetry={load} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container event-details-page">
        <EmptyState
          title="Event not found"
          description="This event may have been removed, or the link is incorrect."
          actionLabel="Back to all events"
          onAction={() => navigate('/events')}
        />
      </div>
    );
  }

  const { name, category, date, time, venue, description, status } = event;
  const statusTone = status === 'open' ? 'success' : status === 'closed' ? 'warning' : 'neutral';
  const statusLabel = status === 'open' ? 'Registration open' : status === 'closed' ? 'Registration closed' : 'Past event';
  const dateLabel = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="container event-details-page animate-fade-in">
      <Link to="/events" className="event-details__back">
        <ArrowLeft size={16} aria-hidden="true" /> Back to events directory
      </Link>

      <div className="event-details__layout">
        {/* Main Info Column */}
        <div className="event-details__main">
          <div className="event-details__badges">
            {category && <Badge tone="accent">{category}</Badge>}
            <Badge tone={statusTone}>{statusLabel}</Badge>
          </div>

          <h1 className="event-details__title">{name}</h1>

          <div className="event-details__section">
            <h3 className="event-details__section-title">About this event</h3>
            <p className="event-details__desc">{description}</p>
          </div>

          <div className="event-details__features-grid">
            <div className="event-details__feature-box">
              <ShieldCheck className="event-details__feature-icon" size={20} />
              <div>
                <h4>Official Club Event</h4>
                <p>Organized by NEXORA student leadership team.</p>
              </div>
            </div>
            <div className="event-details__feature-box">
              <Users className="event-details__feature-icon" size={20} />
              <div>
                <h4>Open to All Students</h4>
                <p>All departments and experience levels are welcome.</p>
              </div>
            </div>
          </div>

          {/* Registration form embedded inside main column when active */}
          {showForm && (
            <div id="rsvp-form" className="event-details__form-wrapper animate-scale-in">
              <RegistrationForm
                eventId={event.id}
                eventName={name}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}
        </div>

        {/* Sidebar / Quick Action Card */}
        <aside className="event-details__sidebar">
          <div className="event-details__card">
            <div className="event-details__card-header">
              <span className="event-details__card-eyebrow">Event Details</span>
              <Badge tone={statusTone}>{statusLabel}</Badge>
            </div>

            <ul className="event-details__meta-list">
              <li className="event-details__meta-item">
                <div className="event-details__meta-icon">
                  <Calendar size={18} aria-hidden="true" />
                </div>
                <div className="event-details__meta-text">
                  <span className="event-details__meta-label">Date</span>
                  <span className="event-details__meta-value">{dateLabel}</span>
                </div>
              </li>

              <li className="event-details__meta-item">
                <div className="event-details__meta-icon">
                  <Clock size={18} aria-hidden="true" />
                </div>
                <div className="event-details__meta-text">
                  <span className="event-details__meta-label">Time</span>
                  <span className="event-details__meta-value">{time}</span>
                </div>
              </li>

              <li className="event-details__meta-item">
                <div className="event-details__meta-icon">
                  <MapPin size={18} aria-hidden="true" />
                </div>
                <div className="event-details__meta-text">
                  <span className="event-details__meta-label">Location / Venue</span>
                  <span className="event-details__meta-value">{venue}</span>
                </div>
              </li>
            </ul>

            <div className="event-details__cta-wrap">
              {status === 'open' && !showForm && (
                <Button
                  variant="primary"
                  size="lg"
                  className="event-details__rsvp-btn"
                  onClick={() => {
                    setShowForm(true);
                    setTimeout(() => {
                      document.getElementById('rsvp-form')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                >
                  Register for this Event
                </Button>
              )}

              {status !== 'open' && (
                <Button variant="secondary" size="lg" disabled className="event-details__rsvp-btn">
                  {statusLabel}
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
