import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {settings,deployment} from '../content/agentic-field-roles.mjs';
const data=JSON.parse(readFileSync('content/agentic-practice.json','utf8'));
const concepts=JSON.parse(readFileSync('content/agentic-concepts.json','utf8'));
const root='public/downloads/agentic-coding';mkdirSync(root,{recursive:true});
const partText=p=>`### ${p.label}\n\n${p.role}\n\n${p.why}\n\n${p.code?'예시:\n\n'+p.code+'\n\n':''}이번 실습: ${p.example}\n`;
let guide='# 에이전틱 코딩 실습\n\nk-skill 기존 Skill 활용 → Skill Creator로 공공데이터 API Skill 제작 → 화면 검증 → Vercel MCP 배포.\n\n웹 안내: https://ksa.dli-lecture.com/agentic-coding\n\n기본 ZIP은 READ_ME.md, PROMPTS.md, EXAMPLES.md 세 파일입니다. 실제 API 응답과 참고 화면은 웹에서 따로 열 수 있습니다. 예시를 받는 것과 Skill 설치·실행은 다릅니다.\n';
guide+='\n실행 환경: '+data.environment+'\n\n검수 범위: '+data.verification+'\n';
for(const [i,s] of data.steps.entries()){
 guide+=`\n## ${i+1}. ${s.title}\n\n${s.goal}\n\n실행 위치: ${s.where}\n\n${s.actions.map((x,j)=>`${j+1}. ${x}`).join('\n')}\n\n성공 확인:\n${s.check.map(x=>'- '+x).join('\n')}\n\n막혔을 때: ${s.trouble}\n`;
 if(s.explain)guide+='\n'+s.explain.map(p=>`### ${p.term}\n\n${p.role}\n\n${p.example}\n`).join('\n');
 if(s.links)guide+='\n'+s.links.map(l=>`- [${l.label}](${l.url.startsWith('/')?'https://ksa.dli-lecture.com':''}${l.url})`).join('\n')+'\n';
 if(s.lesson){const c=concepts[s.lesson];guide+=`\n### ${c.headline}\n\n${c.intro}\n\n${c.analogy}\n\n${c.parts.map(partText).join('\n')}\n${c.flow.map(f=>`- ${f.title} · ${f.label}: ${f.text} ${f.result}`).join('\n')}\n\n${c.takeaway}\n\n확인 질문: ${c.quiz.q}\n정답: ${c.quiz.options[c.quiz.answer]} — ${c.quiz.explain}\n`}
}
guide+='\n## 선택 경로: 데스크톱 수동 MCP 설정값\n\n웹의 Vercel 플러그인 설치와 별개인 경로입니다.\n\n'+settings.map(partText).join('\n')+'\n## 배포 입력값\n\n'+deployment.map(partText).join('\n');
writeFileSync(root+'/READ_ME.md',guide);
writeFileSync(root+'/PROMPTS.md','# 단계별 복사 프롬프트\n\n웹 단계 번호와 같습니다. 기존 Skill은 Installed 목록의 Try in chat으로 호출합니다. 새 Skill은 Create with chat에서 시작합니다. Codex CLI의 $ 경로와 혼동하지 마세요. {{TEAM}}과 {{PROJECT}}는 실제 조회한 대상 값으로 바꿉니다.\n'+data.steps.map((s,i)=>s.prompt?`\n## ${i+1}. ${s.title}\n\n실행 위치: ${s.where}\n\n~~~text\n${s.prompt}\n~~~\n`:'').join(''));
let examples='# 실습 예시\n\n## 실습 1: 기존 k-skill\n\n대표 예제: https://github.com/NomaDamas/k-skill/tree/main/geeknews-search\n\n설치 후 최신 글을 조회하고, 반환된 제목의 키워드로 검색합니다. RSS/Atom 피드 범위이며 전체 웹 검색이 아닙니다. 목록에서 원하는 다른 Skill을 골라도 되지만 입력·인증·성공 기준을 먼저 확인하세요.\n\n## 실습 2: 새 Skill의 본문 예시\n\n아래는 Skill Creator가 만든 결과를 비교할 교육용 예시입니다. scripts/heritage_query.py와 references/api.md는 API 계약을 읽은 Skill Creator가 생성해야 합니다. 이 본문만 복사하면 호출 코드가 자동으로 생기지 않습니다.\n\n~~~markdown\n'+data.skill+'\n~~~\n\n## 입력 A\n\n'+data.inputA+'\n\n## 입력 B\n\n'+data.inputB+'\n\n## API 역할\n\n';
examples+=data.steps.find(s=>s.id==='public-api').explain.map(p=>`- ${p.term}: ${p.role} ${p.example}`).join('\n');
examples+='\n\n## 결과 구조\n\nstatus: ok / no_results / error\nquery: 이번 검색어\ntotal: 전체 일치 수\nreturned: 실제 수집 수\nretrievedAt: 조회 시각\nitems: 이름·유형·지역·주소·설명·식별자·공식 출처\n\n검수 시 경복궁 11건 중 3건, 첨성대 1건이 반환됐습니다. 현재 결과는 달라질 수 있습니다.\n\n## 도구가 막혔을 때\n\n웹에서 실제 API 응답 JSON을 내려받아 출처와 필드를 비교하거나 참고 페이지를 조작할 수 있습니다. 이는 결과 검토 연습이며 자신의 Skill/API 호출·배포 성공을 뜻하지 않습니다.\n';
writeFileSync(root+'/EXAMPLES.md',examples);
for(const [file,title,key] of [['SKILL-EXAMPLE.md','교육용 Skill 본문 예시','skill'],['INPUT-A.md','입력 A','inputA'],['INPUT-B.md','입력 B','inputB']])writeFileSync(root+'/'+file,'# '+title+'\n\n'+data[key]+'\n');
execFileSync('python3',['-c','import zipfile,sys,pathlib\np=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(p/"Agentic-Coding-Practice.zip","w",zipfile.ZIP_DEFLATED) as z:\n for n in ["READ_ME.md","PROMPTS.md","EXAMPLES.md"]: z.write(p/n,n)',root]);
console.log(`Agentic practice: ${data.steps.length} stages; three-file ZIP regenerated from the same source`);
