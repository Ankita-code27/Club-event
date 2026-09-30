import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

/**
 * Client-side route guard. This is a UX convenience, not the real security
 * boundary — the server's requireAdmin middleware is what actually protects
 * admin data. Even if someone bypassed this component, every admin API call
 * still requires a verified Firebase ID token with the admin claim.
 */
export default function RequireAdmin({ children }) {
  const { user, loading, firebaseConfigured } = useAuth();
  const location = useLocation();

  if (!firebaseConfigured) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-6)' }}>
        <h1>Admin sign-in unavailable</h1>
        <p>
          Firebase is not configured for this deployment yet. Add your Firebase web config to{' '}
          <code>client/.env</code> to enable admin sign-in.
        </p>
      </div>
    );
  }

  if (loading) {
    return <Spinner label="Checking admin session" />;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
