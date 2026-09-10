import React, {useId, useState} from 'react';
import {ArrowRight, ArrowDown, Code2, Database, FileText, Monitor, Server, RotateCcw} from 'lucide-react';
import {serviceExamples, streamParts} from '../content/visual-models.mjs';
import './beginner-visuals.css';
function Figure({name,title,description,children,note}){const id=useId();return <figure className="lesson-visual beginner-visual" data-visual={name} aria-labelledby={id}><figcaption><span className="visual-kicker">그림으로 이해하기</span><h3 id={id}>{title}</h3><p>{description}</p></figcaption>{children}<p className="visual-footnote">{note}</p></figure>}
function Tabs({label,items,selected,select}){return <div className="visual-choices" role="group" aria-label={label}>{items.map((name,i)=><button key={name} type="button" aria-pressed={selected===i} onClick={()=>select(i)}>{name}</button>)}</div>}
function Kernel(){
 const [stored,setStored]=useState(false),[output,setOutput]=useState('아직 셀을 실행하지 않았어요.');
 return <Figure name="kernel" title="셀을 실행하면 커널의 기억이 바뀝니다" description="저장하기 전에 출력하거나, 커널을 다시 시작하면 어떻게 될까요?" note="변수 하나의 동작을 보여 주는 학습용 모의 실행입니다. 실제 Python 커널을 실행하지 않습니다.">
  <div className="kernel-flow"><div><span className="beginner-label">노트북 · 작업을 적는 곳</span><div className="kernel-cell"><code>first_name = "민수"</code><button onClick={()=>{setStored(true);setOutput('first_name에 민수를 저장했어요.');}}>1 · 이름 저장</button></div><div className="kernel-cell"><code>print(first_name)</code><button onClick={()=>setOutput(stored?'민수':'NameError · first_name을 아직 모릅니다.')}>2 · 이름 출력</button></div></div><ArrowRight className="beginner-arrow" size={21}/><div className="kernel-memory"><Database size={24}/><span className="beginner-label">커널 · 값을 기억하는 곳</span><strong>{stored?'first_name → "민수"':'기억한 변수 없음'}</strong><button onClick={()=>{setStored(false);setOutput('커널을 다시 시작했어요. 셀의 글은 남지만 변수는 사라집니다.');}}><RotateCcw size={13}/>커널 다시 시작</button></div></div>
  <div className="beginner-result" aria-live="polite"><span>지금 확인할 결과</span><p>{output}</p></div>
 </Figure>
}
function Services(){
 const [selected,setSelected]=useState(0);
 const items=[{name:'Jupyter',role:'실습 코드 실행',detail:'코드 셀을 실행하는 작업 공간입니다. 모델이 필요한 코드는 llm_client로 요청을 보냅니다.',icon:Code2},{name:'llm_client',role:'모델 요청 연결',detail:'수업의 모델 호출을 연결하는 서비스입니다. 모델을 실행하는 추론 서버와 통신하고 결과를 돌려줍니다.',icon:Server},{name:'frontend',role:'웹 화면 제공',detail:'브라우저에 사용 화면을 제공합니다. HTML이 열린 것만으로 검색과 답변 생성이 완성된 것은 아닙니다.',icon:Monitor}];
 return <Figure name="services" title="서로 다른 담당자가 하나의 수업 환경을 만듭니다" description="서비스를 눌러 맡은 일을 확인하세요. 컨테이너는 각각의 작업 공간입니다." note="원본 수업 환경을 단순화한 구성도입니다. 실제 서비스 구성은 docker-compose.yml에 따르며, 모델 실행 서버의 위치는 설정에 따라 다릅니다.">
  <div className="service-host"><span className="beginner-label">호스트 · 컨테이너를 실행하는 환경</span><div className="service-network"><span>수업 내부 네트워크 · 서비스 이름으로 통신</span><div className="service-boxes">{items.map((item,i)=><button className={i===selected?'selected':''} aria-pressed={i===selected} onClick={()=>setSelected(i)} key={item.name}><item.icon size={25}/><small>컨테이너 / 서비스</small><strong>{item.name}</strong><span>{item.role}</span></button>)}</div></div></div>
  <div className="beginner-result" aria-live="polite"><span>{items[selected].name}의 역할</span><p>{items[selected].detail}</p></div>
  <div className="request-lane">{selected===2?<><span>브라우저</span><ArrowRight size={16}/><span>frontend</span><ArrowRight size={16}/><strong>화면 HTML</strong></>:<><span>Jupyter의 코드</span><ArrowRight size={16}/><span>llm_client</span><ArrowRight size={16}/><strong>모델 실행 서버</strong></>}</div>
 </Figure>
}
function ServiceAddress(){
 const [example,setExample]=useState(0),[part,setPart]=useState(1),item=serviceExamples[example];
 const parts=[{name:'통신 방식',value:'http://',help:'HTTP로 요청을 주고받습니다. 이 예시는 수업 내부 서비스 주소입니다.'},{name:'서비스 이름',value:item.host,help:'같은 수업 네트워크에서 찾아갈 서비스 이름입니다. 개인 PC의 인터넷 주소와는 다릅니다.'},{name:'포트',value:':'+item.port,help:'해당 서비스가 요청을 기다리는 번호입니다. 경로와 달리 숫자로 표시합니다.'},{name:'기능 경로',value:item.path,help:item.help}];
 return <Figure name="service-address" title="긴 주소도 네 조각으로 읽으면 쉽습니다" description="예시를 고른 뒤 주소의 각 부분을 눌러 뜻을 확인하세요." note="주소와 예상 데이터 종류를 설명하는 도식입니다. 버튼을 눌러도 실제 수업 서비스에 접속하지 않습니다.">
  <Tabs label="서비스 주소 예시" items={serviceExamples.map(e=>e.title)} selected={example} select={setExample}/>
  <div className="address-parts">{parts.map((p,i)=><button onClick={()=>setPart(i)} aria-pressed={part===i} key={p.name}><span>{p.name}</span><code>{p.value}</code></button>)}</div>
  <div className="beginner-result" aria-live="polite"><span>{parts[part].name}</span><p>{parts[part].help}</p></div>
  <div className="address-exchange"><div><span>1 · 요청</span><code>GET {item.path}</code><p>{item.request}</p></div><ArrowRight className="beginner-arrow" size={20}/><div><span>2 · 응답 확인</span><strong>{item.result}</strong><p>연결 → 상태 코드 → 본문 순서로 읽습니다.</p></div></div>
 </Figure>
}
function Streaming(){
 const [mode,setMode]=useState(1),[step,setStep]=useState(0);
 const complete=step===streamParts.length,accumulated=streamParts.slice(0,step).join('');
 const visible=mode===1?accumulated:complete?accumulated:'';
 return <Figure name="streaming" title="완성된 답을 받을까요, 조각부터 읽을까요?" description="다음 조각 버튼을 눌러 두 방식에서 화면에 보이는 시점을 비교하세요." note="고정된 예시 문장을 나눠 보여 주는 모의 흐름입니다. 실제 모델 호출이나 실제 토큰 분할이 아닙니다.">
  <Tabs label="응답 받는 방식" items={['한 번에 받기','스트리밍']} selected={mode} select={setMode}/>
  <div className="stream-chunks">{streamParts.map((text,i)=><span key={text} className={i<step?'arrived':''}>{text}</span>)}</div>
  <div className="beginner-result" aria-live="polite"><span>사용자에게 보이는 답변</span><p>{visible||'아직 답변을 기다리는 중…'}</p><code>{mode===1?'choices[0].delta.content':'choices[0].message.content'}</code></div>
  <div className="beginner-controls"><span>{step} / {streamParts.length}조각 준비됨</span><button onClick={()=>setStep(Math.min(step+1,streamParts.length))} disabled={complete}>다음 조각<ArrowRight size={15}/></button><button onClick={()=>setStep(0)}><RotateCcw size={14}/>처음부터</button></div>
  <p className="visual-insight">{mode===1?'새로 받은 글자 조각을 계속 이어 붙입니다. 내용이 없는 조각은 건너뜁니다.':'서버의 결과가 완성된 뒤 한 번에 답변을 읽습니다.'}</p>
 </Figure>
}
function Processes(){
 const [step,setStep]=useState(0);
 const status=['노트북에서 만든 변수는 커널 안에만 있습니다.','필요한 import와 함수 정의를 server_app.py 안에 함께 저장합니다.','서버가 파일을 읽어 자기 실행 환경에서 새로 정의합니다.'];
 return <Figure name="processes" title="파일은 옮길 수 있지만 변수 기억은 자동으로 옮겨지지 않습니다" description="저장과 실행을 나누어 보고, 두 실행 환경의 경계를 확인하세요." note="실행 위치를 설명하는 모의 단계입니다. 파일을 쓰거나 서버를 시작하지 않습니다.">
  <Tabs label="서버 파일 준비 단계" items={['1 · 노트북에서 정의','2 · 파일로 저장','3 · 서버로 실행']} selected={step} select={setStep}/>
  <div className="process-diagram"><div className="process-box"><Code2 size={23}/><strong>노트북 커널</strong><code>docs2str 정의 있음</code><small>실행 환경 A</small></div><div className="process-file"><ArrowRight size={20}/><FileText size={30}/><code>server_app.py</code><span>{step>=1?'함수·설정 저장됨':'저장 전'}</span><ArrowRight size={20}/></div><div className={'process-box '+(step===2?'ready':'')}><Server size={23}/><strong>서버 프로세스</strong><code>{step===2?'파일의 정의를 읽음':'아직 준비되지 않음'}</code><small>실행 환경 B</small></div></div>
  <div className="beginner-result" aria-live="polite"><span>현재 단계의 핵심</span><p>{status[step]}</p></div>
 </Figure>
}
function EvaluationPairs(){
 const [swapped,setSwapped]=useState(0);
 const examples=[{question:'청크는 무엇인가요?',reference:'긴 문서를 나눈 작은 조각입니다.',answer:'문서를 처리하기 좋게 나눈 조각입니다.'},{question:'임베딩은 무엇인가요?',reference:'텍스트를 숫자 벡터로 표현합니다.',answer:'문장의 특징을 여러 숫자로 바꿉니다.'}];
 return <Figure name="evaluation-pairs" title="질문과 답변은 같은 번호끼리 비교합니다" description="답변 목록의 순서만 바꾸면 비교가 어떻게 달라지는지 살펴보세요." note="짝 맞추기의 중요성을 보여 주는 학습용 문장입니다. 실제 평가 데이터나 모델의 판정 결과가 아닙니다.">
  <Tabs label="평가 데이터 순서" items={['올바른 짝','답변 순서 뒤바뀜']} selected={swapped} select={setSwapped}/>
  <div className={'evaluation-pairs '+(swapped?'is-mismatched':'')}>{examples.map((item,i)=><div className="evaluation-row" key={item.question}><span>{i+1}번 질문</span><h4>{item.question}</h4><div><span>기준 답변</span><p>{item.reference}</p></div><div><span>RAG 답변</span><p>{examples[swapped?1-i:i].answer}</p></div></div>)}</div>
  <div className="beginner-result" aria-live="polite"><span>비교 전에 확인할 것</span><p>{swapped?'목록 길이는 같지만 서로 다른 질문의 답을 비교하고 있습니다. 순서가 어긋나면 점수를 내도 의미가 없습니다.':'같은 질문의 기준 답변과 RAG 답변이 짝지어져 있습니다. 이제 원문 근거와 판정 기준을 함께 살펴봅니다.'}</p></div>
 </Figure>
}
export const beginnerVisuals={kernel:Kernel,services:Services,'service-address':ServiceAddress,streaming:Streaming,processes:Processes,'evaluation-pairs':EvaluationPairs};
