# Project Progress

> Persistent checkpoint for AI-assisted development.
> This file must reflect the actual state of the repository.

## Project

- Repository: `quinn9x/bulletproof-react`
- Baseline commit: `f083e74ff4c8290587e4808cd07d2fef701e519f`
- Current phase: Phase 1 — Quality Foundation
- Current task: `FND-05`
- Status: `IN_PROGRESS`

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
- [x] Investigated Dev Container locale issue affecting `vp test`
- [x] Confirmed the Dev Container provides `C.UTF-8`
- [x] Confirmed `vp test` runs successfully without an explicit `LANG` override

### FND-02 — TypeScript / Type Safety Baseline

- [x] Reviewed TypeScript configuration
- [x] Enabled `strict` mode for application code
- [x] Enabled `strict` mode for Node/Vite configuration
- [x] Verified TypeScript compilation with `tsc -b`
- [x] Audited explicit `any` usage
- [x] Confirmed existing generic `any` usage does not currently prevent strict typechecking
- [x] `vp check` passes with 0 errors
- [x] `vp test` passes
- [x] Production build succeeds

### FND-03 — Formatting and Linting Consistency

- [x] Reviewed current Vite+ formatting configuration
- [x] Reviewed current lint configuration
- [x] Distinguished genuine application issues from generated/UI-library code
- [x] Avoided broad refactoring solely for stylistic reasons
- [x] Verified `vp check`
- [x] Verified tests and production build
- [x] Documented remaining non-blocking warnings

### FND-04 — Test and Build Verification

- [x] Expanded tests around important pure utilities
- [x] Identified critical application flows requiring tests
- [x] Added tests for important API/query behavior where practical
- [x] Added authentication schema unit tests
- [x] Added authentication API integration tests
- [x] Added discussions API integration tests
- [x] Added MSW-backed integration test setup
- [x] Added an in-memory test database seed
- [x] Added API handler coverage for authenticated and unauthenticated discussion flows
- [x] Added coverage for discussion create, read, update, and delete behavior
- [x] Added `@vitest/coverage-v8` to development dependencies
- [x] Updated `pnpm-lock.yaml`
- [x] Documented the required test environment
- [x] `vp test` passes: 4 test files, 19 tests
- [x] `vp check` passes with 0 errors
- [x] `vp build` succeeds

## FND-05 — E2E Smoke Test

### Current State

- [x] Selected Playwright for browser-level E2E testing
- [x] Added `@playwright/test` as a development dependency
- [x] Playwright version: `1.63.0`
- [x] Added an E2E smoke test at `e2e/smoke.spec.ts`
- [x] Confirmed the application login route is `/auth/login`
- [x] Confirmed successful login redirects to `/app`
- [x] Confirmed the authenticated user can access `/app/discussions`
- [x] Confirmed the E2E test can launch Chromium successfully after the Dev Container browser/runtime dependencies were resolved
- [x] Confirmed the smoke test passes
- [x] Confirmed `pnpm exec playwright test` runs the E2E test successfully
- [x] Confirmed `pnpm exec vp test` passes with all unit and integration tests
- [x] Added `playwright-report/` and `test-results/` to `.gitignore`
- [x] Added Playwright browser installation to CI
- [x] Added a dedicated Playwright E2E step to CI
- [x] Updated testing documentation with the current E2E test location and execution command

### Important E2E Findings

- The original test used `/login`, but the actual application route is `/auth/login`.
- The original expected post-login URL `/app/discussions` was incorrect as the immediate login destination.
- The actual login flow redirects to `/app`.
- The authenticated user can subsequently access `/app/discussions`.
- Playwright initially failed because Chromium could not load `libglib-2.0.so.0`.
- The Dev Container was based on `ghcr.io/voidzero-dev/vite-plus:1.0.0-rc.1`.
- The browser/runtime dependency issue was resolved through the Dev Container Playwright configuration.
- After the browser environment was corrected, the Chromium smoke test passed.

### Current E2E Test

The smoke test validates:

1. Navigate to `/auth/login`.
2. Verify the login heading.
3. Fill `Email Address` with `john@example.com`.
4. Fill `Password` with `password`.
5. Click `Log in`.
6. Verify the resulting URL is `/app`.
7. Navigate to `/app/discussions`.
8. Verify the authenticated user can access the discussions route.

