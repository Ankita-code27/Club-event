import { apiRequest, authedRequest } from './api.js';
import { isPastEvent } from '../utils/date.js';

export const CATEGORIES = ['Workshop', 'Talk', 'Hackathon', 'Social'];

/**
 * The UI works with one `status` field: 'open' | 'closed' | 'past'.
 * The backend stores `registrationStatus` ('open' | 'closed') and derives
 * nothing about "past". So: an event whose date has passed is 'past',
 * otherwise status mirrors registrationStatus.
 */
function toUiEvent(e) {
  const registrationStatus = e.registrationStatus === 'closed' ? 'closed' : 'open';
  const status = e.date && isPastEvent(e.date) ? 'past' : registrationStatus;
  return { ...e, status };
}

/** Only the fields the backend accepts (never send id/active/createdAt back). */
function toPayload(form) {
  return {
    name: form.name?.trim(),
    category: form.category,
    date: form.date,
    time: form.time?.trim(),
    venue: form.venue?.trim(),
    description: form.description?.trim(),
    featured: Boolean(form.featured),
    // 'past' is date-driven in the UI, so it is stored as registration closed.
    registrationStatus: form.status === 'open' ? 'open' : 'closed',
  };
}

// ---- Public ----
export async function getEvents() {
  const { events } = await apiRequest('/events');
  return events.map(toUiEvent);
}

export async function getEvent(id) {
  const { event } = await apiRequest(`/events/${encodeURIComponent(id)}`);
  return toUiEvent(event);
}

// ---- Admin (token attached automatically) ----
export async function getAllEventsAdmin() {
  const { events } = await authedRequest('/events/admin/all');
  return events.filter((e) => e.active !== false).map(toUiEvent);
}

export async function createEvent(form) {
  const { event } = await authedRequest('/events', { method: 'POST', body: toPayload(form) });
  return toUiEvent(event);
}

export async function updateEvent(id, form) {
  const { event } = await authedRequest(`/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: toPayload(form),
  });
  return toUiEvent(event);
}

export async function deleteEvent(id) {
  await authedRequest(`/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ---- Home page helpers (pure, operate on an already-fetched list) ----
export const pickFeatured = (events) => events.find((e) => e.featured && e.status !== 'past') || events.find((e) => e.status !== 'past') || null;
export const pickUpcoming = (events, featured, limit = 3) =>
  events.filter((e) => e.id !== featured?.id && e.status !== 'past').slice(0, limit);
