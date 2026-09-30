/**
 * One-time script: grants the admin custom claim to an existing Firebase
 * user, so they can sign in to /admin and pass the server's requireAdmin
 * check. There is deliberately no public admin sign-up page — an admin
 * account is created once in the Firebase Console (Authentication > Add
 * user), then promoted with this script.
 *
 * Usage (from the server/ folder, with server/.env filled in):
 *   node scripts/setAdmin.js admin@example.edu
 */
import '../src/config/env.js';
import { firebaseConfigured, getAuth } from '../src/config/firebase.js';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/setAdmin.js <email>');
  process.exit(1);
}

if (!firebaseConfigured) {
  console.error('Firebase is not configured. Fill in server/.env first, then re-run this script.');
  process.exit(1);
}

async function run() {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Done. ${email} (uid: ${user.uid}) now has admin access.`);
  console.log('They must sign out and sign back in for the new claim to take effect.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to set admin claim:', err.message);
  process.exit(1);
});
