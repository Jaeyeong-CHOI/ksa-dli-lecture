import React, {useEffect,useRef,useState} from 'react';
import {Terminal,Check,Copy,ArrowUpRight,SlidersHorizontal,MessageCircle,X,Send,Square,RotateCcw} from 'lucide-react';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import {API} from './api.js';
import {CodeBlock} from './code-viewer.jsx';
import {notes} from '../content/notes.mjs';
import {papers} from '../content/papers.mjs';
import './chat-modes.css';
function SourceReference({source}) {
  const note = notes.find(n => n.filename && source.title.includes(n.filename));
  const href = source.url?.startsWith('/') ? source.url : note ? '/notes/' + note.slug : source.url;
  const label = '[' + source.id + '] ' + (source.kind === 'paper' ? '논문 · ' : source.kind === 'lecture' ? '강의자료 · ' : '실습노트 · ') + source.title + ' · ' + source.detail;
  if (!href || /(?:drive|docs)\.google\.com/i.test(href)) return <span className="chat-source-label">{label}</span>;
  return <a href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13}/></a>;
}

function TokenDemo(){const [selected,setSelected]=useState(null);return <div className="token-demo"><div className="demo-label"><span className="live-dot"/>작게 들여다보는 LLM <span>01 / NEXT TOKEN</span></div><div className="demo-prompt"><small>지금까지의 문맥</small><p>인공지능을 배우는 가장 좋은 방법은 <span className="cursor"/></p></div><div className="demo-line"><span/>다음 단어의 후보<span/></div><div className="token-options">{[['직접','62'],['함께','25'],['꾸준히','13']].map(([word,value])=><button key={word} onClick={()=>setSelected(word)} className={selected===word?'selected':''}><span>{word}</span><span>{value}%</span><i style={{width:value+'%'}}/></button>)}</div><p className="demo-result" aria-live="polite">{selected?<>인공지능을 배우는 가장 좋은 방법은 <strong>{selected}</strong>… <span>다음 선택이 이어집니다.</span></>:<>후보를 눌러 다음 말을 선택해 보세요.<ArrowUpRight size={16}/></>}</p><small className="demo-note">설명을 위한 단어·확률 예시입니다. 실제 모델의 출력이 아닙니다.</small></div>}
function MemoryDemo(){const [b,setB]=useState(3),[bits,setBits]=useState(16);const gb=b*bits/8;return <div className="memory-demo"><div className="demo-label"><SlidersHorizontal size={16}/>가중치 메모리 실험실</div><label>파라미터 수 <strong>{b}B</strong><input type="range" min="1" max="70" value={b} onChange={e=>setB(+e.target.value)}/></label><div className="bit-options">{[16,8,4].map(n=><button key={n} onClick={()=>setBits(n)} aria-pressed={bits===n}>{n}비트</button>)}</div><div className="memory-result"><strong>{gb.toFixed(2)} <small>GB</small></strong><span>≈ {(gb*1e9/2**30).toFixed(2)} GiB<br/>가중치만의 이론적 저장 크기</span></div><p>{b} × 10⁹개 × {bits}비트 ÷ 8</p><small>KV 캐시·양자화 메타데이터·실행 공간은 제외됩니다. 이 값만으로 GPU 구매나 실행 가능 여부를 판단하지 마세요.</small></div>}
function Chat({open, close, prefill, status, initialMode = 'lecture'}) {
  const dialog = useRef(), input = useRef(), scroll = useRef(), abort = useRef();
  const empty = () => ({messages: [], value: '', error: '', notice: ''});
  const [mode, setMode] = useState(initialMode);
  const [threads, setThreads] = useState(() => ({lecture: empty(), notebook: empty()}));
  const {messages, value, error, notice} = threads[mode];
  const [busy, setBusy] = useState(false), [includePapers, setIncludePapers] = useState(true);
  const pendingQuestion = useRef(null);
  function field(name, next, target = mode) {
    setThreads(previous => ({...previous, [target]: {...previous[target], [name]: typeof next === 'function' ? next(previous[target][name]) : next}}));
  }
  const setMessages = next => field('messages', next), setValue = next => field('value', next);
  const setError = next => field('error', next), setNotice = next => field('notice', next);
  function switchMode(next) {
    if (next === mode) return;
    const pending = abort.current; abort.current = null; pending?.abort(); setBusy(false);
    if (pendingQuestion.current) {
      const old = pendingQuestion.current;
      field('value', old.question, old.mode);
      field('notice', '모드를 바꿔 진행 중인 답변을 취소했어요. 질문을 다시 보낼 수 있어요.', old.mode);
    }
    pendingQuestion.current = null;
    setMode(next);
    requestAnimationFrame(() => input.current?.focus());
  }
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
      switchMode(initialMode);
      if (prefill && !threads[initialMode].value) field('value', prefill, initialMode);
      input.current?.focus();
    } else dialog.current.close();
  }, [open, prefill, initialMode]);
  useEffect(() => { scroll.current?.scrollTo({top: scroll.current.scrollHeight, behavior: 'smooth'}); }, [messages, busy, error, mode]);
  useEffect(() => () => { const pending = abort.current; abort.current = null; pending?.abort(); }, []);
  function reset() {
    const pending = abort.current;
    // Invalidate before aborting: a late response must not restore the old conversation.
    abort.current = null;
    pending?.abort();
    pendingQuestion.current = null;
    setMessages([]); setValue(''); setError(''); setBusy(false);
    setNotice('이 모드의 새 대화를 시작했어요. 이전 질문과 답변은 다음 요청에 포함되지 않습니다.');
    scroll.current?.scrollTo({top: 0, behavior: 'instant'});
    input.current?.focus();
  }
  async function submit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q || abort.current) return;
    const history = messages.slice(-6).map(m => ({role: m.role, content: m.content}));
    const controller = new AbortController();
    abort.current = controller;
    pendingQuestion.current = {mode, question:q};
    setMessages(m => [...m, {role: 'user', content: q}]);
    setValue(''); setError(''); setNotice(''); setBusy(true);
    try {
      const r = await fetch(API + '/api/chat', {
        credentials: 'include', method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: q, history, mode, includePapers: mode === 'lecture' && includePapers}), signal: controller.signal,
      });
      const data = await r.json();
      if (abort.current !== controller) return;
      if (!r.ok) throw new Error(data.error || '답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
      setMessages(m => [...m, {role: 'assistant', content: data.answer, sources: data.sources}]);
    } catch (e) {
      if (abort.current !== controller) return;
      setError(e.name === 'AbortError' ? '요청을 취소했어요.' : e.message);
      setValue(q);
    } finally {
      if (abort.current === controller) { setBusy(false); abort.current = null; pendingQuestion.current = null; }
    }
  }
  return <dialog ref={dialog} className="chat-dialog" onCancel={close} onClick={e=>{if(e.target===dialog.current)close()}}><div className="chat-shell"><div className="chat-heading"><div className="tutor-icon"><MessageCircle size={21}/></div><div><h2>{mode === 'lecture' ? '강의자료 기반 챗봇' : '실습노트 기반 챗봇'}</h2><p>{mode === 'lecture' ? '슬라이드의 개념과 관련 논문을 함께 살펴봐요.' : '코드·실행 순서·오류를 노트북에서 찾아봐요.'}</p></div><button className="icon-button" onClick={close} aria-label="자료 도우미 닫기"><X size={21}/></button></div><div className="chat-model"><span className={'live-dot '+(!status.ready?'pending':'')}/>{status.ready?'GPT-5.6 Sol · 추론 High':'API 연결 준비 중'}<span>출처 기반 Q&A</span></div><div className="chat-mode-tabs" role="group" aria-label="챗봇 자료 범위"><button type="button" aria-pressed={mode==='lecture'} onClick={()=>switchMode('lecture')}>강의자료 기반</button><button type="button" aria-pressed={mode==='notebook'} onClick={()=>switchMode('notebook')}>실습노트 기반</button></div><div className="chat-scope-info">{mode==='lecture'?<><label><input type="checkbox" checked={includePapers} onChange={e=>{setIncludePapers(e.target.checked);reset();}}/>관련 논문 근거도 참고</label><details><summary>참고할 논문 {papers.length}편</summary><ul>{papers.map(p=><li key={p.slug}><a href={p.url} target="_blank" rel="noreferrer">{p.label}<ArrowUpRight size={12}/></a></li>)}</ul><p>강의와 관련된 원문에서 필요한 부분을 찾아 답합니다. 실시간 웹 검색은 하지 않습니다.</p></details></>:<p>JupyterLab 00–09번 · 코드 해설 · Get Certification</p>}</div><div className="chat-reset-row"><span>두 모드의 대화는 따로 유지됩니다.</span><button type="button" className="chat-reset-button" onClick={reset} aria-label="새 대화로 초기화"><RotateCcw size={14}/>새 대화</button></div><div className="chat-messages" ref={scroll} aria-live="polite" aria-relevant="additions">{notice&&<p className="chat-reset-notice" role="status">{notice}</p>}{messages.length===0&&<div className="chat-welcome"><div className="chat-symbol">?</div><span className="eyebrow">NVIDIA DLI · COURSE ASSISTANT</span><h3>어느 부분이<br/>궁금한가요?</h3><p>{mode==='lecture'?'강의자료 6종의 개념·그림을 설명하고, 필요하면 관련 논문 원문도 근거로 답해요.':'실습노트 10개와 코드 해설에서 붙여넣을 위치, 실행 순서, 오류 해결 방법을 찾아 답해요.'}</p>{(mode==='lecture'?['RAGAS의 평가 지표를 쉽게 설명해 주세요.','QuCo-RAG는 언제 검색을 실행하나요?','Search-R1과 ReasonRAG의 차이는 무엇인가요?']:['07번 인덱스 저장 코드를 어디에 붙이나요?','RunnableAssign은 어떤 역할을 하나요?','09번 서버가 연결되지 않을 때 어떻게 하나요?']).map(q=><button key={q} onClick={()=>{setValue(q);input.current.focus()}}>{q}<ArrowUpRight size={15}/></button>)}<small>질문은 답변 생성을 위해 OpenAI로 전송됩니다. 개인정보나 API 키는 입력하지 마세요. 이 사이트는 대화 원문을 별도로 저장하지 않습니다.</small></div>}{messages.map((m,i)=><div className={'chat-message '+m.role} key={i}>{m.role==='assistant'&&<span className="message-label">{mode==='lecture'?'강의자료 도우미':'실습노트 도우미'}</span>}{m.role==='user'?<p>{m.content}</p>:<><div className="markdown" dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(marked.parse(m.content),{ALLOWED_TAGS:['p','br','strong','em','ul','ol','li','code','pre','h2','h3','h4','blockquote'],ALLOWED_ATTR:[]})}}/>{m.sources?.length>0&&<div className="chat-sources"><span>답변에서 참고한 자료</span>{m.sources.map(s=><SourceReference key={s.id} source={s}/>)}</div>}</>}</div>)}{busy&&<div className="chat-loading" role="status"><span className="spinner"/><div>자료를 찾아 설명을 준비하고 있어요.<small>High 추론은 답변까지 잠시 걸릴 수 있어요.</small></div></div>}{error&&<div className="chat-error" role="alert">{error}</div>}</div><form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="chat-input">{mode==='lecture'?'강의자료에 관한 질문':'실습노트에 관한 질문'}</label><textarea id="chat-input" ref={input} value={value} maxLength={1800} onChange={e=>setValue(e.target.value)} placeholder={mode==='lecture'?'예: RAGAS의 faithfulness는 무엇인가요?':'예: 07번에서 docstore가 없다고 나와요.'} rows={2} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(!busy)submit(e)}}}/><div><small>답변의 출처를 꼭 확인해 주세요.</small>{busy?<button key="cancel" type="button" onClick={event=>{event.preventDefault();abort.current?.abort();}} aria-label="답변 생성 취소"><Square size={16}/></button>:<button key="send" type="submit" disabled={!value.trim()} aria-label="질문 보내기"><Send size={17}/></button>}</div></form></div></dialog>}
export {CodeBlock,TokenDemo,MemoryDemo,Chat};
