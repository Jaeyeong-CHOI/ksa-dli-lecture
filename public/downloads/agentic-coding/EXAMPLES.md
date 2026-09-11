# Skill and input examples

This is teaching material, not an installed Skill. Use Prompt 1 to create it in your host. The example is instruction-only: no scripts, API keys, or deployment permissions are bundled.

## Skill body example

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

## Input A — AI Study Club

Fictional practice page. This is not an existing product.
- Name: AI Study Club
- Audience: students who want to learn AI by building small things together
- Headline: Learn AI. Build together.
- Description: A study club for turning questions into small, testable projects.
- Topics: RAG foundations; coding agents; useful evaluation
- Format: Read one idea; build one example; share what worked
- Primary action: Explore topics — jump to the Topics section on this page
- FAQ: Do I need experience? Basic Python helps; beginners can start with guided examples.
- FAQ: What will I make? A small working artifact and a short explanation of how you checked it.
- No date, venue, price, registration, or contact details have been supplied. Do not add them.
- Add a small "Fictional workshop example" label.
- Visual direction: warm off-white, dark text, one green accent; concise and readable.

## Input B — Research Reading Circle

Fictional practice page. Use a new task folder; do not overwrite Input A.
- Name: Research Reading Circle
- Audience: students who want to discuss research papers critically
- Headline: Read closely. Ask better questions.
- Description: A reading circle focused on claims, evidence, and limitations.
- Topics: Research questions; experimental evidence; reproducibility
- Format: Pick a claim; inspect the evidence; propose a follow-up
- Primary action: Explore topics — jump to the Topics section
- FAQ: Must I understand every equation? Bring one question and one observation from the paper.
- FAQ: What should I share? One claim, supporting evidence, and a limitation.
- No date, venue, price, registration, or contact details have been supplied. Do not add them.
- Add a small "Fictional workshop example" label.
- Visual direction: warm off-white, dark text, one blue accent; concise and readable.

## Compare outputs

Both: semantic single-page HTML; working topic link and FAQ; no invented logistics; honest check summary.
A: AI Study Club, three AI topics, green accent.
B: Research Reading Circle, three research topics, blue accent. No leftover AI Study Club heading, FAQ, or topic labels.
Layout may vary. Compare behavior and facts, not pixel similarity.
