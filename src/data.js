import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, firebaseEnabled } from './firebase';

const KEY = 'goal-pages-data-v1';
const empty = { goal: '', pages: [] };

function localRead(){ try { return JSON.parse(localStorage.getItem(KEY)) || empty; } catch { return empty; } }
function localWrite(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

export async function loadData(){
  if(!firebaseEnabled) return localRead();
  const metaSnap = await getDocs(collection(db,'appMeta'));
  const goal = metaSnap.docs.find(d=>d.id==='main')?.data()?.goal || '';
  const pagesSnap = await getDocs(query(collection(db,'pages'), orderBy('createdAt','asc')));
  const pages = pagesSnap.docs.map(d=>({id:d.id,...d.data(), events:d.data().events || []}));
  return {goal,pages};
}

export async function saveGoal(goal){
  if(firebaseEnabled) await setDoc(doc(db,'appMeta','main'),{goal},{merge:true});
  else { const d=localRead(); d.goal=goal; localWrite(d); }
}
export async function savePage(page){
  if(firebaseEnabled) await setDoc(doc(db,'pages',page.id),page);
  else { const d=localRead(); const i=d.pages.findIndex(p=>p.id===page.id); if(i<0)d.pages.push(page); else d.pages[i]=page; localWrite(d); }
}
export async function removePage(id){
  if(firebaseEnabled) await deleteDoc(doc(db,'pages',id));
  else { const d=localRead(); d.pages=d.pages.filter(p=>p.id!==id); localWrite(d); }
}
