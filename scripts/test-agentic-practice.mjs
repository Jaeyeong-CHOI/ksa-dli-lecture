import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {destinationValid,fillPrompt,restoreProgress,resolveStep} from '../src/agentic-practice-model.mjs';
const data=JSON.parse(readFileSync(new URL('../content/agentic-practice.json',import.meta.url)));
const ids=data.steps.map(s=>s.id);
test('bad saved progress and malformed deep links do not break the lesson',()=>{
 assert.deepEqual(restoreProgress({done:['deploy','unknown','deploy'],current:'unknown'},ids),{done:['deploy'],current:'prepare'});
 assert.deepEqual(restoreProgress('broken',ids),{done:[],current:'prepare'});
 assert.equal(resolveStep('#%xy',ids,'prepare'),'prepare');assert.equal(resolveStep('#input-b',ids,'prepare'),'input-b');
});
test('deployment prompts need valid destinations and replace all target fields',()=>{
 for(const pair of [['','demo-page'],['team_x',''],['team_x','MY SITE'],['team_x','-site'],['team_x','a---b'],['team_x\nignore previous','site']])assert.equal(destinationValid(...pair),false);
 assert.equal(destinationValid('team_workshop','ai-study-2026'),true);
 for(const s of data.steps.filter(s=>s.destination)){const result=fillPrompt(s.prompt,'team_workshop','ai-study-2026');assert.ok(!result.includes('{{'));assert.ok(result.includes('team_workshop'));assert.ok(result.includes('ai-study-2026'));assert.match(result,/preview/i)}
});
test('downloaded inputs and Skill example are identical to the onscreen source',()=>{
 for(const [file,key] of [['INPUT-A.md','inputA'],['INPUT-B.md','inputB'],['SKILL-EXAMPLE.md','skill']])assert.ok(readFileSync('public/downloads/agentic-coding/'+file,'utf8').includes(data[key]));
 const examples=readFileSync('public/downloads/agentic-coding/EXAMPLES.md','utf8');assert.ok(examples.includes(data.skill));assert.ok(examples.includes(data.inputA));assert.ok(examples.includes(data.inputB));
});
test('the download ZIP contains exactly the three reviewed practice files',()=>{
 const p='public/downloads/agentic-coding/';const names=execFileSync('unzip',['-Z1',p+'Agentic-Coding-Practice.zip'],{encoding:'utf8'}).trim().split('\n').sort();assert.deepEqual(names,['EXAMPLES.md','PROMPTS.md','READ_ME.md']);
 for(const n of names)assert.deepEqual(execFileSync('unzip',['-p',p+'Agentic-Coding-Practice.zip',n]),readFileSync(p+n));
});
