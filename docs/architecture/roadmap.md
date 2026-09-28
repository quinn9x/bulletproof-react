# Project Roadmap

> Persistent development roadmap for AI-assisted development.
> The repository and verified project state are the source of truth.

## Roadmap Principles

- Improve the project incrementally.
- Prefer small, verifiable changes over large rewrites.
- Preserve existing application behavior unless a change is intentional and documented.
- Do not start a new task while the current task is still `IN_PROGRESS`.
- Every completed task must be verified against the actual repository.
- Keep architecture decisions separate from temporary tooling or formatting changes.
- Avoid unnecessary dependency changes.
- When a session is interrupted, use `progress.md` as the primary checkpoint.
- Never assume work was completed merely because a previous session claimed it was done.

## Phase 0 — Baseline

### BASE-01 — Establish Project Checkpoint

**Status:** `DONE`

**Goal:** Establish persistent project state so development can continue across AI sessions.

#### Scope

- `docs/architecture/progress.md`
- `docs/architecture/roadmap.md`
- `docs/architecture/decisions.md`

#### Current State

- Persistent architecture state files have been created.
- Repository structure has been inspected.
- Baseline tooling has been verified.
- `vp check` passes with 0 errors.
- `vp test` passes successfully.
- TypeScript verification passes.
- Production build succeeds.
- CI workflow exists under `.github/workflows/ci.yml`.
- Current lint baseline contains 6 warnings and 0 errors.
- Project progress, roadmap, and architecture decisions are maintained as persistent checkpoints.

#### Definition of Done

- [x] `progress.md`, `roadmap.md`, and `decisions.md` describe the same project state.
- [x] Current task and next task are explicitly identified.
- [x] Repository verification results are recorded.
- [x] No stale completion claims remain.
- [x] Checkpoint changes are committed.

## Phase 1 — Foundation

### FND-01 — CI Quality Gates

**Status:** `DONE`

**Goal:** Establish automated verification for pull requests and future changes.

#### Scope

- Add CI workflow(s).
- Install dependencies using the repository's package-manager configuration.
- Run formatting verification.
- Run linting.
- Run TypeScript verification.
- Run tests.
- Run production build.
- Keep CI commands aligned with the actual Vite+ tooling.

#### Current State

- CI workflow is defined in `.github/workflows/ci.yml`.
- CI uses pnpm `12.5.1`.
- CI installs dependencies with `pnpm install --frozen-lockfile`.
- CI runs `pnpm exec vp check`.
- CI runs `pnpm exec vp test`.
- CI runs `pnpm exec vp build`.

#### Definition of Done

- [x] CI runs automatically for relevant changes.
- [x] CI fails when formatting, linting, typechecking, tests, or build fail.
- [x] CI uses reproducible dependency installation.
- [x] CI configuration is documented.

### FND-02 — TypeScript / Type Safety Baseline

**Status:** `DONE`

**Goal:** Establish and document the project's type-safety baseline.

#### Scope

- Review `tsconfig` configuration.
- Review strictness settings.
- Identify unnecessary `any` or unsafe casts.
- Review API and form types.
- Review environment variable typing.
- Review boundaries between application code and external data.

#### Current State

- TypeScript `strict` mode is enabled for application code.
- TypeScript `strict` mode is enabled for Node/Vite configuration.
- `tsc -b` passes with no errors.
- Existing explicit `any` usage was reviewed.
- No broad `any` refactor was introduced because strict typechecking does not currently require it.
- `vp check` passes with 0 errors.
- `vp test` passes with 19 tests.
- Production build succeeds.

#### Definition of Done

- [x] TypeScript configuration is intentionally documented.
- [x] Strict typechecking is enabled for application and Node configuration.
- [x] Important unsafe boundaries were reviewed.
- [x] Critical unsafe types are removed or explicitly justified.
- [x] Typecheck is part of the standard verification process.
- [x] `vp check` passes with no errors.
- [x] Tests pass.
- [x] Production build succeeds.

### FND-03 — Formatting and Linting Consistency

**Status:** `DONE`

**Goal:** Establish consistent automated code quality rules without unnecessary churn.

#### Scope

- Review current Vite+ formatting configuration.
- Review current lint configuration.
- Resolve meaningful warnings.
- Distinguish genuine application issues from generated/UI-library code.
- Avoid broad refactoring solely for stylistic reasons.

#### Current Known Warnings

- `react/only-export-components` in:
  - `src/app/routes/app/discussions/discussion.tsx`
  - `src/app/routes/app/discussions/index.tsx`
  - `src/app/routes/app/users.tsx`
- `jsx-a11y/prefer-tag-over-role` in:
  - `src/components/ui/spinner.tsx`
  - `src/components/ui/field.tsx`
- `jsx-a11y/label-has-associated-control` in:
  - `src/components/ui/label.tsx`

#### Definition of Done

- All remaining warnings are either resolved or explicitly documented.
- No lint errors remain.
- Formatting is reproducible with Vite+.
- Formatting changes do not alter application behavior unintentionally.

### FND-04 — Test and Build Verification

**Status:** `DONE`

