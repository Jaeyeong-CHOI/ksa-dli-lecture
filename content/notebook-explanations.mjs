// Explanations of the displayed course cells, not replacement notebook code.
// Reference links describe the underlying syntax/algorithm, not a required SDK upgrade.
export const explanationReferences = {
 python: ['Python · 함수와 제어 흐름', 'https://docs.python.org/3/tutorial/controlflow.html'],
 data: ['Python · 리스트와 딕셔너리', 'https://docs.python.org/3/tutorial/datastructures.html'],
 generator: ['Python · 제너레이터', 'https://docs.python.org/3/tutorial/classes.html#generators'],
 partial: ['Python · functools.partial', 'https://docs.python.org/3/library/functools.html#functools.partial'],
 itemgetter: ['Python · itemgetter', 'https://docs.python.org/3/library/operator.html#operator.itemgetter'],
 regex: ['Python · 정규식', 'https://docs.python.org/3/library/re.html#re.match'],
 requests: ['Requests · 요청과 응답', 'https://requests.readthedocs.io/en/latest/user/quickstart/'],
 sequence: ['LangChain · RunnableSequence', 'https://reference.langchain.com/python/langchain-core/runnables/base/RunnableSequence'],
 parallel: ['LangChain · RunnableParallel', 'https://reference.langchain.com/python/langchain-core/runnables/base/RunnableParallel'],
 assign: ['LangChain · RunnableAssign', 'https://reference.langchain.com/python/langchain-core/runnables/passthrough/RunnableAssign'],
 schema: ['Pydantic · 모델과 검증', 'https://docs.pydantic.dev/latest/concepts/models/'],
 nvidia: ['LangChain · NVIDIA 통합', 'https://docs.langchain.com/oss/python/integrations/providers/nvidia'],
 splitter: ['LangChain · 재귀적 텍스트 분할', 'https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter'],
 cosine: ['scikit-learn · cosine_similarity', 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html'],
 faiss: ['FAISS · 거리와 유사도', 'https://github.com/facebookresearch/faiss/wiki/MetricType-and-distances'],
 rag: ['RAG 원논문 · Lewis et al. (2020)', 'https://arxiv.org/abs/2005.11401'],
 middle: ['Lost in the Middle · Liu et al. (2023)', 'https://arxiv.org/abs/2307.03172'],
 reorder: ['LangChain · LongContextReorder 구현', 'https://github.com/langchain-ai/langchain-community/blob/main/libs/community/langchain_community/document_transformers/long_context_reorder.py'],
 judge: ['LLM-as-a-judge · Zheng et al. (2023)', 'https://arxiv.org/abs/2306.05685'],
 serve: ['LangServe · API 연결', 'https://github.com/langchain-ai/langserve#server'],
 magic: ['IPython · writefile', 'https://ipython.readthedocs.io/en/stable/interactive/magics.html#cellmagic-writefile'],
};

export const notebookExplanations = {
 '00-jupyterlab': {
  7: {anchor:'first_name = input', syntax:[
   ['first_name = input(...)', '`=`는 오른쪽 결과를 왼쪽 이름에 저장합니다. input은 Enter를 누를 때까지 기다리고, 입력한 숫자도 문자열로 돌려줍니다. 이 이름은 커널에 남아 뒤의 셀 9에서도 first_name으로 읽을 수 있습니다.'],
   ['f"Hello {first_name}\\n"', '앞의 f는 문자열 안의 {변수}를 실제 값으로 채우라는 뜻입니다. \\n은 화면에서 줄바꿈이 됩니다.'],
   ['SecretStr(getpass(...))', '안쪽 getpass가 입력을 받은 뒤 바깥 SecretStr가 그 값을 감쌉니다. 표시를 가리는 것이지 값을 암호화하는 것은 아닙니다.']
  ],  refs:['python']},
  9: {anchor:'5 +',syntax:[
   ['"Hello" "World" / 5 + 6', '나란히 놓인 문자열 리터럴은 합쳐져 HelloWorld가 되고, 숫자의 +는 덧셈이어서 11이 됩니다. 따옴표 유무로 자료형을 구분하세요.'],
   ['(...) / .upper()', '괄호 안의 식은 여러 줄로 쓸 수 있습니다. 점 뒤 upper()는 앞 문자열을 대문자로 바꾼 새 문자열을 반환합니다.'],
   ['try / except Exception as e', 'try 안에서 예외가 발생하면 except가 받습니다. 이 셀의 잘못된 식은 오류 메시지를 관찰하기 위한 예시입니다.']
  ],refs:['python']},
 },
 '01-microservices': {
  22: {anchor:'for entry in requests.get',syntax:[
   ['requests.get(...).json()', 'get이 HTTP 응답을 받고 json()이 본문을 Python 자료로 바꿉니다. 이 API는 서비스 정보 딕셔너리들을 담은 리스트를 반환합니다. JSON을 읽었다고 HTTP 요청 성공까지 보장되는 것은 아닙니다.'],
   ['for entry in ...', '리스트에서 서비스 하나를 꺼낼 때마다 entry에 담습니다. 들여쓴 줄이 그 서비스에 대해 수행할 작업입니다.'],
   ['entry.get("status") == "running"', 'get은 키의 값을 읽고, ==는 같은지 비교합니다. if 조건이 참인 서비스의 name만 출력합니다. status 키가 없으면 get은 None을 돌려줍니다.']
  ],refs:['requests','data']},
 },
 '02-llms': {
  21: {anchor:'payload = {',syntax:[
   ['payload = {...}', '중괄호는 키와 값의 묶음인 딕셔너리입니다. model은 모델 이름, messages는 보낼 대화 목록입니다. 아직 데이터를 만들었을 뿐 요청을 전송한 것은 아닙니다.'],
   ['[{"role":"user","content":...}]', '바깥 []는 메시지 리스트, 안쪽 {}는 메시지 하나입니다. role은 발화 역할이고 content가 실제 질문입니다. 순서대로 대화를 담습니다.'],
   ['temperature / max_tokens / stream', '각각 생성의 무작위성 조절, 출력 토큰 상한, 조각 응답 요청입니다. temperature는 정확도 점수가 아니며 max_tokens는 글자 수가 아닙니다.']
  ],refs:['nvidia']},
  22: {anchor:'response.iter_lines()',syntax:[
   ['json=payload / stream=True', 'json 인자는 딕셔너리를 JSON 본문으로 보냅니다. requests의 stream=True는 응답을 즉시 전부 읽지 않게 합니다. payload의 stream=True는 모델 서버에 조각 응답을 요청하는 별도 설정입니다.'],
   ['entry.decode(...) / json.loads(...)', '네트워크 bytes → 문자열 → Python 딕셔너리 순으로 해석합니다. data: 접두어는 SSE 전송 형식이라 JSON을 읽기 전에 잘라냅니다.'],
   ['.get("delta", {}).get("content") or ""', '변경분 delta 안에서 content를 꺼내고, 없거나 비어 있으면 빈 문자열을 씁니다. print(..., end="")는 조각 사이에 자동 줄바꿈을 넣지 않습니다.']
  ],refs:['requests']},
  28: {anchor:'llm.invoke',syntax:[
   ['ChatNVIDIA(...) / llm.invoke(...)', '앞은 서버를 호출할 클라이언트 객체를 만드는 코드, 뒤는 실제 질문을 보내는 코드입니다. 객체를 만들었다고 모델을 내 컴퓨터에 학습하거나 내려받는 것은 아닙니다.'],
   ['invoke / stream / batch', 'invoke는 한 입력의 결과, stream은 한 입력의 응답 조각들, batch는 여러 입력의 결과 목록을 받는 인터페이스입니다. 모델 자체의 응답은 메시지 객체이므로 텍스트는 보통 .content에서 읽습니다.']
  ],refs:['nvidia','sequence']},
 },
 '03-langchain-intro': {
  9: {anchor:'identity = RunnableLambda',syntax:[
   ['RunnableLambda(lambda x: x)', 'lambda 입력: 식은 이름 없는 짧은 함수입니다. 여기서는 받은 x를 그대로 반환합니다. RunnableLambda는 이 함수를 invoke 등으로 실행하고 체인에 연결할 수 있게 감쌉니다.'],
   ['identity | rprint0', '이 |는 Runnable이 정의한 연결 연산자입니다. 왼쪽의 반환값이 오른쪽 입력이 됩니다. 셸의 파이프나 정수의 비트 OR와 구분하세요. 체인을 만드는 것과 invoke로 실행하는 것도 다릅니다.'],
   ['print(...) 다음 return x', 'print는 관찰용 출력이고 return이 다음 단계로 보내는 값입니다. return x를 빼면 None이 전달되어, 화면에는 정상 출력되어도 체인 값은 사라집니다.'],
   ['partial(print_and_return, preface="1: ")', 'preface 인자만 미리 고정한 함수를 만듭니다. 입력 x는 나중에 체인이 전달합니다. 출력 접두어 1:은 x 자체에 덧붙여 저장되지 않습니다. 따라서 이 셀의 output은 접두어 없는 Welcome Home!입니다.']
  ],refs:['sequence','python','partial']},
  12: {anchor:'rhyme_chain = prompt | chat_llm',syntax:[
   ['("system", ...), ("user", "{input}")', '각 튜플은 역할과 메시지 양식입니다. {input}은 프롬프트의 빈칸이고 invoke에 전달한 딕셔너리의 input 값으로 채웁니다.'],
   ['prompt | chat_llm | StrOutputParser()', '같은 값이 끝까지 흐르는 것이 아니라 단계마다 자료형이 바뀝니다. 파서는 모델 메시지를 문자열로 꺼내므로, 최종 결과에 다시 .content를 붙이지 않습니다.']
  ],refs:['sequence']},
  18: {anchor:'up_and_down = (',syntax:[
   ['isinstance(v, dict) / {key: v}', '이미 딕셔너리면 그대로 통과시키고, 문자열이면 지정한 키로 감쌉니다. 이 RInput 덕분에 셀 19의 문자열 입력도 같은 흐름을 따릅니다.'],
   ['itemgetter("input")', '나중에 받은 딕셔너리에서 input 값을 꺼내는 함수를 만듭니다. lambda d: d["input"]처럼 생각하면 됩니다. 키가 없다면 KeyError가 납니다.'],
   ['| {"word1": ..., "word2": ..., "words": ...}', 'LCEL 연결 안의 딕셔너리는 병렬 분기로 바뀝니다. 세 함수가 모두 같은 문자열을 받습니다. word2가 word1의 결과를 받는 구조가 아닙니다. 일반 딕셔너리만 따로 선언하면 자동 실행되지는 않습니다.'],
   ['x.split()[0] / x.split()[1]', '공백으로 단어를 나눈 리스트의 첫째·둘째 항목입니다. Python 인덱스는 0부터 시작합니다. Hello World를 넣으면 word1=Hello, word2=World가 됩니다. 뒤에서 word1만 꺼내 대문자로 바꾸므로 마지막 결과는 {"output": "HELLO"}입니다. 한 단어만 넣으면 둘째 항목에서 오류가 납니다.']
  ],refs:['parallel','itemgetter']},
  22: {anchor:'for token in chain2.stream',syntax:[
   ['def ... / yield', 'yield가 있는 함수는 결과를 하나씩 내보내는 제너레이터입니다. return처럼 함수 전체를 끝내지 않고, 다음 반복에서 이어서 진행합니다.'],
   ['chain2.stream({"input": first_poem, "topic": message})', 'input에는 첫 시를, topic에는 사용자의 새 주제를 넣습니다. 같은 이름의 message라도 여기서는 시 원문이 아니라 바꿀 주제입니다.'],
   ['buffer += token / buffer if return_buffer else token', '+=는 지금까지의 글에 새 조각을 이어 붙입니다. 조건식은 누적 답변 전체와 이번 조각 중 무엇을 UI에 보낼지 고릅니다. 누적 문자열을 다시 이어 붙이면 앞부분이 중복됩니다.']
  ],refs:['generator']},
 },
 '04-running-state': {
  11: {anchor:"RunnableAssign({'generation'",syntax:[
   ['{...} / RunnableAssign({...})', '일반 병렬 매핑은 지정한 키들로 새 결과를 만듭니다. Assign은 입력 딕셔너리에 계산한 키를 합쳐 돌려주며, 같은 키가 있으면 새 값이 우선합니다. 이 셀의 첫 매핑은 input·topic만 반환하므로 원래 입력의 options 키는 빠지고, 뒤의 Assign은 input·topic을 남긴 채 generation을 더합니다.'],
   ['generation 다음 combination', 'combination 프롬프트가 generation 값을 읽으므로 Assign 두 개를 |로 순서대로 연결합니다. 한 Assign 안의 형제 분기는 서로의 새 결과를 기다리지 않습니다.']
  ],algorithm:{title:'상태 갱신 = 정보를 버리지 않고 단계마다 확장하기',text:'이 셀은 입력 문장을 보존하면서 분류 결과 topic, 새 문장 generation, 결합 문장 combination을 차례로 추가합니다. state는 대화를 저장하는 마법 기능이 아니라 Python 값의 묶음입니다. 다음 호출에도 쓸 값은 반환된 상태를 변수에 보관해야 합니다.',refs:['assign']},refs:['parallel','assign']},
  17: {anchor:'class KnowledgeBase(BaseModel)',syntax:[
   ['class KnowledgeBase(BaseModel)', 'BaseModel을 상속한 자료 양식을 정의합니다. KnowledgeBase는 양식이고 KnowledgeBase(topic="Travel")은 그 양식에 값을 채운 객체입니다.'],
   ['topic: str = Field(...)', ': str은 기대하는 자료형, Field의 첫 값은 기본값, description은 항목 설명입니다. 일반 Python의 타입 힌트만으로는 검사되지 않지만 이 클래스에서는 Pydantic이 자료형과 제약을 검증합니다.'],
   ['Dict[str, Union[str, int]]', '키는 문자열, 값은 문자열 또는 정수인 딕셔너리라는 뜻입니다. 예를 들면 {"seat": "window", "bags": 1}처럼 서로 다른 값의 형식을 허용합니다.']
  ],refs:['schema']},
  22: {anchor:'def RExtract',syntax:[
   ['get_format_instructions()', '모델에 어떤 필드와 형식으로 답할지 설명할 문자열을 만듭니다. 아직 내용을 추출하거나 답을 검증한 결과는 아닙니다.'],
   ['prompt | llm | preparse | parser', '질문 양식 채우기 → 문자열 생성 → 단순 문자열 보정 → 정해진 자료형으로 파싱하는 순서입니다. preparse의 괄호 보완만으로 모든 JSON 오류가 해결되지는 않습니다.']
  ],algorithm:{title:'구조화 추출은 형식 검사와 사실 확인을 나눠 보기',text:'예를 들어 이름을 잘못 추측해도 문자열이면 자료형 검사를 통과할 수 있습니다. 파싱 성공은 대화 내용과 일치한다는 보장이 아닙니다. 새 메시지와 이전 상태를 함께 주는 이유는 이미 받은 값을 유지하면서 확인된 정보만 갱신하기 위해서입니다.',refs:['schema']},refs:['schema']},
  30: {anchor:'def get_flight_info',syntax:[
   ['def get_flight_info(d: dict) -> str', 'd는 입력 딕셔너리, -> str은 문자열을 반환한다는 타입 힌트입니다. 함수 이름만 쓰면 함수 자체이고 괄호에 값을 넣어야 호출합니다.'],
   ['"|".join(...) / str(...)', '이름·성·예약번호를 구분자로 연결해 조회 키를 만듭니다. join은 문자열들을 받으므로 숫자 예약번호를 str로 바꿉니다.'],
   ['{k: v for k, v in zip(keys, l)}', 'zip이 같은 위치의 키와 값을 짝짓고 딕셔너리 컴프리헨션이 항목을 만듭니다. 뒤의 db.get은 정확히 같은 키를 찾습니다. 의미 유사도 검색이나 실제 항공사 DB 연결은 아닙니다.']
  ],refs:['data']},
  38: {anchor:"internal_chain =",syntax:[
   ['lambda state: state["know_base"]', '전체 상태에서 지식 객체 하나만 꺼냅니다. 뒤의 get_key_fn은 이 객체를 예약 조회 함수가 받는 딕셔너리로 바꿉니다.'],
   ['RunnableAssign({"know_base": ...}) | RunnableAssign({"context": ...})', '먼저 추출한 know_base를 새 상태에 넣고, 그 상태로 실제 조회를 합니다. 두 수정을 한 병렬 매핑으로 합치면 갱신 전 정보를 조회할 수 있습니다.']
  ],refs:['assign']},
 },
 '05-documents': {
  8: {anchor:'PyMuPDFLoader',syntax:[
   ['PyMuPDFLoader(...).load()', '파일 위치로 로더를 만들고 load()로 Document 목록을 읽습니다. PDF를 읽는 단계이지 임베딩 생성이나 요약 요청은 아닙니다.'],
   ['try / except', '수정본은 랩에 저장된 PDF를 먼저 읽고, 그 경로가 실패하면 논문 로더로 넘어갑니다. 파일을 읽었다면 뒤의 .page_content가 본문이고 .metadata가 출처 정보입니다.']
  ],refs:['python']},
  15: {anchor:'chunk_size=1200',syntax:[
   ['chunk_size=1200 / chunk_overlap=100', '이 설정은 기본 길이 함수 len을 사용하므로 토큰이 아니라 문자열 길이 기준입니다. 100은 인접 청크가 겹치도록 시도할 길이이며 모든 경계가 정확히 100자 겹친다는 뜻은 아닙니다.'],
   ['separators=[..., ""]', '큰 문단 경계부터 작은 경계로 내려가며 나눕니다. 마지막 빈 문자열은 더 작은 문자 단위까지 나눌 수 있는 최후의 기준입니다. split_documents는 본문을 나누면서 출처 메타데이터도 붙여 줍니다.']
  ],algorithm:{title:'재귀적 청킹: 문맥을 지키면서 작게 나누기',text:'긴 문서를 처음부터 1200자씩 무조건 자르지 않고 문단·문장 등의 경계를 우선합니다. 조각이 너무 크면 더 작은 구분자로 다시 나누고, 가능한 작은 조각들을 길이 범위 안에서 합칩니다. overlap은 경계의 정보 손실을 줄이지만 저장·검색할 텍스트도 늘립니다. 의미를 이해해 자르는 모델 기반 알고리즘은 아닙니다.',refs:['splitter']},refs:['splitter']},
  23: {anchor:'def RSummarizer',syntax:[
   ['def summarize_docs(docs)', '함수 안에서 함수를 정의합니다. 안쪽 함수는 바깥에서 받은 knowledge·llm·prompt를 기억하며, 반환된 RunnableLambda가 나중에 docs를 받아 실행합니다.'],
   ['for i, doc in enumerate(docs)', 'enumerate가 0부터의 순번과 문서를 함께 줍니다. doc.page_content를 이번 입력으로 넣고 parse_chain의 반환값으로 state를 갱신합니다.'],
   ['knowledge.__class__ / latest_summary', '앞은 객체의 양식 클래스를 가리킵니다. latest_summary는 이 코드가 마지막 완성 요약을 따로 기록하는 변수이며, 실패한 청크까지 처리했다는 뜻은 아닙니다.']
  ],algorithm:{title:'누적 요약: 이전 메모 + 새 청크 → 다음 메모',text:'각 반복은 이전 요약 S와 새 문서 조각 C를 받아 다음 요약을 만듭니다. 뒤의 요약이 앞의 결과에 의존하므로 이 반복을 단순 병렬 처리로 바꾸면 같은 알고리즘이 아닙니다. 이 코드의 docs_split[:15]는 첫 15개만 처리합니다. 요약은 압축 과정이라 세부 정보가 빠지거나 앞선 오류가 누적될 수 있으므로 원문 출처를 함께 보관합니다.',formula:'S₀ = 빈 요약 양식   ·   Sᵢ = 요약 모델(Sᵢ₋₁, Cᵢ)',refs:['assign']},refs:['python']},
 },
 '06-embeddings': {
  11: {anchor:'q_embeddings = [',syntax:[
   ['[embedder.embed_query(query) for query in queries]', '리스트 컴프리헨션입니다. queries에서 query를 하나씩 꺼내 벡터로 바꾸고 같은 순서의 리스트에 담습니다. 이 문법 자체가 병렬 실행을 의미하지는 않습니다.'],
   ['embed_query / embed_documents', '질문 하나와 검색 후보 문서 목록을 각각 인코딩하는 인터페이스입니다. 검색용 모델은 질문과 문서의 역할을 다르게 처리할 수 있어, 같은 문자열이라고 두 호출의 벡터가 같다고 가정하면 안 됩니다.']
  ],refs:['data','nvidia']},
  13: {anchor:'cosine_similarity',syntax:[
   ['cosine_similarity(emb1, emb2)', '첫 입력이 질문 Q개, 둘째가 문서 D개라면 결과는 Q행 × D열입니다. [i, j]는 i번째 질문과 j번째 문서의 점수입니다.'],
   ['invert_yaxis()', '그림의 위아래 표시 방향만 뒤집습니다. 행렬을 전치하거나 질문과 문서의 역할을 바꾸는 연산은 아닙니다.']
  ],algorithm:{title:'코사인 유사도: 벡터 길이보다 방향 비교하기',text:'각 위치의 숫자를 곱해 더한 내적을 두 벡터의 길이로 나눕니다. 0이 아닌 벡터가 같은 방향이면 1, 직각이면 0, 반대면 −1입니다. 이 셀의 q_embeddings와 d_embeddings는 실제 임베딩 결과이며, 각 행에 문장 하나의 벡터가 들어갑니다. 점수가 높아도 장소·날짜 등 질문의 세부 조건을 만족하는지는 본문으로 확인해야 합니다.',formula:'cos(q, d) = (q · d) / (‖q‖ × ‖d‖)',refs:['cosine']},refs:['cosine']},
  19: {anchor:'longer_docs_cut =',syntax:[
   ['doc[:2048]', '시작부터 2048번째 위치 직전까지만 남기는 슬라이스입니다. 2048 토큰이 아니라 최대 2048 문자입니다. 질문의 근거가 뒤에 있다면 잘라내는 순간 사라질 수 있습니다.'],
   ['q_long_embs / d_long_embs', '같은 잘린 문서를 질문 방식과 문서 방식으로 인코딩해 비교합니다. 두 방식의 그림을 비교할 때 문장 목록과 순서를 같게 유지해야 인코딩 방식의 차이를 볼 수 있습니다.']
  ],refs:['data']},
 },
 '07-vectorstores': {
  20: {anchor:'NVIDIARerank',syntax:[
   ['retriever.invoke(rerank_query)', '벡터 검색으로 후보 Document들을 먼저 가져옵니다. 후보 추출 단계에서 빠진 문서는 뒤의 리랭커가 되살려 주지 않습니다.'],
   ['compress_documents / relevance_score', '질문과 후보를 함께 비교해 관련성이 높은 순서로 돌려줍니다. 이 이름의 compress는 반드시 문장을 요약한다는 의미가 아닙니다. 점수도 정답 확률이 아닙니다.']
  ],algorithm:{title:'리랭킹과 문서 재배치는 서로 다른 작업',text:'리랭킹은 질문과 후보의 관련성을 다시 판단합니다. 다음 셀의 LongContextReorder는 이미 받은 순서를 바탕으로 중요한 후보를 앞·뒤에 배치하는 도구입니다. 새 관련성 점수를 계산하지 않습니다. 긴 문맥의 중간 정보를 모델이 덜 활용할 수 있다는 연구가 배경이며, 재배치 자체가 답변 개선을 보장하지는 않습니다.',refs:['nvidia','reorder','middle']},refs:['nvidia']},
  22: {anchor:'def docs2str',syntax:[
   ['getattr(doc, "metadata", {})', '객체에 metadata 속성이 있으면 읽고 없으면 빈 딕셔너리를 씁니다. 뒤의 .get("Title", title)은 그 안에서 제목 키를 읽습니다. 속성과 딕셔너리 키는 구별합니다.'],
   ['for doc in docs / out_str += ...', '검색된 문서들을 돌면서 제목과 본문을 한 문자열로 이어 붙입니다. 모델이 Document 객체 자체를 읽는 대신 이 문맥 텍스트를 받는 것입니다. 출처 제목도 함께 넘겨야 답변에서 인용할 수 있습니다.']
  ],refs:['python']},
  34: {anchor:'docs_chunks',syntax:[
   ['.batch(...) / max_concurrency', '여러 문서 입력을 처리하고 결과 목록을 받습니다. 동시 실행 수를 제한하는 설정은 문서 내용이나 검색 기준을 바꾸지 않습니다.'],
   ['docs_chunks / extra_chunks', '앞은 문서별 청크를 담은 중첩 리스트이고 뒤는 문서 목록 같은 보조 텍스트입니다. 다음 셀에서 각각 임베딩해 저장합니다.'],
   ['chunk_size / separators', '05번과 같은 문자 기반 분할입니다. 이 셀의 구분자 목록에는 마지막 빈 문자열이 없으므로, 구분자가 전혀 없는 긴 덩어리는 설정 길이보다 클 수 있습니다.']
  ],refs:['splitter','sequence']},
  38: {anchor:'IndexFlatL2(embed_dims)',syntax:[
   ['len(embedder.embed_query("test"))', '문자열 길이가 아니라 만들어진 벡터의 원소 개수를 읽어 인덱스 차원을 정합니다. 모든 저장 벡터와 검색 벡터가 같은 차원·같은 임베딩 공간을 사용해야 합니다.'],
   ['IndexFlatL2 / normalize_L2=False', '이 셀은 저장된 벡터 전체와의 제곱 L2 거리를 계산하는 정확 검색 인덱스입니다. FAISS를 썼다는 이유만으로 근사 검색(ANN)이나 코사인 검색이라고 부르면 안 됩니다.'],
   ['agg_vstore.merge_from(vstore)', '문서 저장소와 벡터·문서 연결 정보를 합칩니다. 문장들을 평균내거나 새 모델을 학습하는 작업은 아닙니다.']
  ],algorithm:{title:'제곱 L2 거리: 숫자 좌표가 가까운 문서 찾기',text:'좌표 차이를 제곱해 더하며 값이 작을수록 가깝습니다. Flat 인덱스는 질문 하나에 대략 문서 수 N × 차원 D만큼 비교하므로, 자료가 커지면 검색 비용도 증가합니다. 벡터를 길이 1로 정규화한 경우에만 제곱 L2 = 2 − 2 × 코사인 유사도로 순위를 연결할 수 있습니다. 이 셀은 자동 정규화를 끈 설정입니다.',formula:'L2²(q, d) = Σ(qᵢ − dᵢ)²   ·   작은 값부터 선택',refs:['faiss']},refs:['faiss']},
  40: {anchor:'retrieval_chain =',syntax:[
   ['{"input": lambda x: x}', '사용자 질문을 input 키에 보존합니다. 뒤의 검색 함수에는 itemgetter("input")으로 질문 문자열만 꺼내 전달합니다.'],
   ['history / context', 'history는 대화 기록에서, context는 논문 인덱스에서 찾은 내용입니다. 둘을 같은 출처로 취급하지 않고 각각 프롬프트 빈칸에 넣습니다.'],
   ['retrieval_chain | stream_chain', '검색 단계는 상태를 채우고 생성 단계는 그 상태로 답변을 만듭니다. 검색 결과가 비어 있거나 질문과 무관하면 프롬프트 연결만 정상이어도 답변 근거가 부족합니다.']
  ],algorithm:{title:'RAG: 모델을 다시 학습시키지 않고 근거를 먼저 제공하기',text:'질문을 임베딩해 관련 청크를 고르고, 그 본문과 질문을 프롬프트에 함께 넣어 답변합니다. 검색이 놓친 사실은 생성 모델이 근거 있게 설명하기 어렵습니다. 후보 수를 늘리면 근거를 더 찾을 수 있지만 불필요한 내용과 문맥 길이도 늘어납니다. 원논문은 학습 가능한 검색·생성 결합을 연구하며, 이 실습은 고정된 검색기와 프롬프트를 연결하는 간단한 RAG 파이프라인입니다.',refs:['rag']},refs:['rag','itemgetter']},
  44: {anchor:'docstore.save_local',syntax:[
   ['docstore.save_local("docstore_index")', '커널 메모리에 있던 벡터 인덱스와 문서·ID 정보를 파일로 남깁니다. 변수 자체가 다른 노트북이나 서버 프로세스로 넘어가는 것은 아닙니다.'],
   ['!tar czvf ...', '!는 노트북에서 셸 명령을 실행한다는 표시입니다. tar는 폴더를 압축할 뿐, 새 임베딩을 만들거나 검색 품질을 높이지 않습니다. 09번 서버는 저장한 폴더를 다시 읽습니다.']
  ],refs:['magic']},
 },
 '08-evaluation': {
  11: {anchor:'synth_questions = []',syntax:[
   ['"".join((simple_prompt | llm).stream(...))', '문자열 응답 조각을 끝까지 받아 하나로 합칩니다. 빈 구분자를 쓰므로 조각 사이에 공백을 추가하지 않습니다. 이 코드의 llm은 문자열 파서까지 연결되어 있습니다.'],
   ['re.search(...) / .append(...)', '생성한 글에서 질문과 답변의 구분을 찾아 각각 목록에 넣습니다. 질문 i와 참고 답변 i가 같은 쌍이어야 합니다. 이 참고 답변은 모델이 만든 합성 데이터이지 검증된 정답지가 아닙니다.']
  ],refs:['regex','generator']},
  15: {anchor:'neither answer is guaranteed to be correct',syntax:[
   ['zip(synth_questions, synth_answers, rag_answers)', '세 목록의 같은 위치를 묶어 질문·참고 답변·RAG 답변을 함께 비교합니다. zip은 가장 짧은 목록에서 멈추므로 하나가 빠진 상태로 평가하면 일부 질문이 제외됩니다.'],
   ['[1] / [2]', '현재 표시된 랩 검수본에서는 답변 2가 더 좋을 때만 [2], 답변 1이 더 좋거나 비슷할 때 [1]을 고릅니다. 합성 답변 1도 틀릴 수 있다는 조건을 프롬프트가 명시합니다.']
  ],algorithm:{title:'LLM-as-a-judge: 사실 정확도 대신 비교 선호를 측정하기',text:'질문과 두 답변을 심사 모델에 주어 선택과 이유를 받습니다. 답변 길이·제시 순서 등에 편향이 있을 수 있어 숫자만 보지 말고 판정 이유와 실제 근거를 함께 읽습니다. 아래 논문은 이 평가 방식의 한계를 이해하기 위한 자료이며 실습이 MT-bench를 그대로 구현한 것은 아닙니다. 이 비교 결과는 최종 인증서 평가의 통과 점수가 아닙니다.',refs:['judge']},refs:['data','judge']},
  17: {anchor:'def selected_answer',syntax:[
   ['re.match(r"\\s*\\[(1|2)\\]", text)', '문자열 시작에서 공백을 허용한 뒤 [1] 또는 [2]를 찾습니다. r은 역슬래시를 그대로 쓰는 문자열 표기, (1|2)는 두 숫자 중 하나를 잡는 그룹입니다.'],
   ['match.group(1) / raise ValueError', '선택된 숫자를 꺼냅니다. 시작 형식이 없으면 예외를 내므로 잘못된 응답을 조용히 0점으로 합산하지 않습니다. 설명 중간의 [2]만 보고 선택을 세는 것과도 다릅니다.'],
   ['sum(... == "2" for score in pref_score) / len(pref_score)', '각 비교의 참·거짓을 1·0으로 합쳐 전체 판단 수로 나눕니다. pref_score는 원문 목록으로 남기고 집계값은 preference_score에 둡니다.']
  ],refs:['regex']},
 },
 '09-langserve': {
  4: {anchor:'async def astream_model',syntax:[
   ['%%writefile server_app.py', '셀 전체를 파일로 쓰는 IPython 명령입니다. 아래 def나 add_routes가 노트북에서 바로 실행되는 것은 아닙니다. 셀 5에서 파일을 실행할 때 정의와 연결이 실제로 수행됩니다.'],
   ['yield from / async def / async for', 'yield from은 다른 스트림의 조각을 이어 전달합니다. async def로 정의한 비동기 제너레이터는 async for로 응답을 기다리며 조각을 전달합니다. 동기·비동기 경로를 함께 제공해 서버의 호출 방식에 맞춥니다.'],
   ['RunnableLambda(stream_model, afunc=astream_model)', '함수를 지금 호출하는 stream_model(...)이 아니라 함수 자체를 전달합니다. Runnable이 실행될 때 해당 입력으로 동기 또는 비동기 함수를 호출합니다.'],
   ['add_routes(..., path="/retriever")', '검색 Runnable을 HTTP API에 연결합니다. /retriever/invoke는 질문을 받아 문서 목록을 반환하고, /generator/invoke는 input·context를 받아 답변을 생성합니다. generator가 스스로 검색하는 구조는 아닙니다.']
  ],algorithm:{title:'검색과 생성 API를 분리한 이유',text:'프론트엔드가 먼저 질문으로 검색 API를 호출하고, 돌려받은 문서를 문맥으로 만든 뒤 생성 API에 전달합니다. 따라서 화면이 열린 것만으로 두 기능이 완성된 것은 아닙니다. 서버는 별도 프로세스이므로 07번 변수 대신 저장된 docstore_index를 읽고, 파일을 수정한 뒤에는 실행 중인 서버도 다시 시작해야 새 코드가 적용됩니다.',refs:['serve']},refs:['serve','generator','magic']},
  5: {anchor:'!python server_app.py',syntax:[
   ['!python server_app.py', '원본 실행 셀에서 Shift+Enter를 누르면 셸이 Python 서버 프로세스를 시작합니다. 별도 Terminal에 같은 명령을 중복 실행하지 않습니다.'],
   ['if __name__ == "__main__"', '파일을 직접 실행했을 때 Uvicorn을 켜는 조건입니다. 서버가 요청을 기다리는 동안 셀의 [*]가 유지될 수 있으며, 파일 작성 완료와 서버 시작 완료는 다른 상태입니다.']
  ],refs:['magic','serve']},
 },
};

export function explanationText(entry) {
 if (!entry) return '';
 const a=entry.algorithm;
 const refs=[...new Set([...(entry.refs||[]),...(a?.refs||[])])];
 return [
  ...entry.syntax.map(([code,text])=>code+' — '+text),
  a && [a.title,a.text,a.formula].filter(Boolean).join('\n'),
  ...refs.map(id=>explanationReferences[id].join(' · ')),
 ].filter(Boolean).join('\n');
}
