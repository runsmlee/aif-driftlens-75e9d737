# DriftLens — Product Requirements Document

## Problem
Product and engineering teams suffer costly rework when implementations drift from specifications. By the time drift is discovered, the gap is often too large to fix cheaply. Teams need an instant, objective way to measure whether what they built matches what they planned — before it ships.

## Target Users
Product managers and technical leads who write specs and need to verify that the final implementation (code, copy, or configuration) aligns with the original specification. These users work in fast-moving teams where specs evolve and misalignment creeps in silently.

## Core Feature (default: exactly ONE)
- **Side-by-Side Drift Comparison**: User pastes the original spec text on the left and the current implementation text on the right. The tool instantly renders a highlighted diff that categorizes every change as an addition (green), deletion (red), or modification (yellow), and displays a single drift-severity score (0–100) at the top. — Acceptance Criteria: When a user pastes two different texts into the left and right panels and the comparison runs, every differing line is highlighted in the correct category color, the drift score is displayed as a number between 0 and 100, and hovering any highlighted line reveals a tooltip stating the change type (added / deleted / modified).

## Should Have (optional — only if the ONE feature requires it)
- **Comparison History (localStorage)**: The tool saves the last 10 comparisons to localStorage so the user can reload a previous comparison without re-pasting. — Acceptance Criteria: After running a comparison, refreshing the page shows the comparison in a history list; clicking a history entry restores both text inputs and the diff result.

## Out of Scope (v1) — LIST AT LEAST 3 things explicitly NOT being built
- **File upload / URL import**: Drag-and-drop or URL-based file import would be convenient but adds UX complexity and edge cases (file formats, URL auth) that dilute the core "paste and compare" loop.
- **Collaboration / sharing**: Multi-user sharing or permalinks would require a backend and auth layer. The single-user local experience is sufficient to validate the core value.
- **AI-powered semantic analysis**: Using LLMs to judge intent drift (not just text drift) would be powerful but introduces API costs, latency, and hallucination risk. Text diff is deterministic and instant — ship that first.

## Success Metrics
- Primary: User completes a full comparison (paste spec, paste implementation, see drift score and highlighted diff) in under 15 seconds on first visit.
- Secondary: User returns to run a second comparison within 7 days (tracked via localStorage history).

## Design Principles
- **Zero-friction input**: The hero IS the tool — two text areas side by side, results appear as you type. No onboarding, no "Get Started" button.
- **Glanceable severity**: The drift score is the first thing the eye lands on; the user knows instantly if there's a problem before reading any detail.
- **Professional restraint**: Red (#EF4444) brand accent for critical elements only. Diff highlights use semantic green/red/yellow. Clean system typography. No decorative elements.
