# 교육용 Skill 본문 예시

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
