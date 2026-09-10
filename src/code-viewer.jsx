import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Check, Copy, Maximize2, WrapText, X, Code2} from 'lucide-react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';
import './code-viewer.css';

hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

// Keep multiline tokens intact while producing independently numbered rows.
function highlightedLines(code, language) {
  if (language === 'text') return code.split('\n').map(text => [{text, classes: []}]);
  const html = hljs.highlight(code, {language, ignoreIllegals: true}).value;
  const root = new DOMParser().parseFromString(html, 'text/html').body;
  const lines = [[]];
  function visit(node, classes = []) {
    if (node.nodeType === 3) {
      node.textContent.split('\n').forEach((text, index) => {
        if (index) lines.push([]);
        if (text) lines.at(-1).push({text, classes});
      });
    } else {
      const next = node.nodeName === 'SPAN' ? [...classes, node.className] : classes;
      node.childNodes.forEach(child => visit(child, next));
    }
  }
  visit(root);
  return lines;
}
function CodeSurface({lines, wrapped, highlightedLine, surfaceRef}) {
  return <pre ref={surfaceRef} className={'code-surface ' + (wrapped ? 'is-wrapped' : 'is-nowrap')} tabIndex={0} aria-label="코드 내용"><code className="hljs">{lines.map((tokens, index) => <span className={'code-line' + (highlightedLine === index + 1 ? ' is-highlighted' : '')} data-code-line={index + 1} key={index}><span className="code-line-number" aria-hidden="true">{index + 1}</span><span className="code-line-text">{tokens.length ? tokens.map((token, i) => <React.Fragment key={i}>{token.classes.reduceRight((text, className) => <span className={className}>{text}</span>, token.text)}</React.Fragment>) : '\u200b'}</span>{index < lines.length - 1 && <span className="code-line-break" aria-hidden="true">{'\n'}</span>}</span>)}</code></pre>;
}
export function CodeBlock({code, label = 'Python', output = false, highlightedLine, language}) {
  const inferred = language || (output ? 'text' : /^\s*(?:%%bash|!?(?:docker|curl|pip|python|nohup)\s)/.test(code) ? 'bash' : 'python');
  const lines = useMemo(() => highlightedLines(code, inferred), [code, inferred]);
  const [copied, setCopied] = useState(false), [error, setError] = useState(false), [wrapped, setWrapped] = useState(true), [expanded, setExpanded] = useState(false);
  const dialog = useRef(), surface = useRef(), expandedSurface = useRef(), timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (expanded) dialog.current.showModal(); else dialog.current.close(); }, [expanded]);
  useEffect(() => {
    if (highlightedLine) surface.current?.querySelector(`[data-code-line="${highlightedLine}"]`)?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }, [highlightedLine]);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setError(false); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setError(true); }
  }
  function controls(fullscreen = false) {
    return <div className="code-tools"><button type="button" onClick={() => setWrapped(!wrapped)} aria-pressed={wrapped} aria-label="코드 줄바꿈"><WrapText size={15}/><span>줄바꿈</span></button>{!output && <button type="button" onClick={copy} aria-label="코드 전체 복사">{copied ? <Check size={15}/> : <Copy size={15}/>}<span>{copied ? '복사 완료' : '복사'}</span></button>}<button type="button" onClick={() => setExpanded(!fullscreen)} aria-label={fullscreen ? '코드 확대 닫기' : '코드 확대 보기'}>{fullscreen ? <X size={16}/> : <Maximize2 size={15}/>}<span>{fullscreen ? '닫기' : '확대'}</span></button></div>;
  }
  return <div className={'codeblock code-viewer' + (output ? ' output' : '')}>
    <div className="codebar"><span><Code2 size={15}/>{label}</span>{controls()}</div>
    <CodeSurface lines={lines} wrapped={wrapped} highlightedLine={highlightedLine} surfaceRef={surface}/>
    <div className="code-status"><span>{inferred === 'text' ? '출력' : inferred === 'bash' ? 'Shell / Jupyter' : inferred === 'json' ? 'JSON' : 'Python'} · {lines.length}줄</span>{highlightedLine && <span>{highlightedLine}행 살펴보는 중</span>}</div>
    {error && <p role="status">복사가 허용되지 않았어요. 코드를 직접 선택해 복사해 주세요.</p>}
    <dialog ref={dialog} className="code-viewer-dialog" aria-label={label + ' 코드 확대 보기'} onCancel={() => setExpanded(false)} onClick={event => { if (event.target === dialog.current) setExpanded(false); }}>
      <div className="expanded-code"><div className="codebar"><span><Code2 size={16}/>{label}</span>{controls(true)}</div><CodeSurface lines={lines} wrapped={wrapped} highlightedLine={highlightedLine} surfaceRef={expandedSurface}/><div className="code-status">{lines.length}줄 · 코드는 실행되지 않습니다.</div></div>
    </dialog>
  </div>;
}
