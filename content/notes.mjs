// Korean teaching notes adapted from the supplied course; examples are not official solutions.
export const notes = [
  {
    "slug": "introduction-to-llm",
    "no": "PPT",
    "kind": "slides",
    "title": "Introduction to LLM",
    "summary": "LLM은 어떻게 문장을 만들고, 자료를 참고해 답할까요? 생성의 원리부터 학습과 실행에 필요한 자원까지 차근차근 살펴봅니다.",
    "goals": [
      "슬라이드의 다섯 파트를 연결해 설명하기",
      "학습·추론·검색의 차이와 GPU 메모리 계산 이해하기"
    ],
    "sections": [
      {
        "title": "먼저, LLM으로 무엇을 만들까요?",
        "text": "우리가 만들 것은 문서를 참고해 질문에 답하는 챗봇입니다. 이를 이해하려면 먼저 모델이 문장을 만드는 방식과, 모델 밖의 자료를 사용하는 방식을 구분하면 됩니다.\n\n이 강의에서는 생성의 원리를 익힌 뒤 추론·도구 사용·학습으로 시야를 넓힙니다. 마지막에는 이미지와 음성을 다루는 방법, 모델 실행에 필요한 메모리까지 연결해 봅니다.",
        "reference": "1–3쪽"
      },
      {
        "title": "LLM은 다음 토큰을 하나씩 예측합니다",
        "text": "모델은 문장을 토큰이라는 작은 단위로 나누고 숫자 벡터로 바꿉니다. Transformer의 어텐션은 문맥의 어떤 정보에 주목할지 계산하고, MLP는 각 위치의 표현을 변환합니다.\n\n생성은 지금까지의 문맥에서 다음 토큰을 골라 붙이는 과정의 반복입니다. 자연스럽게 이어지는 문장이라고 항상 사실인 것은 아닙니다. 그래서 문서의 근거를 함께 주는 검색 증강 생성(RAG)이 필요해집니다.",
        "reference": "4–12쪽"
      },
      {
        "title": "생각을 더 하고, 필요하면 도구를 씁니다",
        "text": "추론은 문제를 풀기 위한 계산을 더 수행하는 것이고, 도구 사용은 검색이나 함수 실행처럼 모델 밖의 일을 요청하는 것입니다. 둘은 함께 쓰일 수 있지만 같은 기능은 아닙니다.\n\n예를 들어 모델이 조회할 함수와 인자를 정하면, 애플리케이션이 요청을 확인하고 함수를 실행합니다. 그 결과를 받은 모델이 다음 응답을 만듭니다. 이처럼 관찰·결정·행동을 반복하도록 구성한 시스템을 에이전트로 이해하면 됩니다.",
        "reference": "13–26쪽"
      },
      {
        "title": "학습은 가중치를, RAG는 입력 문맥을 바꿉니다",
        "text": "학습에서는 예측을 만들고 손실을 계산한 뒤, 역전파로 얻은 기울기를 이용해 파라미터를 갱신합니다. 사전학습은 많은 데이터의 패턴을 익히는 과정이고, 후학습은 지시 따르기 등 원하는 행동을 다듬는 과정입니다.\n\n반면 일반적인 RAG는 검색한 문서를 질문과 함께 넣습니다. 이때 모델의 가중치는 그대로입니다. “모델 자체를 바꾸는가, 답할 때 참고할 자료를 더하는가”를 기준으로 구분해 보세요.",
        "reference": "27–39쪽"
      },
      {
        "title": "텍스트 밖의 정보도 함께 다룰 수 있습니다",
        "text": "멀티모달 모델은 이미지·오디오·영상도 계산 가능한 표현으로 바꾸어 다룹니다. 사진 속 대상, 음성의 소리, 영상의 시간 순서처럼 텍스트만으로 놓칠 정보를 활용할 수 있습니다.\n\n입력을 이해하는 능력과 출력을 만드는 능력은 구분해야 합니다. 이미지를 읽는 모델이 반드시 이미지를 생성하는 것은 아닙니다. 어떤 입력과 출력을 지원하는지 각각 살펴보세요.",
        "reference": "40–46쪽"
      },
      {
        "title": "계산에 쓰는 크기와 저장하는 크기는 다릅니다",
        "text": "MoE는 토큰을 처리할 때 일부 전문가만 활성화합니다. 활성 파라미터 수는 연산량을 이해하는 단서이지만, 저장해야 하는 전체 가중치 수와는 다릅니다.\n\n저장량에는 파라미터 하나를 몇 비트로 표현하는지도 영향을 줍니다. 16비트를 8비트나 4비트로 줄이면 가중치 저장량은 작아집니다. 다만 정밀도와 품질, 실행 환경의 지원도 함께 달라질 수 있습니다.",
        "reference": "47–57쪽"
      },
      {
        "title": "가중치 메모리를 직접 계산해 봅시다",
        "text": "계산식은 “전체 파라미터 수 × 파라미터당 바이트 수”입니다. 3B는 30억 개, FP16은 하나당 2바이트이므로 가중치만 6GB가 됩니다. 아래에서 비트 수를 바꾸며 차이를 확인해 보세요.\n\n실제 추론에는 KV 캐시와 중간 계산 공간도 필요합니다. 학습할 때는 기울기와 옵티마이저 상태까지 더해집니다. 따라서 이 계산은 전체 필요 메모리가 아니라 가중치의 크기를 구하는 출발점입니다.",
        "reference": "58–63쪽"
      }
    ],
    "exercises": [
      {
        "title": "가중치 메모리 직접 계산하기",
        "location": "58–62쪽 · 추가 학습 예제",
        "goal": "원문의 계산식을 Python으로 확인합니다. 실제 모델을 로드하는 코드는 아닙니다.",
        "steps": [
          "B는 10억 개를 뜻합니다.",
          "bits / 8로 파라미터당 바이트를 구합니다.",
          "GB는 10⁹ bytes, GiB는 2³⁰ bytes로 나눕니다."
        ],
        "code": "parameters = 3 * 10**9\nbits = 16\nweight_bytes = parameters * bits / 8\nprint(f\"가중치: {weight_bytes / 10**9:.2f} GB\")\nprint(f\"가중치: {weight_bytes / 2**30:.2f} GiB\")",
        "check": "6.00 GB, 5.59 GiB가 나옵니다. bits를 8로 바꾸면 가중치 저장량은 절반이 됩니다."
      }
    ],
    "troubleshooting": [
      [
        "강연의 성능 비교 그래프는 어떻게 읽나요?",
        "그래프는 강연 당시의 비교입니다. 세부 수치는 노트 끝의 참고자료에서 PDF를 확대해 확인하세요. 현재 모델 순위를 뜻하는 것은 아닙니다."
      ],
      [
        "RAG도 모델을 다시 학습시키나요?",
        "일반적인 RAG는 검색한 문서를 입력 문맥에 추가합니다. 모델 가중치 갱신은 별도 학습 과정입니다."
      ]
    ],
    "takeaway": "LLM은 문맥을 바탕으로 다음 토큰을 예측합니다. 검색은 답할 근거를 더하고, 학습은 모델의 가중치를 바꿉니다.",
    "flow": [
      "문장을 만드는 원리",
      "학습과 도구의 역할",
      "모델을 실행하는 자원"
    ],
    "bridge": "이제 원리를 코드로 확인할 차례입니다. 첫 실습에서는 JupyterLab의 셀을 실행하고, 다음 셀로 변수가 어떻게 이어지는지 살펴봅니다.",
    "review": [
      "검색한 자료를 프롬프트에 넣는 것과 모델을 다시 학습시키는 것은 어떻게 다를까요?",
      "3B · FP16 가중치가 6GB라면, 실제 실행에도 메모리가 6GB만 필요할까요?"
    ]
  },
  {
    "slug": "00-jupyterlab",
    "no": "00",
    "kind": "notebook",
    "filename": "00_jupyterlab.ipynb",
    "title": "JupyterLab 사용법",
    "summary": "코드를 실행하는 셀과 변수를 기억하는 커널을 구분해 봅니다. 짧은 Python 예제로 실습의 기본 동작부터 익힙니다.",
    "goals": [
      "Shift+Enter로 셀 실행하기",
      "변수가 유지되는 커널과 실행 순서 이해하기"
    ],
    "sections": [
      {
        "title": "셀은 코드를 담고, 커널은 실행합니다",
        "text": "노트북은 코드와 설명을 담은 문서입니다. 셀에서 Shift+Enter를 누르면 커널이 그 코드를 실행하고, 만들어진 변수를 기억합니다.\n\n예를 들어 아래 셀에서 first_name을 쓰려면 이름을 입력받는 셀을 먼저 실행해야 합니다. 커널을 재시작하면 변수도 사라집니다. 실행 결과가 예상과 다를 때는 위에서부터 순서대로 실행했는지 먼저 확인하세요.",
        "cells": [
          5
        ]
      },
      {
        "title": "수업 환경의 언어 설정을 읽어 봅시다",
        "text": "언어 전환 셀은 설정 파일을 읽어 수업 화면의 언어를 바꿉니다. Path는 경로, read_text()는 파일 읽기, strip()은 앞뒤 공백 제거를 맡습니다.\n\n느낌표(!)로 시작하는 줄은 Python이 아니라 셸 명령입니다. 이 셀은 composer 폴더가 있는 DLI 환경용이므로, 개인 PC에서 문법만 연습한다면 건너뛰어도 됩니다.",
        "cells": [
          3
        ]
      },
      {
        "title": "입력한 값은 문자열이 됩니다",
        "text": "input()으로 받은 이름은 문자열입니다. f\"Hello {first_name}\"처럼 쓰면 변수의 값을 문장 안에 넣을 수 있고, \\n은 줄바꿈을 나타냅니다.\n\n이름을 바꾸어 입력한 뒤 출력 문장이 어떻게 달라지는지 확인해 보세요. 아래 셀에는 이름 입력과 문자열 표현을 중심으로 발췌한 코드가 있습니다.",
        "cells": [
          7
        ]
      },
      {
        "title": "문자열 결합과 숫자 덧셈을 구분합니다",
        "text": "나란히 놓인 문자열 리터럴 \"Hello\" \"World\"는 HelloWorld로 이어집니다. 반면 숫자를 더하려면 5 + 6처럼 연산자가 필요합니다.\n\n괄호 안의 식은 여러 줄로 나눠 적어도 됩니다. 괄호 없이 5 + 다음 줄에 6을 쓰면 구문 오류가 납니다. 이제 아래 예제로 문자열과 숫자의 결과를 직접 비교해 봅시다.",
        "cells": [
          9
        ]
      }
    ],
    "exercises": [
      {
        "title": "문자열과 숫자 결과 구분하기",
        "location": "셀 9 · 문법 확인",
        "goal": "문자열 결합과 숫자 덧셈을 직접 비교합니다.",
        "steps": [
          "문자열 \"5\"와 \"8\"은 숫자가 아닙니다.",
          "숫자 5 + 6은 실제 덧셈입니다.",
          "괄호 안에서 줄을 나누어도 같은 식입니다."
        ],
        "code": "print(\"5\" \" \" \"8\")\nprint(\n    5 +\n    6\n)",
        "check": "첫 줄은 5 8, 둘째 줄은 11입니다."
      }
    ],
    "troubleshooting": [
      [
        "NameError: first_name",
        "입력 셀을 먼저 실행하세요. 셀을 수정하기만 하고 실행하지 않으면 커널에는 반영되지 않습니다."
      ],
      [
        "composer/default_language.txt를 찾지 못함",
        "이 파일은 DLI 환경 구성입니다. 개인 환경에서는 언어 전환 셀을 건너뛰고 Python 문법 셀부터 실행하세요."
      ]
    ],
    "takeaway": "셀을 수정하는 것과 실행하는 것은 다릅니다. 다음 셀에서 쓸 변수는 먼저 실행해 커널에 만들어 두어야 합니다.",
    "flow": [
      "셀 실행",
      "커널에 변수 저장",
      "다음 셀에서 사용"
    ],
    "bridge": "셀을 실행할 수 있게 되었습니다. 다음에는 이 코드가 수업 환경의 다른 서비스와 어떻게 통신하는지 살펴봅니다.",
    "review": [
      "커널을 재시작한 뒤 아래 셀만 실행하면 왜 NameError가 날까요?"
    ]
  },
  {
    "slug": "01-microservices",
    "no": "01",
    "kind": "notebook",
    "filename": "01_microservices.ipynb",
    "title": "마이크로서비스와 수업 환경",
    "summary": "Jupyter, 모델 서버, 웹 화면은 서로 다른 일을 합니다. 요청 하나를 보내 보며 서비스 사이의 연결을 이해합니다.",
    "goals": [
      "호스트·컨테이너·서비스 주소 구분하기",
      "HTTP 상태 코드부터 연결 문제 확인하기"
    ],
    "sections": [
      {
        "title": "수업 환경은 여러 서비스의 연결입니다",
        "text": "Jupyter는 코드를 실행하고, llm_client는 모델 요청을 연결하며, frontend는 웹 화면을 제공합니다. Docker 컨테이너는 각 프로그램과 의존성을 묶어 실행하는 단위이고, docker-compose.yml은 이들을 연결하는 구성을 담습니다.\n\n한 서비스가 정상이어도 다른 서비스는 아직 준비되지 않았을 수 있습니다. 먼저 “지금 어디에서 어디로 요청하는가”를 생각하면 연결 문제를 이해하기 쉬워집니다.",
        "reference": "Part 1–2"
      },
      {
        "title": "같은 명령도 실행 위치에 따라 달라집니다",
        "text": "호스트에서 docker ps -a를 실행하면 컨테이너 목록을 볼 수 있습니다. 하지만 Jupyter 컨테이너 안에는 Docker CLI나 소켓이 없어 같은 명령이 실패할 수 있습니다.\n\n원본의 Should fail은 이 차이를 보여주는 예상된 실패입니다. 오류 메시지를 없애기 전에 명령이 호스트용인지, 노트북 안에서 실행할 명령인지 구분해 보세요.",
        "cells": [
          15,
          18
        ],
        "reference": "Part 3"
      },
      {
        "title": "연결 확인 뒤에 응답 내용을 읽습니다",
        "text": "docker_router는 수업 내부 네트워크에서 쓰는 서비스 이름입니다. curl -v로 연결과 응답 헤더를 살펴보고, requests.get()으로 같은 요청을 Python에서 보낼 수 있습니다.\n\n순서는 요청 → HTTP 성공 확인 → JSON 읽기입니다. 응답이 오류 페이지인데 곧바로 JSON으로 해석하면 실제 연결 문제를 놓칠 수 있습니다.",
        "cells": [
          20,
          22
        ]
      },
      {
        "title": "화면 서버와 챗봇 기능을 따로 확인합니다",
        "text": "frontend 요청에서 HTML과 200 응답을 받았다면 웹 서버가 응답한 것입니다. 이것만으로 검색과 답변 생성까지 성공했다고 판단할 수는 없습니다.\n\n챗봇에 필요한 /retriever와 /generator는 뒤 실습에서 직접 구현합니다. 지금은 화면에 도달하는 경로까지 확인하면 됩니다.",
        "cells": [
          27,
          29
        ],
        "reference": "Part 4–5"
      }
    ],
    "exercises": [
      {
        "title": "서비스 목록 연결 확인",
        "location": "셀 20–22 · DLI 환경 전용",
        "goal": "네트워크 문제와 응답 파싱 문제를 분리해 확인합니다.",
        "steps": [
          "DLI Jupyter에서 실행합니다.",
          "타임아웃과 raise_for_status()로 연결·HTTP 오류를 먼저 확인합니다.",
          "성공한 응답만 JSON으로 바꿉니다."
        ],
        "code": "import requests\nresponse = requests.get(\"http://docker_router:8070/containers\", timeout=10)\nresponse.raise_for_status()\ncontainers = response.json()\nprint(type(containers).__name__)",
        "check": "JSON 자료형이 표시되어야 합니다. 연결 실패 시 composer의 실제 포트·경로와 서비스 상태를 확인하세요. 개인 PC에서는 내부 이름이 해석되지 않습니다."
      }
    ],
    "troubleshooting": [
      [
        "docker: command not found",
        "컨테이너 안에서 의도된 실패인지 확인합니다. 호스트용 명령과 노트북 내부 명령을 구분하세요."
      ],
      [
        "NameResolutionError / Connection refused",
        "전자는 서비스 이름·네트워크, 후자는 포트·프로세스 상태를 먼저 확인하세요."
      ],
      [
        "200인데 챗봇이 안 돼요",
        "화면 서버 상태와 모델·검색 API 상태를 따로 점검합니다."
      ]
    ],
    "takeaway": "화면이 열린다고 모델까지 준비된 것은 아닙니다. 요청을 보내는 곳과 받는 곳을 나누어 확인하세요.",
    "flow": [
      "Jupyter에서 요청",
      "내부 서비스에서 처리",
      "상태와 응답 확인"
    ],
    "bridge": "서비스 주소와 응답을 확인하는 방법을 익혔습니다. 다음에는 같은 방식으로 모델에 질문을 보내고 답변을 받아 봅니다.",
    "review": [
      "웹 화면은 열리는데 챗봇이 답하지 않으면 어떤 연결을 따로 확인해야 할까요?"
    ]
  },
  {
    "slug": "02-llms",
    "no": "02",
    "kind": "notebook",
    "filename": "02_llms.ipynb",
    "title": "LLM 엔드포인트 호출하기",
    "summary": "모델에 질문을 보내는 방법을 익힙니다. 직접 HTTP 요청을 보내고, 클라이언트와 ChatNVIDIA로 같은 흐름을 간결하게 표현합니다.",
    "goals": [
      "모델 목록 조회와 채팅 요청의 역할 구분하기",
      "스트리밍 delta와 완성된 message 구분하기"
    ],
    "sections": [
      {
        "title": "모델은 서버에서, 요청은 노트북에서",
        "text": "큰 모델은 별도 추론 서버에서 실행합니다. Jupyter는 입력을 보내고 결과를 받는 클라이언트이며, DLI의 llm_client가 이 연결을 제공합니다.\n\nOpenAI 호환 API는 요청 형식이 호환된다는 뜻입니다. 모델이 반드시 OpenAI 모델인 것은 아니며, 여기서는 수업에 제공된 서버와 인증 설정을 사용합니다.",
        "reference": "Part 1–3"
      },
      {
        "title": "모델 목록을 확인하고 질문을 보냅니다",
        "text": "GET /v1/models로 사용할 수 있는 모델 ID를 확인합니다. 그다음 채팅 요청에 model과 messages를 넣습니다. messages는 role과 content로 누가 어떤 말을 했는지 표현합니다.\n\nservice_url은 요청할 서버 주소이고 headers는 본문의 형식 등을 알립니다. 서버 주소 → 모델 ID → 메시지 → 응답 JSON 순서로 살펴보면 어디서 문제가 났는지 찾기 쉽습니다.",
        "cells": [
          18,
          19,
          22
        ],
        "reference": "Part 4.1"
      },
      {
        "title": "클라이언트가 요청 형식을 대신 구성합니다",
        "text": "OpenAI 클라이언트의 base_url을 수업 서버로 지정하면 같은 호환 API를 간결하게 호출할 수 있습니다. 일반 응답은 choices[0].message.content에서 완성된 답을 읽습니다.\n\nstream=True이면 choices[0].delta.content에 답변 조각이 차례로 도착합니다. 내용 없는 조각은 건너뛰고 텍스트만 누적해 보세요.",
        "cells": [
          25,
          26
        ],
        "reference": "Part 4.2"
      },
      {
        "title": "ChatNVIDIA는 다음 실습의 연결점입니다",
        "text": "ChatNVIDIA의 invoke()는 완성된 응답을, stream()은 점진적인 응답 조각을 반환합니다. 이 인터페이스는 뒤에서 배울 LangChain 체인에 그대로 연결할 수 있습니다.\n\n아래 실습에서는 stream()의 각 조각에서 content를 꺼내 한 문자열로 합칩니다. 모델 ID와 연결 설정은 현재 DLI 환경에서 준비한 값을 유지하세요.",
        "cells": [
          28,
          34
        ],
        "reference": "Part 4.3"
      }
    ],
    "exercises": [
      {
        "title": "응답 텍스트를 누적하기",
        "location": "셀 28 · DLI 사전 설정 필요",
        "goal": "원본의 모델 객체 llm을 만든 다음 실행합니다.",
        "steps": [
          "stream()은 여러 응답 조각을 반환합니다.",
          "각 조각의 content만 문자열에 더합니다.",
          "마지막 문자열과 화면에 출력된 전체 내용을 비교합니다."
        ],
        "code": "answer = \"\"\nfor chunk in llm.stream(\"RAG를 한 문장으로 설명해 주세요.\"):\n    text = chunk.content or \"\"\n    answer += text\n    print(text, end=\"\", flush=True)\nprint(\"\\n응답 길이:\", len(answer))",
        "check": "빈 문자열이 아닌 답변과 양수 길이가 나와야 합니다. 답변 문장은 생성마다 달라질 수 있습니다."
      }
    ],
    "troubleshooting": [
      [
        "401 / 403",
        "수업에서 제공한 인증과 모델 접근 범위를 확인합니다. 이 웹사이트 챗봇 키를 노트북에 복사하는 방식이 아닙니다."
      ],
      [
        "404 / model not found",
        "/v1/models로 현재 수업 서비스가 제공하는 정확한 ID와 base_url을 확인하세요."
      ],
      [
        "stream 응답에서 message가 없어요",
        "스트리밍은 delta, 완성 응답은 message를 읽습니다."
      ]
    ],
    "takeaway": "요청 방식이 달라도 서버 주소·모델 ID·메시지가 필요합니다. 스트리밍에서는 여러 응답 조각을 모아 답변을 만듭니다.",
    "flow": [
      "모델과 서버 선택",
      "메시지 전송",
      "응답 텍스트 읽기"
    ],
    "bridge": "모델의 답을 문자열로 받았습니다. 다음에는 입력을 프롬프트로 바꾸고 결과를 읽는 과정을 하나의 체인으로 연결합니다.",
    "review": [
      "스트리밍 응답에서 message 대신 delta를 읽는 이유는 무엇일까요?"
    ]
  },
  {
    "slug": "03-langchain-intro",
    "no": "03",
    "kind": "notebook",
    "filename": "03_langchain_intro.ipynb",
    "title": "LangChain과 시 바꾸기 챗봇",
    "summary": "프롬프트 → 모델 → 문자열을 하나의 체인으로 연결합니다. 처음 만든 시를 새 주제로 바꾸는 챗봇의 빈칸을 채워 봅니다.",
    "goals": [
      "입력 → 프롬프트 → 모델 → 문자열 흐름 읽기",
      "첫 요청과 후속 요청을 서로 다른 체인에 연결하기"
    ],
    "sections": [
      {
        "title": "Runnable은 서로 연결할 수 있는 작업입니다",
        "text": "RunnableLambda는 Python 함수를 체인에 넣을 수 있게 감쌉니다. A | B는 A의 결과를 B로 넘기고, RunnablePassthrough는 입력을 그대로 전달합니다.\n\n딕셔너리 매핑은 같은 입력을 여러 작업에 보내 결과를 키별로 모읍니다. 연결 기호보다 중요한 것은 각 작업이 무엇을 받고 무엇을 반환하는지입니다.",
        "cells": [
          9
        ],
        "reference": "Part 1–2"
      },
      {
        "title": "프롬프트, 모델, 파서의 역할을 나눕니다",
        "text": "ChatPromptTemplate은 입력 딕셔너리로 메시지를 만들고, ChatNVIDIA는 응답 객체를 반환합니다. 마지막 StrOutputParser가 객체에서 텍스트를 꺼냅니다.\n\n프롬프트가 input과 topic을 요구한다면 두 키가 모두 있어야 합니다. 중간 결과를 새 키로 보관하면서 기존 입력도 남기려면 RunnableAssign을 사용합니다.",
        "cells": [
          12,
          16,
          18,
          19
        ],
        "reference": "Part 3"
      },
      {
        "title": "첫 요청과 후속 요청은 필요한 입력이 다릅니다",
        "text": "chain1은 사용자의 input으로 첫 시를 만듭니다. chain2는 이미 만든 시 input과 새 주제 topic을 받아 시를 바꿉니다.\n\nrhyme_chat2_stream()은 history에서 첫 assistant 시를 찾습니다. 시가 없으면 chain1, 있으면 chain2로 보내면 됩니다. 원본의 Not Implemented 부분을 이 후속 요청 처리로 바꾸는 것이 이번 문제입니다.",
        "cells": [
          21,
          22,
          23
        ],
        "reference": "Part 4"
      },
      {
        "title": "원격 체인에도 같은 방식으로 요청합니다",
        "text": "RemoteRunnable은 HTTP로 연결된 Runnable을 호출합니다. 호출하는 모양은 비슷하지만 작업은 별도 서버에서 실행됩니다.\n\n여기서는 /basic_chat 연결을 확인합니다. /retriever와 /generator를 서버로 제공하는 과정은 마지막 LangServe 실습에서 이어집니다.",
        "cells": [
          25
        ],
        "reference": "Part 5"
      }
    ],
    "exercises": [
      {
        "title": "후속 주제를 chain2로 보내기",
        "location": "셀 22 · else 내부 TODO 교체",
        "goal": "Not Implemented 줄을 지우고 아래 블록을 else 안에 넣습니다. 기존 passage 안내 부분은 유지합니다.",
        "steps": [
          "input에는 새 질문이 아니라 first_poem을 전달합니다.",
          "topic에는 새로 받은 message를 전달합니다.",
          "Gradio는 누적 문자열, 터미널 모드는 새 토큰만 내보냅니다."
        ],
        "code": "buffer = \"Sure! Here you go!\\n\\n\"\nyield buffer\nfor token in chain2.stream({\"input\": first_poem, \"topic\": message}):\n    buffer += token\n    yield buffer if return_buffer else token",
        "check": "첫 요청 “고양이”로 시를 만들고 다음 요청 “우주”를 보내세요. Not Implemented가 사라지고 주제가 바뀐 시가 생성되어야 합니다. 운율·구조는 직접 읽어 평가하세요."
      }
    ],
    "troubleshooting": [
      [
        "KeyError: topic",
        "chain2에는 input과 topic이 모두 필요합니다."
      ],
      [
        "글자가 계속 중복돼요",
        "Gradio에 이미 누적한 buffer를 다시 더하고 있지 않은지 확인하세요."
      ],
      [
        "주제가 매번 초기화돼요",
        "history는 role/content 딕셔너리 목록입니다. assistant 메시지에서 시를 찾는 조건을 확인합니다."
      ]
    ],
    "takeaway": "체인은 앞 단계의 출력을 다음 단계의 입력으로 넘깁니다. 연결할 때마다 자료형과 필요한 키를 확인하세요.",
    "flow": [
      "입력 딕셔너리",
      "프롬프트와 모델",
      "문자열 응답"
    ],
    "bridge": "여러 단계를 연결하는 법을 익혔습니다. 다음에는 대화에서 얻은 정보를 지우지 않고 다음 요청까지 이어 가는 상태를 다룹니다.",
    "review": [
      "시를 바꿀 때 chain2의 input과 topic에는 각각 어떤 값을 넣어야 할까요?"
    ]
  },
  {
    "slug": "04-running-state",
    "no": "04",
    "kind": "notebook",
    "filename": "04_running_state.ipynb",
    "title": "대화 상태와 항공편 조회",
    "summary": "대화에서 얻은 정보를 상태에 모으고, 그 정보로 모의 항공편을 조회합니다. 정보 갱신과 조회의 실행 순서가 핵심입니다.",
    "goals": [
      "RunnableAssign으로 상태를 잃지 않고 갱신하기",
      "지식 추출 → 키 선택 → 실제 조회 순서 구현하기"
    ],
    "sections": [
      {
        "title": "이전 정보를 잃지 않도록 상태를 전달합니다",
        "text": "input, output, know_base, context를 하나의 상태 딕셔너리에 담습니다. RunnableAssign은 기존 키를 유지하면서 새로 계산한 키를 추가하거나 덮어씁니다.\n\n항공편을 조회하려면 know_base를 먼저 갱신하고, 그 결과를 다음 Assign으로 넘겨야 합니다. 같은 Assign 안의 형제 분기는 서로 갱신한 값을 순서대로 읽는 구조가 아닙니다.",
        "cells": [
          7,
          9,
          11
        ],
        "reference": "Part 1–2"
      },
      {
        "title": "자유로운 문장을 구조화된 정보로 바꿉니다",
        "text": "RExtract는 Pydantic 스키마로 필요한 필드를 정하고, 출력 형식 안내를 프롬프트에 넣습니다. 모델이 만든 텍스트를 파서가 읽으면 Pydantic 객체가 됩니다.\n\n반환값은 {info_base: ...} 딕셔너리가 아니라 객체 자체입니다. 상태에 저장할 키는 바깥의 Assign에서 정합니다. 형식이 맞게 파싱되었더라도 값이 대화와 일치하는지는 확인해야 합니다.",
        "cells": [
          17,
          19,
          22,
          25
        ],
        "reference": "Part 3"
      },
      {
        "title": "조회에 필요한 정보만 골라 보냅니다",
        "text": "KnowledgeBase에는 이름·성·예약 번호와 대화 요약이 담깁니다. get_key_fn()은 이 중 조회에 쓸 세 필드만 딕셔너리로 꺼냅니다.\n\n그 딕셔너리를 get_flight_info()에 보내면 수업용 모의 데이터에서 항공편을 찾습니다. 실제 항공사 연결이나 사용자 인증을 구현하는 실습은 아닙니다.",
        "cells": [
          30,
          36
        ],
        "reference": "Part 4"
      },
      {
        "title": "정보 처리와 사용자 답변을 분리합니다",
        "text": "internal_chain은 know_base와 context를 갱신하고, external_chain은 그 결과를 읽어 사용자에게 답합니다. 조회 결과가 없는 값을 그럴듯하게 채우지 말고 None 또는 unknown으로 유지하세요.\n\n이제 빈 지식 추출기와 조회기를 연결해 봅시다. 원본 셀 38에서 Optional을 사용할 때는 from typing import Optional도 준비되어 있어야 합니다.",
        "cells": [
          38
        ]
      }
    ],
    "exercises": [
      {
        "title": "지식 추출기와 DB 조회기 연결",
        "location": "셀 38 · knowbase_getter / database_getter 교체",
        "goal": "셀 22의 RExtract, 셀 30의 get_flight_info, 셀 36의 get_key_fn 정의가 먼저 필요합니다.",
        "steps": [
          "parser_prompt는 기존 know_base·input·output을 읽어 업데이트합니다.",
          "첫 Assign에서 갱신된 know_base를 저장합니다.",
          "다음 Assign에서 get_key_fn을 거쳐 DB를 조회합니다."
        ],
        "code": "from typing import Optional\n\nknowbase_getter = RExtract(KnowledgeBase, instruct_llm, parser_prompt)\ndatabase_getter = (\n    RunnableLambda(lambda state: state[\"know_base\"])\n    | RunnableLambda(get_key_fn)\n    | RunnableLambda(get_flight_info)\n)\ninternal_chain = (\n    RunnableAssign({\"know_base\": knowbase_getter})\n    | RunnableAssign({\"context\": database_getter})\n)",
        "check": "원본 모의 인물 Jane Doe / 12345를 단계적으로 알려주세요. know_base가 누적되고 San Jose → New Orleans 조회 결과가 context에 들어가야 합니다. 틀린 번호에는 정보를 지어내지 않아야 합니다."
      }
    ],
    "troubleshooting": [
      [
        "Optional이 정의되지 않았어요",
        "셀 38의 클래스 정의 전에 from typing import Optional을 실행합니다."
      ],
      [
        "대화할 때마다 이름을 잊어요",
        "knowbase_getter를 항상 빈 KnowledgeBase()를 반환하는 원본 placeholder로 두지 않았는지 확인합니다."
      ],
      [
        "Pydantic 파싱 오류",
        "모델 출력 형식과 스키마를 확인하고 이전 유효 상태를 보존합니다. 임의 문자열 보정만으로 모든 JSON 오류를 해결할 수는 없습니다."
      ]
    ],
    "takeaway": "새 정보를 먼저 추출한 뒤, 갱신된 상태로 조회해야 합니다. 필요한 값이 없다면 만들어 넣지 않고 미확인 상태로 둡니다.",
    "flow": [
      "대화 정보 추출",
      "상태 갱신과 조회",
      "조회 결과로 답변"
    ],
    "bridge": "이전 정보를 다음 단계로 넘기는 상태를 만들었습니다. 다음에는 같은 아이디어로 긴 문서를 조금씩 읽으며 요약을 갱신합니다.",
    "review": [
      "know_base 갱신과 항공편 조회를 같은 Assign의 형제 분기에 넣으면 왜 문제가 될까요?"
    ]
  },
  {
    "slug": "05-documents",
    "no": "05",
    "kind": "notebook",
    "filename": "05_documents.ipynb",
    "title": "문서 로딩과 누적 요약",
    "summary": "긴 문서를 작은 청크로 나누고, 이전 요약에 새 내용을 더합니다. 문서 전체를 한 번에 보내지 않고도 핵심을 이어 읽는 방법입니다.",
    "goals": [
      "page_content와 metadata 구분하기",
      "RSummarizer의 상태 초기화·반복 갱신 TODO 완성하기"
    ],
    "sections": [
      {
        "title": "문서의 본문과 출처를 함께 가져옵니다",
        "text": "문서 로더는 Document 목록을 반환합니다. page_content에는 본문이, metadata에는 제목과 출처 같은 정보가 들어 있습니다.\n\n먼저 문서 개수와 첫 본문 일부를 확인하세요. 제목만 정상이라고 문서 내용까지 제대로 로드된 것은 아닙니다.",
        "cells": [
          8,
          10,
          12
        ],
        "reference": "Part 1–2"
      },
      {
        "title": "긴 문서를 겹치는 작은 조각으로 나눕니다",
        "text": "RecursiveCharacterTextSplitter는 문단·줄 등 구분 경계를 이용해 문서를 나눕니다. chunk_overlap으로 조각의 일부를 겹치면 경계에서 앞뒤 맥락이 끊기는 것을 줄일 수 있습니다.\n\n기본 길이 함수는 문자 수를 셉니다. chunk_size를 모델의 토큰 제한과 같은 단위로 생각하지 않도록 주의하세요.",
        "cells": [
          15,
          16
        ],
        "reference": "Part 3"
      },
      {
        "title": "이전 요약에 새 청크의 내용을 더합니다",
        "text": "DocumentSummaryBase에는 running_summary, main_ideas, loose_ends가 담깁니다. summary_prompt는 이전 info_base와 새 input을 함께 읽습니다.\n\nRExtract로 새 요약 객체를 만든 뒤 info_base에 저장합니다. 다음 청크는 이 갱신된 요약을 받습니다. RSummarizer의 반복문은 바로 이 읽기 → 갱신 → 저장을 구현합니다.",
        "cells": [
          19,
          21,
          23
        ],
        "reference": "Part 4"
      },
      {
        "title": "작게 실행하고 요약이 이어지는지 확인합니다",
        "text": "먼저 청크 두 개로 실행해 첫 청크의 중요한 사실이 두 번째 결과에도 남는지 확인하세요. 요약을 반복한다고 모든 세부 정보가 보존되는 것은 아닙니다.\n\nlatest_summary는 중간 결과를 보는 변수입니다. 원본은 verbose=True일 때만 이 변수를 갱신하므로, 아래 풀이에서는 출력 여부와 관계없이 최신 요약을 저장합니다.",
        "cells": [
          24
        ],
        "reference": "Part 5"
      }
    ],
    "exercises": [
      {
        "title": "RSummarizer 완성하기",
        "location": "셀 23 · 함수 전체 교체",
        "goal": "위 셀의 RExtract와 DocumentSummaryBase, summary_prompt를 그대로 사용합니다.",
        "steps": [
          "knowledge.__class__로 파서가 사용할 클래스를 얻습니다.",
          "info_base에 초기 객체를 넣습니다.",
          "매번 doc.page_content를 input으로 전달하고 새 상태를 저장합니다."
        ],
        "code": "def RSummarizer(knowledge, llm, prompt, verbose=False):\n    parse_chain = RunnableAssign({\n        \"info_base\": RExtract(knowledge.__class__, llm, prompt)\n    })\n    def summarize_docs(docs):\n        global latest_summary\n        state = {\"info_base\": knowledge}\n        for i, doc in enumerate(docs):\n            state[\"input\"] = doc.page_content\n            state = parse_chain.invoke(state)\n            latest_summary = state[\"info_base\"]\n            if verbose:\n                print(f\"처리한 청크: {i + 1}\")\n                pprint(latest_summary)\n        return state[\"info_base\"]\n    return RunnableLambda(summarize_docs)",
        "check": "먼저 docs_split[:2]로 실행하세요. 결과는 문자열이 아니라 DocumentSummaryBase 객체이며 running_summary에 두 청크의 핵심 내용이 남아야 합니다."
      }
    ],
    "troubleshooting": [
      [
        "assert info_base in state 실패",
        "초기 상태에 info_base를 넣고 parse_chain.invoke()의 반환값을 state에 저장합니다."
      ],
      [
        "KeyError: input",
        "Document 전체 대신 doc.page_content를 state[\"input\"]에 넣었는지 확인합니다."
      ],
      [
        "너무 오래 걸려요",
        "이 예제는 청크마다 모델을 호출합니다. 2개로 확인한 뒤 원본의 15개로 늘리세요."
      ]
    ],
    "takeaway": "각 청크를 읽은 새 요약이 다음 청크의 입력 상태가 됩니다. 결과를 돌려받아 저장하는 한 줄이 누적 요약을 만듭니다.",
    "flow": [
      "문서 로딩과 분할",
      "이전 요약 + 새 청크",
      "갱신된 요약 저장"
    ],
    "bridge": "문서를 다루기 좋은 크기로 나누었습니다. 다음에는 이 조각들을 숫자 벡터로 바꾸어 질문과 얼마나 관련 있는지 비교합니다.",
    "review": [
      "parse_chain.invoke()의 결과를 state에 다시 저장하지 않으면 어떤 정보가 이어지지 않을까요?"
    ]
  },
  {
    "slug": "06-embeddings",
    "no": "06",
    "kind": "notebook",
    "filename": "06_embeddings.ipynb",
    "title": "임베딩과 유사도 비교",
    "summary": "질문과 문서를 벡터로 바꾸고 유사도를 비교합니다. 짧은 답을 긴 문서로 바꾸었을 때 검색 관점에서 무엇이 달라지는지도 살펴봅니다.",
    "goals": [
      "embed_query와 embed_documents의 입출력 구분하기",
      "유사도 행렬을 읽고 긴 문서 실험하기"
    ],
    "sections": [
      {
        "title": "질문과 문서를 비교 가능한 벡터로 바꿉니다",
        "text": "embed_query(문자열)는 벡터 하나를, embed_documents(문자열 목록)는 벡터 목록을 돌려줍니다. 모델에 따라 질문과 문서를 처리하는 경로가 다를 수 있습니다.\n\n원본의 course/embedding은 수업 서버의 모델 별칭입니다. 문서 인덱스를 만들 때와 질문을 검색할 때는 서로 호환되는 동일 임베딩 구성을 사용하세요.",
        "cells": [
          6,
          7,
          9,
          11
        ],
        "reference": "Part 1–2"
      },
      {
        "title": "유사도 행렬에서 관련 있는 쌍을 찾습니다",
        "text": "코사인 유사도는 벡터 방향의 가까움을 비교합니다. 행과 열에 어떤 질문과 문서가 놓였는지 축 라벨부터 읽어 보세요.\n\n서로 대응하는 질문·문서의 값이 상대적으로 높은지 살펴보는 실험입니다. 대각선이 반드시 최댓값이어야 하는 규칙은 없고, 높은 유사도가 문서 내용의 사실성을 보증하지도 않습니다.",
        "cells": [
          13,
          15
        ]
      },
      {
        "title": "짧은 답을 긴 설명으로 바꾸어 비교합니다",
        "text": "expound_prompt는 전체 질문 questions와 이번에 집중할 질문 q1을 받습니다. 여기에 instruct_llm과 StrOutputParser()를 연결하면 긴 문서를 만드는 체인이 됩니다.\n\n각 질문을 q1에 넣어 순회하며 longer_docs에 결과를 저장하세요. 문장이 길어졌는지만 보지 말고, 해당 질문의 답이 실제로 포함되어 있는지도 확인합니다.",
        "cells": [
          17,
          19
        ],
        "reference": "Part 3"
      },
      {
        "title": "관련성과 안전성은 다른 판단입니다",
        "text": "임베딩으로 질문과 가까운 내용을 찾을 수 있지만, 유사도 하나로 내용의 안전성을 완전히 판단할 수는 없습니다. 검색 결과의 용도에 맞는 별도 검토가 필요합니다.\n\n원본은 후속 가드레일 실습으로 64_guardrails.ipynb를 안내합니다. 현재 제공된 00–09번에는 포함되지 않으므로 이 노트에서는 관련성과 안전성을 구분하는 데까지 집중합니다.",
        "reference": "Part 4"
      }
    ],
    "exercises": [
      {
        "title": "긴 문서 생성 체인 완성",
        "location": "셀 17 · 두 TODO 교체",
        "goal": "앞에서 정의한 expound_prompt와 instruct_llm을 사용합니다.",
        "steps": [
          "StrOutputParser로 문자열을 얻습니다.",
          "questions에는 전체 질문 목록을 넣습니다.",
          "q1에는 현재 반복 중인 q를 넣습니다."
        ],
        "code": "expound_chain = expound_prompt | instruct_llm | StrOutputParser()\nlonger_docs = []\nfor q in queries:\n    longer_doc = expound_chain.invoke({\n        \"questions\": \"\\n\".join(queries),\n        \"q1\": q,\n    })\n    longer_docs.append(longer_doc)\n    print(q, longer_doc, sep=\"\\n\")",
        "check": "len(longer_docs) == len(queries)이고 모든 문자열이 비어 있지 않아야 합니다. 이어서 셀 19로 유사도를 비교합니다. doc[:2048]은 2048문자 제한이지 2048토큰 제한이 아닙니다."
      }
    ],
    "troubleshooting": [
      [
        "벡터 차원이 안 맞아요",
        "질문과 문서에 다른 모델을 섞지 않았는지 확인하고 변경했다면 문서 벡터도 다시 만듭니다."
      ],
      [
        "긴 문서를 잘랐는데 토큰 초과예요",
        "문자 수와 토큰 수는 다릅니다. 모델의 실제 입력 제한에 맞춰 청킹하거나 토크나이저 기준 길이를 확인하세요."
      ]
    ],
    "takeaway": "임베딩 유사도는 질문과 문서의 관련성을 비교하는 도구입니다. 값이 높다는 이유만으로 사실이거나 안전한 문서가 되지는 않습니다.",
    "flow": [
      "질문·문서 임베딩",
      "유사도 비교",
      "긴 문서로 다시 실험"
    ],
    "bridge": "관련성을 숫자로 비교할 수 있게 되었습니다. 다음에는 벡터 저장소에서 관련 문서를 찾고 그 내용을 답변의 근거로 연결합니다.",
    "review": [
      "임베딩 유사도가 높은 문서라도 답변의 근거로 쓰기 전에 무엇을 확인해야 할까요?"
    ]
  },
  {
    "slug": "07-vectorstores",
    "no": "07",
    "kind": "notebook",
    "filename": "07_vectorstores.ipynb",
    "title": "벡터 검색과 RAG 챗봇",
    "summary": "관련 문서를 찾는 검색기와 답변을 만드는 모델을 연결합니다. 문서 근거와 대화 기록을 구분해 RAG 챗봇을 완성합니다.",
    "goals": [
      "문서 저장소와 대화 저장소 역할 구분하기",
      "history·context TODO를 실제 검색 체인으로 바꾸기"
    ],
    "sections": [
      {
        "title": "검색기는 답변이 아니라 문서를 돌려줍니다",
        "text": "FAISS.from_texts는 문자열을 임베딩해 검색 인덱스를 만듭니다. as_retriever().invoke(question)을 호출하면 관련 Document 목록을 받습니다.\n\n이 목록을 docs2str로 문자열화해 프롬프트에 넣어야 모델이 근거를 읽을 수 있습니다. 검색 → 문맥 구성 → 답변 생성을 나누어 확인해 보세요.",
        "cells": [
          14,
          16,
          17,
          22,
          23
        ],
        "reference": "Part 1–2"
      },
      {
        "title": "검색 결과의 순서와 대화 기록을 구분합니다",
        "text": "NVIDIARerank는 검색된 후보의 순위를 다시 매기고, LongContextReorder는 긴 문맥 안의 배치 순서를 바꿉니다. 두 작업은 목적과 방식이 다릅니다.\n\nconvstore에는 지난 user/assistant 발화를 저장합니다. 과거 대화가 원문의 사실과 같지는 않으므로, 문서 저장소 docstore와 역할을 나누어 사용합니다.",
        "cells": [
          20,
          30
        ]
      },
      {
        "title": "문서를 준비하고 검색 인덱스를 만듭니다",
        "text": "논문을 로드하고 References 이후를 자른 다음 청크로 나눕니다. 짧은 청크를 걸러낸 뒤 실제로 남은 문서가 있는지 확인합니다.\n\n빈 목록에서 chunks[0]을 읽으면 오류가 납니다. 아래 보완 예제로 빈 묶음을 먼저 걸러 보세요. 실시간 arXiv 로딩이 실패하면 수업에 제공된 캐시 파일을 확인합니다.",
        "cells": [
          34,
          36,
          38
        ],
        "reference": "Part 3 Task 1–2"
      },
      {
        "title": "두 검색 결과를 history와 context에 담습니다",
        "text": "질문 문자열을 {input: 질문}으로 감싸고, convstore 결과는 history에, docstore 결과는 context에 넣습니다. stream_chain은 이 세 키를 읽어 답변을 만듭니다.\n\n이번 답변을 대화 저장소에 추가하는 일은 생성 뒤에 합니다. 아직 만들지 않은 답변이 이번 검색의 근거에 섞이지 않도록 순서를 유지하세요.",
        "cells": [
          40,
          42
        ],
        "reference": "Task 3–4"
      },
      {
        "title": "저장한 인덱스를 다음 실습으로 가져갑니다",
        "text": "save_local()로 인덱스를 저장하면 08·09번에서 다시 사용할 수 있습니다. 검색할 때도 인덱스를 만들었던 것과 동일한 임베딩 구성을 유지하세요.\n\nFAISS 문서 저장소 복원에는 역직렬화가 포함될 수 있습니다. 아래 실습처럼 직접 만든 신뢰할 수 있는 파일만 복원하고, 출처를 모르는 인덱스에 dangerous deserialization 옵션을 켜지 마세요.",
        "cells": [
          44,
          46
        ],
        "reference": "Part 4"
      }
    ],
    "exercises": [
      {
        "title": "history와 context에 실제 검색 결과 넣기",
        "location": "셀 40 · retrieval_chain 교체",
        "goal": "앞의 convstore, docstore, docs2str가 준비된 상태에서 실행합니다.",
        "steps": [
          "itemgetter(\"input\")으로 질문 문자열을 뽑습니다.",
          "각 저장소의 retriever를 호출합니다.",
          "Document 목록을 재배치한 뒤 프롬프트용 문자열로 만듭니다."
        ],
        "code": "long_reorder = RunnableLambda(LongContextReorder().transform_documents)\nhistory_getter = (\n    itemgetter(\"input\") | convstore.as_retriever()\n    | long_reorder | RunnableLambda(docs2str)\n)\ncontext_getter = (\n    itemgetter(\"input\") | docstore.as_retriever()\n    | long_reorder | RunnableLambda(docs2str)\n)\nretrieval_chain = (\n    {\"input\": lambda question: question}\n    | RunnableAssign({\"history\": history_getter})\n    | RunnableAssign({\"context\": context_getter})\n)",
        "check": "retrieval_chain.invoke(\"Tell me about RAG!\") 결과의 context가 None이 아닌 문서 문자열이어야 합니다. 첫 대화에는 history가 비어 있어도 정상입니다."
      },
      {
        "title": "빈 청크 목록 방어하기",
        "location": "셀 34 · 짧은 청크 필터 다음",
        "goal": "원본의 chunks[0] 접근 전에 넣는 보완 예제입니다.",
        "steps": [
          "빈 문서 묶음을 제거합니다.",
          "전체가 비었으면 원문 로딩과 필터를 다시 확인합니다."
        ],
        "code": "docs_chunks = [chunks for chunks in docs_chunks if chunks]\nif not docs_chunks:\n    raise ValueError(\"검색할 청크가 없습니다. 문서 로딩과 길이 필터를 확인하세요.\")",
        "check": "메타데이터 접근에서 IndexError가 나지 않고, 실제 문서가 없는 상태는 명확한 오류로 멈춰야 합니다."
      }
    ],
    "troubleshooting": [
      [
        "답변에 근거가 안 붙어요",
        "생성 모델부터 바꾸지 말고 retrieval_chain 출력과 docs2str에 제목이 포함되는지 먼저 확인합니다."
      ],
      [
        "FAISS 차원 오류",
        "인덱스를 만들 때의 임베딩 모델과 지금 검색 모델이 같은지 확인하세요."
      ],
      [
        "arXiv 접속 실패",
        "원본이 안내한 cached_papers 파일 존재 여부를 확인합니다. 실패한 로딩을 빈 데이터로 계속 진행하지 마세요."
      ]
    ],
    "takeaway": "검색기는 문서를 찾고, 모델은 그 문서를 읽어 답합니다. 검색 결과가 실제로 프롬프트까지 전달되는지 먼저 확인하세요.",
    "flow": [
      "질문으로 문서 검색",
      "history·context 구성",
      "근거를 읽고 답변"
    ],
    "bridge": "문서를 참고해 답하는 챗봇이 연결되었습니다. 다음에는 질문별 근거와 답변을 비교하며 실제로 잘 답하는지 평가합니다.",
    "review": [
      "history에는 대화가, context에는 원문이 들어가는 이유는 무엇일까요?"
    ]
  },
  {
    "slug": "08-evaluation",
    "no": "08",
    "kind": "notebook",
    "filename": "08_evaluation.ipynb",
    "title": "RAG 평가와 답변 비교",
    "summary": "같은 질문의 문서 근거, 기준 답변, RAG 답변을 나란히 비교합니다. 점수를 계산하기 전에 무엇을 평가하는지부터 구분합니다.",
    "goals": [
      "검색·생성 체인의 입출력 계약 완성하기",
      "합성 정답을 무조건 사실로 취급하지 않기"
    ],
    "sections": [
      {
        "title": "검색과 답변의 품질을 나누어 봅니다",
        "text": "대화가 자연스럽다는 것만으로 RAG가 잘 동작한다고 판단하기는 어렵습니다. 필요한 근거가 검색되었는지, 답변이 그 근거에 충실한지, 답이 없을 때 모른다고 하는지 나누어 확인합니다.\n\nLLM-as-a-Judge는 모델을 이용해 답변을 비교하는 방법입니다. 검토를 돕는 도구로 사용하되, 판정 자체를 절대적인 정답으로 받아들이지는 마세요.",
        "reference": "Part 1–2"
      },
      {
        "title": "기존 RAG를 검색과 생성으로 다시 연결합니다",
        "text": "07번에서 만든 신뢰 가능한 인덱스를 같은 임베딩 모델로 불러옵니다. retrieval_chain은 질문을 {input, context}로, generator_chain은 그 문맥을 답변으로 바꿉니다.\n\n원본의 identity placeholder는 입력을 그대로 돌려줄 뿐입니다. 검색과 생성 두 TODO를 모두 채워야 실제 근거 기반 답변이 나옵니다.",
        "cells": [
          7,
          9
        ],
        "reference": "Part 3 Task 1–2"
      },
      {
        "title": "같은 질문의 답변을 나란히 보관합니다",
        "text": "문서에서 만든 synth_questions와 synth_answers를 준비하고, 각 질문에 대한 실제 RAG 답변을 rag_answers에 저장합니다. 세 목록의 길이와 순서가 같아야 올바른 쌍을 비교할 수 있습니다.\n\n합성 기준 답도 모델이 만든 결과입니다. 문서와 대조해 확인하기 전에는 검증된 정답으로 간주하지 않습니다.",
        "cells": [
          11,
          13
        ],
        "reference": "Step 3–4"
      },
      {
        "title": "점수의 의미를 판정 규칙과 함께 읽습니다",
        "text": "원본 judge는 첫 답을 참이라고 가정하고 [1] 또는 [2]를 선택합니다. 여기서 얻는 값은 이 규칙 아래의 선호 비율이며, 객관적인 사실 정확도는 아닙니다.\n\n원문 판정은 문자열 목록으로 남기고 집계 결과는 별도 변수에 저장해 보세요. pref_score를 숫자로 덮어쓰면 셀을 재실행할 때 이전 판정을 잃거나 오류가 날 수 있습니다.",
        "cells": [
          15,
          17
        ],
        "reference": "Step 5"
      },
      {
        "title": "답할 수 없는 질문도 평가에 넣습니다",
        "text": "문서가 다른 질문과 근거가 없는 질문도 함께 살펴보세요. 좋은 RAG는 답을 찾는 것뿐 아니라 자료의 한계를 드러내는 것도 중요합니다.\n\n여기서 만든 자체 점검은 학습용입니다. 코스 수료 평가는 원래 DLI 화면에서 제공하는 기준과 절차를 따릅니다.",
        "reference": "Part 4–5"
      }
    ],
    "exercises": [
      {
        "title": "검색·생성 체인 TODO 완성",
        "location": "셀 9 · 두 placeholder 교체",
        "goal": "docstore, long_reorder, docs2str, chat_prompt, llm이 먼저 정의되어 있어야 합니다.",
        "steps": [
          "context_getter의 입력은 문자열이 아니라 상태 딕셔너리입니다.",
          "프롬프트 → llm을 연결합니다.",
          "아래 원본의 output 래퍼와 rag_chain 결합은 유지합니다."
        ],
        "code": "context_getter = (\n    itemgetter(\"input\") | docstore.as_retriever()\n    | long_reorder | RunnableLambda(docs2str)\n)\nretrieval_chain = (\n    {\"input\": lambda question: question}\n    | RunnableAssign({\"context\": context_getter})\n)\ngenerator_chain = chat_prompt | llm\ngenerator_chain = {\"output\": generator_chain} | RunnableLambda(output_puller)\nrag_chain = retrieval_chain | generator_chain",
        "check": "rag_chain.invoke(질문)은 실제 문서에 근거한 답변을 반환해야 합니다. 반환값이 질문 그대로이거나 딕셔너리 repr이면 placeholder/파서 위치를 점검하세요."
      },
      {
        "title": "합성 질문에 실제 RAG 답변 만들기",
        "location": "셀 13 · rag_answer 빈 문자열 교체",
        "goal": "위에서 완성한 rag_chain을 질문마다 호출합니다.",
        "steps": [
          "각 질문을 stream에 전달합니다.",
          "반환 문자열 조각들을 하나로 합칩니다.",
          "질문 순서대로 저장합니다."
        ],
        "code": "rag_answers = []\nfor question in synth_questions:\n    answer = \"\".join(rag_chain.stream(question))\n    rag_answers.append(answer)\nassert len(rag_answers) == len(synth_questions)",
        "check": "모든 항목이 비어 있지 않고 해당 질문과 대응해야 합니다. synth_answers와 RAG 답변 모두 원문 근거를 확인하세요."
      },
      {
        "title": "판정 결과를 덮어쓰지 않고 집계하기",
        "location": "셀 17 · 집계 보완 예제",
        "goal": "셀 15 직후 pref_score가 아직 문자열 목록일 때 실행합니다.",
        "steps": [
          "판정 시작 부분의 [1]/[2]만 파싱합니다.",
          "판정 형식이 아닌 응답은 집계에서 제외하고 별도로 검토합니다.",
          "빈 목록은 0으로 나누지 않습니다."
        ],
        "code": "import re\njudge_results = list(pref_score)\nlabels = [re.match(r\"^\\s*\\[([12])\\]\", text) for text in judge_results]\nvalid = [int(match.group(1)) for match in labels if match]\npreference_rate = sum(value == 2 for value in valid) / len(valid) if valid else None\nprint(\"유효 판정:\", len(valid), \"선호 비율:\", preference_rate)",
        "check": "본문에 [2]가 언급됐다는 이유만으로 승리로 세지 않습니다. 비율은 이 judge 규칙의 결과이며 사실 정확도가 아닙니다."
      }
    ],
    "troubleshooting": [
      [
        "division by zero",
        "질문 생성·판정에 성공한 항목이 있는지 먼저 확인합니다."
      ],
      [
        "zip이 조용히 일부만 평가해요",
        "zip은 가장 짧은 목록에 맞춥니다. 세 목록 길이가 동일한지 검증하세요."
      ],
      [
        "점수는 높은데 답이 틀려요",
        "합성 기준 답, 검색 근거, 판정 프롬프트를 직접 검토하세요."
      ]
    ],
    "takeaway": "평가 점수는 기준 답과 판정 규칙에 따라 달라집니다. 숫자를 보기 전에 검색 근거와 실제 답변을 함께 읽으세요.",
    "flow": [
      "질문과 기준 답 준비",
      "RAG 답변 생성",
      "근거·판정 비교"
    ],
    "bridge": "검색과 생성의 결과를 점검했습니다. 마지막 실습에서는 이 두 기능을 별도 API로 제공해 웹 화면에서 호출할 수 있게 만듭니다.",
    "review": [
      "모델이 만든 기준 답을 무조건 참이라고 가정하면 평가에 어떤 한계가 생길까요?"
    ]
  },
  {
    "slug": "09-langserve",
    "no": "09",
    "kind": "notebook",
    "filename": "09_langserve.ipynb",
    "title": "LangServe로 체인 제공하기",
    "summary": "완성한 검색기와 생성기를 서버의 API로 제공합니다. 노트북 밖에서도 같은 입력과 출력으로 호출되는지 확인합니다.",
    "goals": [
      "노트북 커널과 server_app.py 프로세스 구분하기",
      "RemoteRunnable로 서버 입출력 확인하기"
    ],
    "sections": [
      {
        "title": "서버 파일에는 필요한 정의를 함께 넣습니다",
        "text": "%%writefile server_app.py는 셀 내용을 Python 파일로 저장합니다. 이 파일을 실행하는 서버는 노트북 커널과 다른 프로세스이므로 변수를 자동으로 공유하지 않습니다.\n\n필요한 import, 임베딩 설정, 인덱스 로딩, docs2str, 프롬프트를 파일 안에 준비하세요. 노트북에서 잘 되던 코드가 서버에서 NameError를 내면 이 경계부터 살펴봅니다.",
        "cells": [],
        "reference": "Part 1"
      },
      {
        "title": "검색과 생성의 입출력을 나누어 제공합니다",
        "text": "/basic_chat은 기본 모델 호출입니다. /retriever는 질문 문자열을 받아 Document 목록을, /generator는 {input, context}를 받아 답변 문자열을 반환합니다.\n\nadd_routes는 Runnable을 HTTP 경로로 등록합니다. 빈 목록이나 Not Implemented를 돌려주는 placeholder 대신 앞에서 완성한 실제 체인을 등록하면 됩니다.",
        "cells": [
          4
        ]
      },
      {
        "title": "저장한 파일로 서버를 실행합니다",
        "text": "python server_app.py를 실행하면 해당 셀에서 서버가 계속 동작합니다. 파일을 수정했다면 실행 중인 서버를 중단하고 다시 시작해야 변경이 반영됩니다.\n\n같은 포트 9012에 두 서버를 띄우면 충돌합니다. 한 서버가 실행 중인지 확인한 뒤, 별도 셀에서 원격 요청을 보내세요.",
        "cells": [
          5
        ],
        "reference": "Part 2"
      },
      {
        "title": "검색부터 생성까지 한 단계씩 호출합니다",
        "text": "RemoteRunnable로 /retriever부터 호출해 Document 목록을 확인합니다. 그다음 docs2str로 문서 내용을 문자열 context로 바꾸고, 질문 input과 함께 /generator에 보냅니다.\n\n이 두 경계의 자료형이 맞으면 수업 웹 화면에서도 같은 방식으로 연결할 수 있습니다. 여기서 만드는 LangServe는 DLI 실습용이며, 이 학습 사이트의 자료 도우미와는 별개입니다.",
        "reference": "Part 3"
      }
    ],
    "exercises": [
      {
        "title": "두 add_routes의 placeholder 교체",
        "location": "셀 4 · server_app.py 안에 반영",
        "goal": "먼저 08번의 인덱스 로딩, docs2str, chat_prompt 정의를 server_app.py 안으로 옮기세요. 임베딩 모델은 인덱스 생성 시와 동일해야 합니다.",
        "steps": [
          "docstore는 파일 내부에서 로드한 FAISS 인덱스입니다.",
          "retriever는 문서 목록을 반환하므로 여기서 docs2str를 붙이지 않습니다.",
          "generator는 이미 문자열인 context를 받아 생성만 수행합니다."
        ],
        "code": "retriever = docstore.as_retriever()\ngenerator = chat_prompt | instruct_llm | StrOutputParser()\n\nadd_routes(app, retriever, path=\"/retriever\")\nadd_routes(app, generator, path=\"/generator\")",
        "check": "위 코드를 기존 placeholder add_routes 대신 사용합니다. 같은 경로를 두 번 등록하지 마세요. 서버를 재시작한 후 아래 셀로 확인합니다."
      },
      {
        "title": "원격 요청을 단계별로 확인",
        "location": "서버 실행 후 별도 Jupyter 셀 · DLI 환경 전용",
        "goal": "앞에서 완성한 docs2str 함수가 현재 노트북에도 정의되어 있어야 합니다.",
        "steps": [
          "retriever 결과가 Document 목록인지 확인합니다.",
          "docs2str로 본문·제목을 문자열로 만듭니다.",
          "generator에 input과 context를 같이 보냅니다."
        ],
        "code": "from langserve import RemoteRunnable\n\nretriever_api = RemoteRunnable(\"http://lab:9012/retriever/\")\ngenerator_api = RemoteRunnable(\"http://lab:9012/generator/\")\nquestion = \"What is retrieval-augmented generation?\"\ndocuments = retriever_api.invoke(question)\nprint(\"검색 문서 수:\", len(documents))\nanswer = generator_api.invoke({\"input\": question, \"context\": docs2str(documents)})\nprint(answer)",
        "check": "문서 수가 양수이고 답변이 Not Implemented가 아니어야 합니다. 내부 hostname은 수업 compose 구성에 맞춰 확인하세요."
      }
    ],
    "troubleshooting": [
      [
        "NameError: docstore / docs2str",
        "이전 노트북에만 정의돼 있는 것은 아닌지 확인합니다. server_app.py는 독립 프로세스입니다."
      ],
      [
        "Address already in use",
        "9012 포트의 기존 서버를 중단한 다음 재실행하세요."
      ],
      [
        "422 validation error",
        "retriever는 문자열, generator는 input/context 딕셔너리를 받는지 확인합니다."
      ]
    ],
    "takeaway": "서버 파일은 노트북과 별도로 실행됩니다. 필요한 정의를 파일에 넣고, 검색 API와 생성 API의 입출력을 각각 확인하세요.",
    "flow": [
      "체인을 서버에 등록",
      "서버 실행",
      "원격 요청으로 확인"
    ],
    "bridge": "셀 실행에서 시작해 문서 검색, 답변 생성, 평가, API 연결까지 이어 왔습니다. 이제 같은 질문을 검색기부터 생성기까지 따라가며 각 단계의 입력과 출력을 설명해 보세요.",
    "review": [
      "노트북에서 docstore를 정의했는데 server_app.py에서는 NameError가 나는 이유는 무엇일까요?",
      "/retriever의 결과를 /generator로 보낼 때 어떤 형태로 바꾸어야 할까요?"
    ]
  }
];
