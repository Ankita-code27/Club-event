/**
 * One-time script to load sample events into Firestore, so the frontend has
 * real data to display once Phase 9 connects it to the real API.
 *
 * Usage (from the server/ folder, with server/.env filled in):
 *   node scripts/seedEvents.js
 *
 * Safe to re-run: it checks for an existing event with the same name before
 * adding, so it won't create duplicates.
 */
import '../src/config/env.js';
import { firebaseConfigured, getDb } from '../src/config/firebase.js';

if (!firebaseConfigured) {
  console.error('Firebase is not configured. Fill in server/.env first, then re-run this script.');
  process.exit(1);
}

const today = new Date();
const inDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const sampleEvents = [
  { name: 'Intro to Git & GitHub', category: 'Workshop', date: inDays(6), time: '5:00 PM', venue: 'Seminar Hall 2', description: 'A hands-on session covering version control basics, branching, and opening your first pull request.', featured: true, registrationStatus: 'open' },
  { name: 'Design Systems 101', category: 'Talk', date: inDays(13), time: '4:30 PM', venue: 'Design Lab', description: 'An introduction to tokens, components, and building consistent interfaces at scale.', featured: false, registrationStatus: 'open' },
  { name: 'NEXORA Hack Night', category: 'Hackathon', date: inDays(20), time: '6:00 PM', venue: 'Innovation Hub', description: 'A relaxed overnight build session — bring a team or find one when you arrive.', featured: false, registrationStatus: 'open' },
  { name: 'Portfolio Review Circle', category: 'Workshop', date: inDays(27), time: '3:00 PM', venue: 'Room 214', description: 'Peer feedback on personal projects and portfolios, with tips from senior members.', featured: false, registrationStatus: 'open' },
  { name: 'Welcome Mixer', category: 'Social', date: inDays(3), time: '7:00 PM', venue: 'Courtyard', description: 'Meet the club over snacks and casual games. Open to anyone curious about NEXORA.', featured: false, registrationStatus: 'open' },
];

async function seed() {
  const db = getDb();
  let created = 0;
  let skipped = 0;

  for (const event of sampleEvents) {
    const existing = await db.collection('events').where('name', '==', event.name).limit(1).get();
    if (!existing.empty) {
      skipped += 1;
      continue;
    }
    const now = new Date().toISOString();
    await db.collection('events').add({ ...event, active: true, createdAt: now, updatedAt: now });
    created += 1;
  }

  console.log(`Seed complete: ${created} event(s) created, ${skipped} already existed and were skipped.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
