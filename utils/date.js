/**
 * Formats a stored date (YYYY-MM-DD or ISO timestamp) in UTC so the calendar
 * date never shifts by +1/-1 day due to the viewer's local timezone.
 */
export function formatCalendarDate(
  value,
  options = { day: 'numeric', month: 'short', year: 'numeric' }
) {
  if (!value) return '';
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = match
    ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
    : new Date(raw);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}

export function formatDateRange(start, end, isCurrent) {
  const s = formatCalendarDate(start);
  const e = isCurrent ? 'Present' : formatCalendarDate(end);
  return [s, e].filter(Boolean).join(' – ');
}
