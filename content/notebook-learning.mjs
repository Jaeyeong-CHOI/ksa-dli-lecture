// Authored learning activities; examples describe actions in the original DLI lab, not executable downloads.
export const learningRoutes = {
 '00-jupyterlab': [
  {title:'실행 버튼과 출력의 관계', cells:[5], steps:['print가 있는 셀을 클릭하고 Shift+Enter를 누릅니다.','따옴표 안의 문장만 Hello DLI로 바꿉니다. 아직 실행하지 말고 이전 출력을 봅니다.','같은 셀을 다시 실행한 뒤 출력이 바뀌는지 비교합니다.'], observe:'편집만 했을 때는 이전 출력, 실행한 뒤에는 Hello DLI가 보입니다.', question:'코드를 고쳤는데 아래 문장이 그대로라면 무엇부터 하나요?', answer:'편집한 셀을 다시 실행합니다. 출력은 현재 글자가 아니라 마지막 실행의 결과입니다. 랩 전체를 재시작할 필요는 없습니다.'},
  {title:'입력을 변수에 기억하기', cells:[7], steps:['이름을 묻는 셀을 실행하고 연습용 이름 Mina를 입력한 뒤 Enter를 누릅니다.','별도의 getpass 입력이 나타나면 실제 키나 비밀번호 대신 연습용 문자열을 입력합니다.','Hello Mina가 보이는지 확인합니다. 입력을 기다리는 동안 다른 셀을 실행하지 않습니다.'], observe:'입력 전에는 커널이 대기하고, Enter 후에는 first_name에 문자열이 남습니다.', question:'셀 아래 입력창에 글자를 쓰기만 하고 Enter를 누르지 않으면 왜 멈춘 것처럼 보이나요?', answer:'input/getpass가 입력 완료를 기다리는 중입니다. 오류가 아닙니다. 입력창에서 Enter로 완료하세요.'},
  {title:'문자와 숫자를 구별하기', cells:[9], steps:['이름 입력을 마친 뒤 문자열·숫자 비교 셀을 그대로 실행합니다.','HelloWorld, 5 8, 11을 만드는 세 print를 각각 찾습니다.','try/except가 보여 주는 문법 오류와 마지막 인사 문장을 함께 확인합니다.'], observe:'따옴표 속 "5"와 "8"은 글자이고, 따옴표 없는 5 + 6은 계산입니다. 오류 예시 뒤에도 인사가 이어집니다.', question:'마지막 인사에서 first_name의 NameError가 나면 어느 셀로 돌아가나요?', answer:'이름을 입력하는 셀로 돌아갑니다. 그 셀을 실행해 변수를 만든 뒤 이 셀을 다시 실행합니다. 커널 재시작은 기억한 변수도 지웁니다.'}
 ],
 '01-microservices': [
  {title:'내 코드가 있는 장소 구별하기', cells:[15,18], steps:['세 따옴표로 감싼 컨테이너 목록은 예시로 읽습니다.','Should fail 주석이 있는 !docker ps -a 셀을 실행합니다.','명령 실패를 확인하고 다음 router 요청으로 넘어갑니다. Docker를 설치하지 않습니다.'], observe:'노트북 컨테이너에서 호스트의 Docker 명령을 직접 쓸 수 없다는 점을 확인하는 실험입니다.', question:'이 명령의 실패만으로 모델 서버도 꺼졌다고 판단할 수 있나요?', answer:'아니요. 지금 명령을 실행한 장소와 모델 서비스는 다릅니다. router의 응답을 따로 확인해야 합니다.'},
  {title:'주소를 읽고 요청 보내기', cells:[20], steps:['curl 뒤에서 docker_router, 8070, /help를 구분합니다.','수업 JupyterLab에서 셀을 실행합니다.','연결 과정이 적힌 줄과 실제 도움말 본문을 구분해서 봅니다.'], observe:'docker_router는 서비스 이름, 8070은 포트, /help는 기능의 경로입니다.', question:'같은 코드를 개인 PC에서 실행해 이름을 찾을 수 없다는 오류가 나면 무엇이 다른가요?', answer:'수업 내부 네트워크 밖에서 실행한 것입니다. 코드 오타 여부뿐 아니라 실행 위치가 수업 JupyterLab인지 먼저 확인합니다.'},
  {title:'응답에서 필요한 값만 꺼내기', cells:[22], steps:['requests.get → json() → for → if → print 순서로 코드를 읽습니다.','셀을 그대로 실행해 서비스 이름 목록을 봅니다.','if 조건이 검사하는 status와 print가 꺼내는 name을 각각 찾습니다.'], observe:'전체 응답이 아니라 running 상태인 항목의 이름만 출력됩니다. 개수와 이름은 랩마다 달라질 수 있습니다.', question:'JSON의 모든 항목을 받아 놓고 일부 이름만 출력하는 것은 어디에서 결정하나요?', answer:'for 안의 if 조건이 항목을 걸러냅니다. 요청·데이터 변환·필터링·출력은 서로 다른 단계입니다.'}
 ],
 '02-llms': [
  {title:'모델에 묻기 전에 연결 확인', cells:[18,19], steps:['service_url을 만드는 상태 확인 셀을 실행합니다.','그다음 /v1/models 조회 셀을 실행합니다.','상태 응답과 사용 가능한 모델 id를 구분해 읽습니다.'], observe:'서버 상태 조회와 모델 목록 조회는 질문에 답을 만드는 요청이 아닙니다.', question:'health가 정상이면 어떤 질문에도 답변이 나온다는 뜻인가요?', answer:'아니요. 네트워크와 상태 확인을 통과한 것입니다. 모델 이름·권한·생성 요청은 따로 확인해야 합니다.'},
  {title:'질문이 서버로 전달되는 과정', cells:[21,22], steps:['요청 준비 셀에서 messages 안의 질문, model, stream을 찾습니다. 이미 주어진 접속 설정은 유지합니다.','준비 셀을 실행한 뒤 실제 POST 요청 셀을 실행합니다.','응답 줄의 data:와 delta.content가 답변 조각으로 이어지는 부분을 봅니다.'], observe:'설정 셀은 재료를 준비하고, requests.post가 실제 요청을 보냅니다. 전체 헤더나 인증 설정을 공유하지 않습니다.', question:'payload를 찾을 수 없다는 NameError가 나면 질문을 다시 써야 하나요?', answer:'먼저 앞의 요청 준비 셀을 실행하세요. 같은 노트북 커널에 payload가 만들어져 있어야 합니다.'},
  {title:'한 번에 받기와 나눠 받기', cells:[25,26,28,34], steps:['SDK 설정 뒤 일반 응답 셀을 실행합니다.','ChatNVIDIA 호출과 마지막 stream 예제를 각각 확인합니다.','마지막 셀에서 반복문이 답변 조각을 차례로 출력하는 부분을 찾습니다. 내부 클라이언트·환경 변수 진단 셀은 건너뛰어도 됩니다.'], observe:'응답을 한 번에 받거나 조각으로 받을 수 있지만, stream의 각 조각이 별개의 완성 답변은 아닙니다.', question:'stream 결과의 첫 조각만 저장하면 왜 답이 짧거나 비어 있을 수 있나요?', answer:'전체 답변은 여러 조각의 합입니다. 반복을 끝까지 처리해야 합니다. 이 랩에서 일반 호출이 잘리는 경우에는 뒤 08번의 응답 수집 안내도 참고하세요.'}
 ],
 '03-langchain-intro': [
  {title:'연결과 실행은 다른 일', cells:[9], steps:['identity → rprint0 → rprint1 → RPrint가 넘기는 값을 읽습니다.','셀을 그대로 실행하고 1:, 2:, Output: 출력을 비교합니다.','파이프(|)로 연결한 부분과 .invoke로 실행한 부분을 각각 찾습니다.'], observe:'중간에서 값을 출력해도 반환값을 유지하면 마지막 output은 Welcome Home!입니다. 여기에는 모델 호출이 없습니다.', question:'RPrint가 화면에 1:을 붙여 보여 주면 다음 단계의 입력에도 1:이 붙나요?', answer:'이 함수는 표시할 때만 접두어를 붙이고 원래 x를 반환합니다. 화면에 보이는 출력과 함수의 반환값을 구별하세요.'},
  {title:'문자열과 딕셔너리 따라가기', cells:[18,19], steps:['앞의 도우미 정의 셀을 먼저 실행합니다.','딕셔너리를 넣는 셀에서 A~F 출력을 차례로 봅니다.','바로 다음 셀은 문자열 Hello World만 전달합니다. 두 결과를 비교합니다.'], observe:'RInput이 입력 형식을 맞추고 itemgetter가 값을 꺼냅니다. 두 호출의 최종 결과는 같은 output 키와 HELLO 값입니다.', question:'"Hello World"와 {"input": "Hello World"}를 넣어도 왜 끝의 결과가 같나요?', answer:'RInput은 딕셔너리가 아니면 input 키로 감싸고, 이미 딕셔너리이면 그대로 통과시킵니다. 그 뒤 두 입력은 같은 경로를 지납니다.'},
  {title:'프롬프트에 필요한 값 채우기', cells:[21,22,23], steps:['이 부분의 모델 설정 셀을 먼저 실행합니다.','첫 시를 만드는 chain1과 기존 시·새 topic을 받는 chain2를 구분합니다.','TODO에는 두 번째 프롬프트에 필요한 값만 연결합니다. 풀이 방법에서 수정 구간을 확인한 뒤 같은 셀을 실행합니다.','대화 첫 턴과 다음 턴을 각각 시험합니다.'], observe:'첫 턴에는 주제로 시를 만들고, 다음 턴에는 기존 시와 새 주제를 모두 활용해야 합니다.', question:'다음 턴에 topic만 보내면 무엇이 빠지나요?', answer:'변환할 기존 시가 빠집니다. 프롬프트의 각 자리표시자에 어떤 값이 들어가는지 먼저 확인하세요.'}
 ],
 '04-running-state': [
  {title:'상태를 덮어쓰기와 확장하기', cells:[3,4,5,7,9,11], steps:['앞의 모델·도우미·분류·생성 셀을 순서대로 실행합니다.','big_chain에서 직접 만든 딕셔너리와 RunnableAssign 부분을 비교합니다.','중간 PPrint마다 input, topic, generation, combination 중 어떤 키가 남는지 봅니다.'], observe:'직접 매핑은 적은 키만 남기고, RunnableAssign은 들어온 상태에 새 키를 추가합니다. 모델의 정확한 문장은 실행마다 달라집니다.', question:'처음 입력의 options 키가 최종 결과에서 사라진 이유를 어디에서 찾나요?', answer:'첫 직접 매핑이 input과 topic만 만든 부분입니다. RunnableAssign이 이후 키를 추가해도 이미 빠진 options를 자동 복구하지는 않습니다.'},
  {title:'자유로운 문장을 정해진 양식으로', cells:[17,19,22,25,26,27], steps:['KnowledgeBase의 필드 이름·기본값·설명을 읽습니다.','파서와 추출기 정의를 실행한 뒤 Carmen의 첫 메시지로 상태를 만듭니다.','후속 메시지를 순서대로 실행하며 기존 이름은 남고 location과 summary가 갱신되는지 봅니다.'], observe:'대화 전체를 한 문자열로만 보관하는 대신 이름·위치·요약 등 필요한 칸으로 나눕니다.', question:'사용자가 아직 말하지 않은 성을 모델이 그럴듯하게 채워도 되나요?', answer:'안 됩니다. 구조가 맞는 값과 사실에 근거한 값은 다릅니다. 모르는 정보는 unknown 등 원본의 기본값으로 남겨야 합니다.'},
  {title:'정보를 추출한 다음 실제로 조회', cells:[30,31,32,34,36,38], checkpoint:32, steps:['get_flight_info 정의 셀을 실행하고 Jane의 예시를 확인합니다.','Alice의 조회 셀과 Bob의 잘못된 예약번호 셀을 차례로 실행합니다.','그다음 TODO에서는 정보 추출 → 함수 조회 → 답변을 연결합니다. 예약번호가 없으면 먼저 물어봐야 합니다.'], observe:'Alice는 Chicago → Miami, Bob의 27494는 정보 없음 응답입니다. 실제 항공사에 접속하는 것이 아니라 수업용 고정 목록을 조회합니다.', question:'정보 없음이라는 문장은 서버 오류인가요?', answer:'이 예시에서는 정상적인 조회 결과입니다. Bob의 예시 번호가 목록과 다르기 때문입니다. 모델이 없는 예약을 만들어 답하지 않도록 구분해야 합니다.'}
 ],
 '05-documents': [
  {title:'문서 내용과 출처 함께 읽기', cells:[3,8,10,12], steps:['출력 도우미를 준비하는 앞쪽 셀을 실행한 뒤 문서 읽기 셀을 실행합니다.','page_content를 출력하는 셀에서 논문 본문을 봅니다.','metadata 출력 셀에서 제목·출처 등 어떤 정보가 함께 붙는지 확인합니다.'], observe:'Document는 본문 문자열만이 아니라 본문과 메타데이터를 가진 객체입니다. 파일·로더에 따라 메타데이터 키는 다를 수 있습니다.', question:'본문만 복사해 저장하면 나중에 무엇을 설명하기 어려워지나요?', answer:'어느 자료에서 가져온 답인지 추적하기 어려워집니다. 출처 정보를 함께 보존해야 인용과 검증이 가능합니다.'},
  {title:'조각 사이에 겹침을 두는 이유', cells:[15,16], steps:['splitter의 chunk_size와 chunk_overlap을 읽습니다.','문서를 나누고 조각을 출력하는 셀을 실행합니다.','0번 조각의 끝과 1번 조각의 시작을 비교합니다. 긴 문서를 한 번에 모델에 보내지 않는 이유도 생각해 봅니다.'], observe:'조각의 경계에서 문맥이 완전히 끊기지 않도록 일부 내용이 겹칩니다. 기본 길이 함수라면 크기는 토큰 수가 아니라 문자 길이 기준입니다.', question:'겹치는 문장이 보이면 중복 저장 버그인가요?', answer:'chunk_overlap으로 의도한 중복일 수 있습니다. 청크 크기·분리 기준에 따라 실제 겹침 길이는 달라집니다.'},
  {title:'앞의 내용을 잊지 않는 누적 요약', cells:[4,5,19,21,23,24], steps:['모델·도우미 설정 후 요약 양식과 RExtract를 먼저 정의합니다.','TODO에서 기존 info_base와 다음 문서 조각을 추출기에 함께 전달합니다.','요약 반복이 끝난 뒤 latest_summary를 출력합니다. 처음부터 전체를 반복하기 전에 짧은 입력으로 연결을 점검하세요.'], observe:'매번 이전 메모를 읽고 새 내용으로 갱신합니다. 마지막 조각만 요약하는 구조와 다릅니다.', question:'반복문 안에서 매번 빈 요약을 새로 만들면 무엇을 잃나요?', answer:'앞 조각의 내용과 누적 상태를 잃습니다. 직전 결과가 다음 반복의 info_base로 전달되는지 확인하세요.'}
 ],
 '06-embeddings': [
  {title:'질문용·문서용 숫자 벡터 만들기', cells:[6,7,9,11], steps:['원본의 임베딩 모델 설정을 실행합니다.','queries와 documents에서 이탈리아 음식 질문과 음식 설명을 찾아 짝을 예상합니다.','임베딩 셀을 실행합니다. 질문에는 embed_query, 문서에는 embed_documents가 쓰이는지 확인합니다.'], observe:'각 문장이 숫자 목록으로 바뀝니다. 벡터 길이는 사용하는 모델에 따라 정해지며 단어 수와 같지 않습니다.', question:'숫자 벡터를 만들었다는 것은 모델이 질문에 답했다는 뜻인가요?', answer:'아니요. 검색에 쓸 표현을 만든 것입니다. 이 숫자로 문서를 비교한 뒤, 답변 생성은 별도의 모델 단계에서 합니다.'},
  {title:'유사도 그림을 정확히 읽기', cells:[13], steps:['plot_cross_similarity_matrix(q_embeddings, d_embeddings)의 인자 순서를 봅니다.','행렬의 행은 첫 인자인 질문, 열은 두 번째 인자인 문서입니다. 이탈리아 음식의 질문 1번·문서 1번 위치를 찾습니다.','원본 축 제목이 반대로 적혀 있으면 xlabel만 Document Embeddings, ylabel만 Query Embeddings로 고쳐 다시 실행합니다.'], observe:'가로축은 문서, 세로축은 질문입니다. 번호는 0부터 시작합니다. 색상 막대의 값이 높을수록 표현이 유사하며 확률·정확도가 아닙니다.', question:'날씨 질문에 다른 지역의 날씨 문서가 높은 점수를 받아도 정답인가요?', answer:'아니요. 주제는 비슷해도 지역이 다르면 근거로 부적절할 수 있습니다. 점수와 문서 내용을 함께 봐야 합니다.'},
  {title:'인코딩 역할을 바꾸어 비교하기', cells:[15,17,19], checkpoint:15, steps:['앞의 그림 다음, 문서도 질문 방식으로 인코딩하는 비교 셀을 실행합니다.','같은 문장 쌍의 색과 순위가 어떻게 변하는지 비교합니다.','긴 문서 TODO에서는 실제로 긴 내용이 생성됐는지 먼저 읽고, 그 다음 임베딩 비교로 넘어갑니다.'], observe:'질문과 문서를 같은 역할로 인코딩한다고 항상 같은 검색 순위가 나오지는 않습니다. 긴 입력은 모델의 입력 한도를 확인해야 합니다.', question:'한 번의 그림에서 더 진한 색이 나왔다면 항상 더 좋은 설정인가요?', answer:'아니요. 질문과 정답 문서가 잘 연결되는지 여러 예시로 확인해야 합니다. 서로 다른 설정의 색만 보고 성능을 단정하지 않습니다.'}
 ],
 '07-vectorstores': [
  {title:'검색 결과를 먼저 직접 읽기', cells:[3,4,9,14,16,17], steps:['설정과 예시 대화 정의를 실행한 뒤 FAISS 저장소를 만듭니다.','이름 질문과 산에 관한 질문으로 검색 셀을 각각 실행합니다.','검색된 Document의 본문을 읽습니다. 아직 새로운 답변을 생성한 것이 아닙니다.'], observe:'비슷한 문서를 찾는 retriever와 새 문장을 만드는 LLM을 분리해 확인합니다.', question:'문서 목록이 출력됐는데 자연스러운 답변이 없다면 검색이 실패한 건가요?', answer:'아니요. 검색 단계의 정상 출력은 Document 목록입니다. 이를 문자열로 정리해 프롬프트에 전달한 뒤 생성기가 답합니다.'},
  {title:'검색한 근거로 RAG 답변 만들기', cells:[22,34,36,38,40], steps:['도우미 함수를 실행하고 Task 1의 논문 목록을 준비합니다.','문서 조각별 벡터 저장소를 만든 뒤 하나로 합칩니다.','Task 3의 history와 context TODO에 입력 질문 → 검색 → 문자열 변환을 각각 연결합니다.','프롬프트가 원본 질문과 검색된 근거를 모두 받는지 봅니다.'], observe:'history는 대화 기억, context는 문서 근거입니다. 둘 중 하나가 빈 항등 함수로 남아 있지 않아야 합니다.', question:'모델에서 502가 한 번 났다면 문서 인덱스부터 다시 만들어야 하나요?', answer:'검색이 이미 정상이라면 먼저 답변 호출만 재시도합니다. 실제 검수에서도 502 후 같은 인덱스로 재시도해 답변이 나왔습니다.'},
  {title:'다음 노트북이 쓸 파일 남기기', cells:[44,46], steps:['Part 4의 저장 셀에서 docstore_index를 저장·압축하는 줄을 확인합니다.','원본에 폴더를 지우는 !rm 줄이 있으면 주석으로 남깁니다.','저장 후 다시 읽는 셀을 실행하고 검색 결과를 확인합니다.'], observe:'커널 속 변수와 디스크 파일은 다릅니다. 08·09번은 07번 변수 대신 저장 인덱스를 읽습니다.', question:'07번에서 docstore 변수가 보이는데 08번에 없다는 오류가 나는 이유는 무엇인가요?', answer:'노트북은 별도 커널을 쓸 수 있습니다. 08번의 모델 설정과 인덱스 불러오기 셀을 실행해야 합니다. 랩 STOP은 파일도 초기화할 수 있습니다.'}
 ],
 '08-evaluation': [
  {title:'평가 전에 검색·답변부터 점검', cells:[3,7,9], steps:['이 노트북의 모델 설정을 실행하고 07번 저장 파일을 불러옵니다.','retrieval_chain과 generator_chain의 TODO를 채웁니다.','질문 하나에 실제 문서 근거를 이용한 답변이 나오는지 확인합니다.'], observe:'질문 문자열이 그대로 되돌아오는 것은 완성된 RAG 답변이 아닙니다.', question:'rag_chain이라는 변수가 있기만 하면 평가 준비가 끝난 것인가요?', answer:'아니요. 원본 자리표시자가 항등 함수이면 변수는 있어도 검색·생성이 수행되지 않습니다. 질문 하나로 끝까지 확인합니다.'},
  {title:'같은 질문의 두 답변 만들기', cells:[11,13], steps:['문서에서 질문·참고 답변 쌍을 생성하는 셀을 먼저 실행합니다.','Question: 뒤에 실제 질문과 Answer: 내용이 모두 있는지 읽습니다.','rag_answer의 TODO에 현재 질문을 rag_chain으로 답하는 코드를 넣고 실행합니다.','synth_questions, synth_answers, rag_answers의 길이와 같은 순번의 내용을 비교합니다.'], observe:'질문·참고 답변·내 RAG 답변은 같은 순서로 묶여야 합니다. 문서 선택 방식은 노트북 버전에 따라 다를 수 있습니다.', question:'질문 목록만 새로 만들고 예전 rag_answers를 그대로 채점해도 되나요?', answer:'안 됩니다. 질문이 바뀌면 RAG 답변과 비교 평가도 순서대로 다시 만들어야 합니다. 길이가 같아도 질문이 달라지면 잘못된 비교입니다.'},
  {title:'평가 이유와 점수 함께 읽기', cells:[15,17], steps:['비교 프롬프트에 어느 답변이 1번·2번인지 확인하고 채점을 실행합니다.','판정 문자열의 선택 번호와 이유를 먼저 읽습니다.','점수 셀은 원본 버전의 판정 해석 함수를 유지합니다. 결과를 별도 preference_score 변수에 저장해 재실행 충돌을 피합니다.'], observe:'08번 점수는 소수 합성 질문의 비교 지표입니다. 인증 판정은 09번 연결 후 Evaluate와 ASSESS TASK에서 따로 확인합니다.', question:'08번 점수가 낮으면 바로 인증서 발급에 실패한 것인가요?', answer:'아니요. 08번은 RAG 품질을 살펴보는 사전 실험입니다. 실제 검수에서도 이 점수와 최종 ASSESS TASK 판정은 달랐습니다. 답변 내용과 근거를 검토한 뒤 09번으로 진행합니다.'}
 ],
 '09-langserve': [
  {title:'노트북 코드를 서버 파일로 저장', cells:[4], steps:['%%writefile server_app.py 셀에서 기존 서버 틀은 유지합니다.','/retriever에는 Document 목록을 반환하는 검색기를, /generator에는 입력·문서 근거로 답하는 생성기를 연결합니다.','같은 셀을 실행하고 Writing 또는 Overwriting server_app.py 출력을 확인합니다.'], observe:'writefile은 파일을 쓸 뿐 서버를 켜지는 않습니다. 이 시점의 서버 접속 실패와 코드 저장 성공은 모순이 아닙니다.', question:'/generator가 답 대신 Document 목록을 돌려줘도 되나요?', answer:'안 됩니다. 검색 API와 생성 API가 기대하는 반환 형태가 다릅니다. 검색기는 문서 목록, 생성기는 프롬프트를 바탕으로 한 답변을 돌려줘야 합니다.'},
  {title:'서버를 별도 프로그램으로 실행', cells:[5], steps:['JupyterLab의 Terminal을 열고 server_app.py가 있는 폴더인지 확인합니다.','python server_app.py를 실행합니다. 서버 실행 중에는 Terminal이 점유되는 것이 정상입니다.','코드를 고쳤다면 writefile 셀을 다시 실행하고, 기존 서버를 Ctrl+C로 종료한 뒤 다시 시작합니다.'], observe:'노트북 커널과 Terminal의 서버는 서로 다른 프로세스입니다. 파일을 편집해도 이미 떠 있는 서버가 저절로 바뀌지 않습니다.', question:'브라우저만 새로고침하면 바뀐 Python 코드가 서버에 적용되나요?', answer:'아니요. 변경 파일을 저장하고 서버 프로세스를 다시 시작해야 합니다. 커널만 재시작해도 Terminal 서버는 별도로 남을 수 있습니다.'},
  {title:'화면·평가·수료 판정 연결', cells:[9], steps:['원본 Markdown의 Frontend 링크를 엽니다. Python 셀의 주석 링크 코드를 무조건 해제하지 않습니다.','RAG 모드에서 질문 하나로 검색·답변을 확인하고 Evaluate를 실행합니다.','완료 안내 후 강좌 화면의 ASSESS TASK를 눌러 GRADING → PASSED 결과를 확인합니다.'], observe:'실제 검수에서는 2026-09-12에 이 연결로 PASSED를 확인했습니다. 학생별 현재 결과는 각자의 강좌 화면에서 확인합니다.', question:'일반 질문은 되는데 웹의 비동기 호출만 실패하면 무엇을 확인하나요?', answer:'생성기의 동기·비동기 응답 경로가 모두 제공되는지 확인합니다. Get Certification의 09번 부분 수정 안내에는 실제 랩에서 확인한 afunc 연결과 재시작 순서가 있습니다.'}
 ]
};
export const liveNotebookNotes = {
 '00-jupyterlab':{3:'언어 변경 셀은 노트북 파일들을 다시 생성할 수 있습니다. 이미 한국어 파일을 열었거나 편집한 내용이 있다면 자동으로 실행하지 말고 건너뛰세요. 첫 실행 연습은 print 셀부터 합니다.'},
 '04-running-state':{9:'실제 랩에서 이 생성 호출이 오래 지연되는 경우가 있었습니다. 출력이 없다고 같은 셀을 연속 실행하지 마세요. 입력창이 없고 [*] 상태라면 서버 응답 대기인지 확인하고, 필요하면 ■ Interrupt로 현재 호출만 중단합니다. 앞서 만든 설정·체인은 유지한 채 해당 셀을 재시도합니다.'},
 '05-documents':{8:'실제 랩에서 외부 arXiv 응답이 오래 지연됐습니다. 먼저 ■ Interrupt로 현재 호출을 중단하고, 왼쪽 cached_papers 폴더에 2210.03629v3.pdf가 있는지 확인하세요. 아래 부분 수정으로 제공된 PDF를 먼저 읽을 수 있습니다. 캐시가 없을 때만 기존 외부 조회를 사용합니다.'},
 '06-embeddings':{13:'원본 코드의 xlabel/ylabel 문구와 실제 행렬 방향이 다를 수 있습니다. cosine_similarity의 첫 인자(q_embeddings)가 행, 두 번째(d_embeddings)가 열입니다. 가로=문서, 세로=질문으로 읽습니다.'},
 '08-evaluation':{11:'현재 랩과 한국어 다운로드 사본의 문서 선택 코드가 다를 수 있습니다. import random이라는 첫 줄이 없어도 synth_questions / synth_answers를 만드는 셀을 찾으세요. Question:만 반환되면 qa_pair를 받는 호출만 스트리밍 조각을 합치는 방식으로 보완합니다.',17:'최근 랩에는 selected_answer 함수로 판정 번호를 해석하는 코드가 있습니다. 다운로드 사본과 다르더라도 이 함수를 지우지 마세요. pref_score가 판정 목록과 숫자 점수에 중복 사용될 때는 숫자 결과 이름만 preference_score로 구분합니다.'},
 '09-langserve':{4:'실제 웹 경로는 비동기 호출도 사용합니다. RunnableLambda에 스트리밍 함수를 감쌌다면 afunc도 연결해야 합니다. 원본 서버 틀을 유지하는 정확한 수정 구간은 Get Certification의 09번에 있습니다.'}
};
export const liveLookupAliases = {'08-evaluation':{11:['synth_questions = []','synth_answers = []'],17:['def selected_answer','preference_score','pref_score = sum(selected_answer']}};
export function routeForCell(slug,cell){return learningRoutes[slug]?.find(r=>r.cells.includes(cell));}

export const learningPatches = {
  "06-embeddings": {
    "13": {
      "instruction": "원본 그림 셀 끝의 xlabel·ylabel 두 줄만 아래 코드로 바꾸고, 같은 셀을 다시 실행하세요. 행렬 계산과 나머지 코드는 유지합니다.",
      "code": "plt.xlabel(\"Document Embeddings\")\nplt.ylabel(\"Query Embeddings\")",
      "label": "축 이름 두 줄만 수정"
    }
  },
  "05-documents": {
    "8": {
      "instruction": "최신 랩의 문서 읽기 셀에서 try: 바로 아래 documents = ArxivLoader(query=\"2210.03629\").load() 줄 전체만 아래 코드로 바꿉니다. 위의 Path·PyMuPDFLoader import와 아래 except는 유지합니다. 들여쓰기도 함께 복사하고 같은 셀을 다시 실행하세요.",
      "code": "    documents = (\n        PyMuPDFLoader(\"cached_papers/2210.03629v3.pdf\").load()\n        if Path(\"cached_papers/2210.03629v3.pdf\").is_file()\n        else ArxivLoader(query=\"2210.03629\").load()\n    )  ## ReAct",
      "label": "문서 읽기 구간만 수정"
    }
  }
};
