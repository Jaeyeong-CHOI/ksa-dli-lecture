import React from 'react';
import {Download,BookOpen,ArrowRight,Files} from 'lucide-react';
import manifest from '../content/notebook-downloads.json';
import './notebook-downloads.css';
const fileSize=bytes=>bytes>=1024*1024?(bytes/1024/1024).toFixed(1)+' MB':Math.ceil(bytes/1024)+' KB';
export function MaterialTabs({Link,notebooks=false}) {
 return <nav className="material-tabs" aria-label="다운로드 자료 종류"><Link to="/" aria-current={!notebooks?'page':undefined}>강의 슬라이드</Link><Link to="/notebook-downloads" aria-current={notebooks?'page':undefined}>한국어 실습 노트북</Link></nav>;
}
export function NotebookDownloadCallout({Link}) {
 return <div className="notebook-download-callout"><Files size={23}/><div><strong>한국어 노트북 파일도 함께 보세요</strong><p>00~09번 ipynb 개별 다운로드 · 전체 ZIP</p></div><Link to="/notebook-downloads">파일 다운로드<ArrowRight size={16}/></Link></div>;
}
export function NotebookDownloadLink({slug}) {
 const item=manifest.notebooks.find(n=>n.slug===slug);if(!item)return null;
 return <a className="notebook-current-download" href={item.url} download={item.filename}><Download size={15}/>이 노트북 받기 <span>한국어 · ipynb</span></a>;
}
export function NotebookDownloads({Link}) {
 return <main className="wide-page notebook-download-page" id="main"><MaterialTabs Link={Link} notebooks/>
  <div className="eyebrow">BUILDING RAG AGENTS WITH LLMS</div><h1>한국어 실습 노트북</h1><p className="page-lead">수업 노트북을 내려받아, 실습 노트의 설명과 나란히 보세요.<br/>한국어 설명과 원본 코드·TODO가 들어 있는 ipynb 파일 10개입니다.</p>
  <section className="notebook-bundle" aria-label="노트북 전체 다운로드"><div><Files size={27}/><div><h2>00~09번 한 번에 받기</h2><p>ipynb 10개 + 열기 안내 · ZIP · {fileSize(manifest.bundle.bytes)}</p></div></div><a className="primary-button" href={manifest.bundle.url} download={manifest.bundle.filename}><Download size={17}/>전체 ZIP 다운로드</a></section>
  <section className="notebook-opening-guide" aria-label="다운로드한 노트북 사용법"><h2>받은 파일은 이렇게 사용하세요</h2><ol><li><span>1</span><div><strong>파일 내려받기</strong><p>전체 ZIP은 먼저 압축을 풉니다. 한 파일만 필요하면 아래에서 선택하세요.</p></div></li><li><span>2</span><div><strong>수업 JupyterLab에서 열기</strong><p>수업 작업 폴더에 업로드한 뒤 파일을 더블클릭합니다.</p></div></li><li><span>3</span><div><strong>같은 파일의 해설 보기</strong><p>모르는 제목·코드·변수 이름을 실습 노트에서 검색합니다.</p></div></li></ol><p className="notebook-runtime-note">내부 모델 서버·설정 파일은 수업 DLI 환경이 필요합니다. 완성된 풀이 파일은 아니며, 그림은 인터넷으로 불러옵니다. 같은 이름의 작업 파일이 있다면 먼저 저장·백업하세요.</p></section>
  <section className="notebook-file-section" aria-labelledby="notebook-file-heading"><div className="notebook-file-heading"><h2 id="notebook-file-heading">필요한 노트북만 받기</h2><span>한국어 · 10개</span></div><div className="notebook-file-list">{manifest.notebooks.map(item=><article className="notebook-file-row" key={item.slug}><span className="notebook-file-number">{item.no}</span><div className="notebook-file-info"><h3>{item.title}</h3><code>{item.filename}</code><p>{item.cells}개 셀 · {fileSize(item.bytes)}</p></div><div className="notebook-file-actions"><Link to={'/notes/'+item.slug}><BookOpen size={15}/>해설 보기</Link><a href={item.url} download={item.filename} aria-label={item.filename+' 다운로드'}><Download size={16}/>ipynb 다운로드</a></div></article>)}</div></section>
  <p className="notebook-download-origin">원본 설명·코드·셀 순서를 유지하고 실행 결과와 편집기 기록만 정리한 다운로드용 사본입니다.</p>
 </main>;
}
