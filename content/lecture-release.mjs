import {lectures} from './lectures.mjs';
export const isLectureReleased=(lecture,now=Date.now())=>Number.isFinite(Date.parse(lecture?.releaseAt))&&Number(now)>=Date.parse(lecture.releaseAt);
export const releaseLabel=lecture=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(lecture.releaseAt));
export const lectureApiPath=lecture=>'/api/lectures/'+lecture.slug+'/pdf';
export function releaseSnapshot(now=Date.now()){
 return {serverNow:new Date(now).toISOString(),lectures:lectures.map(l=>({slug:l.slug,releaseAt:l.releaseAt,available:isLectureReleased(l,now)}))};
}
export function lectureForSource(url=''){return lectures.find(l=>url===l.pdf||url.startsWith(l.pdf+'#')||url.startsWith('/lectures/'+l.slug+'#'));}
