/**
 * Frontend validation helpers for the registration form.
 * These mirror the checks the backend will enforce for real in Phase 6 —
 * duplicated intentionally, since frontend and backend run in different
 * processes and can't literally share code without a build-time link.
 */

export function validateRequired(value) {
  return value && value.trim() !== '' ? null : 'This field is required.';
}

export function validateEmail(value) {
  if (!value || value.trim() === '') return 'Email is required.';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim()) ? null : 'Enter a valid email address.';
}

export function validatePhone(value) {
  if (!value || value.trim() === '') return 'Phone number is required.';
  const pattern = /^\+?[0-9]{7,15}$/;
  return pattern.test(value.trim()) ? null : 'Enter a valid phone number (7–15 digits).';
}

/**
 * Validates the whole registration form at once.
 * Returns an object of { fieldName: errorMessage } for invalid fields only.
 */
export function validateRegistrationForm(values) {
  const errors = {};
  const name = validateRequired(values.studentName);
  if (name) errors.studentName = name;

  const email = validateEmail(values.email);
  if (email) errors.email = email;

  const college = validateRequired(values.college);
  if (college) errors.college = college;

  const year = validateRequired(values.year);
  if (year) errors.year = year;

  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;

  return errors;
}
