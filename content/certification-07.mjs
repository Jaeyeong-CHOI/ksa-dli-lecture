// Self-contained 07 notebook preparation for the supplied DLI lab.
export const certification07Code = {
  env07: String.raw`# Get Certification · 07 · 원본 셀 4 · 환경 확인
from pathlib import Path
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, ChatNVIDIA
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

work_dir = Path.cwd()
print("작업 폴더:", work_dir)
for name in ("07_vectorstores.ipynb", "08_evaluation.ipynb", "09_langserve.ipynb"):
    if not (work_dir / name).is_file():
        raise FileNotFoundError(f"{name}이 보이지 않습니다. 수업 노트북들이 있는 폴더에서 실행하세요.")

embedder = NVIDIAEmbeddings(
    model="course/embedding", base_url="http://llm_client:9000/v1"
)
probe_vector = embedder.embed_query("retrieval augmented generation")
assert len(probe_vector) > 0, "임베딩 응답이 비어 있습니다. 수업 서비스 상태를 확인하세요."
print("임베딩 연결 OK · 벡터 차원:", len(probe_vector))

instruct_llm = ChatNVIDIA(
    model="nvidia/nemotron-3.5-lightning-30b-a3b",
    base_url="http://llm_client:9000/v1",
    timeout=300,
    model_kwargs={"chat_template_kwargs": {"enable_thinking": False}},
)
reply = instruct_llm.invoke("Reply with one short greeting.")
assert reply.content, "모델 응답이 비어 있습니다."
print("대화 모델 연결 OK:", reply.content)
print("07 셀 4 완료 · Part 3의 Task 1 코드 셀(원본 셀 34)로 이동하세요.")`,
  papers07: String.raw`# Get Certification · 07 · 원본 셀 34 · 실제 논문 읽기와 청킹
# 같은 07번 노트북에서 원본 셀 4를 교체·실행한 뒤 사용합니다.
import re
from urllib.request import Request, urlopen

paper_id = "2210.03629v3"
paper_title = "ReAct: Synergizing Reasoning and Acting in Language Models"
paper_url = "https://arxiv.org/pdf/" + paper_id
cache_dir = work_dir / "cached_papers"
cache_dir.mkdir(exist_ok=True)
paper_path = cache_dir / (paper_id + ".pdf")

if not paper_path.is_file():
    print("수업 캐시가 없어 ReAct 논문 PDF를 내려받습니다.")
    request = Request(paper_url, headers={"User-Agent": "DLI-Learning-Notebook/1.0"})
    try:
        with urlopen(request, timeout=60) as response:
            pdf_bytes = response.read(30 * 1024 * 1024 + 1)
    except Exception as error:
        raise RuntimeError("논문 다운로드 실패. 이 페이지의 'arXiv 다운로드 오류' 안내를 확인하세요.") from error
    if len(pdf_bytes) > 30 * 1024 * 1024 or not pdf_bytes.startswith(b"%PDF-"):
        raise ValueError("정상 PDF를 받지 못했습니다. 아직 파일을 저장하지 않았습니다.")
    paper_path.write_bytes(pdf_bytes)
else:
    print("수업에 저장된 PDF를 사용합니다:", paper_path.name)

pages = PyMuPDFLoader(str(paper_path)).load()
text = "\n\n".join(page.page_content for page in pages)
# 본문의 References 제목 뒤에 이어지는 참고문헌·부록은 제외합니다.
text = re.split(r"(?im)^\s*(?:\d+\.?\s+)?References\s*$", text, maxsplit=1)[0]
if len(text.strip()) < 1000:
    raise ValueError("논문 본문을 충분히 읽지 못했습니다. PDF 파일을 확인하세요.")

paper = Document(page_content=text, metadata={
    "Title": paper_title, "source": paper_url, "entry_id": paper_id,
})
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200,
    separators=["\n\n", "\n", ".", ";", ",", " ", ""],
)
chunks = [chunk for chunk in splitter.split_documents([paper])
          if len(chunk.page_content.strip()) > 200]
if len(chunks) < 2:
    raise ValueError("실제 문서 조각이 2개 이상 필요합니다. 문서 읽기부터 확인하세요.")
print("읽은 PDF 페이지 수:", len(pages))
print("검색할 문서 조각 수:", len(chunks))
print("첫 조각 미리보기:\n", chunks[0].page_content[:500])
print("07 셀 34 완료 · Task 2 코드 셀(원본 셀 36)로 이동하세요.")`,
  build07: String.raw`# Get Certification · 07 · 원본 셀 36 · Vector Store 생성
# 원본 셀 4 → 34를 이 가이드 코드로 교체·실행한 뒤 사용합니다.
if not chunks:
    raise ValueError("먼저 원본 셀 34의 문서 준비 코드를 실행하세요.")

# 작은 묶음별로 저장소를 만들고 다음 셀에서 하나로 합칩니다.
vecstores = []
batch_size = 16
for start in range(0, len(chunks), batch_size):
    batch = chunks[start:start + batch_size]
    vecstores.append(FAISS.from_documents(batch, embedder))
    print(f"임베딩 완료: {min(start + batch_size, len(chunks))}/{len(chunks)}")

assert sum(len(store.docstore._dict) for store in vecstores) == len(chunks)
print("생성한 Vector Store 수:", len(vecstores))
print("07 셀 36 완료 · 바로 다음 통합 코드 셀(원본 셀 38)로 이동하세요.")`,
  merge07: String.raw`# Get Certification · 07 · 원본 셀 38 · Vector Store 통합
from faiss import IndexFlatL2, clone_index
from langchain_community.docstore.in_memory import InMemoryDocstore

embed_dims = len(embedder.embed_query("test"))
def default_FAISS():
    return FAISS(
        embedding_function=embedder,
        index=IndexFlatL2(embed_dims),
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )

assert vecstores, "먼저 원본 셀 36을 실행하세요."
assert sum(len(store.docstore._dict) for store in vecstores) == len(chunks), "셀 36을 끝까지 다시 실행하세요."
docstore = default_FAISS()
for store in vecstores:
    # 원본 저장소를 보존해 이 셀만 재실행해도 같은 결과를 얻습니다.
    snapshot = FAISS(
        embedding_function=embedder,
        index=clone_index(store.index),
        docstore=InMemoryDocstore(dict(store.docstore._dict)),
        index_to_docstore_id=dict(store.index_to_docstore_id),
    )
    docstore.merge_from(snapshot)

assert len(docstore.docstore._dict) == len(chunks)
hits = docstore.similarity_search("How does ReAct combine reasoning and acting?", k=3)
assert hits and hits[0].page_content.strip(), "검색 결과가 비어 있습니다."
print("통합 문서 조각 수:", len(docstore.docstore._dict))
print("검색된 문서 제목:", hits[0].metadata.get("Title"))
print("검색 내용 미리보기:\n", hits[0].page_content[:500])
print("07 셀 38 완료 · Task 3의 retrieval_chain TODO 셀(원본 셀 40)로 이동하세요.")`,
  rag07: String.raw`# Get Certification · 07 · 원본 셀 40 · RAG Chain 구현
from langchain_community.document_transformers import LongContextReorder
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.runnables.passthrough import RunnableAssign
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter

# 문서 검색과 대화 기록 검색을 서로 다른 저장소로 유지합니다.
convstore = default_FAISS()
reorder = LongContextReorder()
def docs2str(documents):
    return "\n\n".join(
        f"[Source: {doc.metadata.get('Title', 'Conversation')}] {doc.page_content}"
        for doc in reorder.transform_documents(documents)
    )

def get_history(question):
    if not convstore.docstore._dict:
        return "아직 이전 대화가 없습니다."
    return docs2str(convstore.similarity_search(question, k=4))

retrieval_chain = (
    {"input": RunnablePassthrough()}
    | RunnableAssign({"history": itemgetter("input") | RunnableLambda(get_history)})
    | RunnableAssign({"context": itemgetter("input") | docstore.as_retriever(search_kwargs={"k": 4}) | RunnableLambda(docs2str)})
)
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer using only the retrieved documents. If evidence is insufficient, say so. "
     "Cite the source titles you used. Conversation history is context, not factual evidence.\n"
     "Conversation history:\n{history}\nRetrieved documents:\n{context}"),
    ("user", "{input}"),
])
stream_chain = chat_prompt | instruct_llm | StrOutputParser()

def chat_gen(message, history=None, return_buffer=True):
    retrieval = retrieval_chain.invoke(message)
    buffer = ""
    for token in stream_chain.stream(retrieval):
        buffer += token
        yield buffer if return_buffer else token
    if buffer.strip():
        convstore.add_texts([f"User: {message}\nAssistant: {buffer}"])

initial_msg = "ReAct 논문에 대해 질문해 주세요."
test_question = "How does ReAct combine reasoning and acting?"
for response in chat_gen(test_question, return_buffer=False):
    print(response, end="", flush=True)
print("\n07 셀 40 완료 · 답변의 근거를 확인하고 Part 4 저장 셀(원본 셀 44)로 이동하세요.")`,
  save07: String.raw`# Get Certification · 07 · 원본 셀 44 · 저장과 압축
# 원본 셀 40의 RAG 답변까지 확인한 뒤 실행합니다.
from datetime import datetime, timezone
import tarfile

assert len(docstore.docstore._dict) == len(chunks), "원본 셀 36 → 38을 끝까지 다시 실행하세요."
index_dir = work_dir / "docstore_index"
archive = work_dir / "docstore_index.tgz"
stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")

# 예전 결과가 있으면 삭제하지 않고 이름을 바꿔 보관합니다.
for existing in (index_dir, archive):
    if existing.exists():
        backup = existing.with_name(existing.name + ".backup-" + stamp)
        existing.rename(backup)
        print("기존 결과 보관:", backup.name)

docstore.save_local(str(index_dir))
for name in ("index.faiss", "index.pkl"):
    assert (index_dir / name).is_file(), f"저장 실패: {name}"

with tarfile.open(archive, "w:gz") as bundle:
    bundle.add(index_dir, arcname="docstore_index")

print("저장된 인덱스:", index_dir)
print("압축 파일:", archive, "·", archive.stat().st_size, "bytes")
print("07 셀 44 완료 · 바로 다음 불러오기 코드 셀(원본 셀 46)로 이동하세요.")`,
  verify07: String.raw`# Get Certification · 07 · 원본 셀 46 · 저장한 인덱스 확인
from langchain_community.vectorstores import FAISS
from pathlib import Path

# 방금 자신이 생성한 인덱스만 다시 읽습니다.
index_dir = Path.cwd() / "docstore_index"
for name in ("index.faiss", "index.pkl"):
    assert (index_dir / name).is_file(), "먼저 원본 셀 44의 저장 코드를 실행하세요."
new_db = FAISS.load_local(
    str(index_dir), embedder, allow_dangerous_deserialization=True
)
assert len(new_db.docstore._dict) == len(chunks), "다시 읽은 문서 수가 다릅니다."
saved_hits = new_db.similarity_search("How does ReAct combine reasoning and acting?", k=3)
assert saved_hits and saved_hits[0].page_content.strip(), "저장 후 검색 확인에 실패했습니다."
print("저장 후 검색 OK:", saved_hits[0].metadata.get("Title"))
print(saved_hits[0].page_content[:1000])
print("07 셀 46 완료 · 이제 같은 폴더의 08_evaluation.ipynb를 여세요.")`,
};