**Goal:** Establish a reliable automated test and build baseline.

#### Current State

- Vitest is available through Vite+.
- Test import convention is `import { describe, expect, it } from 'vite-plus/test';`.
- `src/utils/format.test.ts` exists.
- `formatDate` currently has two passing tests.
- Authentication schema unit tests exist.
- Authentication API integration tests exist.
- Discussions API integration tests exist.
- MSW-backed integration test setup exists.
- An in-memory test database seed exists.
- Discussion create, read, update, and delete behavior is covered.
- `@vitest/coverage-v8` is included in development dependencies.
- `pnpm-lock.yaml` has been updated.
- `vp test` passes: 4 test files, 19 tests.
- `vp check` passes with 0 errors and 6 warnings.
- Production build succeeds.
- The dev container initially had a broken locale configuration that caused `vp test` to panic.
- The issue was traced to `LANG=en_US.UTF-8` while only `C`, `C.utf8`, and `POSIX` locales were installed.
- The current dev container runs `vp test` successfully without an explicit `LANG` override.

#### Definition of Done

- [x] Test command runs reliably in the supported development environment.
- [x] Critical utility behavior has unit coverage.
- [x] Critical API behavior has integration coverage.
- [x] Production build remains verified.
- [x] Test environment requirements are documented.

### FND-05 — E2E Smoke Test

**Status:** `DONE`

**Goal:** Verify that the application can start and that a critical authentication flow works at browser level.

#### Current State

- Playwright is installed through `@playwright/test`.
- `e2e/smoke.spec.ts` exists.
- Playwright runs successfully through `pnpm exec playwright test`.
- The application login route is `/auth/login`, not `/login`.
- The login smoke test:
  - opens `/auth/login`;
  - finds the `Log in to your account` heading;
  - fills `Email Address` with `john@example.com`;
  - fills `Password` with `password`;
  - clicks `Log in`;
  - verifies that authentication redirects to `/app`;
  - navigates to `/app/discussions`;
  - verifies that the authenticated user can access the discussions route.
- The E2E runtime uses the application's existing MSW/mock authentication environment.
- Playwright-generated `playwright-report/` and `test-results/` directories are ignored by `.gitignore`.
- CI installs Chromium and its required system dependencies with `pnpm exec playwright install --with-deps chromium`.
- CI runs the Playwright E2E suite with `pnpm exec playwright test`.
- Testing documentation references the current E2E test location and execution command.

#### Current Verification

- [x] Browser test runner is configured.
- [x] Critical authentication happy path is automated.
- [x] Authenticated access to the discussions route is automated.
- [x] E2E test runs successfully in the current development container.
- [x] Unit and integration tests continue to pass.
- [x] `vp check` passes with 0 errors.
- [x] Production build succeeds.
- [x] Playwright browser installation is configured for CI.
- [x] CI includes a dedicated Playwright E2E step.
- [x] E2E setup and execution are documented.

#### Known E2E Details

- Application URL during local E2E execution: `http://127.0.0.1:5173`.
- Login route: `/auth/login`.
- Successful login destination: `/app`.
- Discussions route: `/app/discussions`.
- Test credentials currently used by the mock environment:
  - Email: `john@example.com`
  - Password: `password`

#### Definition of Done

- [x] Playwright is configured and runs successfully.
- [x] A critical authentication flow is covered at browser level.
- [x] Authenticated access to discussions is covered.
- [x] Unit and integration tests remain passing.
- [x] Formatting, linting, and typechecking remain passing with no errors.
- [x] Production build remains passing.
- [x] CI installs the required Playwright browser dependencies.
- [x] CI runs the E2E suite.
- [x] E2E setup and execution are documented.

## Phase 2 — Architecture

### ARC-01 — Application Boundary Review

**Status:** `TODO`

Review boundaries between:

- `app`
- `components`
- `features`
- `lib`
- `config`
- `types`
- `utils`
- `testing`

Focus on dependency direction and prevent accidental cross-feature coupling.

### ARC-02 — Feature Module Consistency

**Status:** `TODO`

Review feature modules for consistent organization of:

- API functions.
- Components.
- Query options.
- Schemas.
- Types.
- Mutations.
- Authorization rules.

Do not introduce abstractions unless multiple features genuinely require them.

### ARC-03 — Routing and Data Loading

**Status:** `TODO`

Review:

- React Router configuration.
- Route-level loaders.
- React Query integration.
- Query invalidation.
- Error boundaries.
- Loading states.
- Protected routes.

Pay particular attention to the relationship between `clientLoader` and React Fast Refresh warnings.

### ARC-04 — API and External Data Boundaries

**Status:** `TODO`

Review:

- Axios configuration.
- API response typing.
- Runtime validation.
- Error normalization.
- Authentication handling.
- Mock API parity.

### ARC-05 — Authentication and Authorization Review

**Status:** `TODO`

Perform a dedicated security-oriented review of:

- Session handling.
- Authentication state.
- Protected routes.
- Role handling.
- Authorization checks.
- Token/cookie behavior.
- Logout behavior.
- Persistence behavior.

Do not assume client-side authorization is sufficient for a real backend.

