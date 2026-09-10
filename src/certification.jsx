import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ClipboardPaste, GraduationCap, Server, FileCode2, CircleHelp} from 'lucide-react';
import {CodeBlock} from './code-viewer.jsx';
import {certificationCode as code, certificationSteps as steps, certificationErrors as errors} from '../content/certification.mjs';
import './certification.css';

function Paste({id, title, where, children, language = 'python'}) {
  return <section className="cert-paste" id={'paste-' + id}><h3><ClipboardPaste size={19}/>{title}</h3><p className="paste-location">{where}</p>{children}<CodeBlock code={code[id]} label={title} language={language}/></section>;
}
function Checkpoint({children}) { return <div className="cert-check"><CheckCircle2 size={20}/><div><strong>확인하고 다음으로</strong><p>{children}</p></div></div>; }
function StepBody({id}) {
  if (id === 'prepare') return <>
    <p>이 페이지는 <strong>07번까지 문서 인덱스를 만든 뒤, 08·09번을 마무리하는 실행 가이드</strong>입니다. 00~07번을 대신 실행해 주는 코드는 아닙니다. 준비가 되어 있다면 아래 순서로 바로 이어 가세요.</p>
    <ol className="cert-actions"><li><strong>NVIDIA 강좌에서 수업 환경을 실행합니다.</strong><p>이 사이트는 안내·복사용입니다. 코드는 강좌의 DLI JupyterLab에서 실행합니다. 수업에서 제공한 모델 연결 설정을 사용하세요.</p></li><li><strong>작업할 노트북을 복제합니다.</strong><p>왼쪽 파일 목록에서 08_evaluation.ipynb와 09_langserve.ipynb를 우클릭 → Duplicate로 복제하고 원본과 같은 폴더에 둡니다. 09번 셀 4는 server_app.py를 덮어쓰므로, 이미 수정한 서버 파일이 있다면 먼저 별도 이름으로 보관하세요.</p></li><li><strong>07번 결과 파일을 확인합니다.</strong><p>07_vectorstores.ipynb에서 실제 문서를 적재하고 저장·내보내기를 끝내야 합니다. 같은 폴더에 docstore_index.tgz 또는 풀린 docstore_index 폴더가 있어야 합니다. 없다면 <a className="cert-inline-link" href="/notes/07-vectorstores#section-4">07번의 인덱스 저장 과정</a>부터 마무리하세요.</p></li></ol>
    <div className="cert-file-tree"><span>JupyterLab 파일 목록 · 배치 예시</span><pre>{'수업 작업 폴더/\n├─ 08_evaluation-Copy1.ipynb\n├─ 09_langserve-Copy1.ipynb\n├─ docstore_index.tgz\n└─ docstore_index/\n   ├─ index.faiss\n   └─ index.pkl'}</pre></div>
    <p className="cert-note">인덱스는 본인이 수업에서 만든 신뢰할 수 있는 파일만 사용하세요. 임베딩 설정도 07번과 같아야 합니다. 이 가이드는 제공 노트북의 course/embedding 설정을 사용합니다.</p>
    <Checkpoint>내 수업 환경이 열려 있고, 07번에서 만든 문서 인덱스를 찾을 수 있습니다.</Checkpoint>
  </>;
  if (id === 'load') return <>
    <p><strong>08번 복제본에서 원본 셀 3을 먼저 실행</strong>하세요. embedder는 질문을 검색용 숫자로 바꾸는 도구이고, pprint·pprint2는 뒤의 원본 셀이 출력에 사용하는 함수입니다. 다른 노트북에서 실행한 변수는 자동으로 넘어오지 않습니다.</p>
    <Paste id="load" title="셀 7 · 문서 인덱스 불러오기" where="08번 · FAISS.load_local이 있는 셀 전체를 선택해 교체 → Shift+Enter"><p>압축이 풀려 있으면 그대로 사용하고, 없으면 준비한 압축 파일을 풉니다. 이후의 원본 평가 셀에서 필요한 docs와 format_chunk도 함께 만듭니다.</p></Paste>
    <Checkpoint>문서 조각 수가 2개 이상이고 실제 문서 내용이 출력됩니다. 파일이나 임베딩 오류가 남아 있다면 여기서 해결하세요.</Checkpoint>
  </>;
  if (id === 'evaluate') return <>
    <p>08번은 <strong>내 RAG가 근거를 찾아 답하는지 미리 점검</strong>하는 단계입니다. 여기에 표시된 선호 비율만으로 인증서가 발급되지는 않습니다.</p>
    <div className="cert-sequence" aria-label="08번 셀 실행 순서">{['3 · 설정', '7 · 인덱스', '9 · RAG', '11 · 질문', '13 · 답변', '15 · 판정', '17 · 집계'].map(x => <span key={x}>{x}</span>)}</div>
    <Paste id="rag" title="셀 9 · RAG 체인 연결" where="08번 · context_getter / generator_chain TODO가 있는 셀 전체 교체 → Shift+Enter"><p>질문 → 관련 문서 검색 → 근거를 프롬프트에 넣기 → 답변 순서입니다. 먼저 샘플 질문에 대한 답이 출력되는지 확인하세요.</p></Paste>
    <div className="cert-original"><strong>이어서 원본 셀 11 실행</strong><p>num_questions = 3으로 시작하는 질문 생성 셀은 그대로 실행합니다. synth_questions와 synth_answers가 준비될 때까지 기다리세요.</p></div>
    <Paste id="answers" title="셀 13 · 질문별 RAG 답변 수집" where="08번 · rag_answers = []로 시작하는 TODO 셀 전체 교체 → Shift+Enter"/>
    <div className="cert-original"><strong>이어서 원본 셀 15 실행</strong><p>eval_prompt와 pref_score가 있는 판정 셀은 그대로 실행합니다. 생성한 질문·기준 답변·RAG 답변을 같은 순서로 비교합니다.</p></div>
    <Paste id="score" title="셀 17 · 판정 결과 집계" where="08번 · pref_score를 숫자로 덮어쓰는 집계 셀 전체 교체 → Shift+Enter"><p>판정 목록은 보존하고 유효한 형식을 따로 확인합니다. 낮은 점수나 근거 없는 답은 검색 문서와 프롬프트를 점검할 신호입니다.</p></Paste>
    <Checkpoint>질문마다 비어 있지 않은 답변과 판정이 있습니다. 검색 근거와 답변을 읽어 본 뒤 09번으로 이동하세요.</Checkpoint>
  </>;
  if (id === 'server') return <>
    <p>08번의 변수는 노트북 안에만 있습니다. 이제 프론트엔드가 호출할 수 있도록 <strong>서버 파일에서 인덱스를 다시 불러오고 세 개의 API를 연결</strong>합니다. API는 기능을 호출하는 주소라고 생각하면 됩니다.</p>
    <div className="cert-contracts"><div><code>/basic_chat</code><span>간단한 질문 → 모델 응답</span></div><div><code>/retriever</code><span>질문 → 검색한 문서 목록</span></div><div><code>/generator</code><span>질문 + 근거 텍스트 → 답변</span></div></div>
    <Paste id="server" title="셀 4 · server_app.py 전체 작성" where="09번 복제본 · %%writefile server_app.py 셀 전체 교체 → Shift+Enter"><p><strong>첫 줄 %%writefile까지 전부 복사</strong>합니다. 기존 add_routes 아래에 덧붙이지 마세요. 이 셀은 파일을 저장할 뿐, 아직 서버를 실행하지 않습니다.</p></Paste>
    <Checkpoint>Writing server_app.py 또는 Overwriting server_app.py가 표시되고, 파일 목록에 서버 파일이 생겼습니다. docstore_index 폴더가 바로 옆에 있는지도 확인하세요.</Checkpoint>
  </>;
  if (id === 'connect') return <>
    <p>이번에는 서버를 <strong>Terminal에서 실행</strong>합니다. 서버가 한 노트북의 실행을 막지 않으므로, 같은 09번 복제본에서 연결 점검을 계속할 수 있습니다. <strong>원본 셀 5의 !python server_app.py는 추가 실행하지 마세요.</strong></p>
    <div className="cert-processes" aria-label="서로 별도로 실행되는 노트북과 서버"><div><Server size={28}/><strong>Terminal · 켜 두기</strong><p>server_app.py 실행<br/>9012 포트에서 요청 대기</p></div><span>질문 →<br/>← 답변</span><div><FileCode2 size={28}/><strong>노트북 · 계속 사용</strong><p>새 코드 셀 실행<br/>세 API 연결 점검</p></div></div>
    <ol className="cert-actions"><li><strong>서버 파일이 보이는 폴더에서 Terminal을 엽니다.</strong><p>왼쪽 파일 브라우저에서 server_app.py가 있는 폴더로 이동한 뒤 + → Launcher → Terminal을 선택합니다. Terminal에서 ls를 입력해 server_app.py와 docstore_index가 보이는지 확인하세요.</p></li><li><strong>아래 명령을 한 번 실행하고 Terminal을 켜 둡니다.</strong><p>여기서는 앞에 느낌표(!)를 붙이지 않습니다. 정상 시작 후 입력창이 돌아오지 않는 것은 서버가 요청을 기다리는 정상 상태입니다.</p></li></ol>
    <Paste id="terminal" title="Terminal · 서버 실행" where="JupyterLab Terminal에 붙여넣기 → Enter" language="bash"/>
    <p className="cert-note">정상 실행 로그 예: “Application startup complete”, “Uvicorn running on http://0.0.0.0:9012”. 파일을 수정했다면 이 Terminal에서 Ctrl+C → 같은 명령으로 재실행해야 새 코드가 반영됩니다.</p>
    <Paste id="check" title="새 코드 셀 · 연결 점검" where="09번 복제본의 아래쪽에 Code 셀 추가 → 붙여넣기 → Shift+Enter"><p>이 코드는 앞 노트북의 변수를 사용하지 않습니다. 원본 프론트엔드처럼 검색 결과를 정렬하고 근거 문자열로 바꾼 뒤 generator에 전달합니다.</p></Paste>
    <Checkpoint>기본 모델 응답, 검색 문서 수, RAG 답변이 모두 출력됩니다. 답변이 실제 검색 문서의 내용과 맞는지도 확인하세요. Terminal은 종료하지 않습니다.</Checkpoint>
  </>;
  if (id === 'assess') return <>
    <p>여기부터가 <strong>수료 결과에 연결되는 최종 평가</strong>입니다. 08번 사전 점검과 달리, 프론트엔드는 지금 실행 중인 09번 서버를 직접 호출합니다.</p>
    <ol className="cert-actions"><li><strong>수업 노트북의 Gradio Frontend UI 링크를 엽니다.</strong><p>09번의 “Part 3: 최종 평가” 아래 또는 08번의 “Part 5: [평가]” 아래에 있습니다. 수업 환경의 /8090 링크를 사용하세요. 이 학습 사이트 주소 뒤에 /8090을 붙이는 것이 아닙니다.</p></li><li><strong>RAG 모드로 실제 질문을 해 봅니다.</strong><p>기본 대화만 되는지 보지 말고, 검색 문서를 바탕으로 답하는지 확인하세요. 답이 나오지 않으면 이전 단계의 연결 점검부터 확인합니다.</p></li><li><strong>Evaluate를 실행하고 완료 결과를 확인합니다.</strong><p>평가가 진행되는 동안 서버와 수업 환경을 그대로 켜 두세요. 통과하지 못하면 검색·답변 문제를 고친 뒤 다시 평가합니다. 화면의 실제 통과 결과가 기준이며, 이 가이드가 통과 점수를 보장하지는 않습니다.</p></li><li><strong>강좌의 환경 런처로 돌아가 Assess Task를 누릅니다.</strong><p>JupyterLab 코드 셀이 아니라, 수업 환경을 시작했던 NVIDIA 강좌 화면입니다. 원본 안내대로 <strong>환경이 아직 열려 있는 동안</strong> 실행하고 플랫폼의 결과 반영을 확인하세요.</p></li></ol>
    <Checkpoint>프론트엔드의 평가 통과와 NVIDIA 플랫폼의 평가 반영을 모두 확인했습니다. 두 곳 중 하나만 완료한 상태로 환경을 종료하지 마세요.</Checkpoint>
  </>;
  return <>
    <p>수강에 사용한 <strong>동일한 NVIDIA 계정</strong>으로 My Learning을 엽니다. 이 사이트의 “학습 완료” 표시는 개인 학습 기록이며 NVIDIA의 수료 상태와 연동되지 않습니다.</p>
    <ol className="cert-actions"><li><strong>Building RAG Agents with LLMs 강좌의 완료 상태를 확인합니다.</strong><p>플랫폼에 남아 있는 필수 항목이 있으면 안내에 따라 완료하세요.</p></li><li><strong>발급된 인증서를 열어 저장합니다.</strong><p>My Learning의 인증서 또는 해당 강좌의 완료 화면에서 인증서를 확인하세요. 다운로드 메뉴가 없고 인증서 화면이 열리면 브라우저 인쇄 → PDF로 저장을 사용할 수 있습니다.</p></li></ol>
    <a className="primary-button" href="https://learn.nvidia.com/my-learning" target="_blank" rel="noreferrer">NVIDIA My Learning 열기<ArrowUpRight size={17}/></a>
    <Checkpoint>내 이름과 강좌명이 맞는 인증서를 확인했습니다. 인증서가 안 보인다면 아래 “Evaluate는 통과했는데…” 항목을 확인하세요.</Checkpoint>
    <details className="cert-source"><summary>이 가이드의 기준 자료</summary><p>제공된 08_evaluation.ipynb의 Part 5 및 09_langserve.ipynb의 최종 평가 안내를 기준으로 구성했습니다. 코드 블록은 이 흐름을 돕기 위해 작성한 해설용 구현이며 공식 Solutions 파일은 아닙니다.</p><p>NVIDIA의 <a href="https://forums.developer.nvidia.com/t/dli-course-building-rag-agents-for-llms-assessment-support/282764?page=2" target="_blank" rel="noreferrer">공식 지원 답변</a>에서도 My Learning의 인증서 확인을 안내합니다. 실제 버튼 위치나 표시 문구는 수업 플랫폼 화면을 우선하세요.</p></details>
  </>;
}

