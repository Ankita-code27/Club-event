/**
 * NEXORA Brand Logo: A continuous single-ribbon geometric "N"
 * with a dynamic orbit line and floating nexus satellite node,
 * paired with the stylized NEXORΛ wordmark.
 */
import './Logo.css';

export default function Logo({ size = 34, withWordmark = true, className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="logo__symbol shrink-0"
      >
        <defs>
          {/* Orbit Arc Gradient */}
          <linearGradient id="nexoraOrbitGrad" x1="4" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="60%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0" />
          </linearGradient>
          {/* Single Continuous Ribbon N Gradient */}
          <linearGradient id="nexoraRibbonGrad" x1="6" y1="8" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="35%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>
          {/* Floating Satellite Node Gradient */}
          <linearGradient id="nexoraDotGrad" x1="33" y1="6" x2="41" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Orbit Swoosh behind bottom-left stem */}
        <path
          d="M4 33.5C2.5 30 4 25 9.5 22.5C18 18.5 32 15 38 12.5"
          stroke="url(#nexoraOrbitGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Single Continuous 3D Ribbon "N" */}
        <path
          d="M12 33.5V14.5C12 11.46 14.46 9 17.5 9C19.8 9 21.8 10.4 22.6 12.5L31.5 31C32.3 32.7 34 33.8 35.9 33.8C38.2 33.8 40 32 40 29.7V17"
          stroke="url(#nexoraRibbonGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Orbit Trajectory Line in front of right stem */}
        <path
          d="M28 17.5L34 15"
          stroke="#00D2FF"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Floating Satellite / Nexus Node */}
        <circle cx="37.5" cy="9.5" r="4.2" fill="url(#nexoraDotGrad)" />
      </svg>

      {withWordmark && (
        <span className="logo__wordmark">
          <span>NEXOR</span>
          <svg width="17" height="21" viewBox="0 0 18 22" fill="none" className="logo__wordmark-a" aria-hidden="true">
            <path d="M1 20L9 2L17 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}
