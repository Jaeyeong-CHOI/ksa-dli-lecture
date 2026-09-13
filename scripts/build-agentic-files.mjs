import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {settings,deployment} from '../content/agentic-field-roles.mjs';
const data=JSON.parse(readFileSync('content/agentic-practice.json','utf8'));
const concepts=JSON.parse(readFileSync('content/agentic-concepts.json','utf8'));
const root='public/downloads/agentic-coding';mkdirSync(root,{recursive:true});
const partText=p=>`### ${p.label}\n\n${p.role}\n\n${p.why}\n\n${p.code?'예시:\n\n'+p.code+'\n\n':''}이번 실습: ${p.example}\n`;
let guide='# 에이전틱 코딩 실습\n\nk-skill 기존 Skill 활용 → Skill Creator로 공공데이터 API Skill 제작 → 화면 검증 → Vercel MCP 배포.\n\n웹 안내: https://ksa.dli-lecture.com/agentic-coding\n\n기본 ZIP은 READ_ME.md, PROMPTS.md, EXAMPLES.md 세 파일입니다. 실제 API 응답과 참고 화면은 웹에서 따로 열 수 있습니다. 예시를 받는 것과 Skill 설치·실행은 다릅니다.\n';
guide+='\n실행 환경: '+data.environment+'\n\n검수 범위: '+data.verification+'\n';
guide+=`\n## ${data.start.title}\n\n${data.start.intro}\n\n${data.start.outcomes.map(o=>`- ${o.title}: ${o.text}`).join('\n')}\n\n${data.start.files}\n\n${data.start.attach}\n\nZIP은 압축을 풀고 READ_ME.md부터 텍스트 편집기로 열면 됩니다. 웹 안내만으로도 실습할 수 있습니다.\n`;
for(const [i,s] of data.steps.entries()){
 guide+=`\n## ${i+1}. ${s.title}\n\n${s.goal}\n\n실행 위치: ${s.where}\n\n${s.actions.map((x,j)=>`${j+1}. ${x}`).join('\n')}\n\n성공 확인:\n${s.check.map(x=>'- '+x).join('\n')}\n\n막혔을 때: ${s.trouble}\n`;
 if(s.handoff)guide+='\n요청하기 전에: '+s.handoff+'\n';
 if(s.routes)guide+='\n내 결과에 맞게 이어가기:\n'+s.routes.map(r=>`- [${r.label}](https://ksa.dli-lecture.com/agentic-coding/#${r.step})`).join('\n')+'\n이동만으로 단계를 완료 처리하지 않습니다.\n';
 if(s.followup)guide+=`\n${s.followup.title}: ${s.followup.where}\n\nPROMPTS.md의 같은 단계에 수정 요청과 실행 요청이 따로 있습니다.\n`;
 if(s.explain)guide+='\n'+s.explain.map(p=>`### ${p.term}\n\n${p.role}\n\n${p.example}\n`).join('\n');
 if(s.links)guide+='\n'+s.links.map(l=>`- [${l.label}](${l.url.startsWith('/')?'https://ksa.dli-lecture.com':''}${l.url})`).join('\n')+'\n';
 if(s.lesson){const c=concepts[s.lesson];guide+=`\n### ${c.headline}\n\n${c.intro}\n\n${c.analogy}\n\n${c.parts.map(partText).join('\n')}\n${c.flow.map(f=>`- ${f.title} · ${f.label}: ${f.text} ${f.result}`).join('\n')}\n\n${c.takeaway}\n\n확인 질문: ${c.quiz.q}\n정답: ${c.quiz.options[c.quiz.answer]} — ${c.quiz.explain}\n`}
}
guide+='\n## 선택 경로: 데스크톱 수동 MCP 설정값\n\n웹의 Vercel 플러그인 설치와 별개인 경로입니다.\n\n'+settings.map(partText).join('\n')+'\n## 배포 입력값\n\n'+deployment.map(partText).join('\n');
writeFileSync(root+'/READ_ME.md',guide);
writeFileSync(root+'/PROMPTS.md','# 단계별 복사 프롬프트\n\n웹 단계 번호와 같습니다. 기존 Skill은 Installed 목록의 Try in chat으로 호출합니다. 새 Skill은 Create with chat에서 시작합니다. 입력창에 선택한 Skill 이름이 보이는지 확인하고 아래 요청만 추가합니다. {{TEAM}}과 {{PROJECT}}는 실제 조회한 대상 값으로 바꿉니다.\n'+data.steps.map((s,i)=>s.prompt?`\n## ${i+1}. ${s.title}\n\n실행 위치: ${s.where}\n\n${s.handoff||''}\n\n### ${s.promptTitle||'보낼 요청문'}\n\n~~~text\n${s.prompt}\n~~~\n${s.followup?`\n### ${s.followup.title}\n\n${s.followup.where}\n\n~~~text\n${s.followup.prompt}\n~~~\n`:''}`:'').join(''));
let examples='# 실습 예시\n\n## 실습 1: 기존 k-skill\n\n대표 예제: https://github.com/NomaDamas/k-skill/tree/main/geeknews-search\n\n설치 후 최신 글을 조회하고, 반환된 제목의 키워드로 검색합니다. RSS/Atom 피드 범위이며 전체 웹 검색이 아닙니다. 목록에서 원하는 다른 Skill을 골라도 되지만 입력·인증·성공 기준을 먼저 확인하세요.\n\n## 실습 2: 새 Skill의 본문 예시\n\n아래는 Skill Creator가 만든 결과를 비교할 교육용 예시입니다. scripts/heritage_query.py와 references/api.md는 API 계약을 읽은 Skill Creator가 생성해야 합니다. 이 본문만 복사하면 호출 코드가 자동으로 생기지 않습니다.\n\n~~~markdown\n'+data.skill+'\n~~~\n\n## 입력 A\n\n'+data.inputA+'\n\n## 입력 B\n\n'+data.inputB+'\n\n## API 역할\n\n';
examples+=data.steps.find(s=>s.id==='public-api').explain.map(p=>`- ${p.term}: ${p.role} ${p.example}`).join('\n');
examples+='\n\n## 결과를 읽는 법\n\nJSON은 정리한 데이터 파일입니다. 키 이름은 만든 Skill마다 다를 수 있으므로 필드의 뜻을 먼저 비교합니다. 파일을 첨부하고 “사람이 읽을 표로 보여 주세요”라고 요청할 수 있습니다.\n\n- 상태: 정상 결과, 정상 0건, 통신 실패를 구분합니다. 실제 응답 파일의 status 값을 그대로 확인합니다.\n- 수: 전체 일치 수, 이번 수집 수, 상세 성공·누락 수는 서로 다릅니다.\n- 시각: 원래 조회 시각과 첨부 파일 처리 시각을 구분합니다.\n- 결과 목록(items 또는 results): 이름·지역·주소·설명·식별자·공식 출처를 담습니다. null은 값이 없거나 모른다는 뜻이지 0이 아닙니다.\n\n## 이번 웹 검수에서 받은 결과\n\n실시간 호출은 웹 실행 환경에서 502 통신 오류였습니다. 실제 XML 첨부를 같은 등록 Skill로 처리했을 때는 sourceMode=provided_snapshot, status=partial, totalCount=11, collectedCount=3, detailSuccessCount=1, detailMissingCount=2였습니다. originalRetrievedAt은 원래 수집 시점, processed_at은 이번 처리 시점이며 항목별 retrieved_at도 있습니다. 키가 다르면 실제 파일의 의미와 대조하세요.\n\n이 숫자는 제공 예제 기준입니다. 다른 검색어·시점에는 실제 결과 수를 확인합니다. 앞선 로컬 API 성공 기록과 이번 웹의 통신 실패를 하나의 성공 기록으로 합치지 않습니다.\n\n## 도구가 막혔을 때\n\n실습 페이지에서 “실제 XML 첨부 예제”를 받아 복구 실습에 사용합니다. 등록 Skill 실행도 어려우면 “첨부 파싱 결과” JSON으로 페이지 제작을 연습할 수 있습니다. 이 경우 제공 결과 검토이며 본인의 API 조회·Skill 실행·배포 성공은 아닙니다.\n\n## 파일 전달과 보관\n\n입력 A/B 요청문에는 검색어와 결과 수가 이미 포함돼 있습니다. 입력 파일은 별도 보관용입니다. JSON으로 페이지를 만들 때는 해당 파일을 새 Work 대화에 실제로 첨부합니다. 완성한 index.html은 다운로드하여 브라우저에서 엽니다. A/B 전환은 정상 결과 파일 두 개를 모두 사용한 경우에만 확인합니다.\n';
writeFileSync(root+'/EXAMPLES.md',examples);
for(const [file,title,key] of [['SKILL-EXAMPLE.md','교육용 Skill 본문 예시','skill'],['INPUT-A.md','입력 A','inputA'],['INPUT-B.md','입력 B','inputB']])writeFileSync(root+'/'+file,'# '+title+'\n\n'+data[key]+'\n');
execFileSync('python3',['-c','import zipfile,sys,pathlib\np=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(p/"Agentic-Coding-Practice.zip","w",zipfile.ZIP_DEFLATED) as z:\n for n in ["READ_ME.md","PROMPTS.md","EXAMPLES.md"]: z.write(p/n,n)',root]);
console.log(`Agentic practice: ${data.steps.length} stages; three-file ZIP regenerated from the same source`);
