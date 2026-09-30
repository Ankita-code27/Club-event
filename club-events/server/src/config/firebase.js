import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { env } from './env.js';

const { projectId, clientEmail, privateKey } = env.firebase;
const looksLikePlaceholder =
  !privateKey || privateKey.includes('REPLACE_ME') || projectId === 'your-project-id';

export const firebaseConfigured = Boolean(projectId && clientEmail && !looksLikePlaceholder);

if (firebaseConfigured) {
  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
  console.log('[firebase] Admin SDK initialised.');
} else {
  console.warn(
    '[firebase] Credentials missing or still placeholders. Server will run, but database ' +
      'and auth features stay disabled until server/.env is filled in.'
  );
}

/** Returns the Firestore instance, or null when Firebase is not configured. */
export const getDb = () => (firebaseConfigured ? getFirestore() : null);

/** Returns the Firebase Auth instance, or null when Firebase is not configured. */
export const getAuth = () => (firebaseConfigured ? getAdminAuth() : null);
