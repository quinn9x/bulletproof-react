# Project Progress

> Persistent checkpoint for AI-assisted development.
> This file must reflect the actual state of the repository.

## Project

- Repository: `quinn9x/bulletproof-react`
- Baseline commit: `f083e74ff4c8290587e4808cd07d2fef701e519f`
- Current phase: Phase 1 — Quality Foundation
- Current task: `FND-01.5`
- Status: `TODO`

## Current Objective

Establish a reliable quality foundation and test architecture while preserving the existing application behavior.

The project must remain easy to resume across AI sessions without depending on previous conversation history.

## Completed

### Phase 0 — Baseline

- [x] Initial repository inspection
- [x] Initial architecture review
- [x] Identified major improvement areas
- [x] Defined phased improvement roadmap
- [x] Defined persistent project-state strategy
- [x] Defined task ID convention
- [x] Defined session handoff workflow

### BASE-01 — Establish Project Checkpoint

- [x] Added `docs/architecture/progress.md`
- [x] Added `docs/architecture/roadmap.md`
- [x] Added `docs/architecture/decisions.md`
- [x] Documented AI session handoff rules
- [x] Verified repository state
- [x] Established persistent project checkpoint

### FND-01.1 — Repository Quality Baseline

- [x] Established Vite+ formatting workflow
- [x] Established Vite+ lint workflow
- [x] Established TypeScript verification
- [x] Ran `vp check`
- [x] Formatting passes for all repository files
- [x] Lint has 0 errors
- [x] Typecheck has 0 errors
- [x] Existing lint warnings documented as non-blocking baseline warnings

### FND-01.2 — Testing Baseline

- [x] Confirmed Vite+ test runner and Vitest integration
- [x] Confirmed test imports use `vite-plus/test`
- [x] Added `src/utils/format.test.ts`
- [x] Added tests for ISO date string formatting
- [x] Added tests for timestamp formatting
- [x] `vp test` passes
- [x] Current test result: 1 test file, 2 tests passed
- [x] Investigated Dev Container locale issue affecting `vp test`
- [x] Confirmed the Dev Container provides `C.UTF-8`
- [x] Confirmed `vp test` runs successfully without an explicit `LANG` override

## In Progress

### FND-01.3 — Test Architecture

#### Goal

Define a practical test architecture based on the application's actual behavior and critical user flows before adding a large number of tests.

#### Tasks

- [x] Audit existing feature and API boundaries
- [x] Identify critical application behaviors
- [x] Identify appropriate unit-test targets
- [x] Review existing MSW infrastructure for reuse in tests
- [x] Define initial test matrix
- [x] Implement the first high-value tests
- [x] Verify the test architecture with `vp test`
- [x] Update project checkpoint

#### Definition of Done

- [x] Critical testable behaviors are identified
- [x] Test responsibilities are defined by layer
- [x] Existing MSW infrastructure is evaluated for test reuse
- [x] Initial test matrix is documented
- [x] At least the first high-value test group is implemented
- [x] `vp test` passes
- [x] `vp check` passes with no new errors or warnings introduced by this task
- [x] `progress.md` and `roadmap.md` describe the same current state

## Next Tasks

1. `FND-01.5` — Tooling and Dependency Cleanup
2. `FND-02` — TypeScript / Type Safety Baseline
3. `FND-03` — Architecture Boundary Enforcement
4. `FND-04` — Authentication and Authorization Review
5. `FND-05` — E2E Smoke Test

## Current Blockers

None.

## Known Warnings

The current `vp check` result contains 6 warnings and 0 errors:

- `react/only-export-components`
  - `src/app/routes/app/discussions/discussion.tsx`
  - `src/app/routes/app/discussions/index.tsx`
  - `src/app/routes/app/users.tsx`
- `jsx-a11y/prefer-tag-over-role`
  - `src/components/ui/spinner.tsx`
  - `src/components/ui/field.tsx`
- `jsx-a11y/label-has-associated-control`
  - `src/components/ui/label.tsx`

These warnings are not part of FND-01.3 unless the test architecture work requires changes to the affected components.

## Known Risks

- Architecture rules are currently expressed mostly through conventions rather than enforced boundaries.
- CI quality gates need to be verified and standardized.
- API contracts and external data validation need further review.
- Authentication and authorization require a dedicated security review.
- Testing strategy needs to be evaluated against critical user flows.
- Tooling choices should be distinguished from architecture decisions.
- The repository currently has no CI workflow under `.github/workflows/`.
- The repository currently has no existing `*.test.*` or `*.spec.*` test files beyond the newly established format test.

## Repository Verification

At the beginning of every resumed session, verify:

- [ ] Git branch
- [ ] Git status
- [ ] Current HEAD
- [ ] Recent commits
- [ ] Current task implementation
- [ ] Tests
- [ ] Typecheck
- [ ] Lint
- [ ] Build

Use the commands defined by the repository's current tooling configuration.

## Session Handoff

When starting a new AI session:

1. Read this file.
2. Read `roadmap.md`.
3. Read `decisions.md`.
4. Inspect the actual repository.
5. Check `git status`.
6. Check the current commit.
7. Verify the current task against the code.
8. Do not redo tasks marked `DONE` unless verification shows they are incomplete.
9. Work on the current task before starting another task.
10. Run the required verification.
11. Update this file before finishing.
12. If the session ends unexpectedly, use this file and the actual repository state as the recovery point.

## Important Rule

The repository is the source of truth.

If this file conflicts with the actual code or git history:

1. Inspect the repository.
2. Identify the discrepancy.
3. Correct this file.
4. Continue development.

Never blindly trust a stale checkpoint.

## Last Updated

- Date: `2026-09-27`
- Last verified commit: `f083e74ff4c8290587e4808cd07d2fef701e519f`
- Updated by: AI-assisted architecture review

## AI Maintenance Rules

When updating this file:

- Preserve valid Markdown syntax.
- Keep headings using `#`, `##`, `###`, etc.
- Keep checkboxes using `- [ ]` and `- [x]`.
- Keep ordered lists using `1.`, `2.`, `3.`, etc.
- Keep unordered lists using `-`.
- Keep code, commands, paths, task IDs, statuses, and commit hashes in backticks when appropriate.
- Do not convert the document into plain text.
- Do not wrap the entire document in a Markdown code fence.
- Do not remove or flatten the document structure.
- Prefer editing the existing sections instead of creating duplicate sections.
- Preserve the meaning of completed tasks and historical checkpoints.
- Update `Current Phase`, `Current Task`, `Status`, `In Progress`, `Next Tasks`, `Current Blockers`, and `Last Updated` when the project state changes.
- Only mark a task as `DONE` after its Definition of Done has been verified against the repository.
- Never claim a task is complete based only on a previous AI session's statement.
- The repository remains the source of truth.
