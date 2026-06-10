# Agent orchestration research — Claude Code/Opus 4.8 + Codex/GPT-5.5 for The Michael Chekhov Toolkit

Date: 2026-06-04
Project: The Michael Chekhov Toolkit
Purpose: Research-backed operating model for using Claude Code/Opus 4.8 and Codex/GPT-5.5 together to build the weekend Lisa pilot and June 13 secure tester beta.

## Project constraints the agents must honor

- App name: The Michael Chekhov Toolkit.
- Target stack: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- Existing React prototype remains a behavior/UX reference, not the production stack.
- Weekend Lisa pilot goal: confidence/proof-of-progress demo, not full beta.
- June 13 goal: secure tester-ready beta for a 1-hour group demo/testing call.
- August 1 goal: public/app-store-readiness direction, with rights/source audit before public release.
- Attribution: include Lisa/NMCA/Chart attribution before external sharing. Current beta stance: “Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.”
- Content guardrail: first beta avoids AI-generated embodied prompts entirely; use sourced excerpts plus POA structure only. Neutral navigation/UI copy is okay.
- Global Daily Tool: model it in flow/data now, but June 13 can use seeded/manual daily tool; no real push scheduler/admin CMS required by June 13.
- Free-first posture: Supabase/Cloudflare Pages/Vercel/Netlify free tiers where possible; avoid paid Apple/Google/Ionic tiers unless necessary.

## Official/source research findings

### Anthropic / Claude Code / Opus 4.8

1. Claude Code is an agentic coding environment: it can read files, run commands, make changes, and work through problems autonomously. Anthropic frames the workflow as Claude explores, plans, and implements, rather than only answering chat questions.
   Source: https://code.claude.com/docs/en/best-practices.md

2. Claude Code can build features/fix bugs, write tests, work with git/PRs, connect tools via MCP, and use project instructions such as CLAUDE.md, skills, hooks, agents/subagents, and plugins.
   Source: https://code.claude.com/docs/en/overview.md

3. Anthropic recommends separating exploration, planning, implementation, and commit. Plan mode is specifically recommended when you are uncertain, changing multiple files, or unfamiliar with the codebase.
   Sources:
   - https://code.claude.com/docs/en/best-practices.md
   - https://code.claude.com/docs/en/common-workflows.md

4. Anthropic emphasizes giving Claude an executable verification signal: tests, build exit code, linter, script, screenshot comparison, etc. Without a check, “looks done” becomes the only stop condition.
   Source: https://code.claude.com/docs/en/best-practices.md

5. Anthropic recommends CLAUDE.md as short persistent project context with build commands, code style, and workflow rules. Overly long CLAUDE.md files degrade usefulness.
   Source: https://code.claude.com/docs/en/best-practices.md

6. Anthropic recommends subagents for investigation to avoid context pollution, and fresh-context/adversarial review before considering long autonomous work done.
   Sources:
   - https://code.claude.com/docs/en/best-practices.md
   - https://code.claude.com/docs/en/common-workflows.md

7. Anthropic supports parallel sessions via worktrees so edits do not collide, and notes that fresh contexts improve review because the reviewer is not biased toward its own code.
   Sources:
   - https://code.claude.com/docs/en/best-practices.md
   - https://code.claude.com/docs/en/common-workflows.md

8. Claude Code security model: strict read-only permissions by default; additional actions require explicit permission. Built-in protections include sandboxed bash, write-access restriction to the started folder/subfolders, allowlisting, and user responsibility for reviewing proposed code/commands.
   Source: https://code.claude.com/docs/en/security.md

9. Anthropic model docs: Claude Opus 4.8 is described as Anthropic’s most capable model for complex reasoning, long-horizon agentic coding, and high-autonomy work. For Opus 4.8, `xhigh` effort is recommended for coding/high-autonomy/intelligence-demanding tasks.
   Sources:
   - https://platform.claude.com/docs/en/about-claude/models/overview.md
   - https://platform.claude.com/docs/en/about-claude/models/choosing-a-model.md

