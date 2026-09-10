# Building RAG Agents with LLMs

**https://ksa.dli-lecture.com**

2026년 충청권 ICT이노베이션스퀘어 확산사업의 **NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지** 교육과정용 한국어 학습 노트입니다. 강좌명: Building RAG Agents with LLMs. 강연 제공: Jae Y. CHOI.

## 학습 흐름

첫 화면(`/`)의 **LLM 이해하기**는 Introduction to LLM 원본 강의 PDF 열람·다운로드 전용입니다. 설명 노트는 넣지 않습니다. 기존 `/notes/introduction-to-llm`과 `/resources` 주소도 같은 PDF 화면으로 연결합니다.

설명 자료는 **JupyterLab 노트북 00–09번, 10개**에만 제공합니다. 42개 소주제를 초심자 관점에서 용어의 뜻·쉬운 비유·입출력·코드 읽는 순서로 풀어썼습니다. 각 노트에는 처음 만나는 용어 3개도 정리합니다.

챕터 첫머리에서 배울 내용을 확인한 뒤, **소주제 하나 → 관련 코드 → 개별 실습 → 핵심 정리**로 한 단계씩 이동합니다. 이전/다음 버튼과 챕터 목차로 순서를 고를 수 있고, 선택한 소주제 주소는 새로고침·뒤로 가기에서도 유지됩니다. 원본 셀 해설은 필요할 때 펼치며, 기존 셀 직접 링크는 해당 소주제와 코드를 자동으로 엽니다. 검색·진행 기록·목차도 노트북 10개 기준입니다. Google Drive 바로가기는 제공하지 않고 원본 정보는 각 노트의 참고자료에 모읍니다.

## Get Certification

`/get-certification`은 07번 문서 인덱스 준비 → 08번 사전 점검 → 09번 서버 구현·연결 → Gradio Evaluate → 강좌 Assess Task → My Learning 인증서 확인을 안내합니다. 파일 복제 없이 기존 노트북에서 작업합니다. 코드 블록마다 열 노트북·찾을 코드 첫 줄·전체 교체 또는 새 Code 셀 추가·실행 키·확인할 출력을 표시합니다. 수정 없이 실행할 원본 셀도 별도로 구분하며 7개 코드 복사 블록을 제공합니다. 화면·서버·커널·수업 환경의 재시작을 구분한 오류 대처도 포함합니다. 실제 평가는 수업 DLI 환경에서 수행합니다.

Q&A의 **새 대화** 버튼은 메시지·입력·오류를 비우고 진행 중인 요청을 취소합니다. 초기화 전의 늦은 응답은 무시하며, 다음 질문에는 이전 대화 기록을 보내지 않습니다. 이용 제한용 세션 쿠키는 초기화하지 않습니다.

## 코드 읽기

highlight.js 기반의 밝은 코드 뷰어를 사용합니다. Python·셸·JSON 문법 강조, 줄 번호, 자동 줄바꿈 전환, 확대 보기, 원문 복사를 제공합니다. 핵심 코드 해설의 행 번호를 누르면 해당 코드 줄이 강조됩니다. 복사에는 줄 번호나 화면용 강조 표시가 포함되지 않습니다.

## 시각자료

노트북 설명과 원본 코드 사이에 **12개의 인터랙티브 도식**을 배치했습니다. 셀과 커널, 마이크로서비스의 역할, 주소·포트·경로, 스트리밍, 순차·병렬 연결, 체인의 자료형 변화, 상태 갱신, 청크 겹침, 임베딩 유사도, RAG 흐름, 평가 데이터의 짝, 노트북과 서버 프로세스의 차이를 다룹니다. 도식은 HTML/CSS/SVG 기반 학습용 예시이며 실제 모델이나 수업 서버를 호출하지 않습니다.

## 학습 구성

- Introduction to LLM 원본 PPT의 PDF 열람·다운로드
- JupyterLab 노트북 00–09번별 해설 노트 10개
- 셀 번호로 연결되는 원본 코드 105개·핵심 연산 해설, 노트북 풀이·확인 예제 14개
- Introduction to LLM PDF 다운로드만 제공 (추가 강연은 추후 공개)
- 제공된 Drive 자료와 한국어 해설에 근거한 Q&A 도우미

해설용 풀이는 공식 Solutions 파일이 아닙니다. 원본 실습에는 DLI 내부 서비스와 수업 패키지가 필요합니다. 이 사이트에서 코드를 실행하거나 수료 평가를 제출하지 않습니다. 노트북 원본 출력 및 인증 설정은 저장소에 포함하지 않습니다.

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
- Mac mini가 꺼져 있어도 학습 노트와 PDF는 열리며, 챗봇만 사용할 수 없게 됩니다.

## 콘텐츠 수정

- `content/notes.mjs`: PPT·노트북별 한국어 해설, 문제 풀이, 오류 해결
- `content/certification.mjs`, `src/certification.jsx`, `src/certification.css`: 수료 실행 가이드·복사 코드·오류 대처
- `content/notebook-code.json`: 출력·인증 셀을 제외한 코드 발췌와 줄별 해설
- `src/app.jsx`, `src/shared.jsx`: 페이지와 도우미 UI
- `src/styles.css`: NVIDIA 로고·흰색·그린 기반 디자인
- `src/lesson-visuals.jsx`, `src/lesson-visuals.css`: 설명 옆의 인터랙티브 시각자료
- `src/beginner-visuals.jsx`, `src/beginner-visuals.css`: 초심자를 위한 실행 환경·요청·평가 도식
- `content/visual-models.mjs`: 시각자료 배치와 학습용 계산/예시
- `src/code-viewer.jsx`, `src/code-viewer.css`: 밝은 문법 강조 코드 뷰어
- `content/lesson-steps.mjs`, `src/reader.css`: 소주제별 단계 구성·기존 링크 매핑·학습 화면

## 출처

강연과 노트북의 출처는 각 노트의 참고자료 및 셀 번호에 표기합니다. 원본 강연자료·NVIDIA 로고의 권리는 각 권리자에게 있습니다. Pretendard는 SIL Open Font License이며 `public/fonts/OFL.txt`에 라이선스가 포함되어 있습니다.
