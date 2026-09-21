import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, Menu, X} from 'lucide-react';
import {notes as allNotes} from '../content/notes.mjs';
import {Certification} from './certification.jsx';
import {AgenticPractice} from './agentic-practice.jsx';
import './styles.css';
import {lectures} from '../content/lectures.mjs';
import {LectureLibrary} from './lecture-library.jsx';
import {NotebookWorkspace} from './notebook-workspace.jsx';
import {NotebookDownloads} from './notebook-downloads.jsx';

const notes = allNotes.filter(note => note.kind === 'notebook');
const COURSE = 'Building RAG Agents with LLMs';
const PROGRAM = 'NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지';
const route = () => location.pathname.replace(/\/$/, '') || '/';
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
function App() {
  const [path, setPath] = useState(route), [menu, setMenu] = useState(false);
  const current = notes.find(note => path === '/notes/' + note.slug) || (['/notebooks','/practice'].includes(path) ? notes[0] : null);
  const lecture = lectures.find(item => path === '/lectures/' + item.slug) || (['/', '/notes/introduction-to-llm', '/resources'].includes(path) ? lectures[0] : null);
  const slides = Boolean(lecture);
  const downloads = path === '/notebook-downloads';
  const agentic = path === '/agentic-coding';
  useEffect(() => {
    const pop = () => { setPath(route()); setMenu(false); };
    addEventListener('popstate', pop);
    return () => { removeEventListener('popstate', pop); };
  }, []);
  useEffect(() => { document.title = (current ? current.title + ' · ' : slides ? lecture.label + ' · ' : downloads ? '한국어 실습 노트북 · ' : agentic ? '에이전틱 코딩 실습 · ' : path === '/get-certification' ? 'Get Certification · ' : '') + COURSE; }, [path]);


  return <><a href="#main" className="skip-link">본문으로 건너뛰기</a>
    <header className="site-header"><Link to="/" className="brand"><img src="/nvidia-dli-logo.png" alt="NVIDIA Deep Learning Institute"/><span className="brand-course"><b>{COURSE}</b><small>산업 AI 전환(AX) 챌린지</small></span></Link>
      <nav className={menu ? 'open' : ''} aria-label="주 메뉴"><Link to="/" className={slides || downloads ? 'active' : ''}>강의자료</Link><Link to="/notebooks" className={current?.kind === 'notebook' || path === '/notebooks' ? 'active' : ''}>실습 노트</Link><Link to="/get-certification" className={path === '/get-certification' ? 'active' : ''}>Get Certification</Link><Link to="/agentic-coding" className={agentic ? 'active' : ''}>에이전틱 코딩 실습</Link></nav>
      <div className="header-actions"><button className="menu-toggle icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="메뉴 열기">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    {agentic ? <AgenticPractice/> : downloads ? <NotebookDownloads Link={Link}/> : slides ? <LectureLibrary lecture={lecture} Link={Link} course={COURSE} program={PROGRAM}/> : path === '/get-certification' ? <Certification/> : current ? <NotebookWorkspace note={current} notes={notes} Link={Link}/> : <main id="main" className="wide-page"><h1>학습 노트를 찾을 수 없어요.</h1><Link to="/" className="primary-button">강의자료로 이동<ArrowRight size={16}/></Link></main>}
    <footer className="site-footer"><div><strong>{COURSE}</strong><p>{PROGRAM}</p></div><div><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span></div></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