export const certification07Actions = {
  env07: {notebook:'07_vectorstores.ipynb', cell:4, kind:'replace', find:'from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings', contains:'embedder = NVIDIAEmbeddings(', section:'노트북 상단 · 모델 설정', result:'작업 폴더, 임베딩 연결 OK, 대화 모델 연결 OK, 07 셀 4 완료가 모두 나옵니다.'},
  papers07: {notebook:'07_vectorstores.ipynb', cell:34, kind:'replace', find:'from langchain_nvidia_ai_endpoints import ChatNVIDIA', contains:'paper_ids = [', section:'Part 3 → Task 1: 문서 로딩 및 청킹', result:'PDF 페이지 수, 문서 조각 수, ReAct 논문 본문과 07 셀 34 완료가 나옵니다.'},
  build07: {notebook:'07_vectorstores.ipynb', cell:36, kind:'replace', find:'%%time', contains:'print("Constructing Vector Stores")', section:'Part 3 → Task 2: 문서 Vector Store 구성하기 · 첫 코드 셀', result:'임베딩 완료 수가 전체 조각 수에 도달하고 생성한 Vector Store 수, 07 셀 36 완료가 나옵니다.'},
  merge07: {notebook:'07_vectorstores.ipynb', cell:38, kind:'replace', find:'from faiss import IndexFlatL2', contains:'docstore = aggregate_vstores(vecstores)', section:'Task 2 → 인덱스들을 하나로 합치는 코드 셀', result:'통합 문서 조각 수, 검색 제목과 본문, 07 셀 38 완료가 나옵니다.'},
  rag07: {notebook:'07_vectorstores.ipynb', cell:40, kind:'replace', find:'from langchain_community.document_transformers import LongContextReorder', contains:'## BEGIN TODO: Implement the retrieval chain to make your system work!', section:'Part 3 → Task 3: [실습] RAG Chain 구현하기', result:'ReAct에 대한 RAG 답변과 07 셀 40 완료가 나옵니다. 답변이 실제 논문 근거와 맞는지 확인합니다.'},
  save07: {notebook:'07_vectorstores.ipynb', cell:44, kind:'replace', find:'docstore.save_local("docstore_index")', contains:'!tar czvf docstore_index.tgz docstore_index', section:'Part 4: 평가를 위해 인덱스 저장하기 · 첫 코드 셀', result:'docstore_index 폴더, docstore_index.tgz가 생성되고 07 셀 44 완료가 나옵니다. 바로 다음 불러오기 셀로 갑니다.'},
  verify07: {notebook:'07_vectorstores.ipynb', cell:46, kind:'replace', find:'from langchain_community.vectorstores import FAISS', contains:'new_db = FAISS.load_local(', section:'Part 4 → 저장 셀 바로 다음의 불러오기 코드 셀', result:'저장 후 검색 OK, 실제 문서 내용, 07 셀 46 완료가 나옵니다. 파일을 옮기지 않고 같은 폴더의 08번을 엽니다.'},
};