function Recovery() {
  return <section className="cert-recovery" id="recovery"><div className="eyebrow">WHEN SOMETHING GOES WRONG</div><h2><CircleHelp size={25}/>막혔을 때, 이 순서로</h2><p>빨간 오류의 마지막 줄을 먼저 읽고 해당하는 항목을 확인하세요. 재시작은 범위를 구분하면 앞에서 한 작업을 덜 반복할 수 있습니다.</p>
    <div className="cert-restarts"><div><span>01</span><h3>화면만 멈췄다면</h3><p>노트북을 저장한 뒤 브라우저를 새로고침합니다. 탭을 닫았다 여는 것만으로 커널이나 서버가 재시작되지는 않습니다.</p></div><div><span>02</span><h3>서버 코드를 바꿨다면</h3><p>서버 Terminal에서 Ctrl+C → python server_app.py. 노트북 커널은 그대로 두고 서버만 다시 실행합니다.</p></div><div><span>03</span><h3>노트북 실행이 꼬였다면</h3><p>먼저 저장하고 해당 노트북에서 Kernel → Restart Kernel. 메모리의 변수는 사라집니다. 08번은 셀 3부터 순서대로 다시 실행하세요.</p></div><div><span>04</span><h3>환경 전체가 응답하지 않으면</h3><p>노트북·server_app.py·문서 인덱스를 저장하고 필요한 파일을 다운로드합니다. 강좌 런처에서 환경을 중지·다시 실행한 뒤 파일과 서비스 상태를 확인하고 서버도 다시 켜세요. 초기화 시 파일 유지 여부는 환경에 따라 다릅니다.</p></div></div>
    <div className="cert-error-list">{errors.map(([title, answer]) => <details key={title}><summary>{title}</summary><p>{answer}</p></details>)}</div>
  </section>;
}
const fromHash = () => steps.some(s => s.id === location.hash.slice(1)) ? location.hash.slice(1) : 'prepare';
export function Certification() {
  const [active, setActive] = useState(fromHash);
  const panel = useRef();
  const index = steps.findIndex(s => s.id === active), step = steps[index];
  useEffect(() => {
    const sync = () => {
      const next = fromHash();
      if (location.hash === '#recovery') { document.getElementById('recovery')?.scrollIntoView(); return; }
      setActive(next);
      requestAnimationFrame(() => panel.current?.scrollIntoView({block: 'start', behavior: 'instant'}));
    };
    addEventListener('hashchange', sync); addEventListener('popstate', sync);
    if (location.hash) sync();
    return () => { removeEventListener('hashchange', sync); removeEventListener('popstate', sync); };
  }, []);
  return <main id="main" className="cert-page"><header className="cert-intro"><div className="eyebrow"><GraduationCap size={19}/>BUILDING RAG AGENTS WITH LLMS</div><h1>Get Certification</h1><p>08·09번 실습부터 최종 평가, 인증서 확인까지.<br/>붙여넣을 위치와 실행 순서를 하나씩 따라갑니다.</p><a className="cert-help-link" href="#recovery">실행 중 오류가 났나요? <ArrowRight size={15}/></a></header>
    <div className="cert-path" aria-label="수료 진행 흐름"><div><small>준비</small><strong>07 문서 인덱스</strong></div><ArrowRight/><div><small>사전 점검</small><strong>08 RAG 평가</strong></div><ArrowRight/><div><small>최종 평가</small><strong>09 서버 · Evaluate</strong></div><ArrowRight/><div><small>완료 반영</small><strong>Assess Task · 인증서</strong></div></div>
    <p className="cert-convention"><strong>셀 번호 읽는 법</strong> 아래 번호는 설명·코드를 포함한 <strong>제공 원본 노트북의 셀 위치</strong>입니다. 왼쪽의 실행 횟수 [1], [2]가 아닙니다. 복제본에서 셀이 추가돼 번호가 달라졌다면 함께 적은 코드 첫 줄로 찾으세요. 코드는 수업 DLI 환경용 해설 예시입니다.</p>
    <div className="cert-layout"><nav className="cert-nav" aria-label="인증서 가이드 단계">{steps.map((s, i) => <a key={s.id} href={'#' + s.id} aria-current={s.id === active ? 'step' : undefined}><span>{String(i + 1).padStart(2, '0')}</span><div><small>{s.short}</small>{s.title}</div></a>)}</nav>
      <article className="cert-panel" ref={panel}><header><span className="eyebrow">STEP {index + 1} / {steps.length} · {step.short}</span><h2>{step.title}</h2><p className="cert-place">{step.place}</p><p className="cert-goal">{step.goal}</p></header><StepBody key={active} id={active}/><nav className="cert-pagination" aria-label="인증서 가이드 이동">{index > 0 ? <a href={'#' + steps[index - 1].id}><ArrowLeft size={17}/>이전 단계</a> : <span/>}{index < steps.length - 1 && <a href={'#' + steps[index + 1].id}>다음 · {steps[index + 1].short}<ArrowRight size={17}/></a>}</nav></article></div>
    <Recovery/>
  </main>;
}
