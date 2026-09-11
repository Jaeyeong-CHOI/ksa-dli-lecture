import React from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Download} from 'lucide-react';
import {lectures} from '../content/lectures.mjs';
import './lecture-library.css';
import {MaterialTabs} from './notebook-downloads.jsx';
export function LectureLibrary({lecture,Link,course,program}) {
 const index=lectures.findIndex(l=>l.slug===lecture.slug);
 const updated=new Date(lecture.updatedAt).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric'});
 return <main id="main" className="slides-page">
  <div className="course-context"><span>2026년 충청권 ICT이노베이션스퀘어 확산사업</span><p>{program}</p><strong>{course}</strong></div>
  <MaterialTabs Link={Link}/><nav className="lecture-catalog" aria-label="강의자료 순서">{lectures.map(item=><Link key={item.slug} to={'/lectures/'+item.slug} className={'lecture-card '+(item.slug===lecture.slug?'selected':'')} aria-current={item.slug===lecture.slug?'page':undefined}><img src={item.cover} alt=""/><div><span>{String(item.number).padStart(2,'0')}</span><strong>{item.label}</strong><small>{item.pages}쪽</small></div></Link>)}</nav>
  <div className="slides-heading"><div><div className="eyebrow">강의자료 {String(lecture.number).padStart(2,'0')} / 06</div><h1>{lecture.label}</h1>{lecture.title!==lecture.label&&<p className="lecture-full-title">{lecture.title}</p>}<p>PDF · {lecture.pages}쪽 · 원본 최종 수정 {updated}</p></div><div className="slides-actions"><a className="outline-button" href={lecture.pdf} target="_blank" rel="noreferrer">PDF 열기<ArrowUpRight size={16}/></a><a className="primary-button" href={lecture.pdf} download><Download size={17}/>다운로드</a></div></div>
  <object key={lecture.slug} className="lecture-pdf" data={lecture.pdf+'#view=FitH'} type="application/pdf" aria-label={lecture.label+' 강의 슬라이드 PDF'}><div className="pdf-fallback"><img src={lecture.cover} alt={lecture.label+' 강의 슬라이드 표지'}/><p>PDF 열기 또는 다운로드로 강의자료를 확인하세요.</p></div></object>
  <nav className="lecture-pagination" aria-label="이전 다음 강의자료">{index>0?<Link to={'/lectures/'+lectures[index-1].slug}><ArrowLeft size={18}/><span>이전 자료<strong>{lectures[index-1].label}</strong></span></Link>:<span/>}{index<lectures.length-1?<Link to={'/lectures/'+lectures[index+1].slug}><span>다음 자료<strong>{lectures[index+1].label}</strong></span><ArrowRight size={18}/></Link>:<span/>}</nav>
 </main>;
}
