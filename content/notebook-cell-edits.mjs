// Existing teaching answers expressed as exact edits to the published course cells.
// Model names, prompts, UI loops and other untouched lines remain original.
export const notebookEdits = {
 '03-langchain-intro': {22: {exercise: 0, title: '기존 시와 새 주제를 chain2에 전달', patches: [
  ['        yield f"Not Implemented!!!"; return ## <- TODO: Comment this out','        # TODO 완료: 아래 chain2에서 새 주제의 시를 생성합니다.'],
  ['        # buffer = f"Sure! Here you go!\\n\\n" ## <- TODO: Uncomment these lines\n        # yield buffer', '        buffer = f"Sure! Here you go!\\n\\n"\n        yield buffer'],
  ['        ## TODO: Iterate over stream generator for second generation (using chain2)', '        for token in chain2.stream({"input": first_poem, "topic": message}):\n            buffer += token\n            yield buffer if return_buffer else token']
 ]}},
 '04-running-state': {38: {exercise: 0, title: '정보 추출 → 상태 갱신 → 예약 조회 연결', patches: [
  ['from typing import Iterable','from typing import Iterable, Optional'],
  ['knowbase_getter = lambda x: KnowledgeBase()','knowbase_getter = RExtract(KnowledgeBase, instruct_llm, parser_prompt)'],
  ['database_getter = lambda x: "Not implemented"','database_getter = (\n    RunnableLambda(lambda state: state["know_base"])\n    | RunnableLambda(get_key_fn)\n    | RunnableLambda(get_flight_info)\n)']
 ]}},
 '05-documents': {
  8: {title: '저장된 ReAct PDF 우선 읽기', patches: [
   ['    documents = ArxivLoader(query="2210.03629").load()  ## ReAct','    documents = (\n        PyMuPDFLoader("cached_papers/2210.03629v3.pdf").load()\n        if Path("cached_papers/2210.03629v3.pdf").is_file()\n        else ArxivLoader(query="2210.03629").load()\n    )  ## ReAct']
  ]},
  23: {exercise: 0, title: '청크마다 요약 상태 갱신', patches: [
   ["parse_chain = RunnableAssign({'info_base' : (lambda x: None)})", "parse_chain = RunnableAssign({'info_base': RExtract(knowledge.__class__, llm, prompt)})"],
   ['        state = {}', '        state = {"info_base": knowledge}'],
   ['            ## TODO: Update the state as appropriate using your parse_chain component', '            state["input"] = doc.page_content\n            state = parse_chain.invoke(state)\n            latest_summary = state["info_base"]']
  ]}
 },
 '06-embeddings': {
  13: {title: '행은 질문, 열은 문서로 축 이름 수정', patches: [
   ['plt.xlabel("Query Embeddings")\nplt.ylabel("Document Embeddings")','plt.xlabel("Document Embeddings")\nplt.ylabel("Query Embeddings")']
  ]},
  17: {exercise: 0, title: '프롬프트·모델·파서를 연결하고 질문별 호출', patches: [
   ['    {}\n)', '    expound_prompt | instruct_llm | StrOutputParser()\n)'],
   ['    longer_doc = ""', '    longer_doc = expound_chain.invoke({"questions": "\\n".join(queries), "q1": q})']
  ]}
 }
};
export const certificationExercises = {
 '07-vectorstores': {40: 0},
 '08-evaluation': {9: 0, 13: 1, 17: 2},
 '09-langserve': {4: 0}
};
