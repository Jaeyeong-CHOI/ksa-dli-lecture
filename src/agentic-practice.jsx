import React, {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Download} from 'lucide-react';
import data from '../content/agentic-practice.json';
import concepts from '../content/agentic-concepts.json';
import {agenticPages, resolveAgenticPage} from '../content/agentic-pages.mjs';
import {destinationValid, fillPrompt} from './agentic-practice-model.mjs';
import {CodeBlock} from './code-viewer.jsx';
import './agentic-practice.css';

const ROOT = '/downloads/agentic-coding/';
const files = {
  bundle:['Agentic-Coding-Practice.zip','전체 자료 ZIP'],
  guide:['READ_ME.md','시작 안내'], prompts:['PROMPTS.md','프롬프트 모음'],
  examples:['EXAMPLES.md','Skill·입력 예시'], 'skill-example':['SKILL-EXAMPLE.md','Skill 본문 예시'],
  'news-result':['GEEKNEWS-RESULT.json','실제 피드 응답'],
  'snapshot-xml':['BROWSER-XML-SNAPSHOT.zip','실제 XML 첨부 예제'],
  'snapshot-result':['HERITAGE-SNAPSHOT.json','첨부 파싱 결과'],
  'api-result':['HERITAGE-A.json','실제 API 응답'],
  'input-a':['INPUT-A.md','입력 A'], 'input-b':['INPUT-B.md','입력 B'],
};
const stepsById = Object.fromEntries(data.steps.map(s => [s.id, s]));

