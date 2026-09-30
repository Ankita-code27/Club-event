import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Public web config only. No service-account secrets belong here.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Only initialise when configured, so the app still loads without a .env file.
export const auth = firebaseConfigured ? getAuth(initializeApp(firebaseConfig)) : null;
