import { apiRequest, authedRequest } from './api.js';

/** Public: create a registration. Throws Error(message) — e.g. duplicate email → 409 message. */
export async function registerForEvent({ eventId, studentName, email, collegeYear, phone }) {
  const { registration } = await apiRequest('/registrations', {
    method: 'POST',
    body: { eventId, studentName, email, collegeYear, phone },
  });
  return registration;
}

/** Admin: list registrations, optionally filtered by eventId and/or search text. */
export async function getRegistrations({ eventId, search } = {}) {
  const params = new URLSearchParams();
  if (eventId) params.set('eventId', eventId);
  if (search) params.set('search', search);
  const qs = params.toString();
  const { registrations } = await authedRequest(`/registrations${qs ? `?${qs}` : ''}`);
  return registrations;
}
