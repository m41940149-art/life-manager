const API = 'https://www.googleapis.com/calendar/v3';
const key = "AIzaSyB6FsHgT3c5vrTozxpGNRKwaCZJKNxjtWw";

async function request(path, options = {}){
  const token = sessionStorage.getItem('googleCalendarAccessToken');
  if(!token) throw new Error('GOOGLE_NOT_CONNECTED');
  const url = `${API}${path}${path.includes('?')?'&':'?'}key=${encodeURIComponent(key || '')}`;
  const res = await fetch(url,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})}});
  if(!res.ok){ const body=await res.text(); if(res.status===401) sessionStorage.removeItem('googleCalendarAccessToken'); throw new Error(body || `Google Calendar error ${res.status}`); }
  return res.status===204 ? null : res.json();
}

export function isCalendarConnected(){ return Boolean(sessionStorage.getItem('googleCalendarAccessToken')); }
export function disconnectCalendar(){ sessionStorage.removeItem('googleCalendarAccessToken'); }
export async function listEvents(timeMin, timeMax){
  const p = `/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
  const data = await request(p);
  return (data.items||[]).map(e=>({id:e.id,title:e.summary||'بدون عنوان',start:e.start?.dateTime||e.start?.date,allDay:Boolean(e.start?.date)}));
}
export async function createEvent({title,date}){
  const start = `${date}T09:00:00`;
  const end = `${date}T10:00:00`;
  return request('/calendars/primary/events',{method:'POST',body:JSON.stringify({summary:title,start:{dateTime:start},end:{dateTime:end}})});
}
export async function deleteEvent(id){ return request(`/calendars/primary/events/${encodeURIComponent(id)}`,{method:'DELETE'}); }