function DownloadFile({name}) {
  const [file,label] = files[name];
  return <a href={ROOT+file} download><Download size={15}/>{label}</a>;
}
function Links({items}) {
  return <nav className="ac-links" aria-label="참고 링크">{items.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}<ArrowUpRight size={13}/></a>)}</nav>;
}
function Prompt({text, label}) {
  return <CodeBlock code={text} label={label} language="text" copyLabel="요청문 전체 복사" textLabel="요청문"/>;
}
function Concept({step}) {
  const c = concepts[step.lesson];
  return <details id={step.id} className="ac-detail ac-concept" tabIndex={-1}>
    <summary>{step.title}</summary>
    <div className="ac-detail-body"><p>{c.headline}</p><p>{c.intro}</p>
      <dl>{c.parts.map(part => <div key={part.id}><dt>{part.label}</dt><dd><p>{part.role}</p><p>{part.why}</p>{part.code && <CodeBlock code={part.code} language="text" label={part.label+' · 설명 예시'} textLabel="예시"/>}<p>{part.example}</p></dd></div>)}</dl>
      <p>{c.takeaway}</p><Links items={c.sources}/>
    </div>
  </details>;
}
function Screens({items}) {
  if (!items?.length) return null;
  return <details className="ac-detail ac-captures"><summary>화면 참고</summary><div className="ac-detail-body">{items.map(f => <figure key={f.src}><a href={f.src} target="_blank" rel="noopener noreferrer" aria-label={f.caption+' · 크게 보기'}><img src={f.src} alt={f.alt} loading="lazy"/></a><figcaption>{f.caption}</figcaption></figure>)}</div></details>;
}
function Destination({team, project, setTeam, setProject}) {
  return <fieldset className="ac-destination"><legend>배포 대상</legend><p>앞 단계에서 조회한 팀과 새 실습 프로젝트 이름을 입력하세요. 아래 배포·재배포 요청문에 함께 반영됩니다.</p><div>
    <label>팀 ID 또는 slug<input value={team} onChange={e=>setTeam(e.target.value)} autoComplete="off" spellCheck={false} maxLength={100} placeholder="team_… 또는 팀 slug"/></label>
    <label>새 프로젝트 이름<input value={project} onChange={e=>setProject(e.target.value)} autoComplete="off" spellCheck={false} maxLength={100} placeholder="예: heritage-myname" aria-describedby="ac-project-format"/></label>
    </div><small id="ac-project-format">프로젝트 이름: 영문 소문자·숫자·하이픈 2–100자. 앞뒤 하이픈과 연속된 ---는 제외합니다.</small></fieldset>;
}
function Task({step, number, team, project, setTeam, setProject}) {
  const valid = destinationValid(team, project);
  const prompt = step.prompt ? fillPrompt(step.prompt, team, project) : '';
  return <>
    <header><h3>{number && <span>{number}. </span>}{step.title}</h3><p>{step.goal}</p><p className="ac-where"><strong>실행 위치</strong>{step.where}</p></header>
    {step.handoff && <p className="ac-handoff">{step.handoff}</p>}
    <ol className="ac-instructions">{step.actions.map(action => <li key={action}>{action}</li>)}</ol>
    {step.links && <Links items={step.links}/>}
    {step.downloads?.some(name=>name!=='bundle') && <nav className="ac-files" aria-label={step.title+' 파일'}>{step.downloads.filter(name=>name!=='bundle').map(name=><DownloadFile key={name} name={name}/>)}</nav>}
    {step.id==='deploy' && <Destination {...{team,project,setTeam,setProject}}/>}
    {prompt && (!step.destination || valid ? <Prompt text={prompt} label={step.promptTitle || '복사해서 보낼 요청문'}/> : <p className="ac-input-hint">{step.id==='deploy'?'위의':'위 「Preview 주소 만들기」의'} 배포 대상을 입력하면 전체 요청문이 표시됩니다.</p>)}
    {step.followup && <section className="ac-followup"><h4>{step.followup.title}</h4><p>{step.followup.where}</p><Prompt text={step.followup.prompt} label="저장한 Skill 실행 요청"/></section>}
    <div className="ac-result"><strong>결과 확인</strong><ul>{step.check.map(item=><li key={item}>{item}</li>)}</ul></div>
    {step.routes && <nav className="ac-branches" aria-label="결과에 따른 이동">{step.routes.map(r=><a key={r.step} href={'#'+r.step}>{r.label}</a>)}</nav>}
    {step.explain && <details className="ac-detail"><summary>입력·응답 필드 설명</summary><dl className="ac-detail-body">{step.explain.map(p=><div key={p.term}><dt>{p.term}</dt><dd><p>{p.role}</p><code>{p.example}</code></dd></div>)}</dl></details>}
    {step.sample==='skill' && <details className="ac-detail"><summary>Skill 본문 예시</summary><div className="ac-detail-body"><CodeBlock code={data.skill} label="SKILL.md · 설명 예시" language="text" textLabel="예시"/></div></details>}
    <Screens items={step.screens}/>
  </>;
}
export function AgenticPractice() {
  const [hash,setHash] = useState(()=>location.hash);
  const [team,setTeam] = useState(''), [project,setProject] = useState('');
  const {page,target} = resolveAgenticPage(hash);
  const panel = useRef();
  useEffect(()=>{
    const sync=()=>setHash(location.hash);
    addEventListener('hashchange',sync); addEventListener('popstate',sync);
    return ()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};
  },[]);
  useEffect(()=>{
    if(!hash)return;
    const frame=requestAnimationFrame(()=>{
      const element=document.getElementById(target)||panel.current;
      if(element?.tagName==='DETAILS')element.open=true;
      element?.scrollIntoView({block:'start',behavior:'instant'});
      element?.focus({preventScroll:true});
    });
    return()=>cancelAnimationFrame(frame);
  },[hash,target]);
  let number=0;
  return <main id="main" className="ac-simple">
    <header className="ac-intro"><h1>에이전틱 코딩 실습</h1><DownloadFile name="bundle"/></header>
    <nav className="ac-stages" aria-label="에이전틱 코딩 실습 4개">{agenticPages.map((p,i)=><a key={p.id} href={'#'+p.id} aria-current={page.id===p.id?'page':undefined}><b>{i+1}</b><span>{p.label}<small>{p.subtitle}</small></span></a>)}</nav>
    <article id={page.id} className="ac-panel" ref={panel} key={page.id} tabIndex={-1} aria-labelledby="ac-page-title">
      <header className="ac-page-header"><h2 id="ac-page-title">{page.title}</h2></header>
      {page.steps.map(id=>{
        const step=stepsById[id];
        if(step.lesson)return <Concept key={id} step={step}/>;
        if(id==='snapshot-recovery')return <details key={id} id={id} className="ac-task ac-detail ac-recovery" tabIndex={-1}><summary>API 통신이 실패했을 때만: XML로 이어가기</summary><div className="ac-detail-body"><Task step={step} {...{team,project,setTeam,setProject}}/></div></details>;
        return <section key={id} id={id} className="ac-task" tabIndex={-1} aria-label={step.title}><Task step={step} number={++number} {...{team,project,setTeam,setProject}}/></section>;
      })}
    </article>
  </main>;
}
