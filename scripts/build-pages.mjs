import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {notes} from '../content/notes.mjs';
import {lectures} from '../content/lectures.mjs';
import {buildLectureFiles} from './build-lecture-files.mjs';
console.log('Released lecture PDFs:',await buildLectureFiles());
const html=readFileSync('dist/index.html','utf8');
const routes=['agentic-coding','notebook-downloads','get-certification','notebooks','resources','practice',...lectures.map(l=>'lectures/'+l.slug),...notes.map(n=>'notes/'+n.slug)];
for(const route of routes){mkdirSync('dist/'+route,{recursive:true});const page=route==='agentic-coding'?html.replace('</head>','<meta name="robots" content="noindex">\n</head>'):html;writeFileSync('dist/'+route+'/index.html',page)}
writeFileSync('dist/404.html',html);writeFileSync('dist/.nojekyll','');
writeFileSync('dist/CNAME','ksa.dli-lecture.com\n');
writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['',...routes.filter(x=>!['practice','agentic-coding'].includes(x))].map(x=>'<url><loc>https://ksa.dli-lecture.com/'+x+(x?'/':'')+'</loc></url>').join('')+'</urlset>');
console.log('GitHub Pages routes:',routes.length);
