import React, {useId, useState} from 'react';
import {ArrowRight, Check, Code2, Database, FileText, Layers, MessageCircle} from 'lucide-react';
import {visualPlacements, compositionResult, chunkText, splitForDemo, embeddingDocuments, embeddingQueries, rankDemoDocuments, ragExamples} from '../content/visual-models.mjs';
import './lesson-visuals.css';

function Frame({name, title, description, children, footnote}) {
  const id = useId();
  return <figure className="lesson-visual" data-visual={name} aria-labelledby={id}>
    <figcaption><span className="visual-kicker">그림으로 이해하기</span><h3 id={id}>{title}</h3><p>{description}</p></figcaption>
    {children}
    {footnote && <p className="visual-footnote">{footnote}</p>}
  </figure>;
}
function Choices({label, items, selected, onChange}) {
  return <div className="visual-choices" role="group" aria-label={label}>{items.map((item, index) => <button type="button" key={item} aria-pressed={selected === index} onClick={() => onChange(index)}>{item}</button>)}</div>;
}
function Node({label, value, icon: Icon, active = false}) {
  return <div className={'visual-node' + (active ? ' is-active' : '')}>{Icon && <Icon size={18} aria-hidden="true"/>}<span>{label}</span><strong>{value}</strong></div>;
}
function Connector() { return <ArrowRight className="visual-connector" size={18} aria-hidden="true"/>; }

function LearningRag() {
  const [selected, setSelected] = useState(1);
  const training = selected === 0;
  return <Frame name="learning-rag" title="모델을 바꿀까요, 참고할 자료를 더할까요?" description="두 방식을 바꾸어 보며, 정보가 어디에 반영되는지 비교하세요.">
    <Choices label="학습과 RAG 비교" items={['모델 학습', 'RAG']} selected={selected} onChange={setSelected}/>
    <div className="visual-lane" aria-live="polite">
      <Node label={training ? '배울 내용' : '답변할 근거'} value={training ? '학습 데이터' : '검색한 문서'} icon={FileText}/><Connector/>
      <Node label={training ? '예측 → 손실 → 갱신' : '질문과 함께 입력'} value={training ? '학습 과정' : '프롬프트 문맥'} icon={Layers} active/><Connector/>
      <Node label={training ? '모델 자체가 달라짐' : '모델은 자료를 읽음'} value={training ? '가중치 갱신' : '가중치 유지'} icon={Database}/>
    </div>
    <p className="visual-insight"><Check size={16}/>{training ? '학습은 파라미터를 갱신해 모델의 행동을 바꿉니다.' : '일반적인 RAG는 가중치를 바꾸지 않고, 답할 때 참고할 문서를 더합니다.'}</p>
  </Frame>;
}

function Composition() {
  const [selected, setSelected] = useState(0), [input, setInput] = useState(3);
  const mode = selected === 0 ? 'sequence' : 'parallel';
  const result = compositionResult(input, mode);
  return <Frame name="composition" title="| 로 잇기와, 딕셔너리로 나누기" description="같은 입력을 넣어도 연결 방식에 따라 계산 경로와 결과가 달라집니다." footnote="숫자로 단순화한 학습용 예시입니다. 병렬 분기는 각각 같은 원래 입력을 받습니다.">
    <Choices label="Runnable 연결 방식" items={['순차 연결 A | B', '병렬 분기']} selected={selected} onChange={setSelected}/>
    <code className="visual-chain-code">{mode === 'sequence' ? 'A | B' : 'RunnableParallel(plus=A, times=B)'}</code>
    <label className="visual-slider">입력 x <strong>{input}</strong><input type="range" min="1" max="5" value={input} onChange={event => setInput(Number(event.target.value))}/></label>
    <div className="composition-diagram" aria-live="polite">
      <div className="visual-input-token">입력 <b>{input}</b></div>
      {mode === 'sequence' ? <div className="sequence-lane"><Node label="A · 2 더하기" value={`${input} + 2 = ${input + 2}`} active/><Connector/><Node label="B · 10 곱하기" value={`${input + 2} × 10 = ${result}`} active/></div> : <div className="parallel-lanes"><div><span>같은 입력 {input}</span><Node label="A · 2 더하기" value={`${input} + 2 = ${result.plus}`} active/></div><div><span>같은 입력 {input}</span><Node label="B · 10 곱하기" value={`${input} × 10 = ${result.times}`} active/></div></div>}
      <div className="visual-output-token"><span>{mode === 'sequence' ? '앞 단계의 출력이 다음 입력으로' : '분기 결과를 키별로 모으면'}</span><code>{typeof result === 'number' ? String(result) : JSON.stringify(result)}</code></div>
    </div>
  </Frame>;
}

