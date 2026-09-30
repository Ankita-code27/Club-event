// Event dates are stored as "YYYY-MM-DD" and times as "HH:mm" (24-hour).

/** Parse "YYYY-MM-DD" as a local date (avoids the UTC off-by-one bug of new Date(str)). */
export function parseEventDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** An event counts as past once its whole day has ended. */
export function isPastEvent(dateStr, now = new Date()) {
  const endOfDay = parseEventDate(dateStr);
  endOfDay.setDate(endOfDay.getDate() + 1);
  return endOfDay <= now;
}

/** "17:00" -> "5:00 PM" */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatLongDate(dateStr) {
  return parseEventDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}
