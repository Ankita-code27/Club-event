import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import DateBlock from "./DateBlock.jsx";
import Badge from "./Badge.jsx";
import "./EventCard.css";

/**
 * Editorial Event Card with high-impact typography and metadata hierarchy.
 */
export default function EventCard({ event }) {
  if (!event) return null;
  const {
    id,
    name,
    category,
    date,
    time,
    venue,
    description,
    status = "open",
    featured,
  } = event;

  const statusTone =
    status === "open" ? "success" : status === "closed" ? "warning" : "neutral";
  const statusLabel =
    status === "open" ? "Open" : status === "closed" ? "Closed" : "Past event";

  return (
    <article className={`event-card ${featured ? "event-card--featured" : ""}`}>
      <div className="event-card__date-col">
        <DateBlock date={date} size={featured ? "lg" : "md"} />
      </div>

      <div className="event-card__body">
        <div className="event-card__top">
          <div className="event-card__badges">
            {category && <Badge tone="accent">{category}</Badge>}
            {featured && (
              <span className="event-card__featured-tag">
                <Sparkles size={12} /> Featured
              </span>
            )}
          </div>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>

        <h3 className="event-card__title">
          <Link to={`/events/${id}`} className="event-card__title-link">
            {name}
          </Link>
        </h3>

        <div className="event-card__meta">
          <span className="event-card__meta-item">
            <Clock size={15} aria-hidden="true" /> {time}
          </span>
          <span className="event-card__dot" aria-hidden="true">
            •
          </span>
          <span className="event-card__meta-item">
            <MapPin size={15} aria-hidden="true" /> {venue}
          </span>
        </div>

        {description && <p className="event-card__desc">{description}</p>}

        <div className="event-card__footer">
          <Link to={`/events/${id}`} className="event-card__link">
            <span>View details & RSVP</span>
            <ArrowRight
              size={15}
              className="event-card__arrow"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
