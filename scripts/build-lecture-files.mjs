import {mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {lectures} from '../content/lectures.mjs';
import {isLectureReleased,lectureApiPath} from '../content/lecture-release.mjs';
export async function buildLectureFiles({out='dist',now=Date.now(),api='https://ksa-api.dli-lecture.com',request=fetch}={}){
 const released=[];
 for(const lecture of lectures){
  // Scheduled PDFs must not be copied blindly by Vite's public-directory handling.
  if(existsSync(resolve('public','.'+lecture.pdf)))throw Error('Move lecture PDF out of public: '+lecture.slug);
  if(!isLectureReleased(lecture,now))continue;
  let bytes;
  for(let attempt=0;attempt<3;attempt++){
   try{const response=await request(api+lectureApiPath(lecture),{signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error('PDF HTTP '+response.status);bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==lecture.bytes||bytes.subarray(0,5).toString()!=='%PDF-'||createHash('sha256').update(bytes).digest('hex')!==lecture.sha256)throw Error('PDF integrity mismatch');break;}
   catch(error){if(attempt===2)throw Error('Cannot publish '+lecture.slug+': '+error.message);}
  }
  const path=resolve(out,'.'+lecture.pdf);mkdirSync(resolve(out,'downloads'),{recursive:true});writeFileSync(path,bytes);released.push(lecture.slug);
 }
 mkdirSync(out,{recursive:true});writeFileSync(resolve(out,'lecture-availability.json'),JSON.stringify({builtAt:new Date(now).toISOString(),released}));
 return released;
}
