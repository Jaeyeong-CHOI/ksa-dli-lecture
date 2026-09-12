import {liveLookupAliases,routeForCell} from './notebook-learning.mjs';
import {cellGuides} from './notebook-companion.mjs';
import {notebookExplanations,explanationText} from './notebook-explanations.mjs';
export function normalizeLookup(value) {return String(value).toLocaleLowerCase().normalize('NFKC').replace(/[\s_\-`'"{}()[\]:;,.]+/g,'');}
export function findNotebookCells(query, sources, locations, onlySlug) {
 const needle=normalizeLookup(query);const results=[];
 for(const [slug,source] of Object.entries(sources)){
  if(onlySlug&&slug!==onlySlug)continue;
  for(const block of source.blocks){
   const guide=cellGuides[slug]?.[block.cell],location=locations[slug]?.[block.cell];
   if(!guide||!location)continue;
   const haystack=normalizeLookup([source.filename,guide.title,guide.kind,guide.process,guide.check,guide.pitfall,...location.path,location.firstLine,location.matchLine,...(liveLookupAliases[slug]?.[block.cell]||[]),routeForCell(slug,block.cell)?.title,block.code,explanationText(notebookExplanations[slug]?.[block.cell])].join(' '));
   if(!needle||haystack.includes(needle))results.push({slug,filename:source.filename,cell:block.cell,guide,location});
  }
 }
 return results;
}
export function companionCell(hash,source) {
 const match=hash.match(/^#cell-(\d+)$/);
 return match&&source.blocks.some(b=>b.cell===Number(match[1]))?Number(match[1]):null;
}
export function usesCompanion(hash) {return !hash||hash==='#overview'||/^#cell-\d+$/.test(hash);}
