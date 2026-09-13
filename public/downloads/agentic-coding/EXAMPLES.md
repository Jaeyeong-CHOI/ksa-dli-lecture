# 실습 예시

## 실습 1: 기존 k-skill

대표 예제: https://github.com/NomaDamas/k-skill/tree/main/geeknews-search

설치 후 최신 글을 조회하고, 반환된 제목의 키워드로 검색합니다. RSS/Atom 피드 범위이며 전체 웹 검색이 아닙니다. 목록에서 원하는 다른 Skill을 골라도 되지만 입력·인증·성공 기준을 먼저 확인하세요.

## 실습 2: 새 Skill의 본문 예시

아래는 Skill Creator가 만든 결과를 비교할 교육용 예시입니다. scripts/heritage_query.py와 references/api.md는 API 계약을 읽은 Skill Creator가 생성해야 합니다. 이 본문만 복사하면 호출 코드가 자동으로 생기지 않습니다.

~~~markdown
---
name: heritage-brief
description: Fetch official Korean heritage facts for a name search.
---

# Heritage Brief

1. Read the user's heritage name or keyword and requested result count. Use a limit of 1–5 (default 3); confirm a missing keyword before querying.
2. Run the bundled `scripts/heritage_query.py --query "<keyword>" --limit 3` with Python 3 from the Skill directory. The script calls the government XML list endpoint, takes the detail identifiers from its results as strings, and fetches matching details. Confirm a successful JSON response before summarizing.
3. Return the actual names, types, regions, addresses, and a concise summary grounded in each returned description, together with the original source URLs and retrieval timestamp. Report total matches separately from returned items. Preserve the complete JSON as a user-requested output, outside the Skill folder.
4. Treat `no_results` as a valid empty search; offer a different keyword. Treat an error, timeout, or invalid XML as an unverified retrieval rather than zero matches. Keep the failure visible and retry only after the cause or conditions change.
5. For a new input, perform a fresh call and check that the query, item names, and timestamp reflect that input. Do not reuse previous facts as a current response.

Read [references/api.md](references/api.md) when adapting parameters or explaining the API. This Skill retrieves facts; page generation and deployment are separate requests. The API does not establish current opening hours, prices, or availability; leave those fields unknown instead of inferring them.
~~~

## 입력 A

검색어: 경복궁
최대 결과: 3개
저장 파일: heritage-a.json
이름·유형·지역·주소·공식 설명·출처·조회 시각을 반환합니다.
운영시간·입장료·현재 개방 여부는 만들지 않습니다.

## 입력 B

검색어: 첨성대
최대 결과: 3개
저장 파일: heritage-b.json
A의 결과를 덮어쓰지 말고 새로 API를 호출합니다.
추가 확인: 존재하지않는유산zzzz → 검색 결과 없음. 통신 오류와 구분합니다.

## API 역할

- API · 데이터를 요청하는 창구: 프로그램이 정해진 주소에 검색 조건을 보내면, 기관이 정해진 형식으로 답을 돌려줍니다. 이번에는 웹페이지를 읽는 대신 기관의 응답 데이터를 받습니다. 경복궁 + 최대 3개 요청 → 목록 XML → 필요한 항목을 JSON으로 정리
- Endpoint · 주소: 어느 기능에 요청할지 정합니다. 목록과 상세는 다른 주소입니다. SearchKindOpenapiList.do → 목록 / SearchKindOpenapiDt.do → 상세
- Parameters · 입력: 검색 조건과 받을 범위를 지정합니다. ccbaMnm1=경복궁, pageUnit=3, pageIndex=1
- XML → JSON: XML은 기관의 응답 형식, JSON은 이번 Skill에서 정리해 저장할 형식입니다. totalCnt=11, 이번 item 3개 → total: 11, returned: 3
- Detail IDs · 상세 식별자: 목록에서 받은 세 값을 그대로 함께 사용합니다. 숫자로 바꾸면 앞의 0이 사라질 수 있습니다. ccbaKdcd + ccbaAsno + ccbaCtcd → 모두 문자열
- API key · 인증키: 서비스에 따라 접근 권한을 확인하는 값입니다. 이번 API에는 필요하지 않습니다. 다른 API에 키가 필요하면 해당 서비스의 보호된 설정에서 관리; 프롬프트·브라우저 코드에 넣지 않기

## 결과를 읽는 법

JSON은 정리한 데이터 파일입니다. 키 이름은 만든 Skill마다 다를 수 있으므로 필드의 뜻을 먼저 비교합니다. 파일을 첨부하고 “사람이 읽을 표로 보여 주세요”라고 요청할 수 있습니다.

- 상태: 정상 결과, 정상 0건, 통신 실패를 구분합니다. 실제 응답 파일의 status 값을 그대로 확인합니다.
- 수: 전체 일치 수, 이번 수집 수, 상세 성공·누락 수는 서로 다릅니다.
- 시각: 원래 조회 시각과 첨부 파일 처리 시각을 구분합니다.
- 결과 목록(items 또는 results): 이름·지역·주소·설명·식별자·공식 출처를 담습니다. null은 값이 없거나 모른다는 뜻이지 0이 아닙니다.

## 이번 웹 검수에서 받은 결과

실시간 호출은 웹 실행 환경에서 502 통신 오류였습니다. 실제 XML 첨부를 같은 등록 Skill로 처리했을 때는 sourceMode=provided_snapshot, status=partial, totalCount=11, collectedCount=3, detailSuccessCount=1, detailMissingCount=2였습니다. originalRetrievedAt은 원래 수집 시점, processed_at은 이번 처리 시점이며 항목별 retrieved_at도 있습니다. 키가 다르면 실제 파일의 의미와 대조하세요.

이 숫자는 제공 예제 기준입니다. 다른 검색어·시점에는 실제 결과 수를 확인합니다. 앞선 로컬 API 성공 기록과 이번 웹의 통신 실패를 하나의 성공 기록으로 합치지 않습니다.

## 도구가 막혔을 때

실습 페이지에서 “실제 XML 첨부 예제”를 받아 복구 실습에 사용합니다. 등록 Skill 실행도 어려우면 “첨부 파싱 결과” JSON으로 페이지 제작을 연습할 수 있습니다. 이 경우 제공 결과 검토이며 본인의 API 조회·Skill 실행·배포 성공은 아닙니다.

## 파일 전달과 보관

입력 A/B 요청문에는 검색어와 결과 수가 이미 포함돼 있습니다. 입력 파일은 별도 보관용입니다. JSON으로 페이지를 만들 때는 해당 파일을 새 Work 대화에 실제로 첨부합니다. 완성한 index.html은 다운로드하여 브라우저에서 엽니다. A/B 전환은 정상 결과 파일 두 개를 모두 사용한 경우에만 확인합니다.
