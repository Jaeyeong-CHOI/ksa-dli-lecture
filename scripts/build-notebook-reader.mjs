import fs from 'node:fs';
import assert from 'node:assert/strict';
import {notes} from '../content/notes.mjs';
import {notebookEdits, certificationExercises} from '../content/notebook-cell-edits.mjs';
import {buildCellGroups} from '../content/certification-cell-code.mjs';
const read = name => JSON.parse(fs.readFileSync(new URL('../'+name, import.meta.url)));
const catalog = read('content/notebook-downloads.json').notebooks;
const excerpts = read('content/notebook-code.json');
const guide = read('content/certification-guide.json');
const reviewed = read('content/certification-cells.json');
const actions = Object.entries(guide.actions).filter(([id,a]) => a.kind !== 'run' && !id.endsWith('-model') && id !== '07-model' && id !== '08-model' && id !== '09-model').map(([action])=>({action}));
const groups = buildCellGroups(actions, guide.actions, reviewed);
const output = {};
for (const n of notes.filter(n=>n.kind==='notebook')) {
 const file = catalog.find(item=>item.slug===n.slug);
 const notebook = read('public'+file.url);
 output[n.slug] = {};
 for (const block of excerpts[n.slug].blocks) {
  const cell = notebook.cells[block.cell-1];
  assert.equal(cell.cell_type, 'code', n.slug+':'+block.cell);
  let original = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
  let complete = original, basis = '한국어 원본', changes = [];
  const group = groups.find(g=>g.notebook===n.filename&&g.cell===block.cell);
  if(group) {
   original = group.original; complete = group.complete; basis = reviewed.basis;
   changes = group.items.map(i=>guide.actions[i.action].title);
  }
  const edit = notebookEdits[n.slug]?.[block.cell];
  if(edit) {
   assert(!group, 'Do not apply overlapping edit sets');
   for(const [before,after] of edit.patches) {
    assert.equal(complete.split(before).length,2,'Exact patch: '+n.slug+':'+block.cell);
    complete = complete.replace(before,()=>after);
   }
   changes.push(edit.title);
  }
  const exercise = edit?.exercise ?? certificationExercises[n.slug]?.[block.cell];
  output[n.slug][block.cell] = {original, complete, basis, changes, ...(exercise!==undefined?{exercise}:{})};
 }
}
fs.writeFileSync(new URL('../content/notebook-reader-code.json', import.meta.url), JSON.stringify(output,null,2)+'\n');
console.log({notebooks:Object.keys(output).length,cells:Object.values(output).reduce((n,c)=>n+Object.keys(c).length,0),changed:Object.values(output).flatMap(Object.values).filter(c=>c.original!==c.complete).length});
