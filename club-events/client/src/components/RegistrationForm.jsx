import { useState } from 'react';
import { CheckCircle2, UserCheck, Sparkles, X } from 'lucide-react';
import FormField from './FormField.jsx';
import Button from './Button.jsx';
import ErrorState from './ErrorState.jsx';
import { validateRegistrationForm } from '../services/validators.js';
import { registerForEvent } from '../services/registrationsApi.js';
import './RegistrationForm.css';

const YEAR_OPTIONS = ['1st year', '2nd year', '3rd year', '4th year', 'Faculty/Staff', 'Other'];

const EMPTY_FORM = { studentName: '', email: '', college: '', year: '', phone: '' };

export default function RegistrationForm({ eventId, eventName, onClose }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [submitError, setSubmitError] = useState(null);
  const [failNext, setFailNext] = useState(false); // dev-only toggle

  const setField = (name) => (e) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, [name]: val }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateRegistrationForm({ ...values, [name]: val })[name] }));
    }
  };
  const markTouched = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateRegistrationForm(values);
    setErrors(fieldErrors);
    setTouched({ studentName: true, email: true, college: true, year: true, phone: true });
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus('submitting');
    setSubmitError(null);
    // failNext is the dev-only "simulate failure" toggle; it skips the real call.
    (failNext
      ? Promise.reject(new Error('Something went wrong. Please try again.'))
      : registerForEvent({
          eventId,
          studentName: values.studentName,
          email: values.email,
          collegeYear: `${values.college} — ${values.year}`,
          phone: values.phone,
        })
    )
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setSubmitError(err.message || 'Something went wrong.');
      });
    setFailNext(false);
  };

  if (status === 'success') {
    return (
      <div className="registration-form registration-form__success animate-scale-in" role="status">
        <div className="registration-form__success-icon-wrap">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>
        <div className="kicker-tag" style={{ margin: '0 auto 12px' }}>
          <Sparkles size={13} />
          Confirmation Confirmed
        </div>
        <h3 className="registration-form__success-title">You're registered!</h3>
        <p className="registration-form__success-desc">
          A confirmation ticket has been recorded for <strong>{values.email}</strong>. We can't wait to see you at{' '}
          <strong>{eventName}</strong>.
        </p>
        {onClose && (
          <Button variant="secondary" size="md" onClick={onClose}>
            Done
          </Button>
        )}
      </div>
    );
  }

  return (
    <form className="registration-form animate-fade-in" onSubmit={handleSubmit} noValidate>
      <div className="registration-form__head">
        <div>
          <div className="kicker-tag" style={{ marginBottom: 6 }}>
            <UserCheck size={13} />
            Student RSVP
          </div>
          <h3 className="registration-form__title">Register for {eventName}</h3>
        </div>
        {onClose && (
          <button
            type="button"
            className="registration-form__close-btn"
            onClick={onClose}
            aria-label="Close registration form"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {status === 'error' && (
        <ErrorState
          title="Registration failed"
          description={submitError}
          onRetry={() => {
            setStatus('idle');
            setSubmitError(null);
          }}
        />
      )}

      {status !== 'error' && (
        <>
          <div className="registration-form__grid">
            <FormField
              label="Full name"
              required
              placeholder="e.g. Alex Johnson"
              value={values.studentName}
              onChange={setField('studentName')}
              onBlur={markTouched('studentName')}
              error={touched.studentName ? errors.studentName : undefined}
            />
            <FormField
              label="Student email"
              type="email"
              required
              placeholder="alex@university.edu"
              value={values.email}
              onChange={setField('email')}
              onBlur={markTouched('email')}
              error={touched.email ? errors.email : undefined}
            />
          </div>

          <div className="registration-form__grid">
            <FormField
              label="College / Institution"
              required
              placeholder="e.g. Springfield University"
              value={values.college}
              onChange={setField('college')}
              onBlur={markTouched('college')}
              error={touched.college ? errors.college : undefined}
            />
            <FormField
              as="select"
              label="Academic Year"
              required
              value={values.year}
              onChange={setField('year')}
              onBlur={markTouched('year')}
              error={touched.year ? errors.year : undefined}
            >
              <option value="" disabled>
                Select year
              </option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FormField>
          </div>

          <FormField
            label="Phone number"
            type="tel"
            required
            placeholder="10-digit mobile number"
            value={values.phone}
            onChange={setField('phone')}
            onBlur={markTouched('phone')}
            error={touched.phone ? errors.phone : undefined}
          />

          {import.meta.env.DEV && (
            <label className="registration-form__dev-toggle">
              <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} />
              Simulate failure on next submit (dev only)
            </label>
          )}

          <div className="registration-form__actions">
            <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting registration…' : 'Confirm Registration'}
            </Button>
            {onClose && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={onClose}
                disabled={status === 'submitting'}
              >
                Cancel
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