### OpenAI / Codex / GPT-5.5

10. Codex docs describe Codex as available through CLI, IDE extension, and cloud automation for speeding development.
    Source: https://developers.openai.com/codex/llms.txt

11. Codex security model: by default, network access is off. Locally, Codex uses an OS-enforced sandbox limiting what it can touch, typically to the current workspace, plus an approval policy. Cloud setup can use network, then the agent phase runs offline by default unless internet is enabled; secrets are removed before the agent phase.
    Source: https://developers.openai.com/codex/agent-approvals-security.md

12. Codex sandbox/approval controls distinguish what the agent technically can do from when it must ask. Read-only mode is available for chat/planning without changes; workspace-write can edit and run commands in the workspace; network/out-of-workspace actions require approval.
    Source: https://developers.openai.com/codex/agent-approvals-security.md

13. Codex reads AGENTS.md files before work. It layers global guidance with project-specific guidance and gives closer files precedence. The default instruction limit is 32 KiB, so project guidance must be concise.
    Source: https://developers.openai.com/codex/guides/agents-md.md

14. Codex worktrees allow multiple independent tasks in the same repo without interfering. Worktrees are separate checkouts/branches sharing Git metadata; they are useful for parallel work, background queues, and later handoff/inspection.
    Source: https://developers.openai.com/codex/app/worktrees.md

15. Codex review pane focuses on repository diffs/uncommitted changes and can scope review to all branch changes, last turn changes, staged/unstaged changes.
    Source: https://developers.openai.com/codex/app/review.md

16. Codex subagents move noisy work off the main thread. The docs emphasize context pollution/context rot and recommend parallel agents for read-heavy tasks such as exploration, tests, triage, and summarization; they caution that parallel write-heavy workflows can create conflicts and coordination overhead.
    Source: https://developers.openai.com/codex/concepts/subagents.md

17. OpenAI’s AI-native engineering guide frames agents across planning, design, build, test, and review. It says coding agents can plan against code, scaffold UI/components, implement full features, run tests/fix build errors, and review logic across files/services. It also emphasizes human ownership: engineers delegate initial review, but own final review and merge.
    Source: https://developers.openai.com/codex/guides/build-ai-native-engineering-team.md

18. OpenAI GPT-5.5 guide says GPT-5.5 is a strong fit for coding use cases, tool-heavy agents, grounded assistants, long-context retrieval, product-spec-to-plan workflows, and customer-facing workflows where execution quality and polish matter. It recommends outcome-first prompts with clear success criteria, allowed side effects, evidence rules, and output shape.
    Source: https://developers.openai.com/api/llms-full.txt section “Using GPT-5.5”

19. OpenAI GPT-5.5 reasoning effort guidance: default is medium. Use medium/high for diagnosing problems, comparing options, writing plans, or reasoning through code; reserve xhigh when evals show extra latency is worth it.
    Source: https://developers.openai.com/api/llms-full.txt section “Set up reasoning.effort”

## Initial synthesis before dual-brain review

### Claude Code / Opus 4.8 likely strengths for this app

- Best primary architect/integrator for ambiguous product flow: acting pedagogy, Lisa/NMCA trust, mobile user experience, weekend demo coherence, and what to defer.
- Strong fit for long-horizon multi-file implementation when given a concrete plan and verification checks.
- Strong fit for creating/maintaining `CLAUDE.md`, project context, handoff specs, and self-verifying implementation passes.
- Strong fit for final demo-readiness pass where product taste, narrative, and stakeholder trust matter.

### Claude Code / Opus 4.8 likely risks

- Can overbuild if the prompt does not aggressively enforce weekend/June 13 cut lines.
- Can accept “looks done” without executable checks if checks are not built into the prompt.
- Can pollute context if research, implementation, and review are mixed in one kitchen-sink session.
- Fresh-context review is necessary because the implementing model may be biased toward its own diff.

### Codex / GPT-5.5 likely strengths for this app

