import React, {useId, useState} from 'react';
import {ArrowRight, CheckCircle2, BookOpen, ChevronRight} from 'lucide-react';
import concepts from '../content/agentic-concepts.json';
import {settings, deployment} from '../content/agentic-field-roles.mjs';
import './agentic-concepts.css';

function Explorer({title, parts}) {
  const [index, setIndex] = useState(0);
  const id = useId(), item = parts[index];
  return <section className="ac-explorer" aria-label={title}>
    <h3>{title}</h3><p className="ac-explorer-hint">항목을 선택하면 역할과 실습 예시가 바뀝니다.</p>
    <div className="ac-explorer-layout">
      <div className="ac-part-buttons" role="group" aria-label="구성요소 선택">
        {parts.map((p, i) => <button key={p.id} type="button" aria-pressed={i === index} aria-controls={id} onClick={() => setIndex(i)}><span>{p.label}</span><ChevronRight size={15}/></button>)}
      </div>
      <div id={id} className="ac-part-detail" aria-live="polite" aria-atomic="true">
        <div className="ac-detail-label">선택한 구성요소</div><h4>{item.label}</h4>
        <p className="ac-role">{item.role}</p><p>{item.why}</p>
        {item.code && <pre tabIndex={0} aria-label={item.label + ' 설명용 예시'}><code>{item.code}</code></pre>}
        <div className="ac-in-practice"><strong>이번 실습에서는</strong><p>{item.example}</p></div>
      </div>
    </div>
  </section>;
}
function Flow({flow}) {
  const [index, setIndex] = useState(0), id = useId();
  const frame = flow[index];
  return <section className="ac-explain-flow" aria-label="실행 흐름 이해하기"><h3>어떤 순서로 이어질까요?</h3><p className="ac-explorer-hint">교육용 흐름입니다. 선택해도 실제 도구는 실행하지 않습니다.</p>
    <div className="ac-flow-buttons" style={{'--ac-flow-count':flow.length}} role="group" aria-label="실행 흐름 선택">{flow.map((f, i) => <button key={f.title} type="button" aria-pressed={index === i} aria-controls={id} onClick={() => setIndex(i)}>{f.title}{i < flow.length - 1 && <ArrowRight size={15}/>}</button>)}</div>
    <div id={id} className="ac-flow-description" aria-live="polite" aria-atomic="true"><strong>{frame.label}</strong><p>{frame.text}</p><span>{frame.result}</span></div>
  </section>;
}
function ConceptCheck({quiz}) {
  const [answer, setAnswer] = useState(null);
  return <section className="ac-concept-quiz" aria-label="개념 확인 문제"><h3><CheckCircle2 size={19}/>잠깐, 이해했는지 확인해 볼까요?</h3><p>{quiz.q}</p><div role="group" aria-label="답 선택">{quiz.options.map((option, i) => <button key={option} type="button" aria-pressed={answer === i} onClick={() => setAnswer(i)}>{option}</button>)}</div>{answer !== null && <div className={'ac-answer ' + (answer === quiz.answer ? 'correct' : '')} role="status"><strong>{answer === quiz.answer ? '맞아요.' : '다시 생각해 보세요.'}</strong> {quiz.explain}</div>}</section>;
}
export function AgenticConceptLesson({name}) {
  const c = concepts[name];
  return <div className="ac-theory">
    <section className="ac-definition"><span><BookOpen size={17}/>먼저 이해하기</span><h3>{c.headline}</h3><p>{c.intro}</p><p className="ac-analogy">{c.analogy}</p></section>
    {name === 'skill' && <figure className="ac-structure-map"><figcaption>필수 파일 하나 안에 세 부분이 들어 있습니다.</figcaption><div className="ac-skill-folder"><strong>brief-to-page/</strong><div className="ac-skill-file"><b>SKILL.md</b><div><span><code>name</code>이름</span><span><code>description</code>적용 상황</span><span><code>본문</code>작업 절차·기준</span></div></div></div><p>name과 description은 별도 파일이 아니라 SKILL.md 안의 항목입니다. 보조 폴더는 필요할 때 추가합니다.</p></figure>}
    {name === 'mcp' && <figure className="ac-structure-map"><figcaption>Client는 Host 안에 있습니다. MCP가 연결하는 구간을 보세요.</figcaption><div className="ac-mcp-map"><div className="ac-map-host"><strong>Host · ChatGPT 앱</strong><span>LLM / 에이전트 · 판단</span><b>MCP Client · 연결 담당</b></div><div className="ac-map-arrow"><strong>↔</strong><small>MCP</small></div><div className="ac-map-server"><strong>MCP Server</strong><span>도구 설명·호출 처리</span></div><div className="ac-map-arrow"><strong>↔</strong><small>서비스 기능</small></div><div className="ac-map-service"><strong>Vercel</strong><span>실제 조회·배포</span></div></div><p>Vercel MCP 서버는 Vercel 기능을 제공하는 연결 프로그램입니다. 생성한 웹페이지와는 다릅니다.</p></figure>}
    <Explorer title={c.title} parts={c.parts}/>
    <Flow flow={c.flow}/>
    <section className="ac-key-difference"><h3>이 차이를 기억하세요</h3><p>{c.takeaway}</p></section>
    <ConceptCheck quiz={c.quiz}/>
    <div className="ac-concept-sources">개념 더 보기: {c.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>)}</div>
  </div>;
}
export function PracticeFieldRoles({kind}) {
  return <details className="ac-field-roles"><summary>{kind === 'settings' ? '이 설정값들은 각각 무슨 역할인가요?' : '팀·프로젝트·파일·Preview는 무엇인가요?'}</summary><Explorer title="설정값의 역할" parts={kind === 'settings' ? settings : deployment}/></details>;
}
