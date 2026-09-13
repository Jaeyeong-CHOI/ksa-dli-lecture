import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {agenticPages,resolveAgenticPage} from '../content/agentic-pages.mjs';
const data=JSON.parse(readFileSync(new URL('../content/agentic-practice.json',import.meta.url)));

test('every published step is reachable exactly once in the four continuous practice pages',()=>{
 assert.equal(agenticPages.length,4);
 const grouped=agenticPages.flatMap(p=>p.steps);
 assert.equal(new Set(grouped).size,grouped.length);
 assert.deepEqual([...grouped].sort(),data.steps.map(s=>s.id).sort());
 for(const page of agenticPages){
  assert.equal(resolveAgenticPage('#'+page.id).page,page);
  for(const id of page.steps){
   const result=resolveAgenticPage('#'+id);
   assert.equal(result.page,page);assert.equal(result.target,id);
  }
 }
});
test('conditional paths still land on the recovery or destination section',()=>{
 for(const s of data.steps)for(const r of s.routes||[]){
  const {page,target}=resolveAgenticPage('#'+r.step);
  assert.ok(page.steps.includes(r.step));assert.equal(target,r.step);
 }
 assert.equal(resolveAgenticPage('#snapshot-recovery').page.id,'skill-create');
 assert.equal(resolveAgenticPage('#transfer').page.id,'mcp-deploy');
});
test('empty, stale and malformed hashes open a useful page without saved progress',()=>{
 for(const hash of ['','#%xy','#unknown','#main'])assert.deepEqual(resolveAgenticPage(hash),{page:agenticPages[0],target:'skill-use'});
 assert.equal(resolveAgenticPage('#%6B-install').target,'k-install');
});
