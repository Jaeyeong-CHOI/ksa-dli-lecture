import React from 'react';
import {FileText, Scissors, Database, Save, ArrowRight} from 'lucide-react';

const parts = {
  'index-setup': {key:'env07', title:'셀 4 · 기존 모델 설정 셀 전체 교체', before:'07번 맨 위쪽에서 ChatNVIDIA와 NVIDIAEmbeddings를 함께 가져오는 기존 코드 셀을 찾습니다. 아래 코드로 그 셀 전체를 교체하면 문서 처리에 필요한 도구와 수업 내부 모델 연결이 준비됩니다.', after:'07 셀 4 완료를 확인한 뒤, 아래로 내려가 Part 3 → Task 1의 paper_ids가 있는 코드 셀을 찾으세요. Part 1·2의 대화 예제는 이 절차에서 실행하지 않습니다.'},
  'index-docs': {key:'papers07', title:'셀 34 · Task 1의 paper_ids 셀 전체 교체', before:'Part 3 → Task 1: 문서 로딩 및 청킹 바로 아래의 코드 셀입니다. paper_ids 목록의 TODO만 바꾸는 것이 아니라, 그 코드 셀 전체를 아래 코드로 교체하세요. 원본에서도 사용하는 ReAct 논문을 캐시에서 읽고, 없으면 내려받습니다.', after:'문서 조각과 실제 논문 본문을 확인한 뒤, Task 2의 %%time으로 시작하는 코드 셀로 이동합니다.'},
  'index-build': {key:'build07', title:'셀 36 · Task 2의 %%time 셀 전체 교체', before:'Task 2: 문서 Vector Store 구성하기 바로 아래의 짧은 코드 셀입니다. %%time 첫 줄까지 포함해 전부 교체합니다. 앞서 나눈 문서 조각을 작은 묶음으로 임베딩하고 vecstores에 저장합니다.', after:'전체 조각의 임베딩이 끝나고 07 셀 36 완료가 나왔습니다. 바로 다음 통합 코드 셀(from faiss import IndexFlatL2)로 이동하세요.'},
  'index-merge': {key:'merge07', title:'셀 38 · 인덱스 통합 셀 전체 교체', before:'Task 2 아래에서 “인덱스들을 하나로 합칠 수 있습니다” 다음의 기존 코드 셀을 찾습니다. 여러 vecstores를 검색용 docstore 하나로 합칩니다. 다음 Task 3에서도 사용할 default_FAISS 함수가 이 셀에서 준비됩니다.', after:'통합 문서 조각 수와 검색 결과를 확인했습니다. Task 3의 retrieval_chain TODO가 있는 기존 셀로 이동하세요.'},
  'index-rag': {key:'rag07', title:'셀 40 · retrieval_chain TODO가 있는 셀 전체 교체', before:'Part 3 → Task 3: [실습] RAG Chain 구현하기 아래의 긴 코드 셀입니다. BEGIN TODO와 END TODO 사이에만 붙이는 것이 아니라, import부터 마지막 테스트 질문까지 그 셀 전체를 교체합니다. 대화 기록은 convstore에서, 논문 근거는 docstore에서 검색합니다.', after:'ReAct 논문을 근거로 답변이 출력되고 07 셀 40 완료가 나옵니다. Task 4의 Gradio 데모 셀(원본 셀 42)은 이 절차에서는 실행하지 않고, Part 4 저장 셀로 이동하세요.'},
  'index-save': {key:'save07', title:'셀 44 · 기존 인덱스 저장 셀 전체 교체', before:'Part 4: 평가를 위해 인덱스 저장하기 바로 아래의 코드 셀입니다. Save and compress your index 주석과 docstore.save_local이 있는 셀 전체를 교체합니다. 기존 셀의 마지막 폴더 삭제 명령도 남기지 않습니다. 새 코드는 인덱스를 저장하고 압축하되 폴더를 유지합니다.', after:'07 셀 44 완료를 확인했습니다. 아직 08번으로 넘어가지 말고, 바로 다음 불러오기 코드 셀(원본 셀 46)로 이동하세요.'},
  'index-verify': {key:'verify07', title:'셀 46 · 기존 인덱스 불러오기 셀 전체 교체', before:'Part 4 저장 셀 다음에 있는 from langchain_community.vectorstores import FAISS로 시작하는 코드 셀입니다. new_db = FAISS.load_local도 있는지 확인하고 셀 전체를 교체합니다. 방금 저장한 파일에서 새 검색기를 만들어 실제 문서가 나오는지 확인합니다.', after:'저장 후 검색 OK와 07 셀 46 완료를 확인했습니다. 파일을 옮기지 말고 같은 폴더의 08_evaluation.ipynb를 열어 이 페이지의 다음 단계를 진행하세요.'},
};

