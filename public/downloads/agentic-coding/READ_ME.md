# Skill → MCP → Vercel

반복 작업을 Skill로 만들고, 결과 페이지를 Vercel MCP로 배포하는 실습입니다.
기존 Study Desk·시작 코드·체크포인트·테스트 파일은 사용하지 않습니다.

## 준비

- 기본 화면: **ChatGPT 데스크톱 앱의 Work**. 새 작업에서 사용할 폴더를 선택합니다.
- Skills 메뉴와 `@skill-creator`가 보이는지 확인합니다.
- Vercel 계정과 실습용 팀/워크스페이스를 준비합니다.
- 데스크톱의 Settings → MCP servers → Add server가 보이는지 확인합니다.
- 실습에는 공개해도 되는 가상 예시만 사용합니다. 인증은 Vercel 로그인 창에서 진행하며 토큰을 채팅에 붙여넣지 않습니다.

웹 브라우저 ChatGPT는 플러그인으로 제공되는 Skill/원격 도구를 사용하는 경로입니다. 로컬 Skill 폴더나 데스크톱 MCP 설정이 웹에 자동 반영되지 않습니다. 메뉴가 다르면 먼저 수업의 데스크톱 경로로 맞춥니다. 관리형 계정은 기능 허용 여부도 확인합니다.

## 파일 3개만 사용합니다

- `READ_ME.md`: 시작 순서와 막혔을 때 확인할 곳
- `PROMPTS.md`: 번호 순서대로 복사하는 요청문
- `EXAMPLES.md`: Skill 본문 예시 + 서로 다른 입력 A/B

텍스트 편집기에서 파일을 열거나, ChatGPT에 첨부한 뒤 필요한 예시와 요청문을 사용합니다.

## 따라하기

1. **Skill 만들기** — PROMPTS의 1번과 EXAMPLES의 Skill 본문을 함께 입력합니다. `brief-to-page`가 Skills 목록에 나타나는지 확인합니다. 예시 텍스트를 첨부한 것만으로 설치된 Skill은 아닙니다.
2. **Skill 사용하기** — `@` 선택기에서 실제 Skill을 고른 뒤 2번과 입력 A를 전달합니다. 생성된 `index.html`을 열고 Topics 링크와 FAQ를 직접 사용합니다.
3. **반복해보기** — 새 작업/폴더에서 같은 Skill에 입력 B를 줍니다. A의 이름·문구가 B에 섞이지 않는지 확인합니다. 배포할 때는 다시 A 작업으로 돌아옵니다.
4. **MCP 연결하기** — 아래 설정을 저장하고 Restart, 이어서 Authenticate로 로그인합니다. `/mcp`에서 연결 상태를 확인합니다.
5. **도구 사용 확인하기** — 4번 요청으로 Vercel 문서를 조회합니다. 이어 5번 요청으로 팀/프로젝트 목록을 확인하고, 배포할 팀을 지정합니다. 도구 호출이 없으면 연결 성공으로 기록하지 않습니다.
6. **Preview 배포하기** — 6번 요청의 `<TEAM>`과 `<PROJECT_NAME>`을 실제 값으로 바꿉니다. 다른 프로젝트와 겹치지 않는 새 이름을 사용합니다. 파일 목록과 target을 검토하고 도구 실행을 승인합니다.
7. **결과 확인하기** — 7번 요청 후 실제 URL을 엽니다. 배포 상태, 제목, 링크, FAQ, 좁은 화면을 확인합니다. Preview가 로그인 화면을 보이면 보호 설정인지 확인합니다. 보호를 무조건 끄지 않습니다.
8. **한 가지만 바꾸기** — 8번 요청으로 제목을 바꾸고 같은 프로젝트에 새 Preview를 만듭니다. 새 URL에서 변경을 확인합니다. 이전 배포 URL과 혼동하지 않습니다.
9. **선택: 공개 게시** — 누구나 접근하는 정식 URL이 필요하면 9번 요청을 사용합니다. 검토한 파일을 production으로 배포하고 실제 접근 범위를 별도로 확인합니다.

## Vercel MCP 설정

ChatGPT 데스크톱: Settings → MCP servers → Add server

- Name: `vercel`
- Type: `Streamable HTTP`
- URL: `https://mcp.vercel.com`
- Save → Restart → Authenticate → 브라우저에서 Vercel 로그인/허용
- 새 작업의 `/mcp`에서 상태 확인

배포는 현재 Vercel MCP의 `deploy_to_vercel`이 파일 트리를 직접 받는 경로입니다. 이 실습에서는 Git 저장소와 Vercel CLI를 먼저 만들 필요가 없습니다. 사용 가능한 도구 목록에서 실제 배포 도구를 확인한 후 진행합니다.

## 완료 기준

- 같은 Skill을 입력 A와 B에 명시적으로 호출했다.
- 생성 파일을 실제로 열었고 최소 한 번 직접 조작했다.
- Vercel MCP 호출 기록과 선택한 팀/프로젝트를 확인했다.
- Preview 배포 ID/URL과 성공 상태가 확인된다.
- 새 배포 URL에서 바뀐 제목을 확인했다.

## 막히면

- **Skill이 안 보임:** Skills 목록, 작업 폴더, 생성 위치를 확인하고 앱을 다시 시작합니다. 단순 채팅에 본문을 붙여넣은 것은 재사용 Skill 설치와 구분합니다.
- **MCP 로그인 실패:** 서버 URL·Authenticate 상태·선택한 Vercel 계정/팀을 확인합니다. 채팅으로 인증 토큰을 전달하지 않습니다.
- **배포 도구가 없음:** 연결 서버의 도구 목록을 다시 확인합니다. 파일을 만들었다는 답변을 배포 완료로 해석하지 않습니다. PROMPTS의 10번으로 실제 상태를 기록합니다.
- **빌드 실패:** 배포 ID를 대상으로 빌드 로그를 읽고 해당 오류만 수정합니다. 통째로 재작성하지 않습니다.
- **주소는 있는데 화면이 다름:** 최신 deployment ID/URL, 파일 내용, Preview 보호/로그인 상태를 확인합니다.

설정 도움말: [Skills](https://learn.chatgpt.com/docs/build-skills) · [Desktop MCP](https://learn.chatgpt.com/docs/extend/mcp) · [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp)
