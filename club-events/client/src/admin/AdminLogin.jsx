import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import Logo from "../components/Logo.jsx";
import { auth, firebaseConfigured } from "../services/firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminLogin.css";

// Firebase's own error codes, translated into messages a non-technical admin
// can act on, without confirming whether an email exists (avoids account
// enumeration).
function friendlyAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already signed in? Skip straight to the dashboard (or wherever they were headed).
  if (user) {
    const redirectTo = location.state?.from?.pathname || "/admin";
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    if (!firebaseConfigured || !auth) {
      setError("Firebase is not configured for this deployment yet.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged (in AuthContext) picks this up; RequireAdmin then
      // lets the dashboard render. No manual navigate needed on success.
    } catch (err) {
      setError(friendlyAuthError(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page animate-fade-in">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <Logo size={36} />
          </div>
          <div className="kicker-tag" style={{ margin: "0 auto 10px" }}>
            <Lock size={12} />
            Organizer Access
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">
            Sign in to manage club events, registrations, attendees, and publish
            announcements.
          </p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form" noValidate>
          <FormField
            label="Organizer Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nexora.club"
            autoComplete="username"
          />

          <FormField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="admin-login-submit"
          >
            Sign In to Dashboard <ArrowRight size={16} />
          </Button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-login-back">
            <ArrowLeft size={15} /> Return to student site
          </Link>
        </div>
      </div>
    </div>
  );
}
