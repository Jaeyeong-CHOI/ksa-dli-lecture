import React,{useState,useEffect,useRef} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,CheckCircle2,GraduationCap,Play,Scissors,Plus,Terminal,MapPin,CircleHelp} from 'lucide-react';
import {CodeBlock} from './code-viewer.jsx';
import guide from '../content/certification-guide.json';
import {Screenshots} from './annotated-captures.jsx';
import './certification.css';
import './certification-patches.css';
const steps=guide.steps;
const kindInfo={run:['그대로 실행',Play],patch:['이 부분만 수정',Scissors],insert:['같은 셀 안에 삽입',Plus],terminal:['Terminal에서 실행',Terminal]};
function EditTask({id,number}){
 const a=guide.actions[id],[label,Icon]=kindInfo[a.kind];
 return <section className={'cert-edit-task kind-'+a.kind} data-action={id}>
  <header><span className="cert-task-number">{number}</span><div><span className="cert-operation"><Icon size={14}/>{label}</span><h3>{a.title}</h3></div></header>
  <p className="cert-task-why">{a.why}</p>
  <div className="cert-locate"><strong><MapPin size={15}/>원본에서 찾기</strong><p><b>{a.notebook}</b>{a.cell&&<> · 원본 셀 {a.cell}</>}</p><p>{a.section}</p>{a.firstLine&&<div>셀의 첫 줄 <code>{a.firstLine}</code></div>}</div>
  <Screenshots items={a.screenshots}/>
  {a.kind==='run'?<p className="cert-unchanged"><Play size={17}/>코드는 고치지 않습니다. 이 셀 안을 클릭하고 <strong>Shift+Enter</strong>를 누르세요.</p>:<>
   <p className="cert-edit-instruction">{a.instruction}</p>
   {a.before&&<div className="cert-before"><span>{a.kind==='insert'?'이 줄 바로 위에 넣으세요':'원본에서 아래 구간만 선택하세요'}</span>{a.before.length>700?<details><summary>선택할 원본 구간 펼치기</summary><CodeBlock code={a.before} language="python" output label="원본 · 위치 확인용"/></details>:<CodeBlock code={a.before} language="python" output label="원본 · 위치 확인용"/>}</div>}
   <div className="cert-after"><span>{a.kind==='terminal'?'복사할 실행 명령':a.kind==='insert'?'정답 · 위 위치에 추가할 코드':'정답 · 선택한 구간을 이 코드로 바꾸세요'}</span><CodeBlock code={a.after.trimEnd()} label={a.kind==='terminal'?'Terminal · 붙여넣고 Enter':'정답 · 이 구간만 복사'} language={a.kind==='terminal'?'bash':'python'}/></div>
  </>}
  {a.note&&<p className="cert-preserve"><strong>유지할 것·주의할 점</strong>{a.note}</p>}
  <div className="cert-task-result"><CheckCircle2 size={17}/><div><strong>{a.kind==='run'||a.kind==='terminal'?'실행 후 확인':'수정·실행 후 확인'}</strong><p>{a.result}</p></div></div>
 </section>;
}
function Recovery(){
 return <section className="cert-recovery" id="recovery"><div className="eyebrow">WHEN SOMETHING GOES WRONG</div><h2><CircleHelp size={25}/>막힌 지점부터 확인하세요</h2><p>재시작하기 전에 노트북을 저장하고, 오류 마지막 줄과 아래 항목을 비교하세요.</p><div className="cert-error-list">{guide.recovery.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><p className="cert-note">커널을 재시작했다면 07번은 3 → 4 → 22 → 34 → 36 → 38 → 40 → 44 → 46, 08번은 3 → 7 → 9 → 11 → 13 → 15 → 17 순서로 다시 실행합니다. 09번 서버는 Terminal에서 따로 재시작합니다.</p></section>;
}
const fromHash=()=>steps.some(s=>s.id===location.hash.slice(1))?location.hash.slice(1):'start';
export function Certification(){
 const [active,setActive]=useState(fromHash),panel=useRef();const index=steps.findIndex(s=>s.id===active),step=steps[index];
 useEffect(()=>{
  const sync=()=>{if(location.hash==='#recovery'){document.getElementById('recovery')?.scrollIntoView();return;}setActive(fromHash());requestAnimationFrame(()=>panel.current?.scrollIntoView({block:'start',behavior:'instant'}));};
  addEventListener('hashchange',sync);addEventListener('popstate',sync);if(location.hash)sync();return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};
 },[]);
 return <main id="main" className="cert-page">
  <header className="cert-intro"><div className="eyebrow"><GraduationCap size={19}/>BUILDING RAG AGENTS WITH LLMS</div><h1>Get Certification</h1><p>원본 노트북을 열고, 필요한 빈칸만 채워 보세요.<br/>바꿀 구간과 정답, 실행 순서와 확인할 결과를 한 단계씩 안내합니다.</p><a className="cert-help-link" href="#recovery">실행 중 오류가 났나요?<ArrowRight size={15}/></a></header>
  {guide.verification&&<aside className="cert-verified" aria-label="실제 랩 검수 결과"><CheckCircle2 size={22}/><div><strong>실제 ASSESS TASK · PASSED 확인</strong><p>{guide.verification.date} · 이 안내의 코드로 07 → 08 → 09 → Evaluate → ASSESS TASK를 검수했습니다.</p><a href="#assess">실제 통과 화면 보기</a><a href="#certificate">이미 PASSED라면 인증서 받기</a></div></aside>}
  <div className="cert-path" aria-label="수료 진행 흐름"><div><small>검색 자료 준비</small><strong>07 문서 → 저장</strong></div><ArrowRight/><div><small>내 답변 사전 점검</small><strong>08 RAG → 비교</strong></div><ArrowRight/><div><small>평가 화면 연결</small><strong>09 서버 → Evaluate</strong></div><ArrowRight/><div><small>강좌 완료 반영</small><strong>Assess Task → 인증서</strong></div></div>
  <div className="cert-edit-legend"><span><Play size={16}/>그대로 실행</span><span><Scissors size={16}/>특정 구간만 수정</span><span><Plus size={16}/>같은 셀 안에 추가</span><p>정답 코드에는 바꿀 부분만 들어 있습니다. 셀 전체를 지우지 마세요.</p></div>
  <label className="cert-mobile-step">현재 진행할 단계<select value={active} onChange={e=>{location.hash=e.target.value;}}>{steps.map((s,i)=><option value={s.id} key={s.id}>{i+1}. {s.phase} · {s.title}</option>)}</select></label>
  <div className="cert-layout"><nav className="cert-nav" aria-label="인증서 가이드 단계">{steps.map((s,i)=><a href={'#'+s.id} key={s.id} aria-current={s.id===active?'step':undefined}><span>{String(i+1).padStart(2,'0')}</span><div><small>{s.phase}</small>{s.title}</div></a>)}</nav>
   <article className="cert-panel" ref={panel}><header><span className="eyebrow">STEP {index+1} / {steps.length} · {step.phase}</span><h2>{step.title}</h2><p className="cert-step-purpose"><strong>이 단계가 하는 일</strong>{step.purpose}</p><p className="cert-prerequisite"><strong>시작 전에</strong>{step.needs}</p>{step.execute&&<p className="cert-step-execute"><Play size={17}/><span><strong>이번 단계의 실행 순서</strong>{step.execute}</span></p>}</header>
    <div key={active}>{step.actions.map((id,i)=><EditTask key={id} id={id} number={i+1}/>)}
     <Screenshots items={step.screenshots}/>
     {step.id==='start'&&<ol className="cert-launch-flow" aria-label="실제 수업 랩 여는 순서">{step.bullets.slice(0,4).map((t,i)=><li key={t}><span>{['01 · 강좌 찾기','02 · START → Confirm','03 · Launch로 실습 열기','04 · 두 화면으로 따라 하기'][i]}</span><p>{t}</p></li>)}</ol>}
     {step.bullets.length>0&&<ol className="cert-walkthrough">{(step.id==='start'?step.bullets.slice(4):step.bullets).map(t=><li key={t}>{t}</li>)}</ol>}
     {step.id==='certificate'&&<a href="https://learn.nvidia.com/my-learning" target="_blank" rel="noreferrer" className="primary-button">NVIDIA My Learning 열기<ArrowUpRight size={16}/></a>}
     <div className="cert-step-finish"><CheckCircle2 size={22}/><div><strong>여기까지 확인했다면 다음 단계로</strong><p>{step.outcome}</p></div></div>
    </div>
    <nav className="cert-pagination" aria-label="인증서 가이드 이동">{index>0?<a href={'#'+steps[index-1].id}><ArrowLeft size={17}/>이전 단계</a>:<span/>}{index<steps.length-1&&<a href={'#'+steps[index+1].id}>다음 · {steps[index+1].phase}<ArrowRight size={17}/></a>}</nav>
   </article>
  </div>
  <Recovery/>
  {guide.verification&&<p className="cert-note"><strong>실제 랩 검수 · {guide.verification.date}</strong><br/>{guide.verification.summary}<br/>{guide.verification.scope}</p>}
  <p className="cert-source-note">제공된 07·08·09번 한국어 노트북 기준의 해설용 정답입니다. 공식 Solutions 파일이나 평가 통과 보장이 아니며, 실제 수료 결과는 NVIDIA 강좌 화면에서 확인합니다.</p>
 </main>;
}
