# Grill Me Method Notes

Source: YouTube video `The Skill That 10x’d My Claude Code Projects` (`https://www.youtube.com/watch?v=c0kaKxM2pHg`). Transcript fetched locally on 2026-06-04.

## Core Pattern

- Extract tacit knowledge from the user's head into reusable AI context.
- Ask one question at a time, relentlessly enough to close real gaps.
- Provide a recommended/default answer for each question so the user can confirm, revise, or reject rather than start from a blank page.
- Walk the design tree branch by branch and resolve decision dependencies in order.
- Inspect code/docs instead of asking when the answer is discoverable.
- Checkpoint after every answer to a Markdown capture doc.
- Maintain summary, key decisions, Q&A log, and open flags.
- Continue until shared understanding is strong enough for a skill, spec, or implementation handoff.

## Chekhov Toolkit Application

For The Michael Chekhov Toolkit, the grill session should produce the context needed for a Claude Code/Codex handoff: what to preserve from the current React prototype, what to rebuild or port for Vue/mobile/web accessibility, what pedagogical and NMCA-facing constraints matter, and what high-leverage council-review ideas should be included or deferred.
