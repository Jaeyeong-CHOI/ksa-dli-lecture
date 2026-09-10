// Self-contained 07 notebook preparation for the supplied DLI lab.
export const certification07Code = {
  env07: String.raw`# Get Certification · 07-A · 환경 확인
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

model = ChatNVIDIA(
    model="nvidia/nemotron-3.5-lightning-30b-a3b",
    base_url="http://llm_client:9000/v1",
    timeout=300,
    model_kwargs={"chat_template_kwargs": {"enable_thinking": False}},
)
reply = model.invoke("Reply with one short greeting.")
assert reply.content, "모델 응답이 비어 있습니다."
print("대화 모델 연결 OK:", reply.content)
print("07-A 완료 · 다음 새 Code 셀에 07-B를 붙여넣으세요.")`,
  papers07: String.raw`# Get Certification · 07-B · 실제 논문 읽기와 청킹
# 같은 07번 노트북에서 07-A를 실행한 뒤 사용합니다.
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
print("07-B 완료 · 다음 새 Code 셀에 07-C를 붙여넣으세요.")`,
  build07: String.raw`# Get Certification · 07-C · FAISS 검색 인덱스 생성
# 07-A의 embedder와 07-B의 chunks를 사용합니다.
if not chunks:
    raise ValueError("먼저 07-B를 실행해 실제 문서 조각을 만드세요.")

# 작은 묶음으로 처리하고 진행 상황을 표시합니다.
# 셀을 재실행하면 메모리의 인덱스를 처음부터 새로 만듭니다.
docstore = None
batch_size = 16
for start in range(0, len(chunks), batch_size):
    batch = chunks[start:start + batch_size]
    if docstore is None:
        docstore = FAISS.from_documents(batch, embedder)
    else:
        docstore.add_documents(batch)
    print(f"임베딩 완료: {min(start + batch_size, len(chunks))}/{len(chunks)}")

assert len(docstore.docstore._dict) == len(chunks), "저장된 문서 조각 수가 맞지 않습니다."
test_question = "How does ReAct combine reasoning and acting?"
hits = docstore.similarity_search(test_question, k=3)
assert hits and all(hit.page_content.strip() for hit in hits), "검색 결과가 비어 있습니다."
print("검색된 문서 제목:", hits[0].metadata.get("Title"))
print("검색 내용 미리보기:\n", hits[0].page_content[:500])
print("07-C 완료 · 다음 새 Code 셀에 07-D를 붙여넣으세요.")`,
  save07: String.raw`# Get Certification · 07-D · 저장, 압축, 다시 불러오기 확인
# 07-C가 오류 없이 끝난 뒤 실행합니다.
from datetime import datetime, timezone
import tarfile

assert len(docstore.docstore._dict) == len(chunks), "07-C를 끝까지 다시 실행하세요."
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

# 방금 본인이 만든 인덱스만 다시 읽습니다. 알 수 없는 출처의 pkl은 사용하지 마세요.
reloaded = FAISS.load_local(
    str(index_dir), embedder, allow_dangerous_deserialization=True
)
assert len(reloaded.docstore._dict) == len(chunks), "다시 읽은 문서 수가 다릅니다."
saved_hits = reloaded.similarity_search("How does ReAct combine reasoning and acting?", k=3)
assert saved_hits and saved_hits[0].page_content.strip(), "저장 후 검색 확인에 실패했습니다."
print("저장된 인덱스:", index_dir)
print("압축 파일:", archive, "·", archive.stat().st_size, "bytes")
print("저장 후 검색 OK:", saved_hits[0].metadata.get("Title"))
print("07-D 완료 · 이제 08_evaluation.ipynb를 열고 이 페이지의 다음 단계를 진행하세요.")`,
};

export const certification07Actions = {
  env07: {notebook:'07_vectorstores.ipynb', kind:'append', find:'노트북 맨 아래에 새로 추가한 첫 번째 Code 셀', insertAfter:'07_vectorstores.ipynb를 열고 맨 마지막 셀을 클릭합니다.', result:'작업 폴더, 임베딩 연결 OK, 대화 모델 연결 OK, 07-A 완료가 모두 나옵니다. 오류가 있으면 다음 단계로 넘어가지 않습니다.'},
  papers07: {notebook:'07_vectorstores.ipynb', kind:'append', find:'07-A 셀 바로 아래에 추가한 새 Code 셀', insertAfter:'방금 실행한 “Get Certification · 07-A” 코드 셀을 클릭합니다.', result:'PDF 페이지 수와 문서 조각 수가 표시되고 ReAct 논문 본문이 보입니다. 마지막에 07-B 완료가 나옵니다.'},
  build07: {notebook:'07_vectorstores.ipynb', kind:'append', find:'07-B 셀 바로 아래에 추가한 새 Code 셀', insertAfter:'방금 실행한 “Get Certification · 07-B” 코드 셀을 클릭합니다.', result:'임베딩 완료 수가 전체 조각 수에 도달하고, ReAct 제목과 검색 내용이 출력된 뒤 07-C 완료가 나옵니다.'},
  save07: {notebook:'07_vectorstores.ipynb', kind:'append', find:'07-C 셀 바로 아래에 추가한 새 Code 셀', insertAfter:'방금 실행한 “Get Certification · 07-C” 코드 셀을 클릭합니다.', result:'docstore_index 폴더와 docstore_index.tgz가 생성되고, 저장 후 검색 OK 및 07-D 완료가 나옵니다. 파일을 옮기지 않고 같은 폴더의 08번을 엽니다.'},
};

export const certification07Steps = [
  {id:'start', short:'랩 시작', title:'새 랩을 열고 07번부터 시작하기', place:'NVIDIA 강좌 → 수업 환경 실행 → JupyterLab', goal:'00~06번에서 만든 변수나 미리 저장한 인덱스 없이, 이 페이지의 코드부터 실행합니다.'},
  {id:'index-setup', short:'07-A · 연결', title:'첫 번째 새 셀 · 환경과 모델 확인', place:'07_vectorstores.ipynb · 맨 아래 새 Code 셀', goal:'문서 작업 전에 수업 폴더·패키지·임베딩·대화 모델 연결을 확인합니다.'},
  {id:'index-docs', short:'07-B · 문서', title:'두 번째 새 셀 · 논문 읽고 나누기', place:'07_vectorstores.ipynb · 07-A 아래 새 Code 셀', goal:'실제 ReAct 논문을 읽고, 검색할 수 있는 문서 조각으로 나눕니다.'},
  {id:'index-build', short:'07-C · 생성', title:'세 번째 새 셀 · 검색 인덱스 생성', place:'07_vectorstores.ipynb · 07-B 아래 새 Code 셀', goal:'문서 조각을 임베딩해 FAISS에 넣고 질문으로 검색해 봅니다.'},
  {id:'index-save', short:'07-D · 저장', title:'네 번째 새 셀 · 저장하고 다시 검색', place:'07_vectorstores.ipynb · 07-C 아래 새 Code 셀', goal:'08·09번에서 읽을 인덱스 폴더와 압축 파일을 만들고 실제로 다시 읽어 확인합니다.'},
];
