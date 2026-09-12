import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, CheckCircle2, Search, ChevronRight, BookOpen, Code2, MessageCircle, X} from 'lucide-react';
import {chapterBriefs,cellGuides} from '../content/notebook-companion.mjs';
import {learningRoutes,liveNotebookNotes,liveLookupAliases,routeForCell,learningPatches} from '../content/notebook-learning.mjs';
import {findNotebookCells,companionCell} from '../content/notebook-lookup.mjs';
import locations from '../content/notebook-locations.json';
import sources from '../content/notebook-code.json';
import {CodeBlock} from './shared.jsx';
import './notebook-companion.css';
import captures from '../content/notebook-captures.json';
import {Screenshots} from './annotated-captures.jsx';
import {NotebookDownloadLink} from './notebook-downloads.jsx';

export function ReaderModes({original=true}) {
 return <nav className="reader-modes" aria-label="실습 노트 읽는 방식"><a href="#overview" aria-current={original?'page':undefined}><BookOpen size={16}/>원본 순서로 찾기</a><a href="#section-0" aria-current={!original?'page':undefined}><Code2 size={16}/>개념별로 배우기</a></nav>;
}
export function NotebookCompanion({note,notes,done,mark,Link,hash,askCell}) {
 const source=sources[note.slug],guide=chapterBriefs[note.slug];
 const cell=companionCell(hash,source),position=source.blocks.findIndex(b=>b.cell===cell),block=source.blocks[position];
 const detail=cellGuides[note.slug][cell],location=locations[note.slug][cell];
 const routes=learningRoutes[note.slug],route=routeForCell(note.slug,cell),checkpoint=route&&(route.checkpoint||route.cells.at(-1))===cell;
 const [query,setQuery]=useState(''),[highlight,setHighlight]=useState(null);
 const mainRef=useRef(),lookupRef=useRef(),outlineRef=useRef();
 const matched=findNotebookCells(query,sources,locations,note.slug);
 const related=note.sections.map((s,i)=>({s,i})).filter(({s})=>s.cells?.includes(cell));
 const exercises=note.exercises.map((e,i)=>({e,i})).filter(({e})=>new RegExp(`셀\\s*${cell}(?:\\D|$)`).test(e.location));
 useEffect(()=>{
  setQuery('');setHighlight(null);
  if(cell)requestAnimationFrame(()=>{mainRef.current?.scrollIntoView({block:'start',behavior:'instant'});const nav=outlineRef.current,selected=nav?.querySelector('[aria-current=location]');if(nav&&selected)nav.scrollTop+=selected.getBoundingClientRect().top-nav.getBoundingClientRect().top-nav.clientHeight*.4;});
 },[hash]);
 const goCell=value=>{if(locationGlobalHash()===value){setQuery('');return;}window.location.hash=value;};
 const outline=<><a href="#overview" aria-current={!cell?'location':undefined} className="source-overview">이 노트에서 배우는 것</a>{source.blocks.map((b,i)=>{
  const meta=locations[note.slug][b.cell],previous=source.blocks[i-1],group=meta.path[0];
  return <React.Fragment key={b.cell}>{(!previous||locations[note.slug][previous.cell].path[0]!==group)&&<p className="source-group">{group}</p>}<a href={'#cell-'+b.cell} aria-current={cell===b.cell?'location':undefined}><span>{String(meta.codeOrdinal).padStart(2,'0')}</span><span>{cellGuides[note.slug][b.cell].title}<small>{cellGuides[note.slug][b.cell].kind}</small></span></a></React.Fragment>;
 })}</>;
 return <div className="companion-page">
  <div className="companion-heading"><div><div className="breadcrumb"><Link to="/notebooks">실습 노트</Link><ChevronRight size={14}/><span>{note.filename}</span></div><span className="eyebrow">실습 {note.no} · 노트북 옆에서 보는 해설</span><h1>{note.title}</h1><p>{guide.result}</p><NotebookDownloadLink slug={note.slug}/></div><label className="notebook-switch">다른 노트북<select aria-label="실습 노트북 선택" value={note.slug} onChange={e=>{history.pushState(null,'','/notes/'+e.target.value);dispatchEvent(new PopStateEvent('popstate'));window.scrollTo(0,0);}}>{notes.map(n=><option key={n.slug} value={n.slug}>{n.filename}</option>)}</select></label></div>
  <ReaderModes/>
  <div className="companion-layout"><aside className="source-outline" ref={outlineRef}><span>원본 코드 순서</span><nav aria-label="원본 코드 목차">{outline}</nav></aside>
  <main id="main" className="companion-main">
   <section className="cell-finder" aria-label="원본에서 보고 있는 위치 찾기"><label htmlFor="cell-lookup">ipynb에서 지금 보고 있는 부분을 찾으세요</label><div className="cell-search-field"><Search size={18}/><input ref={lookupRef} id="cell-lookup" type="search" value={query} placeholder="원본 제목, 코드 한 줄, 변수 이름 검색" onChange={e=>setQuery(e.target.value)}/>{query&&<button className="icon-button" aria-label="셀 검색 지우기" onClick={()=>{setQuery('');lookupRef.current.focus();}}><X size={17}/></button>}</div>
    <div className="source-mobile-select"><label htmlFor="source-cell-select">원본 코드 순서로 이동</label><select id="source-cell-select" value={cell||''} onChange={e=>goCell(e.target.value?'#cell-'+e.target.value:'#overview')}><option value="">이 노트에서 배우는 것</option>{source.blocks.map(b=><option key={b.cell} value={b.cell}>{locations[note.slug][b.cell].codeOrdinal}. {cellGuides[note.slug][b.cell].title}</option>)}</select></div>
    <details className="source-number-help"><summary>ipynb 화면의 [숫자]와 여기의 셀 번호가 다른가요?</summary><p>ipynb 왼쪽의 [숫자]는 <strong>실행 횟수</strong>입니다. 아래의 “원본 셀”은 설명 셀까지 포함한 파일 내 위치이고, 목차의 순번은 코드 셀만 센 순서입니다. 숫자가 달라도 <strong>원본 제목과 코드 첫 줄</strong>로 같은 셀을 찾으세요.</p></details>
    <details className="source-number-help"><summary>실행이 멈춘 것 같거나 출력이 없나요?</summary><ul className="execution-help"><li><strong>입력창이 보임:</strong> 그 입력창을 클릭하고 Enter로 입력을 마칩니다. 이름 다음에 별도 입력창이 나올 수도 있습니다.</li><li><strong>[숫자]가 있고 출력 없음:</strong> 함수·변수를 정의하는 셀은 출력 없이 끝나는 것이 정상일 수 있습니다.</li><li><strong>[*]이고 입력창 없음:</strong> 계산이나 서버 응답을 기다리는 중일 수 있습니다. 오래 지연되면 위쪽 ■(Interrupt)로 현재 실행만 중단하고 원인을 확인합니다.</li><li><strong>Traceback이 보임:</strong> 마지막 줄의 오류 이름부터 봅니다. NameError는 앞의 준비 셀 누락을 먼저 확인하세요.</li></ul><p>Interrupt는 현재 실행 중단, Restart Kernel은 변수 초기화, 강좌의 STOP은 랩 종료·파일 초기화입니다. 같은 작업이 아닙니다.</p></details>
   </section>
   {query.trim()?<section className="cell-search-results" aria-label="셀 검색 결과"><h2>찾은 코드 {matched.length}개</h2><p>결과를 누르면 해당 셀의 설명과 코드가 바로 열립니다.</p>{matched.map(item=><a href={'#cell-'+item.cell} key={item.cell} onClick={()=>{if(cell===item.cell)setQuery('');}}><span className="cell-kind">{item.guide.kind}</span><strong>{item.guide.title}</strong><small>{item.location.path.join(' › ')} · 원본 셀 {item.cell}</small><code>{item.location.firstLine}</code></a>)}{!matched.length&&<p className="empty-cell-search">찾지 못했어요. 변수 이름만 입력하거나 코드 앞뒤의 주석을 빼 보세요. 다른 파일을 보고 있다면 위에서 노트북을 바꿉니다.</p>}</section>
   :!block?<section className="companion-overview" ref={mainRef}>
    <span className="eyebrow">학습의 출발점</span><h2>처음이라면, 이 세 가지를 익혀 보세요</h2><p className="learning-intro">처음부터 배우려면 아래 순서로, 막힌 곳만 찾으려면 위 검색창을 사용하세요. 각 단계에서 코드는 원본 JupyterLab에 그대로 두고 필요한 부분만 확인합니다.</p>
    <ol className="learning-roadmap">{routes.map((r,i)=><li key={r.title}><span className="learning-number">{i+1}</span><div><h3>{r.title}</h3><p>{guide.outcomes[i][1]}</p><CellTrail cells={r.cells} slug={note.slug}/><a className="learning-start" href={'#cell-'+r.cells[0]}>이 단계 시작<ArrowRight size={15}/></a><small>확인할 결과 · {r.observe}</small></div></li>)}</ol>
    <div className="companion-prerequisite"><strong>시작 전에</strong><p>{guide.before}</p></div>
    <div className="companion-howto"><h3>원본과 나란히 보는 방법</h3><ol><li>JupyterLab에서 <strong>{note.filename}</strong>을 엽니다.</li><li>모르는 제목이나 코드 한 줄을 위 검색창에서 찾습니다.</li><li>이곳의 설명을 읽고 원본 셀을 실행한 뒤, “실행 후 확인”과 비교합니다.</li></ol><p>코드는 이 사이트가 아니라 수업 JupyterLab에서 실행합니다. <b>TODO</b>는 직접 채울 부분, <b>선택</b>은 필요할 때 볼 부분입니다.</p></div>
    <Screenshots items={captures[note.filename]?.overview}/>
    <a className="primary-button" href={'#cell-'+routes[0].cells[0]}>첫 실습 시작<ArrowRight size={17}/></a>
    <section className="concept-shortcuts"><h3>개념부터 이해하고 싶다면</h3><p>코드가 없는 원본 설명 구간도 여기에서 연결해 읽을 수 있습니다.</p>{note.sections.map((s,i)=><a href={'#section-'+i} key={i}>{s.title}<ArrowRight size={15}/></a>)}</section>
    <section className="companion-course-link"><h3>다음 단계와의 연결</h3><p>{note.bridge}</p></section>
   </section>:<article className="companion-cell" id={'cell-'+cell} ref={mainRef} key={cell}>
    <div className="cell-position"><span>코드 {position+1} / {source.blocks.length}</span><span className={'cell-kind kind-'+detail.kind}>{detail.kind}</span><button className="cell-jump-search" onClick={()=>{lookupRef.current?.scrollIntoView({block:'center'});lookupRef.current?.focus();}}>다른 셀 찾기</button><a href="#overview">학습 목표</a></div>
    <h2>{detail.title}</h2>
    <div className="original-location"><span>{note.filename} · 원본 셀 {cell}</span><strong>{location.path.join(' › ')}</strong><code>{location.firstLine}</code>{location.firstLine!==location.matchLine&&<p>같은 셀 안: <code>{location.matchLine}</code></p>}</div>
    {liveLookupAliases[note.slug]?.[cell]&&<p className="live-location-alias">최신 랩에서는 이 코드로도 찾을 수 있어요: {liveLookupAliases[note.slug][cell].map(text=><code key={text}>{text}</code>)}</p>}
    {liveNotebookNotes[note.slug]?.[cell]&&<aside className="live-notebook-note"><strong>실제 랩에서 확인한 차이</strong><p>{liveNotebookNotes[note.slug][cell]}</p>{learningPatches[note.slug]?.[cell]&&<div className="learning-patch"><p>{learningPatches[note.slug][cell].instruction}</p><CodeBlock code={learningPatches[note.slug][cell].code} label={learningPatches[note.slug][cell].label}/></div>}{['08-evaluation','09-langserve'].includes(note.slug)&&<Link to={'/get-certification#'+(note.slug==='09-langserve'?'server':cell===11?'questions':'score')}>해당 부분 수정 안내<ArrowRight size={14}/></Link>}</aside>}
    {route&&<nav className="cell-learning-trail" aria-label="이 학습 단계의 실행 순서"><strong>{routes.indexOf(route)+1}/3 · {route.title}</strong><CellTrail cells={route.cells} slug={note.slug} current={cell}/><details className="route-instructions" open={cell===route.cells[0]}><summary>이 단계에서 직접 할 일</summary><ol>{route.steps.map(text=><li key={text}>{text}</li>)}</ol></details></nav>}
    <Screenshots items={captures[note.filename]?.cells?.[cell]}/>
    <section className="cell-purpose"><h3>이 셀은 왜 필요한가요?</h3><p>{detail.process}</p></section>
    <div className="cell-before"><strong>먼저 준비할 것</strong><p>{detail.before}</p></div>
    <div className="cell-data-flow" aria-label="이 셀의 입력과 결과"><div><span>들어오는 것</span><p>{detail.input}</p></div><ArrowRight size={20}/><div><span>남는 것</span><p>{detail.output}</p></div></div>
    {block.code?<section className="companion-code"><h3>원본 코드와 함께 읽기</h3>{block.notice&&<p className="cell-excerpt-notice">{block.notice}</p>}<CodeBlock code={block.code} label={'원본 발췌 · 셀 '+cell} highlightedLine={highlight}/>{block.annotations.length>0&&<ol className="companion-annotations">{block.annotations.map((a,i)=><li key={i}><button onClick={()=>setHighlight(a.line)} aria-label={a.line+'행 코드 보기'}>{a.line}행</button><div><code>{a.token}</code><p>{a.text}</p></div></li>)}</ol>}</section>:<div className="original-only-cell"><BookOpen size={20}/><p>이 셀은 <strong>열어 둔 원본 ipynb에서</strong> 확인하세요. 위 제목·첫 줄로 찾은 뒤 설명과 비교하면 됩니다. 설정·내부 진단·파일 복원 코드는 원본 환경에 맞춰 살펴봅니다.</p></div>}
    {checkpoint&&<section className="cell-practice" aria-label="직접 해보기"><span className="eyebrow">배운 것을 확인하는 작은 실습</span><h3>실행했다면, 이제 확인해 보세요</h3><div className="practice-observe"><strong>이렇게 보이면 연결된 거예요</strong><p>{route.observe}</p></div><details className="learning-question"><summary><span>확인 질문</span>{route.question}<small>생각한 뒤 눌러 해설 보기</small></summary><p>{route.answer}</p></details></section>}
    <section className="cell-result-check"><CheckCircle2 size={22}/><div><h3>실행 후 확인</h3><p>{detail.check}</p></div></section>
    <section className="cell-pitfall"><h3>여기서 헷갈리기 쉬워요</h3><p>{detail.pitfall}</p></section>
    {detail.kind==='TODO'&&<div className="todo-steps"><strong>빈칸은 이렇게 접근하세요</strong><ol><li>위 “들어오는 것”과 “남는 것”의 자료형·키를 먼저 확인합니다.</li><li>원본의 TODO 또는 자리표시자를 찾아 해당 연결을 채웁니다.</li><li>같은 셀을 실행하고 결과를 확인한 뒤 풀이 예시와 비교합니다.</li></ol></div>}
    <div className="cell-related">{related.map(({s,i})=><a href={'#section-'+i} key={i}>개념 해설 · {s.title}<ArrowRight size={15}/></a>)}{exercises.map(({e,i})=><a href={i===0?'#exercises':'#exercise-'+i} key={i}>풀이 방법 · {e.title}<ArrowRight size={15}/></a>)}</div>
    <button className="outline-button ask-about-cell" onClick={()=>askCell(note,cell,detail.title)}><MessageCircle size={16}/>이 셀에 대해 질문하기</button>
    <nav className="step-pagination" aria-label="원본 코드 이동"><a href={position>0?'#cell-'+source.blocks[position-1].cell:'#overview'}><ArrowLeft size={17}/><span><small>이전</small>{position>0?cellGuides[note.slug][source.blocks[position-1].cell].title:'학습 목표'}</span></a>{position<source.blocks.length-1?<a className="following-step" href={'#cell-'+source.blocks[position+1].cell}><span><small>다음 코드</small>{cellGuides[note.slug][source.blocks[position+1].cell].title}</span><ArrowRight size={17}/></a>:<a className="following-step" href="#review"><span><small>이 노트 마무리</small>핵심 정리와 학습 확인</span><ArrowRight size={17}/></a>}</nav>
   </article>}
  </main></div>
 </div>;
}
function locationGlobalHash(){return window.location.hash;}

function CellTrail({cells,slug,current}) {return <ol className="learning-cell-trail">{cells.map(cell=><li key={cell}><a href={'#cell-'+cell} aria-current={cell===current?'step':undefined}><span>셀 {cell}</span>{cellGuides[slug][cell].title}</a></li>)}</ol>;}