const poetryExamples = [
  {topic: '새', input: 'Tell me about birds!', answer: 'Birds in flight,\nGreet the light.'},
  {topic: '고양이', input: 'Tell me about cats!', answer: 'Cats at play,\nChase the day.'},
];
function ChainTypes() {
  const [step, setStep] = useState(0), [example, setExample] = useState(0);
  const sample = poetryExamples[example];
  const steps = [
    {title: '입력', type: 'dict', note: '프롬프트의 {input} 자리를 채울 값을 딕셔너리로 전달합니다.', value: JSON.stringify({input: sample.input}, null, 2)},
    {title: '프롬프트', type: 'ChatPromptValue', note: 'ChatPromptTemplate이 시스템 안내와 사용자 입력을 메시지로 구성합니다.', value: `SystemMessage(content="Only respond in rhymes")\nHumanMessage(content=${JSON.stringify(sample.input)})`},
    {title: '모델', type: 'AIMessage', note: 'ChatNVIDIA는 답변 내용을 담은 메시지 객체를 반환합니다. 아직 문자열 자체는 아닙니다.', value: `AIMessage(content=${JSON.stringify(sample.answer)})`},
    {title: '파서', type: 'str', note: 'StrOutputParser가 메시지에서 텍스트를 꺼냅니다. 다음 작업에서 문자열로 사용할 수 있습니다.', value: sample.answer},
  ];
  return <Frame name="chain-types" title="데이터가 체인을 통과하면 어떤 모양일까요?" description="각 단계를 눌러, 값과 자료형이 바뀌는 지점을 살펴보세요." footnote="03번 노트북 셀 12의 구조를 재구성했습니다. 시와 응답 객체는 이해를 돕는 예시이며 실제 모델 출력이 아닙니다.">
    <Choices label="체인 입력 예시" items={poetryExamples.map(item => item.topic)} selected={example} onChange={setExample}/>
    <code className="visual-chain-code">prompt | chat_llm | StrOutputParser()</code>
    <ol className="visual-steps" aria-label="체인 단계 선택">{steps.map((item, index) => <li key={item.title}><button type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>{index + 1}</span><strong>{item.title}</strong><small>{item.type}</small></button>{index < steps.length - 1 && <Connector/>}</li>)}</ol>
    <div className="visual-inspector" aria-live="polite"><div><strong>{steps[step].title} 단계</strong><span className="visual-type">{steps[step].type}</span></div><pre>{steps[step].value}</pre><p>{steps[step].note}</p></div>
  </Frame>;
}

function StateFlow() {
  const [step, setStep] = useState(0);
  return <Frame name="state" title="필요한 값을 더하며 상태를 이어 갑니다" description="앞에서 만든 know_base를 다음 조회 단계가 읽는 순서입니다." footnote="04번 노트북 셀 38의 모의 항공편 예시입니다. 상태의 주요 필드만 표시하며 실제 예약을 조회하지 않습니다.">
    <Choices label="상태 갱신 단계" items={['1 · 입력 상태', '2 · 정보 추출', '3 · 항공편 조회']} selected={step} onChange={setStep}/>
    <div className="state-chain"><span className={step === 1 ? 'active' : ''}><Code2 size={15}/>Assign(know_base)</span><ArrowRight size={16}/><span className={step === 2 ? 'active' : ''}><Database size={15}/>Assign(context)</span></div>
    <div className="state-snapshot" aria-live="polite">
      <div><code>input</code><p>Jane Doe이고 예약 번호는 12345예요.</p><span>유지</span></div>
      <div className={step >= 1 ? 'changed' : ''}><code>know_base</code><p>{step === 0 ? 'KnowledgeBase(first_name="unknown", last_name="unknown", confirmation=None)' : 'KnowledgeBase(first_name="Jane", last_name="Doe", confirmation=12345)'}</p><span>{step >= 1 ? '갱신' : '초기값'}</span></div>
      <div className={step === 2 ? 'changed' : 'pending'}><code>context</code><p>{step === 2 ? 'San Jose → New Orleans · 내일 12:30 PM 출발' : '아직 조회하지 않았어요.'}</p><span>{step === 2 ? '추가' : '대기'}</span></div>
    </div>
    <p className="visual-insight"><ArrowRight size={16}/>{step === 0 ? '사용자 입력과 이전 지식이 다음 단계로 전달됩니다.' : step === 1 ? 'input은 남기고 know_base만 갱신합니다. 조회는 아직 하지 않았습니다.' : '새 know_base에서 조회 키를 꺼냅니다. input과 know_base는 그대로 남습니다.'}</p>
  </Frame>;
}

