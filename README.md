# NVIDIA DLI · KSA 학습 노트

**https://ksa.dli-lecture.com**

NVIDIA DLI 강연자료를 따라 읽는 한국어 학습 보조 사이트입니다. 강연 제공: Jae Y. CHOI.

## 학습 구성

- Introduction to LLM PPT 해설 노트 1개 — 원본 63쪽의 다섯 파트를 순서대로 설명
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

## 출처

강연과 노트북은 페이지의 수업 Google Drive 및 원본 링크를 참고하세요. 원본 강연자료·NVIDIA 로고의 권리는 각 권리자에게 있습니다. Pretendard는 SIL Open Font License이며 `public/fonts/OFL.txt`에 라이선스가 포함되어 있습니다.
