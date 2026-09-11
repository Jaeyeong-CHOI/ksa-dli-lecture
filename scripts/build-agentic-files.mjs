import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {settings,deployment} from '../content/agentic-field-roles.mjs';
const data=JSON.parse(readFileSync('content/agentic-practice.json','utf8'));
const root='public/downloads/agentic-coding';mkdirSync(root,{recursive:true});
writeFileSync(root+'/SKILL-EXAMPLE.md','# Skill 본문 예시\n\n설명용 파일입니다. 받는 것만으로 설치되지 않습니다. Work의 skill-creator에 전달해 검토하고 생성하세요.\n\n```markdown\n'+data.skill+'\n```\n');
writeFileSync(root+'/INPUT-A.md','# Input A — AI Study Club\n\n'+data.inputA+'\n');
writeFileSync(root+'/INPUT-B.md','# Input B — Research Reading Circle\n\n'+data.inputB+'\n');
const concepts=JSON.parse(readFileSync('content/agentic-concepts.json','utf8'));
const partText=p=>`### ${p.label}\n\n${p.role}\n\n${p.why}\n\n${p.code?'설명용 예시:\n\n'+p.code+'\n\n':''}이번 실습: ${p.example}\n`;
let lessonText='## 개념부터 이해하기\n\n웹 실습은 개념 3단계와 실행 10단계, 총 13단계입니다. 아래 개념을 읽고 따라하기로 이어 가세요. PROMPTS.md의 번호는 PPT와 함께 쓰는 요청문 번호이며 웹 단계 번호와 다릅니다.\n';
for(const c of Object.values(concepts)){
 lessonText+=`\n## ${c.headline}\n\n${c.intro}\n\n${c.analogy}\n\n${c.parts.map(partText).join('\n')}\n### 실행 흐름\n\n`;
 for(const f of c.flow)lessonText+=`- **${f.title} · ${f.label}**: ${f.text} ${f.result}\n`;
 lessonText+=`\n${c.takeaway}\n\n확인 질문: ${c.quiz.q}\n\n정답: ${c.quiz.options[c.quiz.answer]} — ${c.quiz.explain}\n\n공식 안내: ${c.sources.map(s=>'['+s.label+']('+s.url+')').join(' · ')}\n`;
}
lessonText+='\n## MCP 설정값의 역할\n\n'+settings.map(partText).join('\n');
lessonText+='\n## 배포 입력과 결과의 역할\n\n'+deployment.map(partText).join('\n');
const start='<!-- CONCEPTS:START -->',end='<!-- CONCEPTS:END -->';
let guide=readFileSync(root+'/READ_ME.md','utf8').replace(/<!-- CONCEPTS:START -->[\s\S]*?<!-- CONCEPTS:END -->\n*/,'');
guide=guide.replace('기존 Study Desk·시작 코드·체크포인트·테스트 파일은 사용하지 않습니다.\n','');
guide=guide.replace('## 따라하기',start+'\n'+lessonText+'\n'+end+'\n\n## 따라하기');
writeFileSync(root+'/READ_ME.md',guide);
execFileSync('zip',['-j','-q',root+'/Agentic-Coding-Practice.zip',root+'/READ_ME.md',root+'/PROMPTS.md',root+'/EXAMPLES.md']);
console.log('Agentic practice: three-file ZIP + individual educational examples');
