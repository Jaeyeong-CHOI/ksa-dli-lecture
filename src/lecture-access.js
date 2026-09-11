import {useEffect,useState} from 'react';
import {API} from './api.js';
import {lectureApiPath} from '../content/lecture-release.mjs';
export function useLectureAccess(){
 const [staticSlugs,setStatic]=useState([]),[serverSlugs,setServer]=useState([]),[checked,setChecked]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();let boundary;
  fetch('/lecture-availability.json',{cache:'no-store',signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(!controller.signal.aborted&&Array.isArray(data?.released))setStatic(data.released);}).catch(()=>{});
  const refresh=async()=>{
   try{
    const response=await fetch(API+'/api/lectures',{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error();const data=await response.json();
    if(controller.signal.aborted||!Array.isArray(data.lectures))return;
    setServer(data.lectures.filter(l=>l.available).map(l=>l.slug));setChecked(true);
    clearTimeout(boundary);const delays=data.lectures.filter(l=>!l.available).map(l=>Date.parse(l.releaseAt)-Date.parse(data.serverNow)).filter(t=>t>0);
    if(delays.length)boundary=setTimeout(refresh,Math.min(...delays,2147483000)+100);
   }catch{if(!controller.signal.aborted)setChecked(true);}
  };
  refresh();const poll=setInterval(refresh,30000);const visible=()=>{if(document.visibilityState==='visible')refresh();};document.addEventListener('visibilitychange',visible);
  return()=>{controller.abort();clearTimeout(boundary);clearInterval(poll);document.removeEventListener('visibilitychange',visible);};
 },[]);
 return {checked,available:l=>staticSlugs.includes(l.slug)||serverSlugs.includes(l.slug),url:(l,download=false)=>staticSlugs.includes(l.slug)?l.pdf:API+lectureApiPath(l)+(download?'?download=1':'')};
}
