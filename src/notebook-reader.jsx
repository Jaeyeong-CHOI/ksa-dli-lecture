import React, {useEffect} from 'react';
import sources from '../content/notebook-code.json';
import fullCode from '../content/notebook-reader-code.json';
import locations from '../content/notebook-locations.json';
import captures from '../content/notebook-captures.json';
import {cellGuides} from '../content/notebook-companion.mjs';
import {liveNotebookNotes} from '../content/notebook-learning.mjs';
import {notebookExplanations,explanationReferences} from '../content/notebook-explanations.mjs';
import {readerSections} from '../content/notebook-reader.mjs';
import {FullCellCode} from './full-cell-code.jsx';
import {CodeBlock} from './code-viewer.jsx';
import {Screenshots} from './annotated-captures.jsx';
import './notebook-reader.css';

const exerciseId = i => i === 0 ? 'exercises' : 'exercise-'+i;
function InlineText({text}) {
 const parts = text.split(/(`[^`]+`)/g);
 return parts.map((part,i) => part.startsWith('`') ? <code key={i}>{part.slice(1,-1)}</code> : part);
}
function CellExplanation({entry}) {
 const a=entry.algorithm;
 const refs=[...new Set([...(entry.refs||[]),...(a?.refs||[])])];
 return <div className="reader-syntax">
   <h4>코드 문법과 값의 흐름</h4>
   <dl>{entry.syntax.map(([code,text])=><div key={code}><dt><code>{code}</code></dt><dd><InlineText text={text}/></dd></div>)}</dl>
   {a&&<section className="reader-algorithm"><h4>{a.title}</h4><p><InlineText text={a.text}/></p>{a.formula&&<p className="reader-formula">{a.formula}</p>}</section>}
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
export function NotebookReader({note}) {
 const source = sources[note.slug];
 const sectionBlocks = readerSections(note, source);
 const integrated = new Set(Object.values(fullCode[note.slug]).map(c=>c.exercise).filter(i=>i!==undefined));
 const examples = note.exercises.map((e,i)=>({e,i})).filter(({i})=>!integrated.has(i));
 useEffect(()=>{
  let frame,active=true;
  function reveal() {
   if(!active)return;
   cancelAnimationFrame(frame);
   frame = requestAnimationFrame(()=>{
    let id; try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const aliases={'source-code':'cell-'+source.blocks[0].cell,overview:'notebook-content',explanation:'section-0',references:'notebook-content',troubleshooting:'review'};
    const target=document.getElementById(aliases[id]||id);
    if(target) {for(let p=target;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;target.scrollIntoView({block:'start',behavior:'instant'});}
   });
  }
  reveal();document.fonts?.ready.then(reveal);addEventListener('hashchange',reveal);addEventListener('popstate',reveal);
  return ()=>{active=false;cancelAnimationFrame(frame);removeEventListener('hashchange',reveal);removeEventListener('popstate',reveal);};
 },[note.slug]);
 return <article id="notebook-content" className="notebook-reader" aria-labelledby="notebook-title">
   <p className="reader-file">{note.filename}</p>
   <header className="reader-heading"><h1 id="notebook-title" tabIndex={-1}>{note.title}</h1></header>

   {note.sections.map((section,i)=><section className="reader-section" id={'section-'+i} key={i}>
     <h2>{section.title}</h2>
     <div className="reader-concept">{section.text.split('\n\n').slice(0,2).map((p,j)=><p key={j}><InlineText text={p}/></p>)}</div>
     {sectionBlocks[i].map(block=><NotebookCell key={block.cell} note={note} block={block}/>)}
   </section>)}
   {examples.map(({e,i})=><section className="reader-section reader-example" id={exerciseId(i)} key={i}>
     <h2>{e.title}</h2><p className="reader-location">{e.location} · 해설용 예시</p><p>{e.goal}</p>
     <CodeBlock code={e.code} label="해설용 코드 전체"/>
     <ul>{e.steps.map(s=><li key={s}>{s}</li>)}</ul><p><strong>실행 결과</strong> {e.check}</p>
   </section>)}
   <p className="reader-takeaway" id="review">{note.takeaway}</p>
 </article>;
}
