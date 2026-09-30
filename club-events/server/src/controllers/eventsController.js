import * as Events from '../models/events.js';
import { validateEventPayload } from '../validators/registrationValidator.js';

export async function getEvents(_req, res, next) {
  try {
    const events = await Events.listActiveEvents();
    res.json({ events });
  } catch (err) { next(err); }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Events.getEventById(req.params.id);
    if (!event || event.active === false) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json({ event });
  } catch (err) { next(err); }
}

// Admin-only in intent; real enforcement (token verification) is added in Phase 7.
export async function createEvent(req, res, next) {
  try {
    const errors = validateEventPayload(req.body);
    if (Object.keys(errors).length > 0) return res.status(400).json({ error: 'Invalid event data.', fields: errors });
    const event = await Events.createEvent(req.body);
    res.status(201).json({ event });
  } catch (err) { next(err); }
}

export async function updateEvent(req, res, next) {
  try {
    const errors = validateEventPayload(req.body, { partial: true });
    if (Object.keys(errors).length > 0) return res.status(400).json({ error: 'Invalid event data.', fields: errors });
    const event = await Events.updateEvent(req.params.id, req.body);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json({ event });
  } catch (err) { next(err); }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Events.softDeleteEvent(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json({ event, message: 'Event archived. Registrations were kept.' });
  } catch (err) { next(err); }
}

export async function getAllEventsAdmin(_req, res, next) {
  try {
    const events = await Events.listAllEvents();
    res.json({ events });
  } catch (err) { next(err); }
}
