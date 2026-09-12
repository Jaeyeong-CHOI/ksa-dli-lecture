import React, {useEffect, useState} from 'react';
import {ChevronRight, Search, X} from 'lucide-react';
import sources from '../content/notebook-code.json';
import fullCode from '../content/notebook-reader-code.json';
import locations from '../content/notebook-locations.json';
import captures from '../content/notebook-captures.json';
import {cellGuides} from '../content/notebook-companion.mjs';
import {liveNotebookNotes} from '../content/notebook-learning.mjs';
import {notebookExplanations,explanationReferences} from '../content/notebook-explanations.mjs';
import {readerSections,conceptLabels,withFullCellCode} from '../content/notebook-reader.mjs';
import {findNotebookCells} from '../content/notebook-lookup.mjs';
import {FullCellCode} from './full-cell-code.jsx';
import {CodeBlock} from './code-viewer.jsx';
import {LessonVisual} from './lesson-visuals.jsx';
import {Screenshots} from './annotated-captures.jsx';
import './notebook-reader.css';

const searchSources = withFullCellCode(sources,fullCode);
const exerciseId = i => i === 0 ? 'exercises' : 'exercise-'+i;
function InlineText({text}) {
 const parts = text.split(/(`[^`]+`)/g);
 return parts.map((part,i) => part.startsWith('`') ? <code key={i}>{part.slice(1,-1)}</code> : part);
}
function Flow({label,steps}) {
 return <figure className="reader-flow"><figcaption>{label}</figcaption><ol>{steps.map((step,i)=><li key={i}><InlineText text={step}/></li>)}</ol></figure>;
}
function CellExplanation({entry}) {
 const a=entry.algorithm;
 const refs=[...new Set([...(entry.refs||[]),...(a?.refs||[])])];
 return <div className="reader-syntax">
   <h4>코드 문법과 값의 흐름</h4>
   <dl>{entry.syntax.map(([code,text])=><div key={code}><dt><code>{code}</code></dt><dd><InlineText text={text}/></dd></div>)}</dl>
   {entry.flow&&<Flow {...entry.flow}/>}
   {a&&<section className="reader-algorithm"><h4>{a.title}</h4><p><InlineText text={a.text}/></p>{a.formula&&<p className="reader-formula">{a.formula}</p>}{a.steps&&<Flow label="작동 원리" steps={a.steps}/>}</section>}
   <p className="reader-references"><span>참고</span>{refs.map(id=><a key={id} href={explanationReferences[id][1]} target="_blank" rel="noreferrer">{explanationReferences[id][0]}</a>)}</p>
 </div>;
}
function NotebookCell({note, block}) {
 const detail = cellGuides[note.slug][block.cell], code = fullCode[note.slug][block.cell];
 const explanation=notebookExplanations[note.slug]?.[block.cell];
 const exercise = code.exercise === undefined ? null : note.exercises[code.exercise];
 return <article className="reader-cell" id={'cell-'+block.cell} data-cell={block.cell}>
   {exercise && <span className="reader-anchor" id={exerciseId(code.exercise)}/>}
   <h3><span>셀 {block.cell}</span>{detail.title}</h3>
   <p className="reader-location">{locations[note.slug][block.cell].path.join(' › ')}</p>
   <p>{detail.process}</p>
   <p className="reader-prerequisite">{detail.before}</p>
   {code.changes.length > 0 && <p className="reader-edit-note">{code.changes.join(' · ')}. <span>원본이 같으면 수정 후 전체를 한 번에 복사하고, 다르면 강조된 부분만 반영하세요.</span></p>}
   <FullCellCode original={code.original} complete={code.complete} label={'셀 '+block.cell+' 전체 · '+code.basis}/>
   <div className="reader-explanation">
     {explanation ? <CellExplanation entry={explanation}/> : block.annotations.length > 0 && <ul>{block.annotations.filter(a=>a.token!=='TODO').map((a,i)=><li key={i}><code>{a.token}</code> — {a.text}</li>)}</ul>}
     <p><strong>실행 결과</strong> {exercise?.check || detail.check}</p>
     {['TODO','예상 실패','선택'].includes(detail.kind) && <p>{detail.pitfall}</p>}
     {liveNotebookNotes[note.slug]?.[block.cell] && <p className="reader-version-note">{liveNotebookNotes[note.slug][block.cell]}</p>}
   </div>
   <Screenshots items={captures[note.filename]?.cells?.[block.cell]}/>
 </article>;
}
export function NotebookReader({note, notes, Link}) {
 const source = sources[note.slug];
 const sectionBlocks = readerSections(note, source);
 const [query,setQuery] = useState('');
 const matches = query.trim() ? findNotebookCells(query,searchSources,locations,note.slug) : [];
 const integrated = new Set(Object.values(fullCode[note.slug]).map(c=>c.exercise).filter(i=>i!==undefined));
 const examples = note.exercises.map((e,i)=>({e,i})).filter(({i})=>!integrated.has(i));
 useEffect(()=>{
  let frame,active=true;
  function reveal() {
   if(!active)return;
   cancelAnimationFrame(frame);
   frame = requestAnimationFrame(()=>{
    let id; try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const aliases={'source-code':'cell-'+source.blocks[0].cell,overview:'main',explanation:'section-0',references:'main',troubleshooting:'review'};
    const target=document.getElementById(aliases[id]||id);
    if(target) {for(let p=target;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;target.scrollIntoView({block:'start',behavior:'instant'});}
   });
  }
  reveal();document.fonts?.ready.then(reveal);addEventListener('hashchange',reveal);addEventListener('popstate',reveal);
  return ()=>{active=false;cancelAnimationFrame(frame);removeEventListener('hashchange',reveal);removeEventListener('popstate',reveal);};
 },[note.slug]);
 return <main id="main" className="notebook-reader">
   <div className="breadcrumb"><Link to="/notebooks">실습 노트</Link><ChevronRight size={14}/><span>{note.filename}</span></div>
   <header className="reader-heading"><h1>{note.title}</h1><p>{note.summary}</p></header>
   <div className="reader-tools">
     <label className="reader-search"><Search size={17}/><input type="search" aria-label="이 노트에서 개념·코드 찾기" placeholder="개념·코드 찾기" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" aria-label="검색 지우기" onClick={()=>setQuery('')}><X size={16}/></button>}</label>
     <select aria-label="실습 노트북 선택" value={note.slug} onChange={e=>{history.pushState(null,'','/notes/'+e.target.value);dispatchEvent(new PopStateEvent('popstate'));window.scrollTo(0,0);}}>{notes.map(n=><option key={n.slug} value={n.slug}>{n.filename}</option>)}</select>
   </div>
   {query.trim() && <div className="reader-search-results" aria-label="셀 검색 결과">{matches.map(m=><a key={m.cell} href={'#cell-'+m.cell} onClick={()=>setQuery('')}>셀 {m.cell} · {m.guide.title}</a>)}{!matches.length&&<p>일치하는 코드가 없습니다.</p>}</div>}
   <nav className="reader-contents" aria-label="이 파일의 개념과 코드">
     {note.sections.map((s,i)=><a href={'#section-'+i} key={i}>{conceptLabels[note.slug][i]}</a>)}
   </nav>

   {note.sections.map((section,i)=><section className="reader-section" id={'section-'+i} key={i}>
     <h2>{section.title}</h2>
     <div className="reader-concept">{section.text.split('\n\n').slice(0,2).map((p,j)=><p key={j}><InlineText text={p}/></p>)}</div>
     <LessonVisual slug={note.slug} section={i}/>
     {sectionBlocks[i].map(block=><NotebookCell key={block.cell} note={note} block={block}/>)}
   </section>)}
   {examples.map(({e,i})=><section className="reader-section reader-example" id={exerciseId(i)} key={i}>
     <h2>{e.title}</h2><p className="reader-location">{e.location} · 해설용 예시</p><p>{e.goal}</p>
     <CodeBlock code={e.code} label="해설용 코드 전체"/>
     <ul>{e.steps.map(s=><li key={s}>{s}</li>)}</ul><p><strong>실행 결과</strong> {e.check}</p>
   </section>)}
   <p className="reader-takeaway" id="review">{note.takeaway}</p>
 </main>;
}
