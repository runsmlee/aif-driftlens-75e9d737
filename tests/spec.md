# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### diff.test.ts
- [ ] `computeLineDiff` returns empty array for identical texts
- [ ] `computeLineDiff` correctly identifies added lines (present in right, absent in left)
- [ ] `computeLineDiff` correctly identifies deleted lines (present in left, absent in right)
- [ ] `computeLineDiff` correctly identifies modified lines (adjacent delete+add with shared prefix)
- [ ] `computeLineDiff` ignores pure whitespace-only differences when option enabled
- [ ] `computeLineDiff` handles empty left input (all additions)
- [ ] `computeLineDiff` handles empty right input (all deletions)

### scoring.test.ts
- [ ] `calculateDriftScore` returns 0 for identical texts
- [ ] `calculateDriftScore` returns 100 when all lines changed
- [ ] `calculateDriftScore` returns proportional score for partial changes
- [ ] `getDriftSeverity` returns "aligned" for scores 0–15
- [ ] `getDriftSeverity` returns "low" for scores 16–35
- [ ] `getDriftSeverity` returns "medium" for scores 36–60
- [ ] `getDriftSeverity` returns "high" for scores 61–85
- [ ] `getDriftSeverity` returns "critical" for scores 86–100

### DiffViewer.test.tsx
- [ ] renders without crash when given diff results
- [ ] renders "No differences" message when diff array is empty
- [ ] highlights added lines with green background class
- [ ] highlights deleted lines with red background class
- [ ] highlights modified lines with yellow background class
- [ ] shows change-type tooltip on hover over a highlighted line

### DriftScore.test.tsx
- [ ] renders the numeric score
- [ ] displays correct severity label based on score range
- [ ] applies correct color class for each severity level

### App.test.tsx
- [ ] renders both text input areas on load
- [ ] shows drift score of 0 initially (empty inputs)
- [ ] updates drift score when text is entered in both panels
- [ ] updates diff highlights when text changes in either panel
- [ ] saves comparison to localStorage after running
- [ ] restores comparison from history on click

## User Journey Tests

### Primary Workflow
1. App loads → hero shows two empty text areas side by side with a drift score of "—" (no comparison yet)
2. User pastes spec text into left panel → left panel shows text, no diff yet
3. User pastes implementation text into right panel → diff highlights appear instantly, drift score updates to a number 0–100
4. User hovers a highlighted line → tooltip shows change type (added / deleted / modified)
5. User clicks "Save" or comparison auto-saves → entry appears in history sidebar
6. User refreshes page → history sidebar shows saved comparison
7. User clicks history entry → both text areas and diff restore

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [ ] AC: When a user pastes two different texts into the left and right panels and the comparison runs, every differing line is highlighted in the correct category color
- [ ] AC: the drift score is displayed as a number between 0 and 100
- [ ] AC: hovering any highlighted line reveals a tooltip stating the change type (added / deleted / modified)
