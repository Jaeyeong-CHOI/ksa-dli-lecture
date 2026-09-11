# Copyable prompts

Use ChatGPT desktop Work. Invoke a Skill from the `@` picker, not by pasting its name as ordinary text. Replace every `<PLACEHOLDER>` before sending. Inputs and the Skill body are in EXAMPLES.md.

## 1 · Create the Skill

Select `@skill-creator`, then paste:

```text
Create an instruction-only Skill named brief-to-page using the Skill body below.
It should turn a short public brief into a responsive single-page static website.
Keep creation and deployment separate. Do not add scripts, external services, or API keys.
Create it for this host and tell me where it was saved and how to invoke it.
If you cannot create an installed Skill here, say so; do not call an attachment an installed Skill.

[Paste the Skill body from EXAMPLES.md here.]
```

Check: `brief-to-page` appears in Skills / the `@` picker. Review the generated procedure before use.

## 2 · Use it on Input A

Select `@brief-to-page`, then paste:

```text
Use Input A below to create the page in this task's output folder.
Follow the Skill. Open the result if you have a browser and check the topic link,
FAQ toggles, and narrow layout. Report only checks you actually performed.
Do not deploy yet.

[Paste Input A here.]
```

Check: open the saved file, use Explore topics, toggle both FAQs, and resize the browser. Keep this task and its file for deployment.

## 3 · Reuse without repasting the procedure

In a fresh task/folder, select the same `@brief-to-page` and paste:

```text
Use Input B below to create a separate page. Follow the same Skill.
Do not overwrite Input A or copy its club name, topic list, FAQ answers, or green accent.
Give the output path and a checked/not-checked summary. Do not deploy.

[Paste Input B here.]
```

Check: compare with EXAMPLES.md. Then return to the task holding Input A.

## 4 · Make one read-only MCP call

After connecting `vercel` in Settings → MCP servers, paste:

```text
Use the connected Vercel MCP to find the current documentation for deploying
an agent-generated static page. Summarize what the direct deployment tool needs.
Show which tool you actually called. Do not create or change any project.
```

Check: a real Vercel documentation-tool call and result, not only an answer from model memory.

## 5 · Choose the destination

```text
Use Vercel MCP to list my accessible teams. Do not deploy.
After I select a team, list its projects so I can choose a new, non-conflicting
workshop project name. Report the selected team ID and the exact project name.
```

Choose your team. Pick a unique name, for example `ai-club-your-initials-demo` if unused. Keep the returned team ID and exact project name for the next prompts. Do not select an unrelated existing project.

## 6 · Deploy a Preview with MCP

```text
Deploy the reviewed Input A page from this task using the connected Vercel MCP.
Team: <TEAM>
Project name: <PROJECT_NAME>
Target: preview
Use deploy_to_vercel with the actual complete source file contents.
The generated index.html must be at the deployment root, not inside output/.
Show the destination and file list before the tool action so I can review it.
Do not use a different project, switch to production, or claim deployment from code generation alone.
Return the real deployment ID and URL. If the deployment tool is unavailable,
report that and stop; do not invent a URL or silently switch to the CLI.
```

Check: approve the intended tool action in the host. A tool invocation and a deployment record must exist. No Git repository or Vercel CLI is required for this direct-file route.

## 7 · Verify the actual deployment

```text
Use Vercel MCP to inspect deployment <DEPLOYMENT_ID_OR_URL> in team <TEAM>.
Wait for the build result. If it failed, read its build logs and identify the first actionable error.
If it is ready, report the exact URL. Fetch the page when a suitable tool is available.
Distinguish build success, retrieved HTML, and checks performed in a real browser.
Do not say links, FAQ interaction, or mobile layout passed unless you tested them.
```

Open the returned URL yourself. Check the heading, Explore topics, both FAQ toggles, keyboard focus, and a narrow viewport. If Preview requires sign-in, inspect its access/protection state; do not assume the URL is anonymously public.

## 8 · One change, then another Preview

```text
Change only Input A's headline from "Learn AI. Build together." to
"Build small. Learn together." Keep the remaining content, structure, and styles.
Show the focused diff. Then deploy the updated files with Vercel MCP to a new Preview
in team <TEAM>, using the same project name <PROJECT_NAME>.
Return the new deployment ID and URL. Verify the new heading there, and say which
checks were run. Do not overwrite or switch to an unrelated project.
```

Check: open the new URL, not a previous deployment URL. The heading changes; Topics and FAQ still work. Retain the previous deployment ID for comparison.

## 9 · Optional: publish the reviewed page

```text
I have reviewed this version and want to publish it to production.
Use Vercel MCP with team <TEAM>, project <PROJECT_NAME>, and target production.
Deploy the same reviewed source files. Report the real deployment record and URL.
Check the resulting access behavior without automatically disabling project protection.
Do not change a custom domain or an unrelated project.
```

Check: open the final address in the intended access context. Production and anonymous access are separate checks.

## 10 · If blocked, preserve an honest handoff

```text
Do not claim success for steps that did not run.
Report: available output files; Skill invocation status; connected tools;
last real deployment ID/URL, if any; the blocking error; and one concrete next action.
Keep the generated page intact. Do not install another tool or deploy elsewhere.
```
