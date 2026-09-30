import { getDb } from '../config/firebase.js';

const COLLECTION = 'registrations';

function requireDb() {
  const db = getDb();
  if (!db) {
    const err = new Error('Database is not configured. Set Firebase credentials in server/.env.');
    err.status = 503;
    throw err;
  }
  return db;
}

function toRegistration(doc) {
  return { id: doc.id, ...doc.data() };
}

/** Case-insensitive: emails are stored lowercased for the duplicate check to be reliable. */
export async function findRegistration(eventId, email) {
  const db = requireDb();
  const normalizedEmail = email.trim().toLowerCase();
  const snap = await db
    .collection(COLLECTION)
    .where('eventId', '==', eventId)
    .where('emailLower', '==', normalizedEmail)
    .limit(1)
    .get();
  return snap.empty ? null : toRegistration(snap.docs[0]);
}

export async function createRegistration({ eventId, eventName, studentName, email, collegeYear, phone }) {
  const db = requireDb();
  const now = new Date().toISOString();
  const ref = await db.collection(COLLECTION).add({
    eventId,
    eventName,
    studentName: studentName.trim(),
    email: email.trim(),
    emailLower: email.trim().toLowerCase(),
    collegeYear,
    phone: phone.trim(),
    registeredAt: now,
  });
  const doc = await ref.get();
  return toRegistration(doc);
}

/** For the admin dashboard. Optional filters: eventId, search (matches name or email, case-insensitive prefix). */
export async function listRegistrations({ eventId, search } = {}) {
  const db = requireDb();
  let query = db.collection(COLLECTION).orderBy('registeredAt', 'desc');
  if (eventId) query = query.where('eventId', '==', eventId);
  const snap = await query.get();
  let results = snap.docs.map(toRegistration);

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter(
      (r) => r.studentName.toLowerCase().includes(term) || r.email.toLowerCase().includes(term)
    );
  }
  return results;
}
