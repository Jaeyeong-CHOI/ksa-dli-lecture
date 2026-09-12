import {buildLessonSteps} from './lesson-steps.mjs';
export function readerSections(note, source) {
 const {sectionBlocks,extraBlocks} = buildLessonSteps(note,source);
 // Keep every source cell once. Supporting cells stay near their source neighbors,
 // so a trailing restore/diagnostic cell never becomes the first suggested action.
 for(const block of extraBlocks) {
  let closest=-1,index=0;
  for(let i=0;i<sectionBlocks.length;i++)for(const assigned of sectionBlocks[i])if(assigned.cell<block.cell&&assigned.cell>closest){closest=assigned.cell;index=i;}
  sectionBlocks[index].push(block);
 }
 return sectionBlocks.map(blocks=>blocks.sort((a,b)=>a.cell-b.cell));
}
export const conceptLabels = {
 '00-jupyterlab':['셀과 커널','언어 설정','입력받기','문자열과 숫자'],
 '01-microservices':['마이크로서비스','실행 환경','주소와 요청','웹 화면과 모델'],
 '02-llms':['모델과 클라이언트','모델 조회·호출','응답과 스트리밍','ChatNVIDIA'],
 '03-langchain-intro':['체인 연결','입출력 자료형','시 바꾸기','원격 체인'],
 '04-running-state':['대화 상태','정보 추출','예약 조회','상태와 조회 연결'],
 '05-documents':['문서 읽기','청킹','요약 구조','누적 요약'],
 '06-embeddings':['임베딩','질문과 문서','유사도','긴 문서 비교'],
 '07-vectorstores':['검색과 생성','검색 결과 배치','인덱스 만들기','RAG 체인','저장·불러오기'],
 '08-evaluation':['평가 기준','검색·생성 분리','질문·답변 비교','점수 해석','근거 없는 질문'],
 '09-langserve':['서버와 노트북','API 연결','서버 실행','원격 호출']
};
export function withFullCellCode(sources,full) {
 return Object.fromEntries(Object.entries(sources).map(([slug,source])=>[slug,{...source,blocks:source.blocks.map(b=>({...b,code:[full[slug]?.[b.cell]?.original,full[slug]?.[b.cell]?.complete,b.code].filter(Boolean).join('\n')}))}]));
}
