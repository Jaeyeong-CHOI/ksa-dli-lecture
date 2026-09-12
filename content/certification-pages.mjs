// File-level reading pages; task hashes remain deep links within each page.
export function certificationPages(route, guide) {
 const optional=guide.steps.filter(s=>route.optional.includes(s.id)).map(s=>({...s,...route.optionalOverrides[s.id],optional:true,items:[...(route.optionalPrerequisites[s.id]||[]),...s.actions].map(action=>({action,asRun:route.inheritedModelActions.includes(action)}))}));
 return [
  ...route.stages.map(stage=>({...stage,tasks:stage.tasks})),
  {id:'optional-07',title:'07번 추가 점검',label:'선택 실습',optional:true,tasks:optional.filter(t=>t.id.startsWith('index-'))},
  {id:'optional-08',title:'08번 비교 실습',label:'선택 실습',optional:true,tasks:optional.filter(t=>!t.id.startsWith('index-'))},
 ];
}
export function resolveCertificationPage(hash, pages, route) {
 const raw=hash.replace(/^#/,''),target=route.aliases[raw]||raw;
 const page=pages.find(p=>p.id===target||p.tasks.some(t=>t.id===target))||pages[0];
 return {page,target:page.tasks.some(t=>t.id===target)?target:page.tasks[0].id};
}
