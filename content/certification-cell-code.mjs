// Build full cells from the reviewed original, never from an independent rewrite.
function apply(code, action) {
 if (action.kind === 'run') return code;
 if (!action.before || code.split(action.before).length !== 2) throw new Error('Ambiguous cell edit: '+action.id);
 return code.replace(action.before, () => action.after+(action.kind==='insert'?action.before:''));
}
export function changedLines(before, after) {
 const left=before.split('\n'),right=after.split('\n');
 const lengths=Array.from({length:left.length+1},()=>new Uint16Array(right.length+1));
 for(let i=left.length-1;i>=0;i--)for(let j=right.length-1;j>=0;j--)lengths[i][j]=left[i]===right[j]?1+lengths[i+1][j+1]:Math.max(lengths[i+1][j],lengths[i][j+1]);
 let i=0,j=0;const original=[],complete=[];
 while(i<left.length||j<right.length){
  if(i<left.length&&j<right.length&&left[i]===right[j]){i++;j++;}
  else if(i<left.length&&(j===right.length||lengths[i+1][j]>=lengths[i][j+1]))original.push(++i);
  else complete.push(++j);
 }
 return {original,complete};
}
export function buildCellGroups(items, actions, sources, prepared=[]) {
 const groups=new Map();
 for(const item of items){
  const a=actions[item.action];if(!a)throw new Error('Missing action '+item.action);
  const key=a.cell?a.notebook+':'+a.cell:item.action;
  if(!groups.has(key)){
   const source=a.cell?sources.cells[key]?.code:a.after;
   if(typeof source!=='string')throw new Error('Missing complete cell '+key);
   const original=prepared.map(id=>actions[id]).filter(p=>p.notebook===a.notebook&&p.cell===a.cell).reduce(apply,source);
   groups.set(key,{key,notebook:a.notebook,cell:a.cell,original,complete:original,items:[],terminal:a.kind==='terminal'});
  }
  const group=groups.get(key);group.items.push(item);
  if(a.cell&&!item.asRun&&a.kind!=='run')group.complete=apply(group.complete,a);
 }
 return [...groups.values()].map(g=>({...g,changed:g.original!==g.complete,lines:changedLines(g.original,g.complete)}));
}
