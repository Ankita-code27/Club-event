import { getAuth, firebaseConfigured } from '../config/firebase.js';

/**
 * Verifies a Firebase ID token on the Authorization header and checks for
 * the admin custom claim. Grant that claim to a user with
 * `node scripts/setAdmin.js <email>` (run locally, never by this server).
 *
 * Replaces the Phase 6 placeholder, which unconditionally returned 501.
 */
export async function requireAdmin(req, res, next) {
  if (!firebaseConfigured) {
    return res.status(503).json({ error: 'Admin authentication is not configured on this server yet.' });
  }

  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.admin !== true) {
      return res.status(403).json({ error: 'This account does not have admin access.' });
    }
    req.admin = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
}
