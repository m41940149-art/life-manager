const API = 'https://www.googleapis.com/calendar/v3';
const key = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || 'AIzaSyB6FsHgT3c5vrTozxpGNRKwaCZJKNxjtWw';

async function request(path, options = {}) {
  const token = sessionStorage.getItem('googleCalendarAccessToken');
  if (!token) throw new Error('GOOGLE_NOT_CONNECTED');
  const url = `${API}${path}${path.includes('?') ? '&' : '?'}key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) sessionStorage.removeItem('googleCalendarAccessToken');
    throw new Error(body || `Google Calendar error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const isCalendarConnected = () => Boolean(sessionStorage.getItem('googleCalendarAccessToken'));
export const disconnectCalendar = () => sessionStorage.removeItem('googleCalendarAccessToken');

export async function getCalendar() {
  return request('/calendars/primary');
}

export async function listEvents(timeMin, timeMax) {
  const p = `/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=2500`;
  const data = await request(p);
  return (data.items || []).filter(e => e.status !== 'cancelled').map(e => ({
    id: e.id,
    title: e.summary || 'بدون عنوان',
    start: e.start?.dateTime || e.start?.date,
    end: e.end?.dateTime || e.end?.date,
    allDay: Boolean(e.start?.date),
    extendedProps: { description: e.description || '', location: e.location || '', htmlLink: e.htmlLink || '' }
  }));
}

export async function createEvent({ title, description = '', start, end, allDay = false }) {
  const body = allDay
    ? { summary: title, description, start: { date: start.slice(0,10) }, end: { date: end.slice(0,10) } }
    : { summary: title, description, start: { dateTime: start }, end: { dateTime: end } };
  return request('/calendars/primary/events', { method: 'POST', body: JSON.stringify(body) });
}

export async function updateEvent(id, { title, description = '', start, end, allDay = false }) {
  const body = allDay
    ? { summary: title, description, start: { date: start.slice(0,10) }, end: { date: end.slice(0,10) } }
    : { summary: title, description, start: { dateTime: start }, end: { dateTime: end } };
  return request(`/calendars/primary/events/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function deleteEvent(id) {
  return request(`/calendars/primary/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
