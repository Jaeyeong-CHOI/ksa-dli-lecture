import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const data=JSON.parse(readFileSync('content/agentic-practice.json','utf8'));
const root='public/downloads/agentic-coding';mkdirSync(root,{recursive:true});
writeFileSync(root+'/SKILL-EXAMPLE.md','# Skill 본문 예시\n\n설명용 파일입니다. 받는 것만으로 설치되지 않습니다. Work의 skill-creator에 전달해 검토하고 생성하세요.\n\n```markdown\n'+data.skill+'\n```\n');
writeFileSync(root+'/INPUT-A.md','# Input A — AI Study Club\n\n'+data.inputA+'\n');
writeFileSync(root+'/INPUT-B.md','# Input B — Research Reading Circle\n\n'+data.inputB+'\n');
execFileSync('zip',['-j','-q',root+'/Agentic-Coding-Practice.zip',root+'/READ_ME.md',root+'/PROMPTS.md',root+'/EXAMPLES.md']);
console.log('Agentic practice: three-file ZIP + individual educational examples');
