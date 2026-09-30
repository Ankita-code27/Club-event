import { getDb } from '../config/firebase.js';

const COLLECTION = 'events';

/** Throws a clear error if Firestore isn't configured, instead of a confusing crash deeper in. */
function requireDb() {
  const db = getDb();
  if (!db) {
    const err = new Error('Database is not configured. Set Firebase credentials in server/.env.');
    err.status = 503;
    throw err;
  }
  return db;
}

function toEvent(doc) {
  return { id: doc.id, ...doc.data() };
}

/** Active (non-deleted) events, newest-dated first is NOT assumed — sorted by date ascending. */
export async function listActiveEvents() {
  const db = requireDb();
  const snap = await db.collection(COLLECTION).where('active', '==', true).orderBy('date', 'asc').get();
  return snap.docs.map(toEvent);
}

/** All events including soft-deleted ones — for the admin dashboard. */
export async function listAllEvents() {
  const db = requireDb();
  const snap = await db.collection(COLLECTION).orderBy('date', 'asc').get();
  return snap.docs.map(toEvent);
}

export async function getEventById(id) {
  const db = requireDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return toEvent(doc);
}

export async function createEvent(data) {
  const db = requireDb();
  const now = new Date().toISOString();
  const ref = await db.collection(COLLECTION).add({
    ...data,
    featured: Boolean(data.featured),
    registrationStatus: data.registrationStatus || 'open',
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return getEventById(ref.id);
}

export async function updateEvent(id, data) {
  const db = requireDb();
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  return getEventById(id);
}

/** Soft-delete: keeps the event (and its registrations) but hides it from public listings. */
export async function softDeleteEvent(id) {
  const db = requireDb();
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ active: false, updatedAt: new Date().toISOString() });
  return getEventById(id);
}
