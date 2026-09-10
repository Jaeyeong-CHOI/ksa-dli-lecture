// Deterministic teaching models, not actual LLM calls or embeddings.
export const visualPlacements = {
  '00-jupyterlab:0': 'kernel',
  '01-microservices:0': 'services',
  '01-microservices:2': 'service-address',
  '02-llms:2': 'streaming',
  '03-langchain-intro:0': 'composition',
  '03-langchain-intro:1': 'chain-types',
  '04-running-state:0': 'state',
  '05-documents:1': 'chunks',
  '06-embeddings:1': 'embeddings',
  '07-vectorstores:3': 'rag',
  '08-evaluation:2': 'evaluation-pairs',
  '09-langserve:0': 'processes',
};

export const serviceExamples = [
  {title:'컨테이너 목록',host:'docker_router',port:8070,path:'/containers',help:'수업 컨테이너 목록을 조회하는 기능입니다. 모델에게 질문하는 경로가 아닙니다.',request:'현재 실행 상태와 이름 등을 조회합니다.',result:'JSON 목록 · 상태와 이름'},
  {title:'모델 목록',host:'llm_client',port:9000,path:'/v1/models',help:'사용할 수 있는 모델 ID 목록을 조회하는 기능입니다. 답변 생성은 별도의 요청입니다.',request:'호출할 수 있는 모델 이름을 조회합니다.',result:'JSON · data 안의 모델 목록'},
  {title:'웹 화면',host:'frontend',port:8090,path:'/',help:'브라우저에 보여 줄 웹 화면을 요청하는 경로입니다.',request:'웹 화면을 구성할 문서를 요청합니다.',result:'HTML · 웹 화면 문서'},
];
export const streamParts = ['문서를 ', '검색해 ', '근거를 ', '읽습니다.'];

export function compositionResult(input, mode) {
  return mode === 'sequence' ? (input + 2) * 10 : {plus: input + 2, times: input * 10};
}

export const chunkText = '문서를작은조각으로나눕니다.겹치는부분은앞뒤문맥을이어줍니다.검색된조각을읽고질문에답합니다.';
export function splitForDemo(text, size, overlap) {
  if (!Number.isInteger(size) || !Number.isInteger(overlap) || size <= 0 || overlap < 0 || overlap >= size) throw new RangeError('Invalid chunk settings');
  const characters = Array.from(text), chunks = [];
  for (let start = 0; start < characters.length; start += size - overlap) {
    const end = Math.min(start + size, characters.length);
    chunks.push({start, end, text: characters.slice(start, end).join('')});
    if (end === characters.length) break;
  }
  return chunks;
}

export const embeddingDocuments = [
  {id: 'rag', title: 'RAG', vector: [0.95, 0.15]},
  {id: 'search', title: '벡터 검색', vector: [0.78, 0.34]},
  {id: 'jupyter', title: 'JupyterLab', vector: [0.18, 0.83]},
  {id: 'kernel', title: '커널', vector: [0.05, 0.99]},
];
export const embeddingQueries = [
  {title: '문서로 답하기', text: '문서를 검색해서 답하고 싶어요.', vector: [0.92, 0.22]},
  {title: '셀 실행하기', text: '셀 실행 순서가 궁금해요.', vector: [0.15, 0.94]},
];
export function cosineSimilarity(a, b) {
  const denominator = Math.hypot(...a) * Math.hypot(...b);
  return denominator ? a.reduce((sum, value, i) => sum + value * b[i], 0) / denominator : 0;
}
export function rankDemoDocuments(query) {
  return embeddingDocuments.map(document => ({...document, score: cosineSimilarity(query.vector, document.vector)})).sort((a, b) => b.score - a.score);
}

export const ragExamples = [
  {
    title: 'RAG와 학습',
    question: 'RAG는 모델을 다시 학습하나요?',
    history: '사용자: RAG가 궁금해요.',
    documents: [
      {title: 'RAG의 역할', text: '일반적인 RAG는 검색한 문서를 입력 문맥에 추가합니다. 모델 가중치는 그대로입니다.'},
      {title: '모델 학습', text: '학습은 손실을 계산하고 파라미터를 갱신하는 과정입니다.'},
    ],
    answer: '일반적인 RAG는 모델을 다시 학습하지 않습니다. 검색한 자료를 문맥에 추가하고, 모델 가중치는 그대로 사용합니다.',
  },
  {
    title: '임베딩과 검색',
    question: '검색할 때 왜 같은 임베딩 구성을 써야 하나요?',
    history: '사용자: 문서 인덱스를 만들었어요.',
    documents: [
      {title: '임베딩 구성', text: '문서 인덱스를 만들 때와 질문을 검색할 때는 호환되는 동일 임베딩 구성을 사용해야 합니다.'},
      {title: '벡터 비교', text: '서로 호환되지 않는 벡터 공간에서는 질문과 문서의 유사도를 올바르게 비교할 수 없습니다.'},
    ],
    answer: '질문과 문서를 같은 벡터 공간에서 비교해야 하기 때문입니다. 인덱스를 만들 때와 검색할 때 동일한 임베딩 구성을 유지합니다.',
  },
];
