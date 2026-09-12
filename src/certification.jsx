import React,{useState,useEffect,useRef} from 'react';
import {ArrowRight,ArrowUpRight,CheckCircle2} from 'lucide-react';
import {CellEdits} from './certification-cell.jsx';
import guide from '../content/certification-guide.json';
import route from '../content/certification-route.json';
import {Screenshots} from './annotated-captures.jsx';
import './certification.css';
import './certification-simple.css';

import {certificationPages,resolveCertificationPage} from '../content/certification-pages.mjs';
const pages=certificationPages(route,guide);
const sourceStep=id=>guide.steps.find(s=>s.id===id);
export function Certification(){
 const [hash,setHash]=useState(()=>location.hash),panel=useRef();
 const {page,target}=resolveCertificationPage(hash,pages,route);
 useEffect(()=>{
  const sync=()=>setHash(location.hash);
  addEventListener('hashchange',sync);addEventListener('popstate',sync);
  return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};
 },[]);
 useEffect(()=>{
  if(!hash)return;
  const frame=requestAnimationFrame(()=>{
   const element=document.getElementById(target)||panel.current;
   element?.scrollIntoView({block:'start',behavior:'instant'});element?.focus({preventScroll:true});
  });
  return()=>cancelAnimationFrame(frame);
 },[hash,target]);
 const file=page.tasks.flatMap(t=>t.items).map(i=>guide.actions[i.action].notebook).find(n=>n?.endsWith('.ipynb'));
 return <main id="main" className="cert-simple">
  <header className="simple-intro"><h1>Get Certification</h1><p>07번에서 자료를 저장하고, 09번 서버를 켠 뒤 평가를 진행하세요.</p><div><span>파일마다 위에서 아래로 읽고 실행하세요. 08번은 선택입니다.</span><a href="#certificate">이미 PASSED라면 인증서 받기 <ArrowRight size={14}/></a></div></header>
  <nav className="simple-stages" aria-label="인증서 필수 4단계">{route.stages.map((s,i)=><a key={s.id} href={'#'+s.tasks[0].id} aria-current={page.id===s.id?'page':undefined}><b>{i+1}</b><span>{s.title}<small>{s.label}</small></span></a>)}</nav>
  <article className="simple-panel" ref={panel} tabIndex={-1} aria-labelledby="cert-page-title" data-page={page.id} key={page.id}>
   <header className="simple-page-header">
    <h2 id="cert-page-title">{file?file.slice(0,2)+'번 · ':''}{page.title.replace(/^0[78]번 /,'')}</h2>
    {file&&<p className="simple-file">열 파일 <code>{file}</code></p>}
    {page.optional&&<p>선택 실습입니다. 최종 평가에 필요한 필수 단계는 아닙니다. <a href="#server">09번 서버 보기</a></p>}
    {page.tasks.length>1&&<nav className="simple-page-toc" aria-label="이 파일에서 할 일">{page.tasks.map((t,i)=><a href={'#'+t.id} key={t.id}>{i+1}. {t.title}</a>)}</nav>}
   </header>
   {page.tasks.map((task,i)=><section className="simple-task" key={task.id} id={task.id} data-task={task.id} tabIndex={-1} aria-labelledby={'title-'+task.id}>
    <header><h3 id={'title-'+task.id}>{page.tasks.length>1&&<span>{i+1}.</span>} {task.title}</h3><p>{task.purpose}</p>{task.optional&&<p className="simple-needs">시작 전에: {task.needs}</p>}</header>
    <CellEdits items={task.items}/>
    {task.instructions&&<ol className="simple-instructions">{task.instructions.map(t=><li key={t.title}><strong>{t.title}</strong><p>{t.text}</p></li>)}</ol>}
    {task.optional&&<ol className="simple-instructions">{task.bullets.map(t=><li key={t}><p>{t}</p></li>)}</ol>}
    {task.execute&&<p className="simple-execute"><strong>실행</strong>{task.execute}</p>}
    <p className="simple-outcome"><CheckCircle2 size={18}/><span>{task.outcome}</span></p>
    <Screenshots items={task.screenshotsFrom?sourceStep(task.screenshotsFrom).screenshots:task.screenshots}/>
    {task.id==='certificate'&&<a className="primary-button" href="https://learn.nvidia.com/my-learning" target="_blank" rel="noreferrer">My Learning에서 인증서 받기 <ArrowUpRight size={16}/></a>}
   </section>)}
  </article>
 </main>;
}