function Chunking() {
  const [selected, setSelected] = useState(1);
  const overlap = selected ? 6 : 0, size = 18;
  const chunks = splitForDemo(chunkText, size, overlap);
  return <Frame name="chunks" title="조금 겹치게 나누면 문맥이 이어집니다" description="초록색 글자는 바로 앞 조각에도 들어 있는 동일한 부분입니다." footnote="원리를 보여주기 위해 18문자씩 고정 분할한 예시입니다. 원본의 RecursiveCharacterTextSplitter는 문단·줄 등의 경계도 고려하며, 문자 수와 토큰 수는 다릅니다.">
    <Choices label="청크 겹침 비교" items={['겹침 없음', '6문자 겹치기']} selected={selected} onChange={setSelected}/>
    <div className="chunk-original"><span>원문</span><p>{chunkText}</p></div>
    <div className="chunk-stack" aria-live="polite">{chunks.map((chunk, i) => <div className="chunk-row" key={chunk.start}><span>조각 {i + 1}<small>{chunk.start + 1}–{chunk.end}문자</small></span><p>{i > 0 && overlap > 0 ? <><mark>{Array.from(chunk.text).slice(0, overlap).join('')}</mark>{Array.from(chunk.text).slice(overlap).join('')}</> : chunk.text}</p></div>)}</div>
    <p className="visual-insight"><Layers size={16}/>{overlap ? '중복된 문맥은 경계를 잇지만, 처리할 전체 문자량도 늘어납니다.' : '각 조각은 중복 없이 나뉘지만, 경계에 걸친 문맥이 끊길 수 있습니다.'}</p>
  </Frame>;
}

function Embeddings() {
  const [selected, setSelected] = useState(0);
  const query = embeddingQueries[selected], ranked = rankDemoDocuments(query);
  const point = vector => ({x: 40 + vector[0] * 220, y: 223 - vector[1] * 182});
  const q = point(query.vector);
  return <Frame name="embeddings" title="질문이 바뀌면, 관련 문서의 순위도 바뀝니다" description="두 질문을 선택해 점의 방향과 코사인 유사도를 비교해 보세요." footnote="설명용 2차원 벡터를 직접 정한 예시입니다. 실제 임베딩이나 검색 성능이 아니며, 표시한 값은 이 예시 벡터의 코사인 유사도입니다.">
    <Choices label="임베딩 질문 비교" items={embeddingQueries.map(item => item.title)} selected={selected} onChange={setSelected}/>
    <p className="visual-query"><MessageCircle size={16}/>{query.text}</p>
    <div className="embedding-layout">
      <svg viewBox="0 0 310 263" role="img" aria-label={`설명용 벡터 공간. ${query.text}와 가장 방향이 비슷한 문서는 ${ranked[0].title}입니다.`}>
        {[.25,.5,.75,1].map(t => <React.Fragment key={t}><line x1="40" y1={223-t*182} x2="276" y2={223-t*182} className="embedding-grid"/><line x1={40+t*220} y1="30" x2={40+t*220} y2="223" className="embedding-grid"/></React.Fragment>)}
        <path d="M40 25 V223 H281" className="embedding-axis"/><text x="245" y="249">예시 축 1</text><text x="7" y="16">예시 축 2</text>
        {embeddingDocuments.map(document => { const p = point(document.vector), active = ranked[0].id === document.id; return <g key={document.id} className={active ? 'embedding-point nearest' : 'embedding-point'}><line x1="40" y1="223" x2={p.x} y2={p.y}/><circle cx={p.x} cy={p.y} r={active ? 6 : 4}/><text x={p.x + (document.id === 'rag' ? -26 : 9)} y={p.y + (document.id === 'rag' ? 19 : 1)}>{document.title}</text></g>; })}
        <line x1="40" y1="223" x2={q.x} y2={q.y} className="embedding-query-line"/><rect x={q.x-5} y={q.y-5} width="10" height="10" transform={`rotate(45 ${q.x} ${q.y})`} className="embedding-query-point"/><text x={selected === 0 ? q.x - 35 : q.x + 25} y={selected === 0 ? q.y + 13 : q.y - 14} className="embedding-query-label">질문</text>
      </svg>
      <div className="embedding-ranking" aria-live="polite"><span>문서별 코사인 유사도</span>{ranked.map((document, i) => <div key={document.id} className={i === 0 ? 'first' : ''}><strong>{i + 1}. {document.title}</strong><span>{document.score.toFixed(3)}</span><i style={{width: `${Math.max(0, document.score) * 100}%`}}/></div>)}</div>
    </div>
    <p className="visual-insight"><Check size={16}/>코사인 유사도는 벡터의 방향을 비교합니다. 높은 점수가 내용의 사실성을 보장하지는 않습니다.</p>
  </Frame>;
}