export function Certification07({id, Paste, Checkpoint}) {
  if (id === 'start') return <>
    <p><strong>07번에 이미 있는 코드 셀을 찾아 교체합니다. 새 셀을 추가하지 않습니다.</strong> 새 수업 랩에서 시작해도 되며, 00~06번에서 실행해 둔 변수는 필요하지 않습니다.</p>
    <ol className="cert-actions">
      <li><strong>NVIDIA 강좌에서 실습 환경을 실행하고 JupyterLab을 엽니다.</strong><p>수강 중인 Building RAG Agents with LLMs 강좌의 실습 환경을 사용합니다. 이 학습 사이트 안에 코드를 붙여넣는 것이 아닙니다.</p></li>
      <li><strong>07_vectorstores.ipynb를 열고 상단의 모델 설정 셀을 찾습니다.</strong><p><code>from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings</code>로 시작하는 기존 셀입니다. 다음 단계의 코드를 이 셀 전체에 붙여넣습니다.</p></li>
      <li><strong>각 단계에 적힌 기존 셀 하나만 교체하고 Shift+Enter를 누릅니다.</strong><p>실행이 끝나면 다음 단계의 제목·코드 첫 줄을 보고 다음 위치로 이동하세요. Run All이나 셀 추가용 +는 누르지 않습니다. 이전 안내로 맨 아래에 만든 07-A~D 셀이 있더라도 이번에는 실행하지 않습니다.</p></li>
    </ol>
    <div className="cert-cell-demo" aria-label="07번 기존 Task 1 코드 셀의 교체 위치"><div className="cell-demo-tab">07_vectorstores.ipynb <span>기존 셀 위치 설명용 그림</span></div><div className="cell-demo-toolbar"><span>Part 3 → Task 1: 문서 로딩 및 청킹</span></div><div className="cell-demo-editor"><span>[ ]:</span><div><code>from langchain_nvidia_ai_endpoints import ChatNVIDIA<br/>…<br/>paper_ids = [ … ]<br/>…</code><strong>이 기존 코드 셀의 처음부터 끝까지 교체</strong><p>코드 안을 클릭해 커서를 놓기 → Ctrl+A → Ctrl+V → Shift+Enter<br/>맥에서는 Cmd+A → Cmd+V. 출력 칸에는 붙이지 않습니다.</p></div></div><p className="cell-demo-output">그림은 문서 준비 셀의 예시입니다. 실제 실행은 다음 단계의 상단 모델 설정 셀부터 시작합니다.</p></div>
    <div className="cert-run-overview"><h3>07번에서 실행할 기존 셀 순서</h3><div className="cert-sequence" aria-label="07번 기존 셀 실행 순서">{['4 · 모델 설정','34 · Task 1 문서','36 · Task 2 생성','38 · 통합','40 · Task 3 RAG','44 · Part 4 저장','46 · 불러오기'].map(x=><span key={x}>{x}</span>)}</div><p>이 가이드는 위 7개 셀을 교체해서 실행하는 순서입니다. 원본의 나머지 예제 셀은 실행하지 않아도 됩니다. 특히 Task 3의 TODO와 Part 4 저장 위치를 그대로 사용합니다.</p></div>
    <p className="cert-note">“원본 셀 34” 같은 번호는 설명·코드 셀을 위에서부터 센 위치이며 왼쪽 [숫자] 실행 횟수가 아닙니다. 숫자를 찾으려 하지 말고 <strong>Part/Task 제목 + 코드 첫 줄 + 같은 셀 안의 코드</strong>를 대조하세요.</p>
    <Checkpoint>07번 상단의 기존 모델 설정 셀을 찾았습니다. 다음 단계에서 그 셀에 붙여넣을 코드를 복사하세요.</Checkpoint>
  </>;
  const part=parts[id];
  if (!part) return null;
  return <>
    <p>{part.before}</p>
    {id==='index-docs' && <div className="cert-index-flow" aria-label="문서에서 검색 인덱스까지"><div><FileText/><strong>실제 논문</strong><span>PDF의 본문 읽기</span></div><ArrowRight/><div><Scissors/><strong>문서 조각</strong><span>1,000자 · 200자 겹침</span></div><ArrowRight/><div><Database/><strong>검색 인덱스</strong><span>Task 2에서 임베딩</span></div></div>}
    <Paste id={part.key} title={part.title}/>
    {id==='index-build' && <p className="cert-note">임베딩 완료 수가 증가하는 동안 기다리세요. 오류가 남아 있거나 [*] 표시가 있는 동안 다음 셀을 실행하지 않습니다. 중간에 실패했다면 원인을 해결한 뒤 이 셀부터 다시 실행합니다.</p>}
    {id==='index-rag' && <p className="cert-note">답변은 실제 모델 출력이라 문구가 달라집니다. 근거가 있는 답변인지 읽어 보고, 부족하면 검색 결과와 질문을 점검하세요. 이 코드는 문서 저장소와 대화 기록을 분리하므로 대화를 해도 저장할 논문 인덱스에 대화가 섞이지 않습니다.</p>}
    {id==='index-save' && <div className="cert-index-output"><Save size={22}/><div><strong>이 셀을 실행하면 생기는 결과</strong><code>docstore_index/index.faiss</code><code>docstore_index/index.pkl</code><code>docstore_index.tgz</code><p>직접 파일을 만들거나 복사하지 않습니다. 기존 결과가 있으면 .backup-날짜 이름으로 보관하고 새 결과를 저장합니다.</p></div></div>}
    <Checkpoint>{part.after}</Checkpoint>
  </>;
}
