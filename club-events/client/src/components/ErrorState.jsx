import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";
import "./ErrorState.css";

export default function ErrorState({
  title = "Couldn't load events",
  description = "Something went wrong on our end. Try again in a moment.",
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <AlertTriangle
        size={36}
        aria-hidden="true"
        className="error-state__icon"
      />
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
