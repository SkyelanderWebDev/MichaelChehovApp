---
description: Relentless one-question discovery with checkpointed brainstorm docs
argument-hint: [topic-or-goal]
---

Run the Grill Me workflow for this project.

Purpose: extract tacit requirements, product taste, domain nuance, implementation constraints, and handoff decisions into a reusable Markdown capture document before coding.

Operating rules:
1. Ask exactly one question at a time.
2. For every question, provide your recommended/default answer first, with brief rationale.
3. If the answer can be discovered by reading the codebase, project docs, prior plans, or existing brainstorms, inspect those sources instead of asking.
4. After every user answer, update the capture document before asking the next question.
5. Maintain a confidence score, key decisions, Q&A log, and open flags.
6. Stop when the next Claude Code/Codex handoff is clear enough, the user stops, or remaining gaps require outside stakeholder input.

Project naming rule:
- Refer to this app as "The Michael Chekhov Toolkit" unless the user explicitly chooses a different name.

Capture file:
- Use `brainstorms/<slug>.md` in the project root.
- If `$ARGUMENTS` names a topic, create/update a slug based on that topic.
- If no argument is provided, use `brainstorms/michael-chekhov-toolkit-grill-me.md`.
- Create `brainstorms/` if missing.
- Do not overwrite useful existing notes; update in place or create a timestamped sibling when needed.

Capture structure:

```markdown
# Grill Me Capture: <Topic>

## Session Metadata
- Date:
- Project/root:
- User goal:
- Current confidence:
- Status: active | paused | ready-for-handoff | blocked

## Executive Summary

## Key Decisions

## Design Tree / Coverage Map
- Users & stakeholders:
- Jobs to be done:
- Success criteria:
- Scope / non-goals:
- Domain model:
- User flows:
- Data/state:
- UX/accessibility/mobile:
- Technical architecture:
- Testing/verification:
- Handoff needs:
- Risks/blind spots:

## Q&A Log
### Q1: <question>
Recommended answer/default: <recommendation>
User answer: <answer>
Extracted decisions/context:
Open follow-ups:

## Open Flags

## Handoff Seeds
- Claude Code context:
- Codex bounded work lanes:
- Tests/checks to require:
- Files/artifacts likely needed:
```

Question ladder:
1. Frame/outcome: what must be produced, judged, shipped, or deferred?
2. Stakeholders/users: actors, directors, teachers, NMCA/Lisa, students, maintainers.
3. Jobs/rituals: what practice behavior should the app create?
4. Domain fidelity: which Michael Chekhov concepts/language must be preserved?
5. Experience/flow: first run, repeat use, mobile, classroom, accessibility, ceremony vs utility.
6. Architecture: current React prototype, possible Vue/mobile-accessible rebuild, persistence, data model, source-of-truth files.
7. Risks/blind spots: what would fail despite polish?
8. Handoff: what Claude Code builds, what Codex reviews or implements, what tests/manual checks prove readiness.

Begin by inspecting existing context before asking:
- `CLAUDE.md`
- `design_guidelines.md`
- `.claude/plans/`
- `brainstorms/` if present
- key source files: `client/src/pages/Home.tsx`, `client/src/components/ToolRevealCard.tsx`, `client/src/components/POAJournal.tsx`, `client/src/lib/toolData.ts`, `shared/schema.ts`, `server/routes.ts`, `server/db.ts`

Then create/update the capture doc and ask the first single question.
