import React from 'react';
import {FileText, Scissors, Database, Save, ArrowRight} from 'lucide-react';

export function Certification07({id, Paste, Checkpoint}) {
  if (id === 'start') return <>
    <p><strong>인덱스가 없는 새 수업 랩에서 시작해도 됩니다.</strong> 이 페이지에서 07번의 문서 준비·인덱스 저장부터 08·09번, 최종 평가까지 이어 갑니다. 00~06번에서 미리 실행해 둬야 할 코드나 변수는 없습니다.</p>
    <ol className="cert-actions">
      <li><strong>NVIDIA 강좌에서 수업 환경을 실행합니다.</strong><p>수강 중인 Building RAG Agents with LLMs 강좌의 실습 환경 실행 버튼을 누르고, 환경이 준비되면 JupyterLab을 엽니다. 버튼 표시는 강좌 화면을 따르세요. 이 학습 사이트에 코드를 실행하는 것이 아닙니다.</p></li>
      <li><strong>왼쪽 파일 목록에서 07_vectorstores.ipynb를 더블클릭합니다.</strong><p>아직 아무 셀도 실행하지 않아도 됩니다. 07·08·09번 노트북은 처음 제공된 같은 폴더에 둡니다. 이미 다른 코드가 실행 중이면 해당 실행을 정지한 뒤 진행하세요.</p></li>
      <li><strong>07번 맨 아래에 새 Code 셀을 하나 추가합니다.</strong><p>맨 마지막 셀을 클릭 → <strong>노트북 위쪽 도구막대의 +</strong> → 셀 종류 <strong>Code</strong> 확인. 다음 단계의 07-A 코드를 이 빈 셀에 붙여넣습니다. Markdown이나 출력 결과 칸에는 붙이지 않습니다.</p></li>
    </ol>
    <div className="cert-cell-demo" aria-label="07번 아래에 Code 셀 추가하기 설명 그림"><div className="cell-demo-tab">07_vectorstores.ipynb <span>위치 설명용 그림</span></div><div className="cell-demo-toolbar"><span>+ ← 새 셀 추가</span><span>▶</span><span>Code ▾</span></div><div className="cell-demo-editor"><span>[ ]:</span><div><code># 다음 단계의 07-A 전체 코드를<br/># 이 빈 Code 셀에 붙여넣습니다.</code><strong>붙여넣고 Shift + Enter</strong><p>실행이 끝나면 이 셀 아래에 새 Code 셀을 추가해 07-B → 07-C → 07-D를 이어 갑니다.</p></div></div><p className="cell-demo-output">각 코드의 마지막 “07-A/B/C/D 완료” 출력을 보고 다음으로 이동합니다.</p></div>
    <div className="cert-run-overview"><h3>오늘 실행할 순서</h3><ol><li><strong>07번 새 셀 4개:</strong> 07-A 연결 → 07-B 논문·청킹 → 07-C 검색 인덱스 → 07-D 저장·재검색</li><li><strong>08번:</strong> 설정 실행 → 저장한 인덱스 읽기 → RAG·평가 코드 실행</li><li><strong>09번:</strong> 서버 코드 붙여넣기 → Terminal에서 서버 실행 → 연결 점검</li><li><strong>강좌 화면:</strong> Gradio Evaluate → Assess Task → 인증서 확인</li></ol></div>
    <p className="cert-note">이 절차에서는 07번 원본 전체를 Run All로 실행하지 않습니다. 아래 07-A~D가 문서 준비·임베딩·저장을 한 흐름으로 구성한 해설용 코드입니다. 실제 검색과 답변 품질은 08번과 최종 평가에서 확인합니다.</p>
    <Checkpoint>07번 노트북에 빈 Code 셀을 만들었습니다. 다음 단계에서 07-A 코드를 전부 복사해 붙여넣으세요.</Checkpoint>
  </>;
  if (id === 'index-setup') return <>
    <p><strong>방금 만든 07번의 첫 번째 빈 Code 셀</strong>에 아래 코드를 붙여넣습니다. 필요한 도구를 가져오고, 임베딩 모델과 대화 모델에 작은 요청을 보내 연결을 확인합니다.</p>
    <Paste id="env07" title="07-A · 새 Code 셀에 환경 확인 코드 붙여넣기"/>
    <p className="cert-note">오류가 난 상태로 다음 셀을 실행하지 마세요. 특히 “작업 폴더”, “임베딩 연결 OK”, “대화 모델 연결 OK”를 먼저 확인합니다. 임베딩과 대화 모델은 모두 수업 내부 llm_client 서비스에 연결합니다. 02번 등 다른 노트북에서 설정한 환경변수에 의존하지 않습니다.</p>
    <Checkpoint>07-A 완료가 나왔습니다. 같은 07번 노트북에서 방금 셀 아래에 빈 Code 셀을 하나 더 만듭니다.</Checkpoint>
  </>;
  if (id === 'index-docs') return <>
    <p>07번 원본에서 사용하는 <strong>ReAct 논문</strong>으로 시작합니다. 수업의 cached_papers에 저장된 PDF가 있으면 바로 읽고, 없으면 arXiv에서 한 번 내려받습니다. 미리 다른 페이지에서 자료를 준비할 필요가 없습니다.</p>
    <div className="cert-index-flow" aria-label="문서에서 검색 인덱스까지"><div><FileText/><strong>실제 논문</strong><span>PDF의 본문 읽기</span></div><ArrowRight/><div><Scissors/><strong>문서 조각</strong><span>1,000자 · 200자 겹침</span></div><ArrowRight/><div><Database/><strong>검색 인덱스</strong><span>다음 셀에서 임베딩</span></div></div>
    <Paste id="papers07" title="07-B · 다음 새 Code 셀에 문서 읽기 코드 붙여넣기"/>
    <p className="cert-note">문서 개수를 늘리기 전에 이 논문으로 검색이 되는지 먼저 확인합니다. 출력 숫자는 PDF 내용과 패키지에 따라 달라질 수 있습니다. arXiv에 연결되지 않을 때의 대처는 페이지 아래에 있습니다.</p>
    <Checkpoint>문서 조각 수가 2개 이상이고 실제 논문 본문이 출력됩니다. 07-B 완료를 확인한 뒤 다음 셀을 만듭니다.</Checkpoint>
  </>;
  if (id === 'index-build') return <>
    <p><strong>같은 07번 커널에서 07-A → 07-B를 실행한 다음</strong> 진행합니다. chunks는 방금 나눈 문서 조각이고, docstore는 그 조각을 검색할 수 있도록 모은 저장소입니다.</p>
    <Paste id="build07" title="07-C · 다음 새 Code 셀에 인덱스 생성 코드 붙여넣기"/>
    <p className="cert-note">“임베딩 완료: 처리한 수/전체 수”가 증가하는 동안 기다리세요. 이 단계는 모델이 실제로 문서를 처리하므로 즉시 끝나지 않을 수 있습니다. 멈춘 것 같다고 동일 셀을 연속 실행하지 마세요.</p>
    <Checkpoint>전체 조각의 임베딩이 끝나고 검색한 논문 제목과 본문이 출력됩니다. 07-C 완료 후에만 저장 단계로 넘어갑니다.</Checkpoint>
  </>;
  if (id === 'index-save') return <>
    <p>메모리에만 있는 docstore를 <strong>다음 노트북에서도 읽을 수 있는 파일</strong>로 저장합니다. 아래 코드는 저장, 압축, 다시 읽기, 검색 확인까지 한 번에 수행합니다.</p>
    <Paste id="save07" title="07-D · 다음 새 Code 셀에 저장·재검색 코드 붙여넣기"/>
    <div className="cert-index-output"><Save size={22}/><div><strong>07번을 끝내면 생기는 결과</strong><code>docstore_index/index.faiss</code><code>docstore_index/index.pkl</code><code>docstore_index.tgz</code><p>직접 파일을 만들거나 옮기지 않습니다. 기존 결과가 있으면 코드가 .backup-날짜 이름으로 보관한 뒤 새 결과를 저장합니다.</p></div></div>
    <p><strong>“저장 후 검색 OK”와 “07-D 완료”를 확인하세요.</strong> 이제 왼쪽 파일 목록에서 같은 폴더의 <strong>08_evaluation.ipynb</strong>를 열고 다음 단계로 이동합니다. 07번의 변수는 08번으로 옮겨지지 않으므로, 08번은 설정 셀부터 새로 실행합니다.</p>
    <Checkpoint>인덱스 생성·저장·재검색이 끝났습니다. 이 페이지의 다음 단계부터 08번을 진행합니다.</Checkpoint>
  </>;
  return null;
}