export const certification07Steps = [
  {id:'start', short:'랩 시작', title:'07번의 기존 코드 셀에서 시작하기', place:'NVIDIA 강좌 → JupyterLab → 07_vectorstores.ipynb', goal:'새 셀을 만들지 않고, 원본의 설정·Task 1~3·저장 코드 셀을 차례로 교체합니다.'},
  {id:'index-setup', short:'07 · 설정', title:'셀 4 · 모델 설정 코드 교체', place:'07번 상단 · ChatNVIDIA, NVIDIAEmbeddings를 가져오는 셀', goal:'앞 노트북 변수 없이 수업 폴더·임베딩·모델 연결을 준비합니다.'},
  {id:'index-docs', short:'07 · 문서', title:'셀 34 · Task 1 문서 준비 코드 교체', place:'Part 3 → Task 1 · paper_ids가 있는 기존 셀', goal:'실제 ReAct 논문을 읽고 검색할 문서 조각으로 나눕니다.'},
  {id:'index-build', short:'07 · 생성', title:'셀 36 · Task 2 인덱스 생성 코드 교체', place:'Part 3 → Task 2 · %%time으로 시작하는 기존 셀', goal:'문서 조각을 임베딩해 Vector Store들을 만듭니다.'},
  {id:'index-merge', short:'07 · 통합', title:'셀 38 · Task 2 통합 코드 교체', place:'Task 2 · from faiss import IndexFlatL2로 시작하는 기존 셀', goal:'생성한 저장소를 docstore 하나로 합치고 실제 검색을 확인합니다.'},
  {id:'index-rag', short:'07 · RAG', title:'셀 40 · Task 3 RAG TODO 셀 교체', place:'Task 3: [실습] RAG Chain 구현하기 · retrieval_chain TODO 셀', goal:'대화 기록과 문서를 검색해 질문에 답하는 RAG 체인을 실행합니다.'},
  {id:'index-save', short:'07 · 저장', title:'셀 44 · Part 4 저장 코드 교체', place:'Part 4: 평가를 위해 인덱스 저장하기 · docstore.save_local 셀', goal:'다음 노트북에서 사용할 인덱스 폴더와 압축 파일을 저장합니다.'},
  {id:'index-verify', short:'07 · 확인', title:'셀 46 · Part 4 불러오기 코드 교체', place:'Part 4 · new_db = FAISS.load_local이 있는 기존 셀', goal:'저장한 파일을 실제로 다시 읽고 검색한 뒤 08번으로 이동합니다.'},
];
