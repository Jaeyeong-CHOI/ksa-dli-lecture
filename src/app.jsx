import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, ArrowLeft, ArrowUpRight, Check, CheckCircle2, ChevronRight, Code2, Download, Menu, MessageCircle, Search, Terminal, X} from 'lucide-react';
import {notes as allNotes} from '../content/notes.mjs';
import {buildLessonSteps, stepFromHash} from '../content/lesson-steps.mjs';
import notebookCode from '../content/notebook-code.json';
import {CodeBlock, Chat} from './shared.jsx';
import {LessonVisual} from './lesson-visuals.jsx';
import {API} from './api.js';
import {Certification} from './certification.jsx';
import './styles.css';
import './reader.css';
import {lectures} from '../content/lectures.mjs';
import {LectureLibrary} from './lecture-library.jsx';
import {NotebookCompanion,ReaderModes} from './notebook-companion.jsx';
import {chapterBriefs} from '../content/notebook-companion.mjs';
import {findNotebookCells,usesCompanion} from '../content/notebook-lookup.mjs';
import notebookLocations from '../content/notebook-locations.json';

const notes = allNotes.filter(note => note.kind === 'notebook');
const COURSE = 'Building RAG Agents with LLMs';
const PROGRAM = 'NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지';
const route = () => location.pathname.replace(/\/$/, '') || '/';
const noteUrl = note => '/notes/' + note.slug;
const stages = [
  {title: '실습 환경과 모델 호출', text: '셀을 실행하고, 수업 서버의 모델에 첫 질문을 보냅니다.', notes: notes.slice(0, 3)},
  {title: '체인과 대화 상태', text: '입력부터 답변까지 연결하고, 대화에서 얻은 정보를 이어 갑니다.', notes: notes.slice(3, 5)},
  {title: '문서로 답하는 RAG 만들기', text: '문서를 준비해 검색·생성으로 연결한 뒤, 평가하고 API로 제공합니다.', notes: notes.slice(5)},
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
    <h3>{note.title}</h3><code className="notebook-card-file">{note.filename}</code><p>{chapterBriefs[note.slug].result}</p>
    <div className="chapter-card-bottom"><span>{note.flow.join(' → ')}</span><ArrowRight size={18}/></div>
  </Link>;
}
function NotebookList({done}) {
  return <main id="main" className="wide-page">
    <div className="eyebrow">{COURSE}</div><h1>실습 노트</h1>
    <p className="page-lead">JupyterLab의 원본 노트북과 나란히 두고 보세요.<br/>파일을 고른 뒤 원본 제목·코드 한 줄로 해당 셀의 설명을 찾을 수 있습니다.</p>
    <div className="practice-notice"><Terminal size={22}/><div><strong>코드 실행은 수업의 DLI JupyterLab에서</strong><p>이곳에서는 설명을 읽고 코드를 복사합니다. 수업 내부 서버와 패키지가 필요한 코드는 DLI 환경에서 실행하세요.</p></div></div>
    {stages.map((stage, i) => <section className="notebook-stage" key={stage.title}>
      <div className="module-heading"><span>{String(i + 1).padStart(2, '0')}</span><h2>{stage.title}</h2></div>
      <p>{stage.text}</p><div className="chapter-grid">{stage.notes.map(note => <NoteCard key={note.slug} note={note} done={done}/>)}</div>
    </section>)}
  </main>;
}
function CodeCell({block}) {
  const [highlightedLine, setHighlightedLine] = useState(null);
  return <details className="code-cell" id={'cell-' + block.cell}>
    <summary><span>셀 {String(block.cell).padStart(2, '0')}</span><strong>{block.title}</strong><Code2 size={17}/></summary>
    <div className="code-cell-body">
      {block.notice && <p className="cell-notice">{block.notice}</p>}
      {block.code && <><CodeBlock code={block.code} label={'원본 발췌 · 셀 ' + block.cell} highlightedLine={highlightedLine}/><h3>핵심 코드 해설</h3>
        <div className="code-explanations">{block.annotations.map((annotation, i) => <div key={i}><button className="annotation-line" type="button" onClick={() => setHighlightedLine(annotation.line)} aria-label={annotation.line + '행 코드 보기'}>{annotation.line}행</button><div><code>{annotation.token}</code><p>{annotation.text}</p></div></div>)}</div>
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
function useCellAnchor(slug, active) {
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
  }, [slug, active]);
}
function NotePage(props) {
  const [hash,setHash]=useState(location.hash);
  useEffect(()=>{const sync=()=>setHash(location.hash);addEventListener('hashchange',sync);addEventListener('popstate',sync);return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);};},[]);
  return usesCompanion(hash)?<NotebookCompanion {...props} notes={notes} Link={Link} hash={hash}/>:<ConceptNotePage {...props}/>;
}
function ConceptNotePage({note, done, mark}) {
  const source = notebookCode[note.slug], index = notes.indexOf(note), next = notes[index + 1];
  const {sectionBlocks, extraBlocks, steps, targets} = buildLessonSteps(note, source);
  const [active, setActive] = useState(() => stepFromHash(location.hash, targets));
  const activeIndex = steps.findIndex(step => step.id === active), currentStep = steps[activeIndex];
  useEffect(() => {
    const sync = () => setActive(stepFromHash(location.hash, targets));
    addEventListener('hashchange', sync); addEventListener('popstate', sync);
    return () => { removeEventListener('hashchange', sync); removeEventListener('popstate', sync); };
  }, [note.slug]);
  useCellAnchor(note.slug, active);
  const navigation = steps.map((step, i) => <a key={step.id} href={'#' + step.id} aria-current={active === step.id ? 'step' : undefined} className={active === step.id ? 'current-step' : ''}><span>{String(i + 1).padStart(2, '0')}</span><span><small>{step.kind}</small>{step.title}</span></a>);
  return <div className="learning-layout stepped-layout">
    <aside className="course-sidebar">
      <div className="sidebar-title">전체 챕터<small>{done.length} / {notes.length} 완료</small></div>
      <div className="progress-track"><i style={{width: done.length / notes.length * 100 + '%'}}/></div>
      <nav className="course-nav" aria-label="학습 노트 목록">{notes.map(n => <React.Fragment key={n.slug}>
        {['00', '03', '05'].includes(n.no) && <span className="nav-group">{n.no === '00' ? '환경과 모델 호출' : n.no === '03' ? '체인과 대화 상태' : 'RAG 구현과 평가'}</span>}
        <Link to={noteUrl(n)} aria-current={note.slug === n.slug ? 'page' : undefined} className={note.slug === n.slug ? 'current' : ''}><span>{done.includes(n.slug) ? <Check size={13}/> : n.no}</span>{n.title}</Link>
      </React.Fragment>)}</nav>
    </aside>
    <main id="main" className="lesson-main">
      <div className="breadcrumb"><Link to="/notebooks">실습 노트</Link><ChevronRight size={14}/><span>실습 {note.no}</span></div>
      <div className="eyebrow">실습 {note.no}</div>
      <h1>{note.title}</h1><p className="lesson-lead">{chapterBriefs[note.slug].result}</p><ReaderModes original={false}/>
      <section className="chapter-goals" aria-label="챕터 학습 목표"><div><span>LEARNING GOALS</span><h2>이 챕터에서 배울 내용은?</h2></div><ul>{chapterBriefs[note.slug].outcomes.map(([goal,check]) => <li key={goal}><CheckCircle2 size={17}/><span><strong>{goal}</strong> — {check}</span></li>)}</ul><p>{note.sections.length}개 소주제와 {note.exercises.length}개 실습을 한 단계씩 따라갑니다.</p></section>
      {source && <p className="execution-context">코드 실행은 수업의 DLI JupyterLab에서 진행합니다. {note.filename}을 열고 따라 해 보세요.</p>}
      {note.glossary && <details className="chapter-glossary"><summary>처음 만나는 용어 <span>{note.glossary.length}개</span></summary><dl>{note.glossary.map(([term,definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></details>}
      <details className="chapter-contents"><summary>이 챕터의 학습 순서<span>{activeIndex + 1} / {steps.length}</span></summary><nav aria-label="챕터 소주제 목록">{navigation}</nav></details>
      <div className="step-meter" aria-label="현재 학습 단계"><span>{currentStep.kind} <b>{String(activeIndex + 1).padStart(2, '0')}</b><small> / {steps.length}</small></span><p>한 번에 하나씩, 이해하고 넘어가세요.</p><div><i style={{width: (activeIndex + 1) / steps.length * 100 + '%'}}/></div></div>
      <div className="lesson-prose" id="explanation">{note.sections.map((section, i) => <section className="lesson-step concept-step" key={i} id={'section-' + i} hidden={active !== 'section-' + i}>
        <span className="section-no">소주제 {String(i + 1).padStart(2, '0')}</span><h2>{section.title}</h2>
        {section.text.split('\n\n').map((paragraph, j) => <p key={j}><ConceptText text={paragraph}/></p>)}
        <LessonVisual slug={note.slug} section={i}/>
        {section.reference && <span className="source-location">원본 {section.reference}</span>}
        <CodeGroup blocks={sectionBlocks[i]}/>
      </section>)}</div>
      {extraBlocks.length > 0 && <section className="lesson-step preparation-step" id="source-code" hidden={active !== 'source-code'}><span className="section-no">실습 준비</span><h2>실습 준비와 추가 코드</h2><p>환경 설정과 보조 셀입니다. 필요한 부분을 확인한 뒤 실습으로 넘어가세요.</p><CodeGroup blocks={extraBlocks} extra/></section>}
      {note.exercises.map((exercise, i) => { const id = i === 0 ? 'exercises' : 'exercise-' + i; return <section className="lesson-step practice-step" id={id} hidden={active !== id} key={id}>
        <span className="section-no">직접 해보기 {i + 1}</span><h2>{exercise.title}</h2>
        <article className="notebook-exercise"><span className="exercise-location">{exercise.location}</span><div className="practice-goal"><span>이번 실습의 목표</span><p><ConceptText text={exercise.goal}/></p></div>
          <h3>이 순서대로 풀어보세요</h3><ol>{exercise.steps.map(step => <li key={step}><ConceptText text={step}/></li>)}</ol>
          <details className="solution"><summary>풀이 예시와 비교하기<Code2 size={16}/></summary><p className="solution-context">학습을 위한 해설용 예시이며 공식 Solutions 파일은 아닙니다.</p><CodeBlock code={exercise.code} label="해설용 풀이 예시 · Python"/></details>
          <div className="solution-check"><CheckCircle2 size={19}/><div><strong>실행 후 이렇게 확인하세요</strong><p><ConceptText text={exercise.check}/></p></div></div>
        </article>
      </section>; })}
      <section className="lesson-step recap-step" id="review" hidden={active !== 'review'}>
        <span className="section-no">챕터 마무리</span><h2>이제 이렇게 설명할 수 있어요</h2>
        <div className="chapter-takeaway"><span>기억할 핵심</span><p>{note.takeaway}</p></div>
        <div className="review-section"><h3>스스로 확인해 보세요</h3><ul>{note.review.map(question => <li key={question}><ConceptText text={question}/></li>)}</ul></div>
        <section className="troubleshooting" id="troubleshooting"><h3>막혔을 때 확인하기</h3>{note.troubleshooting.map(([question, answer]) => <details key={question}><summary>{question}</summary><p><ConceptText text={answer}/></p></details>)}</section>
        <details className="references" id="references"><summary>참고자료 · 원본 정보</summary><p className="source-filename">{note.filename} · 본문의 셀 번호는 원본 노트북 기준입니다.</p><p>강연 제공: Jae Y. CHOI · 제공 자료를 바탕으로 재구성한 한국어 해설입니다.</p></details>
        <section className="lesson-transition"><span className="eyebrow">{next ? '다음 챕터로 연결하기' : '과정 돌아보기'}</span><p>{note.bridge}</p><div className="lesson-complete"><button className="outline-button" onClick={() => mark(note.slug)}><Check size={17}/>{done.includes(note.slug) ? '학습 완료됨 · 취소' : '이 노트 학습 완료'}</button>{next && <Link className="primary-button next-lesson" to={noteUrl(next)}>{next.title}<ArrowRight size={17}/></Link>}</div></section>
      </section>
      <nav className="step-pagination" aria-label="소주제 이동">
        {steps[activeIndex - 1] ? <a className="previous-step" href={'#' + steps[activeIndex - 1].id}><ArrowLeft size={17}/><span><small>이전 단계</small>{steps[activeIndex - 1].title}</span></a> : <span className="first-step-label">이 챕터의 첫 소주제입니다.</span>}
        {steps[activeIndex + 1] && <a className="following-step" href={'#' + steps[activeIndex + 1].id}><span><small>다음 단계</small>{steps[activeIndex + 1].title}</span><ArrowRight size={18}/></a>}
      </nav>
    </main>
    <aside className="lesson-outline chapter-outline"><span>이 챕터의 학습 순서</span><nav aria-label="데스크톱 소주제 목록">{navigation}</nav></aside>
  </div>;
}
function ConceptText({text}) {
  const names = /\b(RunnableAssign|RunnableLambda|RunnablePassthrough|RunnableParallel|ChatPromptTemplate|StrOutputParser|ChatNVIDIA|RemoteRunnable|RExtract|RSummarizer|DocumentSummaryBase|KnowledgeBase|RecursiveCharacterTextSplitter|LongContextReorder|NVIDIARerank|Document|FAISS|docs2str|know_base|info_base|page_content|metadata|retrieval_chain|generator_chain|context|history|input|topic|chain1|chain2|embed_query|embed_documents)\b/g;
  const parts = text.split(names);
  return parts.map((part, i) => i % 2 ? <code className="concept-code" key={i}>{part}</code> : part);
}
function SearchNotes({open, close}) {
  const dialog = useRef(), input = useRef();
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) { dialog.current.showModal(); input.current.focus(); } else dialog.current.close(); }, [open]);
  const result = notes.filter(note => (note.title + note.filename + note.summary + note.sections.map(s => s.title + s.text).join('') + note.exercises.map(e => e.title + e.code).join('')).toLowerCase().includes(query.toLowerCase()));
  const cellResults = query.trim() ? findNotebookCells(query,notebookCode,notebookLocations) : [];
  return <dialog ref={dialog} className="search-dialog" onCancel={close} onClick={event => { if (event.target === dialog.current) close(); }}><div className="search-head"><Search size={20}/><input ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder="개념, 노트북, 코드 검색" aria-label="학습 내용 검색어"/><button className="icon-button" onClick={close} aria-label="검색 닫기"><X size={19}/></button></div><div className="search-results"><small>{result.length}개의 학습 노트</small>{result.map(note => <Link key={note.slug} to={noteUrl(note)} onClick={close}><span>{note.no}</span><div><strong>{note.title}</strong><p>{'실습 ' + note.no}</p></div><ArrowRight size={16}/></Link>)}{cellResults.length>0&&<><small className="global-cell-heading">원본 코드 위치 {cellResults.length}개 · 최대 40개 표시</small>{cellResults.slice(0,40).map(item=><Link className="global-cell-result" key={item.slug+'-'+item.cell} to={'/notes/'+item.slug+'#cell-'+item.cell} onClick={close}><Code2 size={16}/><div><strong>{item.guide.title}</strong><p>{item.filename} · 원본 셀 {item.cell}</p><code>{item.location.firstLine}</code></div><ArrowRight size={16}/></Link>)}</>}{!result.length&&!cellResults.length && <p>일치하는 내용이 없어요. 원본 파일명이나 변수 이름으로 찾아보세요.</p>}</div></dialog>;
}
function App() {
  const [path, setPath] = useState(route), [done, setDone] = useState(progress), [menu, setMenu] = useState(false);
  const [questionContext,setQuestionContext]=useState('');
  const [search, setSearch] = useState(false), [chat, setChat] = useState(false), [prefill, setPrefill] = useState(''), [status, setStatus] = useState({ready: false});
  const current = notes.find(note => path === '/notes/' + note.slug);
  const lecture = lectures.find(item => path === '/lectures/' + item.slug) || (['/', '/notes/introduction-to-llm', '/resources'].includes(path) ? lectures[0] : null);
  const slides = Boolean(lecture);
  useEffect(() => {
    const pop = () => { setPath(route()); setMenu(false); };
    const key = event => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); setSearch(true); } };
    addEventListener('popstate', pop); addEventListener('keydown', key);
    fetch(API + '/api/status', {credentials: 'include'}).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(setStatus).catch(() => {});
    return () => { removeEventListener('popstate', pop); removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { document.title = (current ? current.title + ' · ' : slides ? lecture.label + ' · ' : path === '/get-certification' ? 'Get Certification · ' : '') + COURSE; }, [path]);
  function ask() { setQuestionContext(''); setPrefill(current ? `${current.filename}에서 궁금한 점이 있어요. ` : slides ? `${lecture.label} 강의자료에서 궁금한 점이 있어요. ` : ''); setChat(true); }
  function askCell(note,cell,title){setQuestionContext(`${note.filename} · 원본 셀 ${cell} · ${title}`);setPrefill('');setChat(true);}
  function mark(slug) { const next = done.includes(slug) ? done.filter(value => value !== slug) : [...done, slug]; setDone(next); try { localStorage.setItem('ksa-notes-v2', JSON.stringify(next)); } catch {} }
  return <><a href="#main" className="skip-link">본문으로 건너뛰기</a>
    <header className="site-header"><Link to="/" className="brand"><img src="/nvidia-dli-logo.png" alt="NVIDIA Deep Learning Institute"/><span className="brand-course"><b>{COURSE}</b><small>산업 AI 전환(AX) 챌린지</small></span></Link>
      <nav className={menu ? 'open' : ''} aria-label="주 메뉴"><Link to="/" className={slides ? 'active' : ''}>강의자료</Link><Link to="/notebooks" className={current?.kind === 'notebook' || path === '/notebooks' ? 'active' : ''}>실습 노트</Link><Link to="/get-certification" className={path === '/get-certification' ? 'active' : ''}>Get Certification</Link></nav>
      <div className="header-actions"><button className="search-button" onClick={() => setSearch(true)} aria-label="학습 내용 검색"><Search size={18}/><span>검색</span></button><button className="ask-button" onClick={ask} aria-label="자료 도우미 열기"><MessageCircle size={16}/><span>질문하기</span></button><button className="menu-toggle icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="메뉴 열기">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    {slides ? <LectureLibrary lecture={lecture} Link={Link} course={COURSE} program={PROGRAM}/> : path === '/get-certification' ? <Certification/> : current ? <NotePage key={current.slug} note={current} done={done} mark={mark} askCell={askCell}/> : path === '/notebooks' || path === '/practice' ? <NotebookList done={done}/> : <main id="main" className="wide-page"><h1>학습 노트를 찾을 수 없어요.</h1><Link to="/" className="primary-button">강의자료로 이동<ArrowRight size={16}/></Link></main>}
    <footer className="site-footer"><div><strong>{COURSE}</strong><p>{PROGRAM}</p></div><div><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span></div></footer>
    <SearchNotes open={search} close={() => setSearch(false)}/><Chat questionContext={questionContext} clearQuestionContext={()=>setQuestionContext('')} open={chat} close={() => setChat(false)} prefill={prefill} status={status} initialMode={slides ? 'lecture' : 'notebook'}/>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
