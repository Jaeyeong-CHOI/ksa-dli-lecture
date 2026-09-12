import React,{useState,useMemo} from 'react';
import guide from '../content/certification-guide.json';
import sources from '../content/certification-cells.json';
import {buildCellGroups} from '../content/certification-cell-code.mjs';
import {CodeBlock} from './code-viewer.jsx';
import {Screenshots} from './annotated-captures.jsx';

function Cell({group}){
 const [view,setView]=useState('complete');
 const edits=group.items.filter(i=>!i.asRun&&guide.actions[i.action].kind!=='run');
 const actions=group.items.map(i=>guide.actions[i.action]);
 const pictures=group.items.filter(i=>!i.asRun).flatMap(i=>guide.actions[i.action].screenshots||[]);
 const modelEdit=edits.some(i=>guide.actions[i.action].before?.trim().endsWith('ChatNVIDIA('));
 if(group.terminal)return <section className="simple-edit" data-cell-key={group.key}><h4>Terminal에서 실행</h4><p>{actions[0].instruction}</p><CodeBlock code={group.complete} language="bash" label="명령 전체 · 붙여넣고 Enter"/><details className="simple-explanation"><summary>설명·주의사항</summary><p>{actions[0].note}</p></details></section>;
 return <section className="simple-edit simple-cell" data-cell-key={group.key}>
  <h4>{group.items.length>1?'같은 셀 · '+edits.length+'곳 수정':group.items[0].title||actions[0].title}<span>{group.changed?'전체 코드에 반영됨':'원본 그대로 실행'}</span></h4>
  <p className="simple-cell-location">{actions[0].section} · 원본 셀 {group.cell} · {sources.basis}</p>
  {modelEdit&&<p><strong>기본 주소로 정상 연결되면 이 수정은 하지 않습니다.</strong></p>}
  {group.changed&&<>
   <ol className="simple-cell-changes">{edits.map(i=><li key={i.action}>{guide.actions[i.action].title}</li>)}</ol>
   <p className="simple-cell-copy-hint">원본이 같으면 <strong>수정 후 전체</strong>를 한 번 복사해 이 셀에 붙여넣으세요. 모델명·옵션 등 원본이 다르면 강조된 부분만 반영하세요.</p>
   <div className="simple-code-views" role="group" aria-label="셀 전체 코드 선택"><button type="button" aria-pressed={view==='complete'} onClick={()=>setView('complete')}>수정 후 전체</button><button type="button" aria-pressed={view==='original'} onClick={()=>setView('original')}>원본 전체</button><span>강조된 줄 = {view==='complete'?'변경·추가한':'바꾸는'} 부분</span></div>
  </>}
  <CodeBlock key={view} code={group[view]} language="python" output={group.changed&&view==='original'} label={group.changed?(view==='complete'?'수정 후 셀 전체 · 한 번에 복사':'수정 전 원본 셀 전체'):'원본 셀 전체 · 그대로 실행'} changedLines={group.lines[view]}/>
  <details className="simple-explanation"><summary>수정 위치·설명 자세히 보기</summary>{group.items.map(i=>{const a=guide.actions[i.action];return <div key={i.action}><strong>{i.title||a.title}</strong><p>{i.asRun?'기본 모델 설정을 그대로 실행합니다. 환경변수로 주소가 적용되면 별도 지정은 필요 없습니다.':a.instruction||'이 셀은 수정 없이 실행합니다.'}</p>{!i.asRun&&<><p>{a.why}</p><p>{a.note}</p></>}</div>;})}</details>
  <Screenshots items={[...new Map(pictures.map(p=>[p.src,p])).values()]}/>
 </section>;
}
export function CellEdits({items,prepared=[]}){
 const groups=useMemo(()=>buildCellGroups(items,guide.actions,sources,prepared),[items,prepared]);
 return groups.map(group=><Cell key={group.key} group={group}/>);
}
