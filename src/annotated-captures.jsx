import React,{useRef,useId} from 'react';
import './annotated-captures.css';
function AnnotatedCapture({item}){
 const uid=useId().replace(/:/g,''),dialog=useRef();
 const width=1000,height=width*item.height/item.width,pad=item.callouts?.length?90:0;
 const picture=(variant)=>item.callouts?.length?<svg className="cert-capture-svg" viewBox={'0 0 '+width+' '+(height+pad)} role="img" aria-label={item.alt}>
  <defs><marker id={'arrow-'+uid+variant} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d44c22"/></marker></defs>
  <image href={item.src} x="0" y={pad} width={width} height={height}/>
  {item.callouts.map((c,i)=><g key={i}><path d={'M '+c.fromX*10+' 45 L '+c.x*10+' '+(pad+c.y*height/100)} stroke="#d44c22" strokeWidth="3" fill="none" markerEnd={'url(#arrow-'+uid+variant+')'}/><circle cx={c.fromX*10} cy="25" r="18" fill="#d44c22"/><text x={c.fromX*10} y="32" textAnchor="middle" fill="white" fontSize="21" fontWeight="700">{i+1}</text></g>)}
 </svg>:<img src={item.src} alt={item.alt} loading="lazy"/>;
 const legend=()=>item.callouts?.length>0&&<ol className="cert-capture-legend">{item.callouts.map((c,i)=><li key={i}><b>{i+1}</b>{c.note}</li>)}</ol>;
 return <figure><button className="cert-capture-open" type="button" onClick={()=>dialog.current.showModal()} aria-label={item.alt+' · 화살표 포함 크게 보기'}>{picture("inline")}</button><figcaption>{item.caption}{legend()}<small>이미지를 누르면 화살표와 함께 크게 볼 수 있습니다.</small></figcaption><dialog ref={dialog} className="cert-capture-dialog" aria-label={item.alt+" 확대"}><button type="button" className="cert-capture-close" onClick={()=>dialog.current.close()}>닫기</button><div className="cert-capture-viewport" tabIndex={0} aria-label="확대한 그림, 좌우로 스크롤할 수 있습니다">{picture("dialog")}</div><small className="cert-capture-pan-hint">그림을 좌우로 밀어 나머지 부분을 볼 수 있습니다.</small><p>{item.caption}</p>{legend()}</dialog></figure>;
}
export function Screenshots({items=[]}){
 if(!items.length)return null;
 return <details className="cert-screenshots"><summary>실제 실습 화면 보기 · {items.length}장</summary>{items.map(item=><AnnotatedCapture key={item.src} item={item}/>)}</details>;
}
