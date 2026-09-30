import { useId } from "react";
import "./FormField.css";

/**
 * as: 'input' | 'select' | 'textarea'
 * Renders a label, the control, an optional hint, and an error message.
 * The error is announced via aria-live so screen reader users hear it
 * as soon as it appears, and the control gets aria-invalid + aria-describedby.
 */
export default function FormField({
  as = "input",
  label,
  hint,
  error,
  required,
  children,
  ...controlProps
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const Control = as;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <Control
        id={id}
        className={`field__control ${error ? "field__control--error" : ""}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        aria-required={required || undefined}
        {...controlProps}
      >
        {children}
      </Control>
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
