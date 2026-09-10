import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, ArrowLeft, ArrowUpRight, Check, CheckCircle2, ChevronRight, Code2, Download, Menu, MessageCircle, Search, Terminal, X} from 'lucide-react';
import {notes} from '../content/notes.mjs';
import notebookCode from '../content/notebook-code.json';
import {CodeBlock, MemoryDemo, Chat} from './shared.jsx';
import {LessonVisual} from './lesson-visuals.jsx';
import {API} from './api.js';
import './styles.css';

const PDF = '/downloads/Introduction-to-LLM.pdf';
const COURSE = 'Building RAG Agents with LLMs';
const PROGRAM = 'NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지';
const route = () => location.pathname.replace(/\/$/, '') || '/';
const noteUrl = note => note.kind === 'slides' ? '/' : '/notes/' + note.slug;
const stages = [
  {title: '실습 환경과 모델 호출', text: '셀을 실행하고, 수업 서버의 모델에 첫 질문을 보냅니다.', notes: notes.slice(1, 4)},
  {title: '체인과 대화 상태', text: '입력부터 답변까지 연결하고, 대화에서 얻은 정보를 이어 갑니다.', notes: notes.slice(4, 6)},
  {title: '문서로 답하는 RAG 만들기', text: '문서를 준비해 검색·생성으로 연결한 뒤, 평가하고 API로 제공합니다.', notes: notes.slice(6)},
];
function progress() {
  try {
    const value = JSON.parse(localStorage.getItem('ksa-notes-v2') || '[]');
    return Array.isArray(value) ? value.filter(slug => notes.some(n => n.slug === slug)) : [];
  } catch { return []; }
}
function Link({to, children, ...props}) {
  return <a href={to} {...props} onClick={event => {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && to.startsWith('/')) {
      event.preventDefault();
      history.pushState(null, '', to);
      dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({top: 0, behavior: 'instant'});
    }
  }}>{children}</a>;
}
function NoteCard({note, done}) {
  return <Link to={noteUrl(note)} className="chapter-card">
    <div className="chapter-card-top"><span>실습 {note.no}</span>{done.includes(note.slug) && <span className="chapter-done"><Check size={13}/>완료</span>}</div>
    <h3>{note.title}</h3><p>{note.summary}</p>
    <div className="chapter-card-bottom"><span>{note.flow.join(' → ')}</span><ArrowRight size={18}/></div>
  </Link>;
}
function NotebookList({done}) {
  return <main id="main" className="wide-page">
    <div className="eyebrow">{COURSE}</div><h1>실습 노트</h1>
    <p className="page-lead">작은 모델 호출에서 문서로 답하는 챗봇까지.<br/>00번부터 차례로 따라가거나 필요한 단계에서 이어서 학습하세요.</p>
    <div className="practice-notice"><Terminal size={22}/><div><strong>코드 실행은 수업의 DLI JupyterLab에서</strong><p>이곳에서는 설명을 읽고 코드를 복사합니다. 수업 내부 서버와 패키지가 필요한 코드는 DLI 환경에서 실행하세요.</p></div></div>
    {stages.map((stage, i) => <section className="notebook-stage" key={stage.title}>
      <div className="module-heading"><span>{String(i + 1).padStart(2, '0')}</span><h2>{stage.title}</h2></div>
      <p>{stage.text}</p><div className="chapter-grid">{stage.notes.map(note => <NoteCard key={note.slug} note={note} done={done}/>)}</div>
    </section>)}
  </main>;
}
function CodeCell({block}) {
  return <details className="code-cell" id={'cell-' + block.cell}>
    <summary><span>셀 {String(block.cell).padStart(2, '0')}</span><strong>{block.title}</strong><Code2 size={17}/></summary>
    <div className="code-cell-body">
      {block.notice && <p className="cell-notice">{block.notice}</p>}
      {block.code && <><CodeBlock code={block.code} label={'원본 발췌 · 셀 ' + block.cell}/><h3>핵심 코드 해설</h3>
        <div className="code-explanations">{block.annotations.map((annotation, i) => <div key={i}><span>{annotation.line}행</span><div><code>{annotation.token}</code><p>{annotation.text}</p></div></div>)}</div>
      </>}
    </div>
  </details>;
}
function CodeGroup({blocks, extra = false}) {
  if (!blocks.length) return null;
  return <details className={'context-code' + (extra ? ' extra-code' : '')}>
    <summary><Code2 size={17}/><span>{extra ? '실습 준비와 추가 코드' : '코드로 확인하기'}<small>{extra ? '설정·진단 등 보조 셀' : `관련 셀 ${blocks.map(b => b.cell).join(', ')}`}</small></span><ChevronRight size={17}/></summary>
    <div className="context-code-body">{blocks.map(block => <CodeCell block={block} key={block.cell}/>)}</div>
  </details>;
}
function useCellAnchor(slug) {
  useEffect(() => {
    let frame;
    function reveal() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target) return;
        for (let parent = target; parent; parent = parent.parentElement) {
          if (parent.tagName === 'DETAILS') parent.open = true;
        }
        target.scrollIntoView({block: 'start', behavior: 'instant'});
      });
    }
    reveal();
    addEventListener('hashchange', reveal);
    return () => { cancelAnimationFrame(frame); removeEventListener('hashchange', reveal); };
  }, [slug]);
}
function NotePage({note, done, mark}) {
  const source = notebookCode[note.slug], index = notes.indexOf(note), next = notes[index + 1];
  const used = new Set();
  const sectionBlocks = note.sections.map(section => (section.cells || []).flatMap(cell => {
    const block = source?.blocks.find(b => b.cell === cell);
    if (!block || used.has(cell)) return [];
    used.add(cell); return [block];
  }));
  const extraBlocks = source?.blocks.filter(block => !used.has(block.cell)) || [];
  useCellAnchor(note.slug);
  return <div className="learning-layout">
    <aside className="course-sidebar">
      <div className="sidebar-title">학습 순서<small>{done.length} / {notes.length} 완료</small></div>
      <div className="progress-track"><i style={{width: done.length / notes.length * 100 + '%'}}/></div>
      <nav className="course-nav" aria-label="학습 노트 목록">{notes.map(n => <React.Fragment key={n.slug}>
        {['PPT', '00', '03', '05'].includes(n.no) && <span className="nav-group">{n.kind === 'slides' ? 'LLM 이해하기' : n.no === '00' ? '환경과 모델 호출' : n.no === '03' ? '체인과 대화 상태' : 'RAG 구현과 평가'}</span>}
        <Link to={noteUrl(n)} aria-current={note.slug === n.slug ? 'page' : undefined} className={note.slug === n.slug ? 'current' : ''}><span>{done.includes(n.slug) ? <Check size={13}/> : n.kind === 'slides' ? '시작' : n.no}</span>{n.title}</Link>
      </React.Fragment>)}</nav>
    </aside>
    <main id="main" className="lesson-main">
      {note.kind === 'slides' ? <div className="course-context"><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span><p>{PROGRAM}</p><strong>{COURSE}</strong></div> : <div className="breadcrumb"><Link to="/">LLM 이해하기</Link><ChevronRight size={14}/><span>실습 {note.no}</span></div>}
      <div className="eyebrow">{note.kind === 'slides' ? '첫 강의 · LLM 이해하기' : '실습 ' + note.no}</div>
      <h1>{note.title}</h1><p className="lesson-lead">{note.summary}</p>
      <div className="reading-start"><span>이번 노트의 핵심</span><p>{note.takeaway}</p><ol className="concept-flow" aria-label="핵심 학습 흐름">{note.flow.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol></div>
      {source && <p className="execution-context">수업의 DLI JupyterLab에서 {note.filename}을 열고 따라 해 보세요. 관련 코드는 각 설명 아래에서 펼칠 수 있습니다.</p>}
      <details className="mobile-outline"><summary>이 노트의 차례</summary><nav aria-label="모바일 노트 차례">{note.sections.map((section, i) => <a key={i} href={'#section-' + i}>{section.title}</a>)}<a href="#exercises">직접 풀어보기</a><a href="#review">핵심 정리</a></nav></details>
      <div className="lesson-prose" id="explanation">{note.sections.map((section, i) => <section key={i} id={'section-' + i}>
        <span className="section-no">{String(i + 1).padStart(2, '0')}</span><h2>{section.title}</h2>
        {section.text.split('\n\n').map((paragraph, j) => <p key={j}>{paragraph}</p>)}
        <LessonVisual slug={note.slug} section={i}/>
        {section.reference && <span className="source-location">{note.kind === 'slides' ? '슬라이드 ' : '원본 '} {section.reference}</span>}
        <CodeGroup blocks={sectionBlocks[i]}/>
        {note.kind === 'slides' && i === note.sections.length - 1 && <MemoryDemo/>}
      </section>)}</div>
      {source && <div id="source-code"><CodeGroup blocks={extraBlocks} extra/></div>}
      <section className="exercise-section" id="exercises">
        <div className="eyebrow">배운 내용을 코드로</div><h2>직접 풀어보기</h2>
        <p className="section-intro">먼저 풀이 순서대로 작성해 본 뒤, 예시 코드와 비교하세요. 예시는 학습을 위한 해설이며 공식 Solutions 파일은 아닙니다.</p>
        {note.exercises.map((exercise, i) => <article className="notebook-exercise" key={i}>
          <span className="exercise-location">{exercise.location}</span><h3>{exercise.title}</h3><p>{exercise.goal}</p>
          <ol>{exercise.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <details className="solution"><summary>풀이 예시 확인하기<Code2 size={16}/></summary><CodeBlock code={exercise.code} label="해설용 풀이 예시 · Python"/></details>
          <div className="solution-check"><CheckCircle2 size={19}/><div><strong>실행 후 확인</strong><p>{exercise.check}</p></div></div>
        </article>)}
      </section>
      <section className="review-section" id="review"><span className="eyebrow">다음으로 넘어가기 전에</span><h2>핵심을 설명해 보세요</h2><ul>{note.review.map(question => <li key={question}>{question}</li>)}</ul></section>
      <section className="troubleshooting" id="troubleshooting"><h2>막혔을 때 확인하기</h2>{note.troubleshooting.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      <details className="references"><summary>참고자료 · 원본 정보</summary>
        {source ? <p className="source-filename">{note.filename} · 본문의 셀 번호는 원본 노트북 기준입니다.</p> : <a className="text-button" href={PDF} target="_blank" rel="noreferrer">Introduction to LLM · 63쪽 PDF<ArrowUpRight size={15}/></a>}
        <p>강연 제공: Jae Y. CHOI · 제공 자료를 바탕으로 재구성한 한국어 해설입니다.</p>
      </details>
      <section className="lesson-transition"><span className="eyebrow">{next ? '다음 학습으로 연결하기' : '과정 돌아보기'}</span><p>{note.bridge}</p>
        <div className="lesson-complete"><button className="outline-button" onClick={() => mark(note.slug)}><Check size={17}/>{done.includes(note.slug) ? '학습 완료됨 · 취소' : '이 노트 학습 완료'}</button>{next && <Link className="primary-button next-lesson" to={noteUrl(next)}>{next.title}<ArrowRight size={17}/></Link>}</div>
      </section>
    </main>
    <aside className="lesson-outline"><span>이 노트의 차례</span>{note.sections.map((section, i) => <a key={i} href={'#section-' + i}>{section.title}</a>)}<a href="#exercises">직접 풀어보기</a><a href="#review">핵심 정리</a></aside>
  </div>;
}
function Resources() {
  return <main id="main" className="wide-page resources-page"><div className="eyebrow">{COURSE}</div><h1>강의자료</h1><p className="page-lead">복습할 때 원본 슬라이드를 내려받아 확인하세요.</p>
    <div className="resource-feature"><div className="pdf-cover"><img src="/intro-cover.webp" alt="Building RAG Agents with LLMs 강연 표지"/><span>INTRODUCTION TO LLM</span></div><div><h2>Introduction<br/>to LLM</h2><p>LLM의 원리부터 학습, 멀티모달, GPU 메모리까지.<br/>첫 강의에서 다룬 내용을 담은 원본 슬라이드입니다.</p><div className="resource-meta"><span>PDF</span><span>63쪽</span><span>9.9 MB</span></div><div className="resource-buttons"><a className="primary-button" href={PDF} download><Download size={18}/>강의자료 다운로드</a></div><small>강연 제공: Jae Y. CHOI</small></div></div>
    <p className="resource-note">현재 Introduction to LLM을 제공합니다. 후속 강의자료는 추후 추가됩니다.</p>
  </main>;
}
function SearchNotes({open, close}) {
  const dialog = useRef(), input = useRef();
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) { dialog.current.showModal(); input.current.focus(); } else dialog.current.close(); }, [open]);
  const result = notes.filter(note => (note.title + note.filename + note.summary + note.sections.map(s => s.title + s.text).join('') + note.exercises.map(e => e.title + e.code).join('')).toLowerCase().includes(query.toLowerCase()));
  return <dialog ref={dialog} className="search-dialog" onCancel={close} onClick={event => { if (event.target === dialog.current) close(); }}><div className="search-head"><Search size={20}/><input ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder="개념, 노트북, 코드 검색" aria-label="학습 내용 검색어"/><button className="icon-button" onClick={close} aria-label="검색 닫기"><X size={19}/></button></div><div className="search-results"><small>{result.length}개의 학습 노트</small>{result.map(note => <Link key={note.slug} to={noteUrl(note)} onClick={close}><span>{note.kind === 'slides' ? '시작' : note.no}</span><div><strong>{note.title}</strong><p>{note.kind === 'slides' ? 'LLM 이해하기' : '실습 ' + note.no}</p></div><ArrowRight size={16}/></Link>)}{!result.length && <p>일치하는 노트가 없어요. “RAG”, “임베딩”, “RunnableAssign”으로 찾아보세요.</p>}</div></dialog>;
}
function App() {
  const [path, setPath] = useState(route), [done, setDone] = useState(progress), [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false), [chat, setChat] = useState(false), [prefill, setPrefill] = useState(''), [status, setStatus] = useState({ready: false});
  const current = path === '/' ? notes[0] : notes.find(note => path === '/notes/' + note.slug);
  useEffect(() => {
    const pop = () => { setPath(route()); setMenu(false); };
    const key = event => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); setSearch(true); } };
    addEventListener('popstate', pop); addEventListener('keydown', key);
    fetch(API + '/api/status', {credentials: 'include'}).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(setStatus).catch(() => {});
    return () => { removeEventListener('popstate', pop); removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { document.title = (current ? current.title + ' · ' : '') + COURSE; }, [path]);
  function ask() { setPrefill(current ? `${current.filename || current.title}에서 궁금한 점이 있어요. ` : ''); setChat(true); }
  function mark(slug) { const next = done.includes(slug) ? done.filter(value => value !== slug) : [...done, slug]; setDone(next); try { localStorage.setItem('ksa-notes-v2', JSON.stringify(next)); } catch {} }
  return <><a href="#main" className="skip-link">본문으로 건너뛰기</a>
    <header className="site-header"><Link to="/" className="brand"><img src="/nvidia-dli-logo.png" alt="NVIDIA Deep Learning Institute"/><span className="brand-course"><b>{COURSE}</b><small>산업 AI 전환(AX) 챌린지</small></span></Link>
      <nav className={menu ? 'open' : ''} aria-label="주 메뉴"><Link to="/" className={current?.kind === 'slides' ? 'active' : ''}>LLM 이해하기</Link><Link to="/notebooks" className={current?.kind === 'notebook' || path === '/notebooks' ? 'active' : ''}>실습 노트</Link><Link to="/resources" className={path === '/resources' ? 'active' : ''}>강의자료</Link></nav>
      <div className="header-actions"><button className="search-button" onClick={() => setSearch(true)} aria-label="학습 내용 검색"><Search size={18}/><span>검색</span></button><button className="ask-button" onClick={ask} aria-label="자료 도우미 열기"><MessageCircle size={16}/><span>질문하기</span></button><button className="menu-toggle icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="메뉴 열기">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    {current ? <NotePage key={current.slug} note={current} done={done} mark={mark}/> : path === '/notebooks' || path === '/practice' ? <NotebookList done={done}/> : path === '/resources' ? <Resources/> : <main id="main" className="wide-page"><h1>학습 노트를 찾을 수 없어요.</h1><Link to="/" className="primary-button">첫 강의로 이동<ArrowRight size={16}/></Link></main>}
    <footer className="site-footer"><div><strong>{COURSE}</strong><p>{PROGRAM}<br/>강연 제공: Jae Y. CHOI · NVIDIA DLI Certified Instructor & University Ambassador</p></div><div><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span><span>제공 자료를 바탕으로 구성한 한국어 학습 노트</span></div></footer>
    <SearchNotes open={search} close={() => setSearch(false)}/><Chat open={chat} close={() => setChat(false)} prefill={prefill} status={status}/>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
