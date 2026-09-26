import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, firebaseEnabled } from './firebase';

const KEY = 'goal-pages-data-v1';
const empty = { goal: '', pages: [] };
function localRead(){ try { return JSON.parse(localStorage.getItem(KEY)) || empty; } catch { return empty; } }
function localWrite(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

const userRoot = (uid) => doc(db, 'users', uid);
const pagesCollection = (uid) => collection(userRoot(uid), 'pages');

export async function loadData(uid){
  if(!firebaseEnabled || !uid) return localRead();
  const metaSnap = await getDocs(collection(userRoot(uid), 'meta'));
  const goal = metaSnap.docs.find(d=>d.id==='main')?.data()?.goal || '';
  const pagesSnap = await getDocs(query(pagesCollection(uid), orderBy('createdAt','asc')));
  const pages = pagesSnap.docs.map(d=>({id:d.id,...d.data()}));
  return {goal,pages};
}
export async function saveGoal(uid, goal){
  if(firebaseEnabled && uid) await setDoc(doc(userRoot(uid),'meta','main'),{goal},{merge:true});
  else { const d=localRead(); d.goal=goal; localWrite(d); }
}
export async function savePage(uid, page){
  if(firebaseEnabled && uid) await setDoc(doc(pagesCollection(uid),page.id),page);
  else { const d=localRead(); const i=d.pages.findIndex(p=>p.id===page.id); if(i<0)d.pages.push(page); else d.pages[i]=page; localWrite(d); }
}
export async function removePage(uid, id){
  if(firebaseEnabled && uid) await deleteDoc(doc(pagesCollection(uid),id));
  else { const d=localRead(); d.pages=d.pages.filter(p=>p.id!==id); localWrite(d); }
}
