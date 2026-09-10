# Building RAG Agents with LLMs

**https://ksa.dli-lecture.com**

2026년 충청권 ICT이노베이션스퀘어 확산사업의 **NVIDIA DLI 기반 산업 AI 전환(AX) 챌린지** 교육과정용 한국어 학습 노트입니다. 강좌명: Building RAG Agents with LLMs. 강연 제공: Jae Y. CHOI.

## 학습 흐름

첫 화면(`/`)은 Introduction to LLM 강의 노트입니다. 기존 `/notes/introduction-to-llm` 주소도 유지합니다. 별도 소개용 랜딩 페이지는 사용하지 않습니다.

핵심 개념 → 설명 옆의 관련 코드 → 직접 풀이 → 확인 질문 → 다음 노트 순으로 읽습니다. 원본 셀 해설은 필요할 때 펼치며, 셀 직접 링크는 해당 코드를 자동으로 엽니다. Google Drive 바로가기는 제공하지 않고 원본 파일명·셀 번호와 강연자 출처를 남깁니다.

## 시각자료

설명과 원본 코드 사이에 7개의 인터랙티브 도식을 배치했습니다. 학습과 RAG의 차이, 순차·병렬 연결, 체인의 자료형 변화, 상태 갱신, 청크 겹침, 임베딩 유사도, 검색부터 답변 생성까지의 흐름을 비교할 수 있습니다. 도식은 HTML/CSS/SVG 기반 학습용 예시이며 실제 모델을 호출하지 않습니다.

## 학습 구성

- Introduction to LLM PPT 해설 노트 1개 — LLM 원리·학습·멀티모달·메모리의 핵심을 연결
- JupyterLab 노트북 00–09번별 해설 노트 10개
- 셀 번호로 연결되는 원본 코드 발췌·핵심 연산 해설, 15개 풀이·확인 예제
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
- `content/notebook-code.json`: 출력·인증 셀을 제외한 코드 발췌와 줄별 해설
- `src/app.jsx`, `src/shared.jsx`: 페이지와 도우미 UI
- `src/styles.css`: NVIDIA 로고·흰색·그린 기반 디자인
- `src/lesson-visuals.jsx`, `src/lesson-visuals.css`: 설명 옆의 인터랙티브 시각자료
- `content/visual-models.mjs`: 시각자료 배치와 학습용 계산/예시

## 출처

강연과 노트북의 출처는 각 노트의 참고자료 및 셀 번호에 표기합니다. 원본 강연자료·NVIDIA 로고의 권리는 각 권리자에게 있습니다. Pretendard는 SIL Open Font License이며 `public/fonts/OFL.txt`에 라이선스가 포함되어 있습니다.
