export const settings = [
 {id:'name',label:'Name · 연결 이름',role:'앱 안에서 이 연결을 구별할 별명입니다.',why:'vercel이라는 이름만 입력해서 연결되는 것은 아닙니다. 실제 연결 대상은 URL로 정합니다.',example:'여러 MCP를 연결했다면 이름으로 어느 서비스를 쓰는지 구분합니다.'},
 {id:'type',label:'Type · 통신 방식',role:'앱과 서버가 요청·응답을 전달할 방법입니다.',why:'Streamable HTTP를 고르는 이유는 Vercel이 원격 HTTP 주소를 제공하기 때문입니다. 내 컴퓨터의 프로그램을 실행하는 STDIO와 다릅니다.',example:'이번 실습에서는 Streamable HTTP를 선택합니다.'},
 {id:'url',label:'URL · MCP 서버 주소',role:'앱이 도구 목록과 실행 요청을 보낼 주소입니다.',why:'이 주소는 우리가 만들 웹페이지 주소가 아닙니다. 서버를 연결해도 아직 페이지를 배포한 것이 아닙니다.',example:'https://mcp.vercel.com은 도구 연결 주소입니다.'},
 {id:'auth',label:'Authenticate · 계정 허용',role:'어느 계정의 어떤 권한으로 기능을 사용할지 확인합니다.',why:'Vercel 로그인 화면에서 계정과 접근 범위를 확인합니다. 로그인은 개별 배포 완료와는 별개입니다.',example:'인증 후 팀 조회 도구를 실행해 실제 접근 가능한 팀을 확인합니다.'},
 {id:'status',label:'/mcp · 연결 상태',role:'앱에서 설정된 MCP 연결 상태를 확인하는 명령입니다.',why:'연결 상태는 통로의 상태입니다. 실제 조회 결과나 배포 상태는 해당 도구 실행으로 확인합니다.',example:'연결됨 → 팀 조회 성공 → 배포 성공을 따로 확인합니다.'}
];
export const deployment = [
 {id:'team',label:'teamId · 소유 팀',role:'누구의 작업 공간에 배포할지 정합니다.',why:'ID는 팀을 구별하는 값이고, slug는 주소 등에 쓰는 짧은 이름입니다. 임의의 예시 값이 아니라 조회된 값을 씁니다.',example:'팀 조회 결과를 아래 팀 ID 또는 slug 칸에 입력합니다.'},
 {id:'name',label:'name · 프로젝트',role:'하나의 사이트를 관리하는 묶음의 이름입니다.',why:'프로젝트 하나에 여러 배포 버전이 생길 수 있습니다. 처음에는 새 이름을 쓰고 수정 배포는 같은 프로젝트에 합니다.',example:'같은 프로젝트 → 처음 만든 배포 → 제목을 바꾼 새 배포.'},
 {id:'files',label:'files · 실제 파일',role:'배포할 파일의 경로와 전체 내용을 전달합니다.',why:'파일 이름이나 내 컴퓨터 경로만 알려 주는 것으로는 부족합니다. file은 상대 경로, data는 내용, encoding은 내용을 표현한 방식입니다.',example:'index.html: HTML은 내용·구조, CSS는 모양, JavaScript는 필요한 동작을 담당합니다. 이번 페이지는 CSS를 HTML 안에 넣습니다.'},
 {id:'target',label:'target · 배포 용도',role:'preview는 검토용, production은 정식 서비스용으로 구분합니다.',why:'Preview도 실제 서버에 올라간 결과입니다. 검토용이라고 반드시 본인만 볼 수 있거나, production이라고 반드시 누구나 볼 수 있는 것은 아닙니다.',example:'이번 필수 실습은 preview입니다. 접근 가능 여부는 URL에서 따로 확인합니다.'},
 {id:'result',label:'ID · 상태 · URL',role:'배포 1회를 구분하고 결과를 확인하는 정보입니다.',why:'deployment ID는 배포 식별자, 상태는 진행·성공·실패 여부, URL은 결과를 열 주소입니다. 프로젝트 이름과 배포 ID는 다릅니다.',example:'상태 성공 → URL 열기 → 제목·링크·FAQ 동작 확인. 수정 후에는 새 배포 결과를 봅니다.'}
];
