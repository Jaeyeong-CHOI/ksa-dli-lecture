# Building RAG Agents with LLMs

**https://ksa.dli-lecture.com**

2026년 충청권 ICT이노베이션스퀘어 확산사업의 **NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지** 교육과정용 한국어 학습 노트입니다. 강좌명: Building RAG Agents with LLMs. 강연 제공: Jae Y. CHOI.

## 학습 흐름

첫 화면(`/`)은 **강의자료 6종**의 PDF 열람·다운로드 화면입니다. 순서는 Introduction to LLM → DLI → RAGAS → QuCo → Recent RAG → Product Building입니다. 최신 Drive 원본의 PDF와 표지, 페이지 수, 원본 수정일을 함께 제공합니다. 각 자료는 `/lectures/<slug>`로 직접 열 수 있고, 기존 `/notes/introduction-to-llm`과 `/resources`는 첫 자료로 연결됩니다. 별도 강의 해설 노트는 넣지 않습니다.

강의 PDF는 한국시간 **2026년 9월 14일 18시(1번), 15일 18시(2번), 16일 18시(3·4·5번), 17일 18시(6번)**에 순서대로 공개됩니다. 공개 전에는 예정 시간과 잠금 화면만 표시합니다. 브라우저 시계가 아니라 서버에서 공개 여부를 판단하며, PDF 직접 요청과 챗봇의 미공개 슬라이드 검색을 제한합니다. 공개 논문 및 실습 자료는 계속 이용할 수 있습니다.

예정 시각에는 맥미니의 시간 제한 PDF API가 열리고, GitHub Actions의 예약 배포가 공개된 PDF를 Pages에 복사합니다. Pages 반영 이후에는 API가 꺼져도 해당 PDF를 받을 수 있습니다. 최초 공개 시각은 GitHub 예약 작업의 지연에 의존하지 않습니다. 과거에 이미 내려받은 사본이나 이전 Git 이력은 회수하지 않습니다.

설명 자료는 **JupyterLab 노트북 00–09번, 10개**에만 제공합니다. 42개 소주제를 초심자 관점에서 용어의 뜻·쉬운 비유·입출력·코드 읽는 순서로 풀어썼습니다. 각 노트에는 처음 만나는 용어 3개도 정리합니다.

**한국어 실습 노트북**(`/notebook-downloads`)에서는 00–09번 ipynb를 개별로 받거나, 사용 안내가 포함된 전체 ZIP으로 받을 수 있습니다. 강의자료 화면의 탭과 실습 노트 목록에서 연결하며, 각 노트에서도 현재 파일을 바로 내려받습니다. 다운로드 사본은 한국어 원문·코드·TODO·셀 순서를 유지하고 실행 출력과 편집기 메타데이터를 정리했습니다. 내부 서비스·환경 파일은 포함하지 않으며 DLI 수업 환경이 필요합니다. 원본의 그림은 인터넷으로 불러옵니다.

기본 화면은 **원본 순서로 찾기**입니다. 각 노트의 관찰 가능한 학습 목표 3개와 선행 조건을 확인한 뒤, ipynb의 제목·코드 첫 줄·변수 이름으로 해당 셀을 찾습니다. 원본 코드 셀 105개 모두에 목적, 선행 조건, 입력과 결과, 실행 후 확인, 흔한 혼동을 개별 설명합니다. 설정·실행·TODO·선택·예상 실패를 구분하며, 코드가 생략된 설정/진단 셀도 원본 위치와 역할은 안내합니다. Jupyter 왼쪽 실행 횟수와 파일 내 셀 위치의 차이도 설명합니다.

