import { auth } from './firebase.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** Small wrapper around fetch that throws readable errors (with .status and .fields attached). */
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error('Could not reach the server. Check your connection and try again.');
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.fields = data.fields;
    throw err;
  }
  return data;
}

/**
 * Same as apiRequest, but attaches the signed-in admin's Firebase ID token.
 * getIdToken() returns a cached token and silently refreshes it when it is
 * close to expiry, so callers never manage tokens themselves.
 * The server (requireAdmin) is still the real security check.
 */
export async function authedRequest(path, options = {}) {
  const user = auth?.currentUser;
  if (!user) {
    const err = new Error('You are signed out. Please sign in again.');
    err.status = 401;
    throw err;
  }
  const token = await user.getIdToken();
  return apiRequest(path, { ...options, token });
}