The test uses the application's existing MSW/mock authentication environment.

## Verification Status

Latest verified commands:

### `pnpm exec vp check`

- Formatting: passed
- Errors: `0`
- Warnings: `6`
- Result: passed

Current warnings:

- `react/only-export-components`
  - `src/app/routes/app/discussions/discussion.tsx`
  - `src/app/routes/app/discussions/index.tsx`
  - `src/app/routes/app/users.tsx`
- `jsx-a11y/prefer-tag-over-role`
  - `src/components/ui/spinner.tsx`
  - `src/components/ui/field.tsx`
- `jsx-a11y/label-has-associated-control`
  - `src/components/ui/label.tsx`

These remain non-blocking.

### `pnpm exec vp test`

- Test files: `4 passed`
- Tests: `19 passed`
- E2E smoke test: `1 passed`
- Result: passed

### `pnpm exec vp build`

- Build: passed
- Result: successful production build
- Existing warnings:
  - `node:fs/promises` is externalized for browser compatibility from `src/testing/mocks/db/persistence.ts`
  - One or more chunks exceed the configured 500 kB warning threshold

These warnings are currently non-blocking.

### `pnpm exec playwright test`

- Chromium E2E: passed
- Tests: `1 passed`

## Tooling / Configuration

### Dev Container

Current base image:

- `ghcr.io/voidzero-dev/vite-plus:1.0.0-rc.1`

The project uses Vite+ as the primary development/test/build tool.

Important command distinction:

- `vp dev` is a Vite+ built-in command.
- `vpr dev` is the package-script-oriented command when using the `dev` npm script.
- The package currently defines `"dev": "vp dev"`.

### Vite Configuration

`vite.config.ts` contains:

- React plugin
- Tailwind plugin
- Vite+ formatting configuration
- Vite+ lint configuration
- `test.setupFiles: ['./src/testing/setup.ts']`
- Vite server configured for:
  - host `0.0.0.0`
  - port `5173`

There is no separate `vitest.config.ts` or `vite-plus.config.ts`.

### CI

`.github/workflows/ci.yml` exists and currently performs:

1. Checkout
2. pnpm setup
3. Node.js 24 setup
4. Dependency installation
5. `pnpm exec vp check`
6. `pnpm exec vp test`
7. `pnpm exec vp build`

CI environment:

- Node.js `24`
- pnpm `12.5.1`
- `VITE_APP_API_URL=http://localhost:8080`

The repository therefore already has a CI quality workflow; this is not an outstanding missing item.

## Known Issues / Follow-up

- The E2E test currently verifies login and landing on `/app`, but does not yet verify navigation/access to `/app/discussions`.
- The original task name says "user can log in and access discussions"; the test should eventually cover the discussions page itself if that remains the intended critical flow.
- The E2E test currently uses hard-coded test credentials:
  - `john@example.com`
  - `password`
- The E2E runtime uses the application's existing MSW/mock authentication environment rather than a separate production backend.
- The browser test should be evaluated against the real application runtime/build where practical before marking FND-05 complete.
- Playwright report and test result directories are ignored by Git.
- The current `vp check` warnings are unrelated to the basic E2E setup and should not be expanded into unrelated refactoring during FND-05.

## Current Blockers

None.

## Known Risks

- Architecture rules are currently expressed mostly through conventions rather than enforced boundaries.
- API contracts and external data validation need further review.
- Authentication and authorization require a dedicated security review.
- Browser/E2E coverage is currently minimal.
- The application currently uses MSW and an in-memory database for integration testing; browser-level runtime behavior still needs verification against the intended runtime configuration.
- The current production build reports a large chunk warning and a browser-externalized `node:fs/promises` dependency that should be investigated separately from FND-05.
- The exact Dev Container Playwright dependency strategy should remain documented so future sessions do not reintroduce the missing-browser-library problem.

## Next Tasks

1. Finish `FND-05` — E2E Smoke Test
2. `ARC-01` — Application Boundary Review
3. `ARC-02` — Feature Module Consistency
4. `ARC-03` — API and Data Contract Review

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

- Date: `2026-09-28`
- Last verified commit: `b904dab137f093fd3b35b5978c272ede45f281cc`
- Updated by: AI-assisted development

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
