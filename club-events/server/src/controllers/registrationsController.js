import * as Registrations from '../models/registrations.js';
import * as Events from '../models/events.js';
import { validateRegistrationPayload } from '../validators/registrationValidator.js';

export async function register(req, res, next) {
  try {
    const errors = validateRegistrationPayload(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Invalid registration data.', fields: errors });
    }

    const { eventId, studentName, email, collegeYear, phone } = req.body;

    const event = await Events.getEventById(eventId);
    if (!event || event.active === false) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    if (event.registrationStatus !== 'open') {
      return res.status(409).json({ error: 'Registration is closed for this event.' });
    }

    const existing = await Registrations.findRegistration(eventId, email);
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered for this event.' });
    }

    const registration = await Registrations.createRegistration({
      eventId,
      eventName: event.name,
      studentName,
      email,
      collegeYear,
      phone,
    });

    // Never echo back other students' data — only the record just created.
    res.status(201).json({ registration });
  } catch (err) { next(err); }
}

// Admin-only in intent; real enforcement is added in Phase 7.
export async function getRegistrations(req, res, next) {
  try {
    const { eventId, search } = req.query;
    const registrations = await Registrations.listRegistrations({ eventId, search });
    res.json({ registrations });
  } catch (err) { next(err); }
}
