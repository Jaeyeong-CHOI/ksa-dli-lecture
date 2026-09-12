import React,{useState,useEffect,useRef} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,CheckCircle2} from 'lucide-react';
import {CodeBlock} from './code-viewer.jsx';
import guide from '../content/certification-guide.json';
import route from '../content/certification-route.json';
import {Screenshots} from './annotated-captures.jsx';
import './certification.css';
import './certification-simple.css';

const tasks=route.stages.flatMap((stage,stageIndex)=>stage.tasks.map((task,taskIndex)=>({...task,stageIndex,taskIndex})));
const optional=guide.steps.filter(s=>route.optional.includes(s.id));
const sourceStep=id=>guide.steps.find(s=>s.id===id);
const readHash=()=>{
 const hash=location.hash.slice(1),id=route.aliases[hash]||hash;
 return tasks.some(t=>t.id===id)||optional.some(t=>t.id===id)?id:tasks[0].id;
};
function Edit({item}){
 const a=guide.actions[item.action],run=item.asRun||a.kind==='run';
 return <section className={"simple-edit"+(run?" simple-run-edit":"")} data-action={item.action}>
  <h3>{item.title||a.title}<span>{run?'수정 없이 실행':a.kind==='insert'?'이 위치에 추가':a.kind==='terminal'?'명령 실행':'부분 수정'}</span></h3>
  {a.kind!=='terminal'&&<div className="simple-locate">{!run&&<p>{a.section}</p>}<span>찾을 셀의 첫 줄</span><code>{a.firstLine}</code></div>}
  {!run&&<>
   {a.before?.trim().endsWith("ChatNVIDIA(")&&<p><strong>기본 주소로 이미 정상 연결되면 이 수정은 건너뛰세요.</strong></p>}<p>{a.instruction}</p>
   {a.before&&<div className="simple-before"><span>{a.kind==='insert'?'아래 줄 바로 위에 삽입':'바꿀 부분'}</span>
    {a.before.length>700?<><pre>{a.before.split('\n')[0]+'\n    … 현재 논문 목록 …\n]'}</pre><details><summary>원본 구간 전체 보기</summary><pre>{a.before}</pre></details></>:<pre>{a.before}</pre>}
   </div>}
   <CodeBlock code={a.after.trimEnd()} label={a.kind==='terminal'?'Terminal · 붙여넣고 Enter':'정답 · 이 부분만 복사'} language={a.kind==='terminal'?'bash':'python'}/>
  </>}
  {!run&&<details className="simple-explanation"><summary>설명·주의사항</summary><p>{a.why}</p><p>{a.note}</p><p>확인: {a.result}</p></details>}
  {!item.asRun&&<Screenshots items={a.screenshots}/>}
 </section>;
}
function ExtraHelp({name,detailsRef,children}){
 return <details className="simple-support" ref={detailsRef}><summary>{name}</summary>{children}</details>;
}
export function Certification(){
 const [active,setActive]=useState(readHash),panel=useRef(),recovery=useRef(),verification=useRef(),optionalMenu=useRef();
 const index=tasks.findIndex(t=>t.id===active),extra=optional.find(s=>s.id===active),task=tasks[index];
 const stage=task&&route.stages[task.stageIndex];
 const extraIndex=optional.findIndex(s=>s.id===active),extraNext=optional[extraIndex+1];
 useEffect(()=>{
  const sync=()=>{
   const target=location.hash==='#recovery'?recovery:location.hash==='#verification'?verification:null;
   if(target){target.current.open=true;target.current.scrollIntoView({block:'start'});return;}
   setActive(readHash());
   requestAnimationFrame(()=>{panel.current?.scrollIntoView({block:'start',behavior:'instant'});panel.current?.focus({preventScroll:true});});
  };
  addEventListener('hashchange',sync);addEventListener('popstate',sync);
  if(location.hash)sync();
  return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};
 },[]);
 const shown=task||extra;
 const items=task?.items||[...(route.optionalPrerequisites[active]||[]),...extra.actions].map(action=>({action}));
 const file=items.length?guide.actions[items[0].action].notebook:null;
 return <main id="main" className="cert-simple">
  <header className="simple-intro"><h1>Get Certification</h1><p>07번에서 자료를 저장하고, 09번 서버를 켠 뒤 평가를 진행하세요.</p><div><span>08번 비교 실습은 선택입니다.</span><a href="#certificate">이미 PASSED라면 인증서 받기 <ArrowRight size={14}/></a></div></header>
  <nav className="simple-stages" aria-label="인증서 필수 4단계">{route.stages.map((s,i)=><a key={s.id} href={'#'+s.tasks[0].id} aria-current={task?.stageIndex===i?'step':undefined}><b>{i+1}</b><span>{s.title}<small>{s.label}</small></span></a>)}</nav>
  <article className="simple-panel" ref={panel} tabIndex={-1} aria-labelledby="cert-task-title" data-task={active}>
   <header>
    {extra?<div className="simple-subnav"><span>선택 실습 · {extra.phase}</span><a href="#server">필수 경로로 돌아가기 <ArrowRight size={14}/></a></div>:<div className="simple-subnav"><span>{stage.title} · {task.taskIndex+1}/{stage.tasks.length}</span>{stage.tasks.length>1&&<label><span className="sr-only">현재 작업 선택</span><select value={active} onChange={e=>{location.hash=e.target.value;}}>{stage.tasks.map((t,i)=><option value={t.id} key={t.id}>{i+1}. {t.title}</option>)}</select></label>}</div>}
    <h2 id="cert-task-title">{shown.title}</h2><p>{shown.purpose}</p>{extra&&<p>시작 전에: {extra.needs}</p>}
    {file&&<p className="simple-file">열 파일 <code>{file}</code></p>}
   </header>
   <div key={active}>
    {items.map(item=><Edit key={item.action} item={item}/>)}
    {task?.instructions&&<ol className="simple-instructions">{task.instructions.map(t=><li key={t.title}><strong>{t.title}</strong><p>{t.text}</p></li>)}</ol>}
    {extra&&<ol className="simple-instructions">{extra.bullets.map(t=><li key={t}><p>{t}</p></li>)}</ol>}
    {shown.execute&&<p className="simple-execute"><strong>실행</strong>{shown.execute}</p>}
    <p className="simple-outcome"><CheckCircle2 size={18}/><span>{shown.outcome}</span></p>
    <Screenshots items={task?.screenshotsFrom?sourceStep(task.screenshotsFrom).screenshots:extra?.screenshots}/>
    {active==='certificate'&&<a className="primary-button" href="https://learn.nvidia.com/my-learning" target="_blank" rel="noreferrer">My Learning에서 인증서 받기 <ArrowUpRight size={16}/></a>}
   </div>
   <nav className="simple-pagination" aria-label="작업 이동">{index>0?<a href={'#'+tasks[index-1].id}><ArrowLeft size={16}/>이전</a>:<span/>}{task&&index<tasks.length-1&&<a className="simple-next" href={'#'+tasks[index+1].id}>다음 · {tasks[index+1].title}<ArrowRight size={16}/></a>}{extra&&<a href={extraNext?"#"+extraNext.id:"#server"} className="simple-next">{extraNext?"다음 · "+extraNext.title:"09번 서버로 돌아가기"}<ArrowRight size={16}/></a>}</nav>
  </article>
  <section className="simple-help" aria-label="필요할 때 참고">
   <ExtraHelp name="랩 열기·코드 수정이 처음이라면">
    <ol><li>My Learning → Instructor-Led Building RAG Agents with LLMs → Course → Content, Lab, and Survey → START → Confirm.</li><li>LOADING이 끝나면 Launch로 JupyterLab을 엽니다. 준비에 약 15분이 걸릴 수 있습니다. 랩을 여는 동안 STOP을 누르지 마세요.</li><li>노트북과 이 가이드를 나란히 놓고, 표시한 첫 코드 줄로 셀을 찾으세요. 왼쪽 [숫자]는 셀 위치가 아니라 실행 횟수입니다.</li><li>Run All이나 셀 전체 교체는 하지 않습니다. 표시한 구간만 선택해 붙여넣고, 안내한 때 Shift+Enter를 누르세요. 00~06번을 먼저 실행할 필요는 없습니다.</li></ol>
    <Screenshots items={sourceStep('start').screenshots}/>
   </ExtraHelp>
   <ExtraHelp name="08번 사전 점검·추가 실습 (선택)" detailsRef={optionalMenu}>
    <p>더 공부하거나 답변 품질을 살펴보고 싶을 때 진행하세요. 최종 평가는 저장된 인덱스와 09번 서버를 직접 사용하므로, 이 실습의 질문·점수 변수를 만들 필요는 없습니다.</p>
    <p>08번을 진행한다면 07번 저장 후 아래 순서대로 실행합니다. 07번 RAG 미리보기를 열 경우, 그 안내에 있는 셀 22도 먼저 실행하세요.</p>
    <nav aria-label="선택 실습">{optional.map(s=><a key={s.id} href={'#'+s.id}>{s.phase} · {s.title}<ArrowRight size={14}/></a>)}</nav>
   </ExtraHelp>
   <ExtraHelp name="오류가 나거나 중간에 멈췄을 때" detailsRef={recovery}>
    <p>07번 커널을 재시작했다면 설정 2개 → 문서 읽기 → 인덱스 생성·합치기 → 저장 순서로 돌아갑니다. docstore_index가 이미 정상 저장돼 있다면 09번부터 다시 시작할 수 있습니다. 서버는 Terminal에서 별도로 재시작합니다.</p>
    <div className="simple-errors"><details><summary>{route.connectionHelp.title}</summary><p>{route.connectionHelp.summary}</p><p>{route.connectionHelp.notebook}</p><p>{route.connectionHelp.server}</p>{route.connectionHelp.actions.map(action=><div key={action}><strong>{guide.actions[action].notebook}</strong><Edit item={{action}}/></div>)}</details>{guide.recovery.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
   </ExtraHelp>
   <ExtraHelp name="실제 ASSESS TASK · PASSED 검수 기록" detailsRef={verification}>
    <p>{route.verificationNote}</p><Screenshots items={sourceStep('assess').screenshots.slice(1)}/>
   </ExtraHelp>
  </section>
 </main>;
}
