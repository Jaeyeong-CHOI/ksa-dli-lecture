import React from 'react';
import {Download} from 'lucide-react';
import manifest from '../content/notebook-downloads.json';
import './notebook-downloads.css';
export function MaterialTabs({Link,notebooks=false}) {
 return <nav className="material-tabs" aria-label="다운로드 자료 종류"><Link to="/" aria-current={!notebooks?'page':undefined}>강의 슬라이드</Link><Link to="/notebook-downloads" aria-current={notebooks?'page':undefined}>한국어 실습 노트북</Link></nav>;
}
export function NotebookDownloadLink({slug}) {
 const item=manifest.notebooks.find(n=>n.slug===slug);if(!item)return null;
 return <a className="notebook-current-download" href={item.url} download={item.filename}><Download size={15}/>이 노트북 받기 <span>한국어 · ipynb</span></a>;
}
export function NotebookDownloads({Link}) {
 return <main className="wide-page notebook-download-page" id="main"><MaterialTabs Link={Link} notebooks/>
  <header className="notebook-download-header"><h1>한국어 실습 노트북</h1><a className="primary-button" href={manifest.bundle.url} download={manifest.bundle.filename}><Download size={17}/>전체 다운받기</a></header>
  <ul className="notebook-file-list" aria-label="노트북 개별 받기">{manifest.notebooks.map(item=><li className="notebook-file-row" key={item.slug}><code>{item.filename}</code><a href={item.url} download={item.filename} aria-label={item.filename+' 개별 받기'}><Download size={16}/>개별 받기</a></li>)}</ul>
 </main>;
}