- Strong independent reviewer/challenger for Claude’s plan and diff.
- Strong bounded implementer for crisp contracts with clear acceptance tests: Supabase schema/RLS, type/build cleanup, data-model checks, auth/security smoke, PWA installability checks, and deterministic bug fixes.
- Strong read-only auditor for “what did the diff actually change?” and “does this satisfy the spec?”
- Strong candidate for parallel one-shot plan/prototype in a separate worktree, provided we do not let both agents edit the same files concurrently.

### Codex / GPT-5.5 likely risks

- Needs outcome-first prompts and explicit evidence/side-effect rules; otherwise it may optimize for checklist output rather than stakeholder coherence.
- Read-only/no-network defaults mean source docs must be supplied, or network must be explicitly approved.
- Parallel write-heavy work can produce merge conflicts and coordination overhead.
- Final merge/deploy ownership must stay with the human/Hermes controller, not the reviewing agent.

## Recommended operating thesis to test with Opus and Codex

1. Do not start with both agents editing the repo.
2. Start with dual one-shot read-only plans from the same sourced prompt.
3. Reconcile into one weekend execution spec.
4. Let Claude Code/Opus be primary product architect + integrator for the weekend vertical slice.
5. Let Codex/GPT-5.5 be independent challenger/reviewer and bounded implementation worker only when the lane has crisp acceptance tests.
6. Use worktrees for any parallel implementation.
7. Require executable verification at every handoff: install, typecheck, build, mobile/browser smoke, state persistence smoke, attribution/source scan, and content guardrail scan.
8. Human/Hermes remains final controller: reconcile, merge, decide scope, and block public sharing until attribution/content gates pass.

## Same prompt sent to Opus and Codex

The prompt below is intended to be given to both brains in read-only/planning mode so their outputs can be compared and reconciled.

```text
You are a peer AI coding-orchestration architect. You are not implementing code in this pass. You are reviewing the sourced research and the Michael Chekhov Toolkit project constraints, then proposing the best Claude Code + Codex collaboration model for a 24-hour app build.

Project context:
- App: The Michael Chekhov Toolkit.
- Stack target: Ionic Vue + Capacitor/PWA + Supabase Auth/Postgres/RLS.
- Existing React prototype is a behavior/UX reference only.
- Weekend Lisa pilot: confidence/proof-of-progress demo, not full beta.
- June 13: secure tester-ready beta for certified teachers/students/actors.
- August/public release requires formal source/rights audit.
- Attribution must appear before external sharing: Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.
- First beta must avoid AI-generated embodied prompts entirely; use sourced excerpts plus POA structure only.
- Free-first infrastructure.

Research thesis to challenge:
- Claude Code/Opus 4.8 should be primary architect/integrator for ambiguous product/UX/domain work and the weekend vertical slice.
- Codex/GPT-5.5 should be independent read-only challenger/reviewer and bounded implementation worker for crisp contracts like RLS, tests, type/build cleanup, and verification.
- Both may one-shot the same prompt first in read-only/planning mode; do not let both freely edit the same files.
- Use worktrees for any parallel implementation and executable checks at every handoff.

Your task:
1. Compare Claude Code/Opus 4.8 vs Codex/GPT-5.5 for this exact app scenario.
2. Identify best-practice orchestration rules, with any caveats.
3. Decide whether both should one-shot the same build prompt, and if so how outputs should be compared/reconciled.
4. Produce a step-by-step weekend operating plan from now through Lisa pilot.
5. Produce a June 13 extension plan.
6. Define exact agent roles at each step: Hermes/controller, Claude Code/Opus, Codex/GPT-5.5.
7. Define acceptance gates and evidence required before showing Lisa.
8. Name likely blind spots and how to mitigate them.
9. Keep the plan practical for a 24-hour build; ruthlessly protect the weekend cut line.

Output format:
- Executive recommendation
- Pros/cons table
- Collaboration model by phase
- Whether to one-shot both agents, with comparison rubric
- Weekend plan with timeboxes and gates
- June 13 plan
- Red flags / blockers
- Final recommended prompt shape for Claude Code and Codex
```
