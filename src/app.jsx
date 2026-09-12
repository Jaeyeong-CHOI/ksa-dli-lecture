import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, Code2, Menu, MessageCircle, Search, X} from 'lucide-react';
import {notes as allNotes} from '../content/notes.mjs';
import notebookCode from '../content/notebook-code.json';
import {Chat} from './shared.jsx';
import {API} from './api.js';
import {Certification} from './certification.jsx';
import {AgenticPractice} from './agentic-practice.jsx';
import agenticPractice from '../content/agentic-practice.json';
import agenticConcepts from '../content/agentic-concepts.json';
import './styles.css';
import {lectures} from '../content/lectures.mjs';
import {LectureLibrary} from './lecture-library.jsx';
import {NotebookWorkspace} from './notebook-workspace.jsx';
import {findNotebookCells} from '../content/notebook-lookup.mjs';
import notebookLocations from '../content/notebook-locations.json';
import fullNotebookCode from '../content/notebook-reader-code.json';
import {withFullCellCode} from '../content/notebook-reader.mjs';
const searchNotebookCode = withFullCellCode(notebookCode,fullNotebookCode);
import {NotebookDownloads} from './notebook-downloads.jsx';

const notes = allNotes.filter(note => note.kind === 'notebook');
const COURSE = 'Building RAG Agents with LLMs';
const PROGRAM = 'NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지';
const route = () => location.pathname.replace(/\/$/, '') || '/';
const noteUrl = note => '/notes/' + note.slug;
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
function SearchNotes({open, close}) {
  const dialog = useRef(), input = useRef();
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) { dialog.current.showModal(); input.current.focus(); } else dialog.current.close(); }, [open]);
  const result = notes.filter(note => (note.title + note.filename + note.summary + note.sections.map(s => s.title + s.text).join('') + note.exercises.map(e => e.title + e.code).join('')).toLowerCase().includes(query.toLowerCase()));
  const practiceResults = query.trim() ? agenticPractice.steps.filter(s => (s.title+s.goal+s.actions.join('')+(s.lesson?JSON.stringify(agenticConcepts[s.lesson]):'')).toLowerCase().includes(query.toLowerCase())) : [];
  const cellResults = query.trim() ? findNotebookCells(query,searchNotebookCode,notebookLocations) : [];
  return <dialog ref={dialog} className="search-dialog" onCancel={close} onClick={event => { if (event.target === dialog.current) close(); }}><div className="search-head"><Search size={20}/><input ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder="개념, 노트북, 코드 검색" aria-label="학습 내용 검색어"/><button className="icon-button" onClick={close} aria-label="검색 닫기"><X size={19}/></button></div><div className="search-results">{practiceResults.length>0&&<><small>에이전틱 코딩 실습 {practiceResults.length}개</small>{practiceResults.map(s=><Link key={s.id} to={'/agentic-coding#'+s.id} onClick={close}><Code2 size={16}/><div><strong>{s.title}</strong><p>{s.group}</p></div><ArrowRight size={16}/></Link>)}</>}<small>{result.length}개의 학습 노트</small>{result.map(note => <Link key={note.slug} to={noteUrl(note)} onClick={close}><span>{note.no}</span><div><strong>{note.title}</strong><p>{'실습 ' + note.no}</p></div><ArrowRight size={16}/></Link>)}{cellResults.length>0&&<><small className="global-cell-heading">원본 코드 위치 {cellResults.length}개 · 최대 40개 표시</small>{cellResults.slice(0,40).map(item=><Link className="global-cell-result" key={item.slug+'-'+item.cell} to={'/notes/'+item.slug+'#cell-'+item.cell} onClick={close}><Code2 size={16}/><div><strong>{item.guide.title}</strong><p>{item.filename} · 원본 셀 {item.cell}</p><code>{item.location.firstLine}</code></div><ArrowRight size={16}/></Link>)}</>}{!result.length&&!cellResults.length&&!practiceResults.length && <p>일치하는 내용이 없어요. 원본 파일명이나 변수 이름으로 찾아보세요.</p>}</div></dialog>;
}
function App() {
  const [path, setPath] = useState(route), [menu, setMenu] = useState(false);
  const [questionContext,setQuestionContext]=useState('');
  const [search, setSearch] = useState(false), [chat, setChat] = useState(false), [prefill, setPrefill] = useState(''), [status, setStatus] = useState({ready: false});
  const current = notes.find(note => path === '/notes/' + note.slug) || (['/notebooks','/practice'].includes(path) ? notes[0] : null);
  const lecture = lectures.find(item => path === '/lectures/' + item.slug) || (['/', '/notes/introduction-to-llm', '/resources'].includes(path) ? lectures[0] : null);
  const slides = Boolean(lecture);
  const downloads = path === '/notebook-downloads';
  const agentic = path === '/agentic-coding';
  useEffect(() => {
    const pop = () => { setPath(route()); setMenu(false); };
    const key = event => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); setSearch(true); } };
    addEventListener('popstate', pop); addEventListener('keydown', key);
    fetch(API + '/api/status', {credentials: 'include'}).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(setStatus).catch(() => {});
    return () => { removeEventListener('popstate', pop); removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { document.title = (current ? current.title + ' · ' : slides ? lecture.label + ' · ' : downloads ? '한국어 실습 노트북 · ' : agentic ? '에이전틱 코딩 실습 · ' : path === '/get-certification' ? 'Get Certification · ' : '') + COURSE; }, [path]);
  function ask() { const cell=Number(location.hash.match(/^#cell-(\d+)$/)?.[1]); setQuestionContext(current&&cell?`${current.filename} · 원본 셀 ${cell}`:''); setPrefill(current&&cell?'':current ? `${current.filename}에서 궁금한 점이 있어요. ` : slides ? `${lecture.label} 강의자료에서 궁금한 점이 있어요. ` : ''); setChat(true); }


  return <><a href="#main" className="skip-link">본문으로 건너뛰기</a>
    <header className="site-header"><Link to="/" className="brand"><img src="/nvidia-dli-logo.png" alt="NVIDIA Deep Learning Institute"/><span className="brand-course"><b>{COURSE}</b><small>산업 AI 전환(AX) 챌린지</small></span></Link>
      <nav className={menu ? 'open' : ''} aria-label="주 메뉴"><Link to="/" className={slides || downloads ? 'active' : ''}>강의자료</Link><Link to="/notebooks" className={current?.kind === 'notebook' || path === '/notebooks' ? 'active' : ''}>실습 노트</Link><Link to="/get-certification" className={path === '/get-certification' ? 'active' : ''}>Get Certification</Link><Link to="/agentic-coding" className={agentic ? 'active' : ''}>에이전틱 코딩 실습</Link></nav>
      <div className="header-actions"><button className="search-button" onClick={() => setSearch(true)} aria-label="학습 내용 검색"><Search size={18}/><span>검색</span></button>{!agentic&&<button className="ask-button" onClick={ask} aria-label="자료 도우미 열기"><MessageCircle size={16}/><span>질문하기</span></button>}<button className="menu-toggle icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="메뉴 열기">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    {agentic ? <AgenticPractice/> : downloads ? <NotebookDownloads Link={Link}/> : slides ? <LectureLibrary lecture={lecture} Link={Link} course={COURSE} program={PROGRAM}/> : path === '/get-certification' ? <Certification/> : current ? <NotebookWorkspace note={current} notes={notes} Link={Link}/> : <main id="main" className="wide-page"><h1>학습 노트를 찾을 수 없어요.</h1><Link to="/" className="primary-button">강의자료로 이동<ArrowRight size={16}/></Link></main>}
    <footer className="site-footer"><div><strong>{COURSE}</strong><p>{PROGRAM}</p></div><div><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span></div></footer>
    <SearchNotes open={search} close={() => setSearch(false)}/><Chat questionContext={questionContext} clearQuestionContext={()=>setQuestionContext('')} open={chat} close={() => setChat(false)} prefill={prefill} status={status} initialMode={slides ? 'lecture' : 'notebook'}/>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
