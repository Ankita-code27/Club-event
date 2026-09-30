import "./Badge.css";

/** tone: 'accent' | 'success' | 'warning' | 'error' | 'neutral' */
export default function Badge({ tone = "neutral", children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
