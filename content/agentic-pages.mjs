// Keep the published step hashes while grouping related work into continuous pages.
export const agenticPages = [
  {id:'skill-use', title:'기존 Skill 사용하기', label:'기존 Skill', subtitle:'설치 · 실행', steps:['understand-basics','prepare','k-install','k-run']},
  {id:'skill-create', title:'공공데이터 Skill 만들기', label:'새 Skill', subtitle:'생성 · 재사용', steps:['understand-skill','public-api','create-api-skill','api-a','api-b','snapshot-recovery']},
  {id:'page-build', title:'검증한 데이터로 웹페이지 만들기', label:'웹페이지', subtitle:'제작 · 검토', steps:['data-page','check-data-page']},
  {id:'mcp-deploy', title:'MCP 연결과 Preview 배포', label:'MCP·배포', subtitle:'연결 · 배포 · 수정', steps:['understand-mcp','connect-mcp','read-tools','deploy','verify','update','transfer']},
];

export function resolveAgenticPage(hash) {
  let id;
  try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { id = ''; }
  const page = agenticPages.find(p => p.id === id || p.steps.includes(id)) || agenticPages[0];
  return {page, target:page.steps.includes(id) ? id : page.id};
}
