/**
 * Server-side registration validation. Mirrors client/src/services/validators.js
 * intentionally — the frontend and backend run in separate processes, and the
 * backend must never trust frontend validation alone.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export function validateRegistrationPayload(body) {
  const errors = {};
  const { eventId, studentName, email, collegeYear, phone } = body || {};

  if (!eventId || typeof eventId !== 'string' || !eventId.trim()) errors.eventId = 'Event ID is required.';
  if (!studentName || typeof studentName !== 'string' || !studentName.trim()) errors.studentName = 'Full name is required.';
  if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) errors.email = 'A valid email is required.';
  if (!collegeYear || typeof collegeYear !== 'string' || !collegeYear.trim()) errors.collegeYear = 'College and year are required.';
  if (!phone || typeof phone !== 'string' || !PHONE_PATTERN.test(phone.trim())) errors.phone = 'A valid phone number (7–15 digits) is required.';

  return errors;
}

export function validateEventPayload(body, { partial = false } = {}) {
  const errors = {};
  const required = ['name', 'category', 'date', 'time', 'venue', 'description'];
  for (const field of required) {
    const value = body?.[field];
    const missing = value === undefined || value === null || (typeof value === 'string' && !value.trim());
    if (missing && !(partial && value === undefined)) {
      errors[field] = `${field} is required.`;
    }
  }
  if (body?.registrationStatus && !['open', 'closed'].includes(body.registrationStatus)) {
    errors.registrationStatus = "registrationStatus must be 'open' or 'closed'.";
  }
  return errors;
}