**개념별로 배우기**에서는 기존 42개 소주제·시각자료·개별 풀이·핵심 정리를 한 단계씩 봅니다. 두 화면을 오갈 수 있고, 기존 `#cell-N`은 정확한 셀 해설로, `#section-N`·풀이·정리 주소는 기존 단계로 연결됩니다. 전역 검색도 노트와 코드 셀을 함께 찾습니다. “이 셀에 대해 질문하기”는 원본 파일·셀 위치를 보여 주고 사용자가 작성한 질문에 함께 전달하며 자동 전송하지 않습니다. 검색·진행 기록·목차는 노트북 10개 기준입니다. Google Drive 바로가기는 제공하지 않습니다.

## Get Certification

`/get-certification`은 새 DLI 랩 실행 → 07번 기존 설정·Task 1 문서·Task 2 생성/통합·Task 3 RAG TODO·Part 4 저장/재검색 → 08번 사전 점검 → 09번 서버 구현·연결 → Gradio Evaluate → 강좌 Assess Task → My Learning 인증서 확인을 안내합니다. 파일 복제 없이 기존 노트북에서 작업합니다. 코드 블록마다 열 노트북·찾을 코드 첫 줄·전체 교체 또는 새 Code 셀 추가·실행 키·확인할 출력을 표시합니다. 수정 없이 실행할 원본 셀도 별도로 구분하며 15개 코드 복사 블록을 제공합니다. 화면·서버·커널·수업 환경의 재시작을 구분한 오류 대처도 포함합니다. 15단계 안에서 07번의 기존 셀 4 → 34 → 36 → 38 → 40 → 44 → 46을 전체 교체해 실행하고, 저장한 인덱스를 08·09번에서 다시 읽습니다. 임베딩과 ChatNVIDIA는 수업 내부 주소를 명시하므로 이전 노트북의 환경변수를 요구하지 않습니다. 실제 평가는 수업 DLI 환경에서 수행합니다.

Q&A는 **강의자료 기반 / 실습노트 기반**으로 구분합니다. 강의자료 모드는 최신 슬라이드 6종과 관련 원논문 9편(RAGAS, QuCo-RAG, ReSearch, Search-R1, ReasonRAG, WebThinker, DeepResearcher, RAG, ReAct)을 근거로 답합니다. 논문 참고 옵션을 끄면 슬라이드만 사용하며, 옵션 변경 시 현재 대화를 초기화합니다. 등록한 논문을 검색하는 방식이며 실시간 웹 검색은 하지 않습니다. 실습노트 모드는 노트북 10개·해설·Get Certification만 사용합니다. 답변 출처에 자료 종류와 PDF 페이지 또는 노트북 위치를 표시합니다.

두 모드의 대화 기록은 브라우저 메모리에서 따로 유지합니다. 모드 전환은 진행 요청을 취소하고 늦은 응답을 무시합니다. **새 대화** 버튼은 현재 모드의 메시지·입력·오류를 비우고 진행 중인 요청을 취소합니다. 초기화 전의 늦은 응답은 무시하며, 다음 질문에는 이전 대화 기록을 보내지 않습니다. 이용 제한용 세션 쿠키는 초기화하지 않습니다.

## 에이전틱 코딩 실습

`/agentic-coding`은 상단의 네 번째 메뉴입니다. ChatGPT 데스크톱 Work에서 **Skill 만들기 → 입력 A/B로 재사용 → Vercel MCP 연결·조회 → Preview 배포·확인 → 한 가지 수정 후 재배포**를 13단계(개념 3 + 실행 10)로 따라갑니다. 개념 단계에서는 프롬프트·LLM·Skill·MCP의 차이, Skill 필수/선택 파일, MCP의 Host/Client/Server·도구·인증을 인터랙티브 구성요소 탐색과 실행 흐름·확인 문제로 설명합니다. MCP 설정 및 배포 입력값의 역할도 해당 단계에서 찾아볼 수 있습니다. 시작 안내 다운로드에는 같은 개념 설명을 함께 담습니다. 각 단계에는 실행 위치, 실행 순서, 복사할 요청문, 직접 확인할 성공 기준과 막혔을 때 대처가 있습니다. 실제 Skill 생성·OAuth·배포는 학습자의 ChatGPT와 Vercel에서 진행하며 이 사이트가 대신 실행하지 않습니다.