function RagFlow() {
  const [selected, setSelected] = useState(0), [step, setStep] = useState(0);
  const sample = ragExamples[selected];
  const steps = ['질문', '문서 검색', '문맥 구성', '답변 생성'];
  return <Frame name="rag" title="검색한 문서가 답변의 근거가 되기까지" description="질문 하나를 따라가며 검색과 생성의 역할을 나누어 보세요." footnote="07번 노트북의 데이터 흐름을 재구성한 학습용 모의 예시입니다. 화면의 검색 결과와 답변은 미리 작성한 예시입니다.">
    <Choices label="RAG 질문 예시" items={ragExamples.map(item => item.title)} selected={selected} onChange={value => {setSelected(value); setStep(0);}}/>
    <ol className="visual-steps" aria-label="RAG 단계 선택">{steps.map((title, i) => <li key={title}><button type="button" aria-pressed={step === i} onClick={() => setStep(i)}><span>{i + 1}</span><strong>{title}</strong><small>{['str', 'list[Document]', 'dict', 'str'][i]}</small></button>{i < 3 && <Connector/>}</li>)}</ol>
    <div className="rag-scene" aria-live="polite">
      {step === 0 && <><div className="visual-query"><MessageCircle size={18}/>{sample.question}</div><p>먼저 질문을 input에 보관합니다. 검색기에도 이 질문을 전달합니다.</p></>}
      {step === 1 && <><span className="visual-scene-label">docstore에서 찾은 Document 목록</span><div className="rag-documents">{sample.documents.map(document => <article key={document.title}><FileText size={19}/><div><strong>{document.title}</strong><p>{document.text}</p></div></article>)}</div><p>검색기는 관련 문서를 찾습니다. 아직 사용자에게 보낼 답변은 만들지 않았습니다.</p></>}
      {step === 2 && <><div className="rag-context-row"><code>input</code><p>{sample.question}</p></div><div className="rag-context-row history"><code>history</code><p>{sample.history}<small>convstore · 과거 대화 기록</small></p></div><div className="rag-context-row context"><code>context</code><p>{sample.documents.map(document => `[${document.title}] ${document.text}`).join('\n')}<small>docstore → docs2str · 답변의 문서 근거</small></p></div><p>docs2str로 문서 목록을 문자열로 바꾸고, input·history·context를 프롬프트에 전달합니다.</p></>}
      {step === 3 && <><div className="rag-answer"><MessageCircle size={20}/><p>{sample.answer}</p></div><div className="rag-save"><Database size={16}/>답변 생성 후, 이번 대화를 convstore에 저장</div><p>답변은 문맥을 읽은 모델이 만듭니다. 이번 답변이 생성되기 전에 대화 저장소에 넣지는 않습니다.</p></>}
    </div>
  </Frame>;
}

const components = {'learning-rag': LearningRag, composition: Composition, 'chain-types': ChainTypes, state: StateFlow, chunks: Chunking, embeddings: Embeddings, rag: RagFlow};
export function LessonVisual({slug, section}) {
  const Component = components[visualPlacements[`${slug}:${section}`]];
  return Component ? <Component/> : null;
}
