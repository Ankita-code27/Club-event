import { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, Sparkles, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import EventCard from '../components/EventCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import Button from '../components/Button.jsx';
import { getEvents, CATEGORIES } from '../services/eventsApi.js';
import './Events.css';

export default function Events() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // forceFail is only used by the dev-only "Test error UI" button.
  const load = (forceFail = false) => {
    setStatus('loading');
    (forceFail ? Promise.reject(new Error('Simulated failure')) : getEvents())
      .then((data) => {
        setEvents(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesSearch = !term || e.name.toLowerCase().includes(term);
      const matchesCategory = !category || e.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const hasActiveFilters = search.trim() !== '' || category !== '';
  const clearFilters = () => {
    setSearch('');
    setCategory('');
  };

  return (
    <div className="container events-page animate-fade-in">
      <div className="events-page__header">
        <div className="kicker-tag">
          <Calendar size={13} />
          Explore & Attend
        </div>
        <h1 className="events-page__title">Events Directory</h1>
        <p className="events-page__desc">
          Browse everything happening at NEXORA. Filter by category, search by topic, or RSVP for upcoming sessions.
        </p>
      </div>

      <div className="events-page__toolbar">
        <div className="events-page__search-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search events by keyword or topic..." />
        </div>
        <div className="events-page__filter-wrap">
          <CategoryFilter categories={CATEGORIES} value={category} onChange={setCategory} />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="events-page__clear-btn">
            Clear filters
          </Button>
        )}
        {import.meta.env.DEV && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => load(true)}
            className="events-page__dev-btn"
          >
            <RefreshCw size={13} /> Test error UI
          </Button>
        )}
      </div>

      {status === 'ready' && (
        <div className="events-page__count-strip">
          <span className="events-page__count-label">
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'event' : 'events'}
            {category && ` in "${category}"`}
            {search && ` matching "${search}"`}
          </span>
        </div>
      )}

      {status === 'loading' && <Spinner label="Loading schedule and events..." />}

      {status === 'error' && <ErrorState onRetry={() => load()} />}

      {status === 'ready' && filtered.length === 0 && (
        <EmptyState actionLabel={hasActiveFilters ? 'Clear filters' : undefined} onAction={clearFilters} />
      )}

      {status === 'ready' && filtered.length > 0 && (
        <div className="events-page__grid">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