기존 PPT와 함께 쓰는 시작 안내·프롬프트·예시 3파일 ZIP과 개별 Skill/입력 예시를 내려받을 수 있습니다. 단계별 요청문은 화면 그대로 복사하거나 TXT로 받습니다. 배포 대상 입력은 요청문에만 반영하며 서버나 저장소로 전송하지 않습니다. 직접 확인한 단계만 브라우저에 저장하고, 단계별 주소·이전/다음·모바일 선택기와 전역 검색을 지원합니다.

## 코드 읽기

highlight.js 기반의 밝은 코드 뷰어를 사용합니다. Python·셸·JSON 문법 강조, 줄 번호, 자동 줄바꿈 전환, 확대 보기, 원문 복사를 제공합니다. 핵심 코드 해설의 행 번호를 누르면 해당 코드 줄이 강조됩니다. 복사에는 줄 번호나 화면용 강조 표시가 포함되지 않습니다.

## 시각자료

노트북 설명과 원본 코드 사이에 **12개의 인터랙티브 도식**을 배치했습니다. 셀과 커널, 마이크로서비스의 역할, 주소·포트·경로, 스트리밍, 순차·병렬 연결, 체인의 자료형 변화, 상태 갱신, 청크 겹침, 임베딩 유사도, RAG 흐름, 평가 데이터의 짝, 노트북과 서버 프로세스의 차이를 다룹니다. 도식은 HTML/CSS/SVG 기반 학습용 예시이며 실제 모델이나 수업 서버를 호출하지 않습니다.

## 학습 구성

- 최신 강의 슬라이드 6종의 PDF 열람·다운로드
- JupyterLab 노트북 00–09번별 해설 노트 10개
- 한국어 ipynb 10개 개별 다운로드와 전체 ZIP
- Skill·MCP·Vercel을 연결하는 에이전틱 코딩 실습 13단계와 요청문·예시 다운로드
- 셀 번호로 연결되는 원본 코드 105개·핵심 연산 해설, 노트북 풀이·확인 예제 14개
- NVIDIA 공식 심볼 파비콘
- 강의자료+관련 논문 / 실습노트로 구분된 Q&A 도우미

해설용 풀이는 공식 Solutions 파일이 아닙니다. 원본 실습에는 DLI 내부 서비스와 수업 패키지가 필요합니다. 이 사이트에서 코드를 실행하거나 수료 평가를 제출하지 않습니다. 검토한 노트북 다운로드 사본만 공개하며, 원본 출력·실제 자격 증명·비공개 원본 폴더는 저장소에 포함하지 않습니다.

## 개발과 배포

```sh
npm ci
npm run dev
npm run build
```

React + Vite. `main` 브랜치 push 시 GitHub Actions가 정적 사이트를 빌드하고 GitHub Pages에 배포합니다. 각 노트의 직접 방문·새로고침을 위해 `scripts/build-pages.mjs`가 경로별 HTML 진입점을 만듭니다.

- 프런트엔드: **GitHub Pages** → `ksa.dli-lecture.com`
- 챗봇 API: **Mac mini / Node.js + Cloudflare Tunnel** → `ksa-api.dli-lecture.com`
- API 주소만 공개 빌드 변수 `VITE_API_BASE_URL`로 지정합니다. API 키를 이 변수나 GitHub에 넣지 않습니다.
- 모델은 서버에서 `gpt-5.6-sol`, reasoning `high`로 고정합니다.
- 모델 자격 증명과 원문 검색 인덱스는 Mac mini의 보호 저장소/비공개 경로에 유지합니다. 이 저장소는 정적 프런트엔드만 배포합니다.
- Mac mini가 꺼져 있어도 학습 노트·한국어 노트북 파일·Pages에 이미 반영된 PDF는 열립니다. 최초 예약 공개 시점부터 Pages 반영 전까지는 PDF API가 필요합니다.

