export function getSessionId() {
  if (typeof window === 'undefined') return 'server-session';
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function parseUserAgent(ua) {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device_type = 'Desktop';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  if (ua.includes('Android')) os = 'Android';
  if (ua.includes('like Mac')) os = 'iOS';

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device_type = 'Tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle/i.test(ua)) {
    device_type = 'Mobile';
  }

  return { browser, os, device_type };
}

function postTrack(kind, payload) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({ kind, payload });
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/track', blob);
    return;
  }
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView(path, title) {
  if (typeof window === 'undefined' || !path || path.startsWith('/admin')) return;
  const session_id = getSessionId();
  const { browser, os, device_type } = parseUserAgent(navigator.userAgent || '');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const country = tz.split('/')[0] || 'Unknown';

  postTrack('page_view', {
    session_id,
    path,
    title: title || document.title,
    referrer: document.referrer || 'Direct',
    browser,
    os,
    device_type,
    country,
  });
}

export function trackSectionView(section_id, time_spent_ms, max_scroll_depth_percent = 100) {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return;
  if (!section_id || time_spent_ms < 1000) return;

  postTrack('section_view', {
    session_id: getSessionId(),
    section_id,
    time_spent_ms: Math.round(time_spent_ms),
    max_scroll_depth_percent: Math.round(max_scroll_depth_percent),
  });
}

export function trackEvent(event_type, target_id = null, metadata = {}) {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return;
  postTrack('event', {
    session_id: getSessionId(),
    event_type,
    target_id,
    metadata,
    path: window.location.pathname,
  });
}
