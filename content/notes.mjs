// Korean adaptations of the supplied course, not official solution files.
const section=(title,text,cells)=>({title,text,cells});
const exercise=(title,location,goal,steps,code,check)=>({title,location,goal,steps,code,check});
export const notes=[
{slug:'introduction-to-llm',no:'PPT',kind:'slides',title:'Introduction to LLM',summary:'63쪽 강연을 한 권의 노트로. LLM의 원리, 추론과 에이전트, 학습, 멀티모달, GPU를 순서대로 이해합니다.',goals:['슬라이드의 다섯 파트를 연결해 설명하기','학습·추론·검색의 차이와 GPU 메모리 계산 이해하기'],sections:[
section('1–3쪽 · 이 강연의 지도','먼저 LLM이 무엇인지 배우고, 더 오래 생각하거나 도구를 이용하는 모델로 확장합니다. 이어서 모델을 어떻게 학습하는지, 텍스트 밖의 입력은 어떻게 다루는지, 실행에 어떤 GPU 자원이 필요한지 살펴봅니다. 이 노트는 PPT 파일 순서를 따르는 한국어 해설이며 원문을 대체하지 않습니다.'),
section('4–12쪽 · 토큰, 벡터, Transformer','문장을 모델이 계산할 수 있는 토큰으로 나누고, 각 토큰을 숫자 벡터로 바꿉니다. 어텐션은 문맥 속 다른 위치의 정보를 가중해 모으고, MLP는 각 위치의 표현을 변환합니다. 생성 모델은 지금까지의 문맥에서 다음 토큰을 골라 붙이는 과정을 반복합니다. “다음에 나올 법한 말”과 “검증된 사실”은 다릅니다. 모델 목록·성능 그래프는 강연 당시 비교이지 현재 순위의 보증이 아닙니다.'),
section('13–26쪽 · 추론과 에이전트','추론은 문제를 풀기 위한 계산을 더 수행하는 것이고, 도구 호출은 외부 프로그램에 특정 작업을 요청하는 인터페이스입니다. 모델이 함수 이름과 인자를 출력했다고 함수가 저절로 실행되지는 않습니다. 애플리케이션이 요청을 검사하고 실행한 결과를 모델에 다시 전달합니다. 에이전트는 이 관찰·결정·행동의 반복을 구성한 시스템으로 이해하면 됩니다. 사용자에게는 확인 가능한 풀이 요약을 제시하면 충분하며 내부 사고 기록 자체를 정답으로 취급하지 않습니다.'),
section('27–39쪽 · 모델은 어떻게 배우나요?','CNN·RNN·GNN의 사례는 데이터 구조를 반영하는 귀납적 편향을 비교하기 위한 것입니다. Transformer의 어텐션은 토큰 사이 상호작용을 유연하게 계산합니다. 학습에서는 순전파로 예측을 만들고, 손실을 계산한 뒤 역전파로 파라미터를 바꿉니다. 사전학습은 큰 데이터의 패턴을 익히는 단계, 후학습은 지시 따르기나 선호 등 원하는 행동을 다듬는 단계입니다. 추론 중 프롬프트에 자료를 붙이는 RAG와 가중치를 바꾸는 학습을 혼동하지 마세요.'),
section('40–46쪽 · 텍스트에서 멀티모달로','이미지·오디오·영상도 모델이 계산할 수 있는 표현으로 바꾸어 함께 다룹니다. 입력 모달리티와 출력 모달리티는 별개이므로 이미지를 읽는 모델이 반드시 이미지를 생성하는 것은 아닙니다. 영상에는 시간 순서, 음성에는 발화와 소리 등 텍스트만으로는 놓치기 쉬운 정보가 있습니다. 슬라이드의 구조 그림과 지원 범위를 원문에서 함께 확인하세요.'),
section('47–57쪽 · 전체 파라미터, 활성 파라미터, 비트 수','MoE는 토큰을 처리할 때 일부 전문가만 활성화하는 구조입니다. 활성 파라미터는 연산량을 이해하는 단서이고, 저장해야 하는 전체 가중치와는 다릅니다. 가중치를 16비트 대신 8비트·4비트로 표현하면 저장량을 줄일 수 있지만, 수치 정밀도와 품질·커널 지원을 함께 고려해야 합니다. 비트 수를 바이트 수로 바꾸려면 8로 나눕니다.'),
section('58–63쪽 · GPU 메모리 계산과 정리','가중치 저장량 = 전체 파라미터 수 × 파라미터당 바이트 수입니다. 3B 모델을 FP16으로 저장하면 3×10⁹×2 = 6×10⁹ bytes, 십진 기준 6GB입니다. 이는 가중치만의 크기입니다. 실제 추론에는 KV 캐시·중간 계산·런타임 메모리가 더 들고, 학습에는 기울기와 옵티마이저 상태도 필요합니다. 따라서 6GB VRAM이면 항상 충분하다는 뜻은 아닙니다.')],exercises:[exercise('가중치 메모리 직접 계산하기','58–62쪽 · 추가 학습 예제','원문의 계산식을 Python으로 확인합니다. 실제 모델을 로드하는 코드는 아닙니다.',['B는 10억 개를 뜻합니다.','bits / 8로 파라미터당 바이트를 구합니다.','GB는 10⁹ bytes, GiB는 2³⁰ bytes로 나눕니다.'],`parameters = 3 * 10**9
bits = 16
weight_bytes = parameters * bits / 8
print(f"가중치: {weight_bytes / 10**9:.2f} GB")
print(f"가중치: {weight_bytes / 2**30:.2f} GiB")`,`6.00 GB, 5.59 GiB가 나옵니다. bits를 8로 바꾸면 가중치 저장량은 절반이 됩니다.`)],troubleshooting:[['성능 그래프의 숫자가 잘 안 보여요','아래 PDF 원문을 열어 확대하세요. 이미지에만 있는 수치는 텍스트 추출 결과로 추정하지 않습니다.'],['RAG도 모델을 다시 학습시키나요?','일반적인 RAG는 검색한 문서를 입력 문맥에 추가합니다. 모델 가중치 갱신은 별도 학습 과정입니다.']]},
{slug:'00-jupyterlab',no:'00',kind:'notebook',filename:'00_jupyterlab.ipynb',title:'JupyterLab 사용법',summary:'셀 실행 순서, 커널, Python 입력과 문자열 문법부터 익힙니다.',goals:['Shift+Enter로 셀 실행하기','변수가 유지되는 커널과 실행 순서 이해하기'],sections:[
section('노트북과 커널은 다릅니다','노트북은 코드·설명·결과를 묶은 문서이고, 커널은 코드를 실행하면서 변수를 기억하는 프로세스입니다. 아래 셀에서 first_name을 사용하려면 이를 정의한 위 셀을 먼저 실행해야 합니다. 커널을 재시작하면 변수는 사라지므로 위에서부터 다시 실행하세요.',[5,7]),
section('언어 전환 셀 읽기','Path는 파일 경로를 표현하고 read_text()는 파일 내용을 읽습니다. strip()은 앞뒤 공백·줄바꿈을 제거합니다. !로 시작하는 줄은 Python이 아니라 Jupyter의 셸 명령입니다. composer 폴더와 언어 파일이 있는 DLI 환경에서만 이 전환 셀을 실행하세요.',[3]),
section('입력과 문자열 표현','input()의 결과는 문자열입니다. f"Hello {first_name}"은 변수 값을 문장에 삽입하고, \\n은 줄바꿈입니다. 원본에는 숨김 입력과 SecretStr의 표시 방식을 보여주는 예제도 있지만 실제 비밀 값을 출력하는 주석은 실행하지 않습니다. 아래 코드는 이름 입력 부분만 제공합니다.',[7]),
section('괄호가 있으면 여러 줄로 쓸 수 있어요','괄호 안에서는 식을 여러 줄에 나눠 쓸 수 있습니다. 나란히 둔 문자열 리터럴 "Hello" "World"는 HelloWorld가 되지만 숫자 덧셈에는 +가 필요합니다. 괄호 없이 5 + 다음 줄에 6을 쓰면 구문 오류가 납니다. 원본 try/except는 이 실패를 잡아 보여주는 예제입니다.',[9])],exercises:[exercise('문자열과 숫자 결과 구분하기','셀 9 · 문법 확인','문자열 결합과 숫자 덧셈을 직접 비교합니다.',['문자열 "5"와 "8"은 숫자가 아닙니다.','숫자 5 + 6은 실제 덧셈입니다.','괄호 안에서 줄을 나누어도 같은 식입니다.'],`print("5" " " "8")
print(
    5 +
    6
)`,`첫 줄은 5 8, 둘째 줄은 11입니다.`)],troubleshooting:[['NameError: first_name','입력 셀을 먼저 실행하세요. 셀을 수정하기만 하고 실행하지 않으면 커널에는 반영되지 않습니다.'],['composer/default_language.txt를 찾지 못함','이 파일은 DLI 환경 구성입니다. 개인 환경에서는 언어 전환 셀을 건너뛰고 Python 문법 셀부터 실행하세요.']]},
{slug:'01-microservices',no:'01',kind:'notebook',filename:'01_microservices.ipynb',title:'마이크로서비스와 수업 환경',summary:'Jupyter, 모델 게이트웨이, 프런트엔드가 어떤 주소로 서로 통신하는지 이해합니다.',goals:['호스트·컨테이너·서비스 주소 구분하기','HTTP 상태 코드부터 연결 문제 확인하기'],sections:[
section('Part 1–2 · 한 환경에 여러 서비스가 있어요','Docker 컨테이너는 필요한 프로그램과 의존성을 묶은 실행 단위입니다. Jupyter, 모델 요청용 llm_client, 화면용 frontend는 각각 다른 역할을 맡습니다. docker-compose.yml은 이들을 어떻게 실행하고 연결할지 정의합니다. 내 노트북 화면이 열린다고 모든 백엔드까지 준비된 것은 아닙니다.'),
section('Part 3 · 호스트와 컨테이너 안의 차이','호스트의 docker ps -a는 컨테이너 목록을 보여줍니다. 그러나 Jupyter 컨테이너 안에서는 Docker CLI나 소켓이 없어 같은 명령이 실패할 수 있습니다. 원본의 Should fail은 예상된 실패이며, 이를 고치려고 Docker 관리자 권한부터 추가할 필요는 없습니다.',[15,18]),
section('curl 요청을 Python 요청으로 바꾸기','docker_router는 DLI 내부 네트워크의 서비스 이름입니다. curl -v는 연결·응답 헤더를 확인하기 좋고, requests.get()은 응답을 Python 객체로 다루기 좋습니다. 먼저 HTTP 성공 여부를 확인한 다음 JSON 본문을 읽어야 HTML 오류 페이지를 JSON으로 해석하는 문제를 피할 수 있습니다.',[20,22]),
section('Part 4–5 · 화면이 열린 것과 기능 완성은 달라요','frontend에 HTTP 요청을 보내 HTML과 200 응답이 오는지 확인합니다. 여기서 성공은 웹 서버가 응답한다는 뜻입니다. /generator와 /retriever는 뒤 실습에서 구현하므로 화면만 열린 상태에서 챗봇이 아직 동작하지 않는 것은 자연스럽습니다.',[27,29])],exercises:[exercise('서비스 목록 연결 확인','셀 20–22 · DLI 환경 전용','네트워크 문제와 응답 파싱 문제를 분리해 확인합니다.',['DLI Jupyter에서 실행합니다.','타임아웃과 raise_for_status()로 연결·HTTP 오류를 먼저 확인합니다.','성공한 응답만 JSON으로 바꿉니다.'],`import requests
response = requests.get("http://docker_router:8070/containers", timeout=10)
response.raise_for_status()
containers = response.json()
print(type(containers).__name__)`,`JSON 자료형이 표시되어야 합니다. 연결 실패 시 composer의 실제 포트·경로와 서비스 상태를 확인하세요. 개인 PC에서는 내부 이름이 해석되지 않습니다.`)],troubleshooting:[['docker: command not found','컨테이너 안에서 의도된 실패인지 확인합니다. 호스트용 명령과 노트북 내부 명령을 구분하세요.'],['NameResolutionError / Connection refused','전자는 서비스 이름·네트워크, 후자는 포트·프로세스 상태를 먼저 확인하세요.'],['200인데 챗봇이 안 돼요','화면 서버 상태와 모델·검색 API 상태를 따로 점검합니다.']]},
{slug:'02-llms',no:'02',kind:'notebook',filename:'02_llms.ipynb',title:'LLM 엔드포인트 호출하기',summary:'HTTP 요청, OpenAI 호환 클라이언트, ChatNVIDIA로 같은 모델 서비스에 접근합니다.',goals:['모델 목록 조회와 채팅 요청의 역할 구분하기','스트리밍 delta와 완성된 message 구분하기'],sections:[
section('Part 1–3 · 모델을 내 노트북에 올리지 않아도 돼요','큰 모델은 별도 추론 서버에서 실행하고 Jupyter는 입력을 보내 결과를 받는 클라이언트가 됩니다. DLI에서는 llm_client가 이 경계를 연결합니다. OpenAI 호환 API라는 말은 요청 형식이 호환된다는 뜻이지 OpenAI 모델이나 이 사이트의 GPT 키를 사용한다는 뜻은 아닙니다.'),
section('Part 4.1 · 모델 목록부터 확인하기','GET /v1/models는 선택 가능한 모델 ID를 확인합니다. service_url은 서버 주소, headers는 본문 형식을 알리는 설정입니다. 채팅 POST에는 model, messages, stream 같은 필드가 들어갑니다. messages의 role/content 구조와 반환 JSON을 한 단계씩 확인하면 고수준 라이브러리 오류도 원인을 좁힐 수 있습니다.',[18,19,22]),
section('Part 4.2 · 같은 요청을 클라이언트로','OpenAI 클라이언트도 base_url을 수업 서버에 맞추면 호환 엔드포인트로 요청합니다. stream=True이면 응답 조각의 choices[0].delta.content를 누적하고, 일반 응답이면 choices[0].message.content를 읽습니다. 종료 신호와 내용 없는 조각은 건너뛰어야 합니다.',[25,26]),
section('Part 4.3 · ChatNVIDIA로 체인에 연결하기','ChatNVIDIA는 뒤의 LangChain 파이프라인에 넣기 쉬운 Runnable 인터페이스를 제공합니다. invoke()는 한 번의 완성된 응답, stream()은 점진적인 조각을 얻습니다. 원본 모델 ID와 timeout·model_kwargs는 DLI 환경 기준입니다. 진단용 last_inputs/last_response나 환경 변수 전체를 공개하면 요청 내용·인증 설정이 노출될 수 있어 아래 복사 코드에서는 제외했습니다.',[28,34])],exercises:[exercise('응답 텍스트를 누적하기','셀 28 · DLI 사전 설정 필요','원본의 모델 객체 llm을 만든 다음 실행합니다.',['stream()은 여러 응답 조각을 반환합니다.','각 조각의 content만 문자열에 더합니다.','마지막 문자열과 화면에 출력된 전체 내용을 비교합니다.'],`answer = ""
for chunk in llm.stream("RAG를 한 문장으로 설명해 주세요."):
    text = chunk.content or ""
    answer += text
    print(text, end="", flush=True)
print("\\n응답 길이:", len(answer))`,`빈 문자열이 아닌 답변과 양수 길이가 나와야 합니다. 답변 문장은 생성마다 달라질 수 있습니다.`)],troubleshooting:[['401 / 403','수업에서 제공한 인증과 모델 접근 범위를 확인합니다. 이 웹사이트 챗봇 키를 노트북에 복사하는 방식이 아닙니다.'],['404 / model not found','/v1/models로 현재 수업 서비스가 제공하는 정확한 ID와 base_url을 확인하세요.'],['stream 응답에서 message가 없어요','스트리밍은 delta, 완성 응답은 message를 읽습니다.']]},
{slug:'03-langchain-intro',no:'03',kind:'notebook',filename:'03_langchain_intro.ipynb',title:'LangChain과 시 바꾸기 챗봇',summary:'Runnable과 파이프 연산자를 익히고, 두 번째 요청부터 시의 주제를 바꾸는 TODO를 완성합니다.',goals:['입력 → 프롬프트 → 모델 → 문자열 흐름 읽기','첫 요청과 후속 요청을 서로 다른 체인에 연결하기'],sections:[
section('Part 1–2 · Runnable은 연결 가능한 함수','RunnableLambda는 Python 함수를 체인 구성 요소로 감쌉니다. A | B는 A의 출력을 B의 입력으로 전달합니다. RunnablePassthrough는 입력을 그대로 유지합니다. 딕셔너리 매핑은 각 값에 같은 입력을 주고 결과를 키별로 모읍니다. “동시에 연결”하더라도 다음 단계가 기대하는 입력 자료형을 반드시 맞춰야 합니다.',[9]),
section('Part 3 · 프롬프트와 파서의 위치','ChatPromptTemplate이 입력 딕셔너리로 메시지를 만들고, ChatNVIDIA가 응답 객체를 반환하며, StrOutputParser가 텍스트로 변환합니다. 프롬프트가 {input}과 {topic}을 요구하면 두 키를 모두 전달해야 합니다. RunnableAssign을 쓰면 원래 키를 잃지 않고 생성 결과를 새 키에 넣을 수 있습니다.',[12,16,18,19]),
section('Part 4 · 첫 시와 바꾼 시를 구분하기','chain1은 input만 받아 처음 시를 만듭니다. chain2는 기존 시 input과 새 주제 topic을 함께 받습니다. rhyme_chat2_stream()은 history에서 첫 assistant 시를 찾고, 없으면 chain1, 있으면 chain2로 분기해야 합니다. 원본의 Not Implemented 뒤 return 때문에 후속 요청이 즉시 종료되는 상태입니다.',[21,22,23]),
section('Part 5 · 원격 체인도 같은 인터페이스','RemoteRunnable은 HTTP로 연결되는 원격 Runnable입니다. 이 단계에서는 /basic_chat을 먼저 확인하며, /generator와 /retriever를 실제로 구현하는 작업은 09번 노트로 이어집니다. 로컬 Python 함수가 성공했다고 원격 서버가 자동으로 배포되는 것은 아닙니다.',[25])],exercises:[exercise('후속 주제를 chain2로 보내기','셀 22 · else 내부 TODO 교체','Not Implemented 줄을 지우고 아래 블록을 else 안에 넣습니다. 기존 passage 안내 부분은 유지합니다.',['input에는 새 질문이 아니라 first_poem을 전달합니다.','topic에는 새로 받은 message를 전달합니다.','Gradio는 누적 문자열, 터미널 모드는 새 토큰만 내보냅니다.'],`buffer = "Sure! Here you go!\\n\\n"
yield buffer
for token in chain2.stream({"input": first_poem, "topic": message}):
    buffer += token
    yield buffer if return_buffer else token`,`첫 요청 “고양이”로 시를 만들고 다음 요청 “우주”를 보내세요. Not Implemented가 사라지고 주제가 바뀐 시가 생성되어야 합니다. 운율·구조는 직접 읽어 평가하세요.`)],troubleshooting:[['KeyError: topic','chain2에는 input과 topic이 모두 필요합니다.'],['글자가 계속 중복돼요','Gradio에 이미 누적한 buffer를 다시 더하고 있지 않은지 확인하세요.'],['주제가 매번 초기화돼요','history는 role/content 딕셔너리 목록입니다. assistant 메시지에서 시를 찾는 조건을 확인합니다.']]},
{slug:'04-running-state',no:'04',kind:'notebook',filename:'04_running_state.ipynb',title:'대화 상태와 항공편 조회',summary:'지식 베이스를 갱신한 다음, 필요한 필드로 모의 항공편 데이터를 조회합니다.',goals:['RunnableAssign으로 상태를 잃지 않고 갱신하기','지식 추출 → 키 선택 → 실제 조회 순서 구현하기'],sections:[
section('Part 1–2 · 상태를 한 딕셔너리에 모아요','input, output, know_base, context를 상태 딕셔너리로 전달합니다. RunnableAssign({키: 체인})은 기존 상태를 보존하면서 계산한 키를 덮어씁니다. 앞 단계에서 know_base를 갱신한 뒤 다음 단계에서 이를 조회해야 합니다. 같은 Assign 안의 형제 분기가 갱신된 값을 이미 받는다고 가정하지 마세요.',[7,9,11]),
section('Part 3 · RExtract의 다섯 단계','Pydantic 스키마 → format_instructions 추가 → 프롬프트 → 모델 텍스트 → 파서 순서입니다. RExtract의 반환값은 Pydantic 객체이며 {info_base: ...} 딕셔너리가 아닙니다. 원본 설명의 일부 예시와 실제 구현의 차이를 주의하세요. JSON이 파싱되었다고 내용까지 사실로 검증된 것은 아닙니다.',[17,19,22,25]),
section('Part 4 · 항공편 조회에 필요한 세 필드','KnowledgeBase는 이름·성·예약 번호와 대화 요약을 보관합니다. get_key_fn()은 그중 조회에 필요한 세 값만 딕셔너리로 만듭니다. get_flight_info()는 원본에 들어 있는 모의 데이터베이스 함수입니다. 실제 항공사 예약 시스템이 아니며 세 필드 일치가 실서비스 인증을 대신하는 것도 아닙니다.',[30,36]),
section('추출과 사용자 답변을 분리하기','internal_chain은 know_base와 context를 갱신하고 external_chain은 이를 읽어 답변합니다. 모르는 예약 번호를 임의로 만들지 않고 None/unknown으로 유지해야 합니다. 원본 셀 38은 Optional을 사용하므로 from typing import Optional도 먼저 추가합니다.',[38])],exercises:[exercise('지식 추출기와 DB 조회기 연결','셀 38 · knowbase_getter / database_getter 교체','셀 22의 RExtract, 셀 30의 get_flight_info, 셀 36의 get_key_fn 정의가 먼저 필요합니다.',['parser_prompt는 기존 know_base·input·output을 읽어 업데이트합니다.','첫 Assign에서 갱신된 know_base를 저장합니다.','다음 Assign에서 get_key_fn을 거쳐 DB를 조회합니다.'],`from typing import Optional

knowbase_getter = RExtract(KnowledgeBase, instruct_llm, parser_prompt)
database_getter = (
    RunnableLambda(lambda state: state["know_base"])
    | RunnableLambda(get_key_fn)
    | RunnableLambda(get_flight_info)
)
internal_chain = (
    RunnableAssign({"know_base": knowbase_getter})
    | RunnableAssign({"context": database_getter})
)`,`원본 모의 인물 Jane Doe / 12345를 단계적으로 알려주세요. know_base가 누적되고 San Jose → New Orleans 조회 결과가 context에 들어가야 합니다. 틀린 번호에는 정보를 지어내지 않아야 합니다.`)],troubleshooting:[['Optional이 정의되지 않았어요','셀 38의 클래스 정의 전에 from typing import Optional을 실행합니다.'],['대화할 때마다 이름을 잊어요','knowbase_getter를 항상 빈 KnowledgeBase()를 반환하는 원본 placeholder로 두지 않았는지 확인합니다.'],['Pydantic 파싱 오류','모델 출력 형식과 스키마를 확인하고 이전 유효 상태를 보존합니다. 임의 문자열 보정만으로 모든 JSON 오류를 해결할 수는 없습니다.']]},
{slug:'05-documents',no:'05',kind:'notebook',filename:'05_documents.ipynb',title:'문서 로딩과 누적 요약',summary:'PDF를 Document와 청크로 나누고, 청크마다 요약 상태를 업데이트합니다.',goals:['page_content와 metadata 구분하기','RSummarizer의 상태 초기화·반복 갱신 TODO 완성하기'],sections:[
section('Part 1–2 · 원문과 메타데이터를 함께 보세요','문서 로더의 결과는 Document 목록입니다. page_content에는 본문, metadata에는 제목·출처 등의 보조 정보가 들어갑니다. 메타데이터만 읽어서는 논문의 결론과 근거를 알 수 없습니다. 먼저 로드 개수와 첫 문서의 본문 일부를 확인합니다.',[8,10,12]),
section('Part 3 · 청크와 overlap','RecursiveCharacterTextSplitter는 문단·줄·문장 등 경계를 순서대로 사용해 텍스트를 나눕니다. chunk_overlap은 경계 부근 문맥이 완전히 끊기지 않도록 일부를 겹칩니다. 기본 길이 함수 기준 크기는 문자 수이며 모델의 토큰 수와 같지 않습니다.',[15,16]),
section('Part 4 · 요약을 새로 쓰지 말고 갱신해요','DocumentSummaryBase는 running_summary, main_ideas, loose_ends를 가집니다. summary_prompt는 이전 info_base와 새 input을 함께 읽습니다. RExtract(DocumentSummaryBase, ...)로 구조화된 새 요약 객체를 만들고, 이를 다음 청크의 이전 상태로 사용합니다.',[19,21,23]),
section('Part 5 · 요약도 확인이 필요해요','각 청크를 누적해서 본다고 모든 세부 정보가 보존되지는 않습니다. 뒤 청크가 앞의 중요한 사실을 덮어썼는지 원문과 대조하세요. latest_summary는 중간 점검용이고 원본에서는 verbose=True 분기 안에서만 갱신되는 점도 주의합니다.',[24])],exercises:[exercise('RSummarizer 완성하기','셀 23 · 함수 전체 교체','위 셀의 RExtract와 DocumentSummaryBase, summary_prompt를 그대로 사용합니다.',['knowledge.__class__로 파서가 사용할 클래스를 얻습니다.','info_base에 초기 객체를 넣습니다.','매번 doc.page_content를 input으로 전달하고 새 상태를 저장합니다.'],`def RSummarizer(knowledge, llm, prompt, verbose=False):
    parse_chain = RunnableAssign({
        "info_base": RExtract(knowledge.__class__, llm, prompt)
    })
    def summarize_docs(docs):
        global latest_summary
        state = {"info_base": knowledge}
        for i, doc in enumerate(docs):
            state["input"] = doc.page_content
            state = parse_chain.invoke(state)
            latest_summary = state["info_base"]
            if verbose:
                print(f"처리한 청크: {i + 1}")
                pprint(latest_summary)
        return state["info_base"]
    return RunnableLambda(summarize_docs)`,`먼저 docs_split[:2]로 실행하세요. 결과는 문자열이 아니라 DocumentSummaryBase 객체이며 running_summary에 두 청크의 핵심 내용이 남아야 합니다.`)],troubleshooting:[['assert info_base in state 실패','초기 상태에 info_base를 넣고 parse_chain.invoke()의 반환값을 state에 저장합니다.'],['KeyError: input','Document 전체 대신 doc.page_content를 state["input"]에 넣었는지 확인합니다.'],['너무 오래 걸려요','이 예제는 청크마다 모델을 호출합니다. 2개로 확인한 뒤 원본의 15개로 늘리세요.']]},
{slug:'06-embeddings',no:'06',kind:'notebook',filename:'06_embeddings.ipynb',title:'임베딩과 유사도 비교',summary:'질문·문서 벡터를 비교하고, 짧은 답을 긴 문서로 바꾸는 체인을 완성합니다.',goals:['embed_query와 embed_documents의 입출력 구분하기','유사도 행렬을 읽고 긴 문서 실험하기'],sections:[
section('Part 1–2 · 질문과 문서는 같은 역할이 아니에요','embed_query(문자열)는 벡터 하나, embed_documents(문자열 목록)는 벡터 목록을 반환합니다. 원본의 course/embedding은 수업 서버의 모델 별칭입니다. 모델에 따라 질문·문서 인코딩 경로가 다를 수 있으며 인덱스를 만들 때와 검색할 때는 호환되는 동일 임베딩 구성을 사용해야 합니다.',[6,7,9,11]),
section('유사도 행렬 읽기','코사인 유사도는 벡터 방향의 가까움을 비교합니다. 행과 열이 각각 무엇인지 축 라벨과 함수 인자 순서로 확인합니다. 대응하는 질문·문서 쌍의 값이 상대적으로 높은지 보는 실험이지 대각선 값이 무조건 최대여야 한다는 규칙은 아닙니다. 값이 높다고 사실인 문서라는 뜻도 아닙니다.',[13,15]),
section('Part 3 · 긴 문서 만들기','expound_prompt는 전체 questions와 집중할 질문 q1을 입력받습니다. expound_chain의 빈 {} 대신 prompt | llm | StrOutputParser()를 연결하고, 질문마다 두 키를 전달합니다. 생성한 긴 글에 답이 실제로 포함되는지도 확인해야 합니다.',[17,19]),
section('Part 4 · 가드레일 실습 범위','원본은 시맨틱 가드레일 과제를 64_guardrails.ipynb로 안내합니다. 현재 받은 한글 노트북 10개에는 이 파일이 없으므로 정답이나 구체 코드를 만들어 원본 과제처럼 제시하지 않습니다. 이 노트에서는 관련성 유사도를 안전성의 완전한 판정으로 쓰면 안 된다는 점까지 기억하세요.')],exercises:[exercise('긴 문서 생성 체인 완성','셀 17 · 두 TODO 교체','앞에서 정의한 expound_prompt와 instruct_llm을 사용합니다.',['StrOutputParser로 문자열을 얻습니다.','questions에는 전체 질문 목록을 넣습니다.','q1에는 현재 반복 중인 q를 넣습니다.'],`expound_chain = expound_prompt | instruct_llm | StrOutputParser()
longer_docs = []
for q in queries:
    longer_doc = expound_chain.invoke({
        "questions": "\\n".join(queries),
        "q1": q,
    })
    longer_docs.append(longer_doc)
    print(q, longer_doc, sep="\\n")`,`len(longer_docs) == len(queries)이고 모든 문자열이 비어 있지 않아야 합니다. 이어서 셀 19로 유사도를 비교합니다. doc[:2048]은 2048문자 제한이지 2048토큰 제한이 아닙니다.`)],troubleshooting:[['벡터 차원이 안 맞아요','질문과 문서에 다른 모델을 섞지 않았는지 확인하고 변경했다면 문서 벡터도 다시 만듭니다.'],['긴 문서를 잘랐는데 토큰 초과예요','문자 수와 토큰 수는 다릅니다. 모델의 실제 입력 제한에 맞춰 청킹하거나 토크나이저 기준 길이를 확인하세요.']]},
{slug:'07-vectorstores',no:'07',kind:'notebook',filename:'07_vectorstores.ipynb',title:'벡터 검색과 RAG 챗봇',summary:'FAISS에 문서와 대화를 저장하고, 두 검색 결과를 프롬프트에 연결합니다.',goals:['문서 저장소와 대화 저장소 역할 구분하기','history·context TODO를 실제 검색 체인으로 바꾸기'],sections:[
section('Part 1–2 · 벡터 저장소가 하는 일','FAISS.from_texts는 문자열을 임베딩해 인덱스를 만들고, as_retriever().invoke(question)은 관련 Document 목록을 돌려줍니다. retriever가 이미 답변을 만드는 것은 아닙니다. 검색 결과를 docs2str로 문자열화하고 프롬프트에 넣은 다음 모델이 답변을 만듭니다.',[14,16,17,22,23]),
section('검색 후 재정렬과 대화 저장','선택적인 NVIDIARerank는 검색된 후보의 순위를 다시 매깁니다. LongContextReorder는 긴 문맥의 배치 순서를 바꾸는 변환기로 리랭킹 모델과 다릅니다. convstore에는 과거 user/assistant 발화를 저장합니다. 이를 권위 있는 문서 사실로 취급하지 않도록 docstore의 원문과 구분해야 합니다.',[20,30]),
section('Part 3 Task 1–2 · 원문을 로드해 인덱스를 만들어요','논문을 로드하고 References 이후를 자른 다음 청킹합니다. 원본은 짧은 청크를 제거하므로 문서에 따라 청크 목록이 비어 있을 수 있습니다. chunks[0]을 읽기 전에 빈 목록을 걸러야 합니다. 실시간 arXiv가 실패하면 수업에 제공된 캐시 파일을 사용하도록 되어 있습니다.',[34,36,38]),
section('Task 3–4 · 두 종류의 context를 조립하기','질문 문자열을 {input: 질문}으로 바꾸고, convstore 검색 결과는 history에, docstore 검색 결과는 context에 넣습니다. stream_chain은 input/history/context 세 키를 읽습니다. 생성 뒤 저장하는 대화는 이번 답변의 검색 단계에 미리 들어가지 않도록 순서를 유지합니다.',[40,42]),
section('Part 4 · 인덱스는 모델과 한 쌍이에요','save_local()로 저장한 인덱스와 동일 임베딩 구성을 08·09번에서 사용합니다. 압축 파일 안의 FAISS 문서 저장소는 역직렬화를 포함할 수 있으므로 자신이 만든 신뢰 가능한 파일만 복원합니다. 인터넷에서 받은 임의 인덱스에 dangerous deserialization 옵션을 켜지 않습니다.',[44,46])],exercises:[exercise('history와 context에 실제 검색 결과 넣기','셀 40 · retrieval_chain 교체','앞의 convstore, docstore, docs2str가 준비된 상태에서 실행합니다.',['itemgetter("input")으로 질문 문자열을 뽑습니다.','각 저장소의 retriever를 호출합니다.','Document 목록을 재배치한 뒤 프롬프트용 문자열로 만듭니다.'],`long_reorder = RunnableLambda(LongContextReorder().transform_documents)
history_getter = (
    itemgetter("input") | convstore.as_retriever()
    | long_reorder | RunnableLambda(docs2str)
)
context_getter = (
    itemgetter("input") | docstore.as_retriever()
    | long_reorder | RunnableLambda(docs2str)
)
retrieval_chain = (
    {"input": lambda question: question}
    | RunnableAssign({"history": history_getter})
    | RunnableAssign({"context": context_getter})
)`,`retrieval_chain.invoke("Tell me about RAG!") 결과의 context가 None이 아닌 문서 문자열이어야 합니다. 첫 대화에는 history가 비어 있어도 정상입니다.`),exercise('빈 청크 목록 방어하기','셀 34 · 짧은 청크 필터 다음','원본의 chunks[0] 접근 전에 넣는 보완 예제입니다.',['빈 문서 묶음을 제거합니다.','전체가 비었으면 원문 로딩과 필터를 다시 확인합니다.'],`docs_chunks = [chunks for chunks in docs_chunks if chunks]
if not docs_chunks:
    raise ValueError("검색할 청크가 없습니다. 문서 로딩과 길이 필터를 확인하세요.")`,`메타데이터 접근에서 IndexError가 나지 않고, 실제 문서가 없는 상태는 명확한 오류로 멈춰야 합니다.`)],troubleshooting:[['답변에 근거가 안 붙어요','생성 모델부터 바꾸지 말고 retrieval_chain 출력과 docs2str에 제목이 포함되는지 먼저 확인합니다.'],['FAISS 차원 오류','인덱스를 만들 때의 임베딩 모델과 지금 검색 모델이 같은지 확인하세요.'],['arXiv 접속 실패','원본이 안내한 cached_papers 파일 존재 여부를 확인합니다. 실패한 로딩을 빈 데이터로 계속 진행하지 마세요.']]},
{slug:'08-evaluation',no:'08',kind:'notebook',filename:'08_evaluation.ipynb',title:'RAG 평가와 답변 비교',summary:'합성 질문, RAG 답변, 판정 결과를 따로 보관하고 평가 수치의 한계를 읽습니다.',goals:['검색·생성 체인의 입출력 계약 완성하기','합성 정답을 무조건 사실로 취급하지 않기'],sections:[
section('Part 1–2 · 잘 답하는지 어떻게 확인하나요?','몇 번 대화가 자연스럽다고 검색 품질이 검증된 것은 아닙니다. 질문에 필요한 근거가 검색됐는지, 생성 답변이 근거에 충실한지, 모를 때 모른다고 말하는지 나누어 확인합니다. LLM-as-a-Judge는 모델로 답변을 비교하는 도구이지 사람 검토를 대체하는 절대 정답기가 아닙니다.'),
section('Part 3 Task 1–2 · 기존 RAG를 가져오기','07번에서 만든 신뢰 가능한 인덱스를 같은 임베딩 모델로 불러옵니다. retrieval_chain은 문자열을 {input, context}로, generator_chain은 그것을 답변 문자열로 바꿉니다. 원본의 identity placeholder는 검색도 생성도 하지 않으므로 두 TODO를 모두 바꿔야 합니다.',[7,9]),
section('Step 3–4 · 질문과 답변을 나란히 보관','문서에서 합성 질문·답변을 만들고 synth_questions를 순회하며 실제 rag_chain의 답을 rag_answers에 넣습니다. 세 목록의 길이와 순서가 같아야 같은 질문의 두 답을 비교할 수 있습니다. 모델로 만든 synth_answers는 문서와 대조하기 전에는 검증된 정답이 아닙니다.',[11,13]),
section('Step 5 · 점수는 판정 규칙에 의존해요','원본 judge 프롬프트는 첫 답을 무조건 참이라고 가정하고 [1]/[2]를 고르게 합니다. 따라서 출력은 이 규칙 아래의 선호 비율이지 객관적 정확도가 아닙니다. 원본 마지막 셀은 pref_score 목록을 숫자로 덮어써 재실행 시 오류가 날 수 있으므로 원문 판정과 집계 변수를 분리하는 편이 좋습니다.',[15,17]),
section('Part 4–5 · 최종 평가는 원래 수업 화면에서','서로 다른 문서·질문, 답할 수 없는 질문도 검토합니다. 실제 코스 수료 평가는 DLI의 제공 화면과 기준을 사용합니다. 이 해설의 예제 코드와 자체 점검은 공식 평가 통과를 보장하거나 대신 제출하는 기능이 아닙니다.')],exercises:[exercise('검색·생성 체인 TODO 완성','셀 9 · 두 placeholder 교체','docstore, long_reorder, docs2str, chat_prompt, llm이 먼저 정의되어 있어야 합니다.',['context_getter의 입력은 문자열이 아니라 상태 딕셔너리입니다.','프롬프트 → llm을 연결합니다.','아래 원본의 output 래퍼와 rag_chain 결합은 유지합니다.'],`context_getter = (
    itemgetter("input") | docstore.as_retriever()
    | long_reorder | RunnableLambda(docs2str)
)
retrieval_chain = (
    {"input": lambda question: question}
    | RunnableAssign({"context": context_getter})
)
generator_chain = chat_prompt | llm
generator_chain = {"output": generator_chain} | RunnableLambda(output_puller)
rag_chain = retrieval_chain | generator_chain`,`rag_chain.invoke(질문)은 실제 문서에 근거한 답변을 반환해야 합니다. 반환값이 질문 그대로이거나 딕셔너리 repr이면 placeholder/파서 위치를 점검하세요.`),exercise('합성 질문에 실제 RAG 답변 만들기','셀 13 · rag_answer 빈 문자열 교체','위에서 완성한 rag_chain을 질문마다 호출합니다.',['각 질문을 stream에 전달합니다.','반환 문자열 조각들을 하나로 합칩니다.','질문 순서대로 저장합니다.'],`rag_answers = []
for question in synth_questions:
    answer = "".join(rag_chain.stream(question))
    rag_answers.append(answer)
assert len(rag_answers) == len(synth_questions)`,`모든 항목이 비어 있지 않고 해당 질문과 대응해야 합니다. synth_answers와 RAG 답변 모두 원문 근거를 확인하세요.`),exercise('판정 결과를 덮어쓰지 않고 집계하기','셀 17 · 집계 보완 예제','셀 15 직후 pref_score가 아직 문자열 목록일 때 실행합니다.',['판정 시작 부분의 [1]/[2]만 파싱합니다.','판정 형식이 아닌 응답은 집계에서 제외하고 별도로 검토합니다.','빈 목록은 0으로 나누지 않습니다.'],`import re
judge_results = list(pref_score)
labels = [re.match(r"^\\s*\\[([12])\\]", text) for text in judge_results]
valid = [int(match.group(1)) for match in labels if match]
preference_rate = sum(value == 2 for value in valid) / len(valid) if valid else None
print("유효 판정:", len(valid), "선호 비율:", preference_rate)`,`본문에 [2]가 언급됐다는 이유만으로 승리로 세지 않습니다. 비율은 이 judge 규칙의 결과이며 사실 정확도가 아닙니다.`)],troubleshooting:[['division by zero','질문 생성·판정에 성공한 항목이 있는지 먼저 확인합니다.'],['zip이 조용히 일부만 평가해요','zip은 가장 짧은 목록에 맞춥니다. 세 목록 길이가 동일한지 검증하세요.'],['점수는 높은데 답이 틀려요','합성 기준 답, 검색 근거, 판정 프롬프트를 직접 검토하세요.']]},
{slug:'09-langserve',no:'09',kind:'notebook',filename:'09_langserve.ipynb',title:'LangServe로 체인 제공하기',summary:'완성한 검색기와 생성기를 /retriever, /generator API로 연결합니다.',goals:['노트북 커널과 server_app.py 프로세스 구분하기','RemoteRunnable로 서버 입출력 확인하기'],sections:[
section('Part 1 · 파일로 내보내는 순간을 주의하세요','%%writefile server_app.py는 셀 본문을 Python 파일로 저장합니다. 노트북의 변수와 함수가 실행 중인 서버 프로세스에 자동으로 공유되지는 않습니다. 필요한 import, 임베딩 구성, 인덱스 로딩, docs2str와 프롬프트 정의를 파일 안에 포함해야 합니다.',[4]),
section('/basic_chat, /retriever, /generator 역할','/basic_chat은 기본 모델 호출입니다. /retriever는 질문 문자열을 Document 목록으로 바꾸고, /generator는 {input, context}를 받아 답변 문자열을 만듭니다. add_routes는 Runnable을 HTTP 엔드포인트로 노출합니다. 원본의 빈 목록·Not Implemented 반환은 실제 컴포넌트로 바꿔야 합니다.',[4]),
section('Part 2 · 실행과 확인','python server_app.py는 현재 셀을 점유하며 서버를 실행합니다. 파일을 수정해 저장한 다음 실행 중인 서버를 중단·재시작해야 반영됩니다. 같은 포트 9012에 서버를 두 번 실행하면 충돌합니다. nohup 등으로 무작정 여러 개를 띄우기보다 한 프로세스 상태를 확인하세요.',[5]),
section('Part 3 · 수업 프런트와 같은 계약으로 테스트','RemoteRunnable로 retriever만 먼저 호출한 뒤 결과를 문자열 context로 바꾸고 generator에 전달합니다. 실제 수업 화면도 이 경계를 사용하므로 두 엔드포인트가 각자 맞는 자료형을 반환하는지 확인해야 합니다. 이 사이트의 Sol 챗봇 API와 원본 DLI 수료 평가용 LangServe는 별도 시스템입니다.')],exercises:[exercise('두 add_routes의 placeholder 교체','셀 4 · server_app.py 안에 반영','먼저 08번의 인덱스 로딩, docs2str, chat_prompt 정의를 server_app.py 안으로 옮기세요. 임베딩 모델은 인덱스 생성 시와 동일해야 합니다.',['docstore는 파일 내부에서 로드한 FAISS 인덱스입니다.','retriever는 문서 목록을 반환하므로 여기서 docs2str를 붙이지 않습니다.','generator는 이미 문자열인 context를 받아 생성만 수행합니다.'],`retriever = docstore.as_retriever()
generator = chat_prompt | instruct_llm | StrOutputParser()

add_routes(app, retriever, path="/retriever")
add_routes(app, generator, path="/generator")`,`위 코드를 기존 placeholder add_routes 대신 사용합니다. 같은 경로를 두 번 등록하지 마세요. 서버를 재시작한 후 아래 셀로 확인합니다.`),exercise('원격 요청을 단계별로 확인','서버 실행 후 별도 Jupyter 셀 · DLI 환경 전용','앞에서 완성한 docs2str 함수가 현재 노트북에도 정의되어 있어야 합니다.',['retriever 결과가 Document 목록인지 확인합니다.','docs2str로 본문·제목을 문자열로 만듭니다.','generator에 input과 context를 같이 보냅니다.'],`from langserve import RemoteRunnable

retriever_api = RemoteRunnable("http://lab:9012/retriever/")
generator_api = RemoteRunnable("http://lab:9012/generator/")
question = "What is retrieval-augmented generation?"
documents = retriever_api.invoke(question)
print("검색 문서 수:", len(documents))
answer = generator_api.invoke({"input": question, "context": docs2str(documents)})
print(answer)`,`문서 수가 양수이고 답변이 Not Implemented가 아니어야 합니다. 내부 hostname은 수업 compose 구성에 맞춰 확인하세요.`)],troubleshooting:[['NameError: docstore / docs2str','이전 노트북에만 정의돼 있는 것은 아닌지 확인합니다. server_app.py는 독립 프로세스입니다.'],['Address already in use','9012 포트의 기존 서버를 중단한 다음 재실행하세요.'],['422 validation error','retriever는 문자열, generator는 input/context 딕셔너리를 받는지 확인합니다.']]}
];
