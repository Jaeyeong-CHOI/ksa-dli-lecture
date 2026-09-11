# Skill 본문 예시

설명용 파일입니다. 받는 것만으로 설치되지 않습니다. Work의 skill-creator에 전달해 검토하고 생성하세요.

```markdown
---
name: brief-to-page
description: Turn a short public-facing brief into a responsive one-page static website. Use for club, workshop, project, or personal introduction pages; not for authenticated apps, payments, or data collection.
---

# Brief to page

## Procedure
1. Extract the audience, purpose, supplied facts, requested sections, and primary action. Separate facts from design choices. Ask about a missing fact only if it blocks a meaningful page; otherwise omit it or label it clearly as not specified.
2. Produce a single self-contained index.html using semantic HTML and inline CSS. Use minimal JavaScript only when necessary. Do not add a framework, external fonts, tracking, login, database, or submission form.
3. Use one clear heading, strong contrast, generous spacing, responsive layout, and visible keyboard focus. Make every link or button do what its label says. Prefer local section links and native details/summary for FAQs.
4. Use only the supplied factual content. Never invent dates, venues, prices, sponsors, testimonials, contact details, or registration links. Do not imply a fictional example is a real service.
5. Save the page in the current task's output folder. If the host cannot save files, provide the complete HTML and say that it was not saved. Never edit an unrelated project.
6. Open and check the actual output when a browser is available: narrow and wide layouts, section links, FAQ toggles, and keyboard focus. Otherwise provide those manual checks and mark them not run.
7. Return the file location and a short checked/not-checked summary. Do not deploy. Deployment is a separate, explicitly requested operation.
```