## 콘텐츠 수정

- `content/agentic-practice.json`, `src/agentic-practice.jsx`, `src/agentic-practice.css`: 에이전틱 코딩 단계별 안내·복사·다운로드 UI
- `content/agentic-concepts.json`, `content/agentic-field-roles.mjs`, `src/agentic-concepts.jsx`, `src/agentic-concepts.css`: 초심자 개념·구성요소·실행 흐름·확인 문제; 다운로드 안내에도 같은 원문 반영
- `src/agentic-practice-model.mjs`: 배포 대상 검증·요청문 치환·로컬 진행 기록
- `public/downloads/agentic-coding/`: 공개 실습 ZIP 및 개별 교육용 예시; `node scripts/build-agentic-files.mjs`로 JSON의 개별 예시와 3파일 ZIP 갱신
- `node --test scripts/test-agentic-practice.mjs`: 진행 기록·대상 치환·예시 일치·ZIP 내용 검증
- `content/notes.mjs`: PPT·노트북별 한국어 해설, 문제 풀이, 오류 해결
- `content/certification-07.mjs`, `src/certification-07.jsx`: 새 랩에서 문서 준비·인덱스 생성·저장·검증
- `content/certification.mjs`, `src/certification.jsx`, `src/certification.css`: 수료 실행 가이드·복사 코드·오류 대처
- `content/notebook-companion.mjs`, `content/notebook-locations.json`, `content/notebook-lookup.mjs`: 셀별 해설·학습 목표·원본 위치·검색
- `src/notebook-companion.jsx`, `src/notebook-companion.css`: 원본 순서 탐색·셀 해설 화면
- `content/notebook-downloads.json`, `src/notebook-downloads.jsx`, `src/notebook-downloads.css`: 한국어 노트북 다운로드 목록·사용법·노트별 연결
- `public/downloads/notebooks/`, `public/downloads/Building-RAG-Agents-Korean-Notebooks.zip`: 검토한 한국어 ipynb 사본과 전체 묶음
- `content/notebook-code.json`: 출력·인증 셀을 제외한 코드 발췌와 줄별 해설
- `content/lecture-release.mjs`, `src/lecture-access.js`, `scripts/build-lecture-files.mjs`: 공개 일정·서버 확인·공개 PDF만 정적 배포
- `content/lectures.mjs`, `content/papers.mjs`: 최신 강의자료와 원논문 메타데이터
- `src/lecture-library.jsx`, `src/lecture-library.css`: 강의자료 선택·PDF 뷰어·다운로드
- `src/app.jsx`, `src/shared.jsx`, `src/chat-modes.css`: 페이지와 두 모드 도우미 UI
- `src/styles.css`: NVIDIA 로고·흰색·그린 기반 디자인
- `src/lesson-visuals.jsx`, `src/lesson-visuals.css`: 설명 옆의 인터랙티브 시각자료
- `src/beginner-visuals.jsx`, `src/beginner-visuals.css`: 초심자를 위한 실행 환경·요청·평가 도식
- `content/visual-models.mjs`: 시각자료 배치와 학습용 계산/예시
- `src/code-viewer.jsx`, `src/code-viewer.css`: 밝은 문법 강조 코드 뷰어
- `content/lesson-steps.mjs`, `src/reader.css`: 소주제별 단계 구성·기존 링크 매핑·학습 화면

## 출처

강연과 노트북의 출처는 각 노트의 참고자료 및 셀 번호에 표기합니다. 원본 강연자료·NVIDIA 로고의 권리는 각 권리자에게 있습니다. 파비콘은 NVIDIA 공식 사이트의 심볼을 사용합니다. 논문은 원 출판사·arXiv로 연결하며 원문 파일과 검색 인덱스는 공개 저장소에 넣지 않습니다. Pretendard는 SIL Open Font License이며 `public/fonts/OFL.txt`에 라이선스가 포함되어 있습니다.
