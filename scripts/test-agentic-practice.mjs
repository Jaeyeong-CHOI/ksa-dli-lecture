import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {destinationValid,fillPrompt,restoreProgress,resolveStep} from '../src/agentic-practice-model.mjs';
const data=JSON.parse(readFileSync(new URL('../content/agentic-practice.json',import.meta.url)));
const ids=data.steps.map(s=>s.id);
test('bad saved progress and malformed deep links do not break the lesson',()=>{
 assert.deepEqual(restoreProgress({done:['deploy','unknown','deploy'],current:'unknown'},ids),{done:['deploy'],current:ids[0]});
 assert.deepEqual(restoreProgress('broken',ids),{done:[],current:ids[0]});
 assert.equal(resolveStep('#%xy',ids,'prepare'),'prepare');assert.equal(resolveStep('#api-b',ids,'prepare'),'api-b');
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

test('new concept steps preserve earlier learner progress and ship matching offline explanations',()=>{
 assert.deepEqual(restoreProgress({done:['prepare','create-skill'],current:'connect-mcp'},ids),{done:['prepare'],current:'connect-mcp'});
 const concepts=JSON.parse(readFileSync('content/agentic-concepts.json','utf8')); const guide=readFileSync('public/downloads/agentic-coding/READ_ME.md','utf8');
 for(const s of data.steps.filter(s=>s.lesson)){
  const c=concepts[s.lesson]; assert.ok(c); assert.ok(c.quiz.answer>=0&&c.quiz.answer<c.quiz.options.length);
  for(const p of c.parts){assert.ok(guide.includes(p.role));assert.ok(guide.includes(p.why));assert.ok(guide.includes(p.example))}
 }
 assert.equal(data.steps.filter(s=>s.lesson).length,3);
});

// Every displayed capture and data result must actually exist; successful API data is not a login/deploy claim.
test('real practice evidence is present and public responses remain bounded',()=>{
 for(const s of data.steps)for(const f of s.screens||[])assert.ok(readFileSync('public'+f.src).length>1000);
 const a=JSON.parse(readFileSync('public/downloads/agentic-coding/HERITAGE-A.json'));
 assert.equal(a.status,'ok');assert.equal(a.returned,a.items.length);assert.ok(a.returned<=3);assert.ok(a.total>=a.returned);
 for(const i of a.items){assert.ok(i.sourceUrl.startsWith('https://www.khs.go.kr/'));assert.equal(typeof i.ids.ccbaAsno,'string');assert.ok(i.name);}
 const prompts=readFileSync('public/downloads/agentic-coding/PROMPTS.md','utf8');for(const s of data.steps)if(s.prompt)assert.ok(prompts.includes(s.prompt));
});

test('conditional lesson paths and both recovery requests survive the offline export',()=>{
 const guide=readFileSync('public/downloads/agentic-coding/READ_ME.md','utf8');
 const prompts=readFileSync('public/downloads/agentic-coding/PROMPTS.md','utf8');
 for(const s of data.steps){
  for(const r of s.routes||[]){assert.ok(ids.includes(r.step),`invalid target ${r.step}`);assert.ok(guide.includes('/#'+r.step));}
  if(s.followup){assert.ok(prompts.includes(s.followup.prompt));assert.ok(prompts.includes(s.followup.where));}
 }
 const recovery=data.steps.find(s=>s.id==='snapshot-recovery');
 assert.ok(recovery.followup);assert.notEqual(recovery.prompt,recovery.followup.prompt);
 const original={done:['api-a'],current:'api-b'};
 assert.deepEqual(restoreProgress({...original,current:resolveStep('#data-page',ids,original.current)},ids),{done:['api-a'],current:'data-page'});
});