## Phase 3 — Reliability

### REL-01 — Error Handling

**Status:** `TODO`

Review:

- Global error handling.
- Route errors.
- API errors.
- Mutation failures.
- Network failures.
- User-facing error messages.

### REL-02 — Loading and Empty States

**Status:** `TODO`

Review all important asynchronous flows for:

- Loading states.
- Empty states.
- Retry behavior.
- Disabled states.
- Race conditions.
- Stale data.

### REL-03 — Data Consistency

**Status:** `TODO`

Review React Query behavior for:

- Query keys.
- Cache invalidation.
- Optimistic updates.
- Mutation lifecycle.
- Stale data.
- Concurrent mutations.

## Phase 4 — Accessibility and UX

### UX-01 — Accessibility Baseline

**Status:** `TODO`

Review:

- Semantic HTML.
- Labels.
- Keyboard navigation.
- Focus management.
- Dialog behavior.
- Loading announcements.
- Form errors.
- Interactive element semantics.

Existing lint warnings should be evaluated as part of this task.

### UX-02 — Responsive and Interaction Review

**Status:** `TODO`

Review critical application flows across:

- Desktop.
- Tablet.
- Mobile.
- Keyboard-only interaction.
- Reduced-motion preferences.

## Phase 5 — Performance

### PERF-01 — Bundle Analysis

**Status:** `TODO`

Investigate the current production bundle.

Current observation:

- Production build reports chunks larger than 500 kB after minification.
- `bootstrap` is currently the largest reported chunk at approximately 816 kB.
- `index` is approximately 352 kB.
- Several application/vendor chunks are also relatively large.

Do not optimize based only on bundle-size warnings. First identify actual dependency and loading boundaries.

### PERF-02 — Code Splitting

**Status:** `TODO`

Evaluate route-level and feature-level lazy loading.

Prioritize changes that improve initial application loading without making the architecture unnecessarily complex.

### PERF-03 — Runtime Performance

**Status:** `TODO`

Review:

- Unnecessary renders.
- Query behavior.
- Large lists.
- Expensive computations.
- Markdown rendering.
- Form rendering.
- Client-side persistence.

## Phase 6 — Developer Experience

### DX-01 — Development Environment

**Status:** `TODO`

Review:

- Dev container.
- Locale configuration.
- Node/pnpm/Vite+ versions.
- Post-create setup.
- Editor extensions.
- Environment reproducibility.

### DX-02 — Repository Documentation

**Status:** `TODO`

Document:

- Local development.
- Testing.
- Build.
- Environment variables.
- Mock backend.
- Architecture.
- Contribution workflow.
- E2E smoke tests.

### DX-03 — Dependency Maintenance

**Status:** `TODO`

Review dependencies periodically.

Rules:

- Do not upgrade dependencies without a reason.
- Prefer coordinated upgrades.
- Verify formatting, linting, tests, typechecking, and build after upgrades.
- Record significant tooling changes in `decisions.md`.

## Phase 7 — Final Hardening

### HARD-01 — Security Review

**Status:** `TODO`

Review the complete application for:

- Authentication weaknesses.
- Authorization weaknesses.
- Unsafe HTML/Markdown handling.
- Dependency risks.
- Sensitive data exposure.
- Client-side trust assumptions.
- Environment configuration.

### HARD-02 — Production Readiness Review

**Status:** `TODO`

Verify:

- CI.
- Tests.
- Build.
- Error handling.
- Accessibility.
- Performance.
- Security.
- Documentation.
- Environment configuration.

### HARD-03 — Architecture Review

**Status:** `TODO`

Perform a final review against the original improvement goals.

Only mark the project ready when the repository, documentation, and automated verification agree with the actual implementation.

## Task Status Rules

Use only these statuses:

- `TODO` — not started.
- `IN_PROGRESS` — actively being worked on.
- `BLOCKED` — cannot continue because an external dependency or unresolved issue prevents progress.
- `DONE` — implementation and verification are complete.

Only one task should normally be `IN_PROGRESS` at a time.

## AI Session Rules

When resuming work:

1. Read `progress.md`.
2. Read this file.
3. Read `decisions.md`.
4. Inspect the repository.
5. Verify the current task against the actual code.
6. Continue from the first incomplete task.
7. Do not repeat completed work unless verification shows it is incomplete.
8. Update `progress.md` after meaningful changes.
9. Record significant architectural decisions in `decisions.md`.
10. Keep this roadmap synchronized with the actual project state.

## Roadmap Maintenance

This roadmap is a living document.

When project priorities change:

- Update task status.
- Add the reason for significant changes to `decisions.md`.
- Keep completed work recorded.
- Do not silently delete historical context.
- Keep the next actionable task explicit.

The repository is the source of truth when this roadmap becomes stale.

## Last Updated

- Date: `2026-09-28`
- Last verified state:
  - `vp check`: 0 errors, 6 warnings.
  - `vp test`: 4 Vitest files, 19 tests, plus 1 passing Playwright smoke test.
  - `vp build`: succeeds.
- Current task: `FND-05`
- Status: `IN_PROGRESS`
