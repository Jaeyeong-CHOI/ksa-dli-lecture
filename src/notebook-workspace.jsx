import React, {useEffect, useRef} from 'react';
import {NotebookReader} from './notebook-reader.jsx';
import './notebook-workspace.css';

export function NotebookWorkspace({note,notes,Link}) {
 const sidebar=useRef(),focusContent=useRef(false);
 useEffect(()=>{
  const active=sidebar.current?.querySelector('[aria-current="page"]');
  if(active&&sidebar.current.clientHeight){
   const a=active.getBoundingClientRect(),s=sidebar.current.getBoundingClientRect();
   if(a.bottom>s.bottom)sidebar.current.scrollTop+=a.bottom-s.bottom+8;
   else if(a.top<s.top)sidebar.current.scrollTop-=s.top-a.top+8;
  }
  if(focusContent.current){document.getElementById('notebook-title')?.focus({preventScroll:true});focusContent.current=false;}
 },[note.slug]);
 function select(slug){
  focusContent.current=true;
  history.pushState(null,'','/notes/'+slug);
  dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({top:0,behavior:'instant'});
 }
 return <main id="main" className="notebook-workspace">
  <aside className="notebook-sidebar" ref={sidebar} aria-label="실습 노트북 목차">
   <h2>실습 노트</h2>
   <nav className="notebook-file-nav" aria-label="00~09 노트북 선택">
    {notes.map(n=><Link key={n.slug} to={'/notes/'+n.slug} aria-current={n.slug===note.slug?'page':undefined} onClick={e=>{
     if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){
      if(n.slug===note.slug)document.getElementById('notebook-title')?.focus({preventScroll:true});
      else focusContent.current=true;
     }
    }}><span className="notebook-file-number">{n.no}</span><span>{n.title}</span></Link>)}
   </nav>
   <label className="notebook-mobile-select">노트북 선택<select aria-label="실습 노트북 선택" value={note.slug} onChange={e=>select(e.target.value)}>{notes.map(n=><option key={n.slug} value={n.slug}>{n.no} · {n.title}</option>)}</select></label>
  </aside>
  <NotebookReader key={note.slug} note={note}/>
 </main>;
}
