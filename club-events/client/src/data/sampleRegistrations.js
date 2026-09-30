/**
 * SAMPLE / IN-MEMORY registration store for development only.
 * Simulates the Firestore "registrations" collection and duplicate-email
 * check that Phase 6 implements for real on the backend.
 *
 * NOTE: this list resets on every page refresh, since it's just an array
 * in memory — that's expected until Phase 6 connects the real database.
 */
let registrations = [
  {
    registrationId: 'seed-1',
    eventId: 'sample-1',
    eventName: 'Intro to Git & GitHub',
    studentName: 'Priya Sharma',
    email: 'priya.sharma@example.edu',
    collegeYear: '2nd year',
    phone: '9876543210',
    registeredAt: new Date().toISOString(),
  },
];

const genId = () => `reg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/**
 * Simulates a POST /api/registrations call: network delay, a duplicate-email
 * check per event, and either a stored registration or a rejection.
 */
export function registerForEventSimulated({ eventId, eventName, studentName, email, collegeYear, phone, shouldFail = false }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject({ code: 'network_error', message: 'Something went wrong. Please try again.' });
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      const isDuplicate = registrations.some(
        (r) => r.eventId === eventId && r.email.toLowerCase() === normalizedEmail
      );
      if (isDuplicate) {
        reject({ code: 'duplicate', message: 'This email is already registered for this event.' });
        return;
      }
      const record = {
        registrationId: genId(),
        eventId,
        eventName,
        studentName: studentName.trim(),
        email: email.trim(),
        collegeYear,
        phone: phone.trim(),
        registeredAt: new Date().toISOString(),
      };
      registrations = [...registrations, record];
      resolve(record);
    }, 600);
  });
}

export function getSimulatedRegistrations() {
  return registrations;
}

export const sampleRegistrations = registrations;
