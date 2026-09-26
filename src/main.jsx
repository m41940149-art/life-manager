import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Plus, Target, FileText, ArrowRight, CalendarDays, Trash2, X, Check, ChevronRight, ChevronLeft} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import arLocale from '@fullcalendar/core/locales/ar';
import {loadData,saveGoal,savePage,removePage} from './data';
import './styles.css';

const uid=()=>crypto.randomUUID();

function Modal({title,children,onClose}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><div className="modalHead"><h3>{title}</h3><button className="iconBtn" onClick={onClose}><X size={20}/></button></div>{children}</div></div>}

function Home({data,setData,openPage}){
 const [menu,setMenu]=useState(false),[goalOpen,setGoalOpen]=useState(false),[pageOpen,setPageOpen]=useState(false),[goal,setGoal]=useState(data.goal),[title,setTitle]=useState(''),[desc,setDesc]=useState('');
 const submitGoal=async e=>{e.preventDefault(); if(!goal.trim())return; await saveGoal(goal.trim());setData({...data,goal:goal.trim()});setGoalOpen(false)};
 const submitPage=async e=>{e.preventDefault();if(!title.trim())return;const p={id:uid(),title:title.trim(),description:desc.trim(),createdAt:Date.now(),events:[]};await savePage(p);setData({...data,pages:[...data.pages,p]});setTitle('');setDesc('');setPageOpen(false)};
 return <div className="home">
   {data.goal && <div className="goalBar"><div className="goalIcon"><Target size={20}/></div><div><span>الهدف العام</span><strong>{data.goal}</strong></div><button onClick={()=>setGoalOpen(true)}>تعديل</button></div>}
   <section className="hero"><div className="heroMark"><Target size={32}/></div><h1>مساحتي</h1><p>حوّل أهدافك إلى صفحات واضحة، ثم نظّم مهامك ومواعيدك في تقويم واحد.</p>{!data.goal&&!data.pages.length&&<button className="primary" onClick={()=>setMenu(true)}><Plus size={19}/> ابدأ بإضافة هدفك</button>}</section>
   {data.pages.length>0&&<section className="cards"><div className="sectionTitle"><div><h2>صفحاتي</h2><p>كل صفحة تمثل مجالًا أو مشروعًا من أهدافك.</p></div><span>{data.pages.length}</span></div><div className="grid">{data.pages.map(p=><article className="card" key={p.id} onClick={()=>openPage(p.id)}><div className="cardIcon"><CalendarDays size={22}/></div><h3>{p.title}</h3><p>{p.description||'لا يوجد وصف.'}</p><div className="cardFoot"><span>فتح الصفحة</span><ArrowRight size={17}/></div></article>)}</div></section>}
   <button className="fab" onClick={()=>setMenu(v=>!v)} aria-label="إضافة"><Plus size={28} className={menu?'rot':''}/></button>
   {menu&&<div className="addMenu"><button onClick={()=>{setGoalOpen(true);setMenu(false)}}><Target size={19}/><span>هدف عام</span></button><button onClick={()=>{setPageOpen(true);setMenu(false)}}><FileText size={19}/><span>إضافة صفحة</span></button></div>}
   {goalOpen&&<Modal title="تحديد الهدف العام" onClose={()=>setGoalOpen(false)}><form onSubmit={submitGoal}><label>اكتب هدفك في جملة واحدة</label><input autoFocus value={goal} onChange={e=>setGoal(e.target.value)} placeholder="مثال: أريد إنهاء مشروع التخرج بنجاح"/><div className="actions"><button type="button" className="secondary" onClick={()=>setGoalOpen(false)}>إلغاء</button><button className="primary" type="submit"><Check size={18}/> حفظ الهدف</button></div></form></Modal>}
   {pageOpen&&<Modal title="إضافة صفحة جديدة" onClose={()=>setPageOpen(false)}><form onSubmit={submitPage}><label>العنوان</label><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثال: مشروع التخرج"/><label>الوصف <small>اختياري</small></label><textarea rows="4" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="اكتب وصفًا مختصرًا لهذه الصفحة..."/><div className="actions"><button type="button" className="secondary" onClick={()=>setPageOpen(false)}>إلغاء</button><button className="primary" type="submit"><Check size={18}/> إنشاء الصفحة</button></div></form></Modal>}
 </div>
}

function Page({page,setPage,onBack,onDelete}){
 const [eventOpen,setEventOpen]=useState(false),[selected,setSelected]=useState(null),[eventTitle,setEventTitle]=useState('');
 const events=(page.events||[]).map(e=>({...e,title:e.title}));
 const selectDate=info=>{setSelected(info.dateStr);setEventTitle('');setEventOpen(true)};
 const addEvent=async e=>{e.preventDefault();if(!eventTitle.trim())return;const next={...page,events:[...(page.events||[]),{id:uid(),title:eventTitle.trim(),start:selected,allDay:true}]};await savePage(next);setPage(next);setEventOpen(false)};
 const eventClick=async info=>{if(!confirm(`حذف «${info.event.title}»؟`))return;const next={...page,events:(page.events||[]).filter(e=>e.id!==info.event.id)};await savePage(next);setPage(next)};
 return <div className="pageView"><header className="pageHeader"><button className="back" onClick={onBack}><ChevronRight size={20}/> الرئيسية</button><div><h1>{page.title}</h1>{page.description&&<p>{page.description}</p>}</div><button className="dangerGhost" onClick={onDelete}><Trash2 size={18}/></button></header><main className="calendarWrap"><div className="calendarTop"><div><h2>التقويم</h2><p>اضغط على أي يوم لإضافة مهمة أو موعد.</p></div><div className="legend"><span></span> حدث</div></div><FullCalendar plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]} locale={arLocale} direction="rtl" initialView="dayGridMonth" headerToolbar={{start:'prev,next today',center:'title',end:'dayGridMonth,timeGridWeek'}} buttonText={{today:'اليوم',month:'شهر',week:'أسبوع'}} selectable dateClick={selectDate} events={events} eventClick={eventClick} height="auto" dayMaxEvents={3}/></main>{eventOpen&&<Modal title={`إضافة إلى ${selected}`} onClose={()=>setEventOpen(false)}><form onSubmit={addEvent}><label>اسم المهمة أو الموعد</label><input autoFocus value={eventTitle} onChange={e=>setEventTitle(e.target.value)} placeholder="مثال: مراجعة الفصل الأول"/><div className="actions"><button type="button" className="secondary" onClick={()=>setEventOpen(false)}>إلغاء</button><button className="primary" type="submit"><Check size={18}/> إضافة</button></div></form></Modal>}</div>
}

function App(){const [data,setData]=useState({goal:'',pages:[]}),[active,setActive]=useState(null),[loading,setLoading]=useState(true);useEffect(()=>{loadData().then(d=>{setData(d);setLoading(false)}).catch(()=>setLoading(false))},[]);if(loading)return <div className="loading">جارٍ التحميل...</div>;const p=data.pages.find(x=>x.id===active);return <>{active&&p?<Page page={p} setPage={next=>setData(d=>({...d,pages:d.pages.map(x=>x.id===next.id?next:x)}))} onBack={()=>setActive(null)} onDelete={async()=>{if(confirm('هل تريد حذف هذه الصفحة وجميع أحداثها؟')){await removePage(p.id);setData(d=>({...d,pages:d.pages.filter(x=>x.id!==p.id)}));setActive(null)}}}/>:<Home data={data} setData={setData} openPage={setActive}/>}</>}
createRoot(document.getElementById('root')).render(<App/>);
