import { CalendarSearch } from "lucide-react";
import Button from "./Button.jsx";
import "./EmptyState.css";

export default function EmptyState({
  title = "No events match your search",
  description = "Try a different name or clear your filters to see everything.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <CalendarSearch
        size={36}
        aria-hidden="true"
        className="empty-state__icon"
      />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
