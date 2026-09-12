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
function ExtraHelp({name,detailsRef,children}){
 return <details className="simple-support" ref={detailsRef}><summary>{name}</summary>{children}</details>;
}
export function Certification(){
 const [hash,setHash]=useState(()=>location.hash),panel=useRef(),recovery=useRef(),verification=useRef();
 const {page,target}=resolveCertificationPage(hash,pages,route);
 useEffect(()=>{
  const sync=()=>setHash(location.hash);
  addEventListener('hashchange',sync);addEventListener('popstate',sync);
  return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};
 },[]);
 useEffect(()=>{
  if(!hash)return;
  const frame=requestAnimationFrame(()=>{
   const help=hash==='#recovery'?recovery.current:hash==='#verification'?verification.current:null;
   if(help){help.open=true;help.scrollIntoView({block:'start',behavior:'instant'});return;}
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
  <section className="simple-help" aria-label="필요할 때 참고">
   <ExtraHelp name="랩 열기·코드 수정이 처음이라면">
    <ol><li>My Learning → Instructor-Led Building RAG Agents with LLMs → Course → Content, Lab, and Survey → START → Confirm.</li><li>LOADING이 끝나면 Launch로 JupyterLab을 엽니다. 준비에 약 15분이 걸릴 수 있습니다. 랩을 여는 동안 STOP을 누르지 마세요.</li><li>노트북과 이 가이드를 나란히 놓고, 원본 전체 코드와 제목을 대조해 셀을 찾으세요. 왼쪽 [숫자]는 셀 위치가 아니라 실행 횟수입니다.</li><li>Run All은 누르지 않습니다. 원본이 같은 셀이라면 수정 후 전체를 한 번에 붙여넣고, 모델명·옵션 등 원본이 다르면 강조된 변경 부분만 반영하세요. 셀 수정이 끝나면 Shift+Enter를 누릅니다. 00~06번을 먼저 실행할 필요는 없습니다.</li></ol>
    <Screenshots items={sourceStep('start').screenshots}/>
   </ExtraHelp>
   <ExtraHelp name="08번 사전 점검·추가 실습 (선택)">
    <p>더 공부하거나 답변 품질을 살펴보고 싶을 때 진행하세요. 최종 평가는 저장된 인덱스와 09번 서버를 직접 사용하므로, 이 실습의 질문·점수 변수를 만들 필요는 없습니다.</p>
    <p>08번을 진행한다면 07번 저장 후 아래 순서대로 실행합니다. 07번 RAG 미리보기를 열 경우, 그 안내에 있는 셀 22도 먼저 실행하세요.</p>
    <nav aria-label="선택 실습">{pages.filter(p=>p.optional).map(p=><a key={p.id} href={'#'+p.tasks[0].id}>{p.title}<ArrowRight size={14}/></a>)}</nav>
   </ExtraHelp>
   <ExtraHelp name="오류가 나거나 중간에 멈췄을 때" detailsRef={recovery}>
    <p>07번 커널을 재시작했다면 설정 2개 → 문서 읽기 → 인덱스 생성·합치기 → 저장 순서로 돌아갑니다. docstore_index가 이미 정상 저장돼 있다면 09번부터 다시 시작할 수 있습니다. 09번 서버는 Kernel → Interrupt Kernel로 중지한 뒤 셀 4 저장 → 셀 5 재실행 순서로 다시 켭니다.</p>
    <div className="simple-errors"><details><summary>{route.connectionHelp.title}</summary><p>{route.connectionHelp.summary}</p><p>{route.connectionHelp.notebook}</p><p>{route.connectionHelp.server}</p><CellEdits items={route.connectionHelp.actions.map(action=>({action}))} prepared={route.stages.find(s=>s.id==='server').tasks.find(t=>t.id==='server').items.map(i=>i.action)}/></details>{guide.recovery.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
   </ExtraHelp>
   <ExtraHelp name="실제 ASSESS TASK · PASSED 검수 기록" detailsRef={verification}>
    <p>{route.verificationNote}</p><Screenshots items={sourceStep('assess').screenshots.slice(1)}/>
   </ExtraHelp>
  </section>
 </main>;
}
