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

**Status:** `DONE`

**Goal:** Verify that application, feature, shared component, and core utility layers maintain a consistent dependency direction.

#### Result

- Reviewed imports from feature API modules.
- Feature API modules do not import from `src/app` or `src/components`.
- Reviewed shared/core layers under `src/lib`, `src/config`, `src/types`, and `src/components`.
- Shared/core layers do not import from `src/app` or `src/features`.
- Application routes compose feature APIs and feature components.
- No reverse dependency violating the current architectural boundary was found.
- No refactor was required for this task.

#### Verification

Dependency searches were performed against:

- `src/features/*/api`
- `src/lib`
- `src/config`
- `src/types`
- `src/components`

The reviewed dependency direction is:

```text
src/app
    ↓
src/features
    ↓
shared/core layers

src/components
src/lib
src/config
src/types
    ↗
used by application/features without depending back on them
```

## ARC-02 — Feature Module Consistency

**Status:** `DONE`

### Current State

- [x] Reviewed all current feature modules under `src/features`.
- [x] Confirmed consistent separation between `api/` and `components/`.
- [x] Reviewed API functions, query options, mutations, schemas, and feature-local types.
- [x] Confirmed React Query patterns are consistent across applicable features.
- [x] Confirmed schemas are colocated with the mutations/forms that use them.
- [x] Confirmed authorization rules remain centralized in `src/lib/authorization.tsx`, `src/lib/use-authorization.ts`, and `src/lib/roles.ts`.
- [x] Confirmed no unnecessary shared abstractions are required.
- [x] Confirmed no feature-to-feature dependency was found in the reviewed imports.
- [x] Confirmed authentication remains a deliberate application-wide concern through `src/lib/auth.tsx`.
- [x] No code refactor was required.

### Review Result

The feature modules currently follow a consistent organization:

- `api/` owns API functions, React Query options/hooks, mutations, and feature-specific validation schemas.
- `components/` owns feature UI and consumes the feature API layer.
- Shared authorization remains outside individual features.
- Shared infrastructure remains in `src/lib`, `src/components`, `src/config`, and `src/types`.
- No new abstraction is justified by the current level of duplication.

A minor consistency observation remains: `src/features/discussions/components/discussions-list.tsx` uses a relative import for a feature-local API module while most other feature components use alias imports. This does not create a dependency-direction violation and does not require architectural refactoring.

ARC-02 is complete based on repository inspection.

### Verification

The following checks were performed:

```bash
for feature in src/features/*; do
  echo "=== $(basename "$feature") ==="
  find "$feature" -maxdepth 2 -type f | sort
done

grep -RInE \
  "QueryOptions|InputSchema|Schema|MutationConfig|QueryConfig|useMutation|useQuery|useInfiniteQuery|Authorization|ROLES" \
  src/features \
  2>/dev/null

grep -RInE "from ['\"](@/)?features/|from ['\"]\.\.?/.*/features/" \
  src/features \
  2>/dev/null

grep -RInE "Authorization|allowedRoles|ROLES|useAuthorization" \
  src/app src/features src/components src/lib \
  2>/dev/null
```

### ARC-03 — Routing and Data Loading

**Status:** `DONE`

### Current State

- [x] Reviewed React Router configuration and route composition.
- [x] Confirmed application routes use `createBrowserRouter` with lazy-loaded route modules.
- [x] Confirmed route `clientLoader` functions receive the shared `QueryClient`.
- [x] Confirmed route loaders use feature-owned React Query options for data loading.
- [x] Confirmed discussion routes preload discussion and comments data through the query client.
- [x] Confirmed discussion list prefetches comments data before navigation.
- [x] Confirmed mutations invalidate or refetch affected queries.
- [x] Confirmed protected application routes are wrapped by `ProtectedRoute`.
- [x] Confirmed role-based authorization remains enforced at the route/component boundary.
- [x] Confirmed application-level and route-level error boundaries are present.
- [x] Confirmed loading states are provided at provider, route, and feature levels.
- [x] No routing or data-loading refactor was required.

### Review Result

The current routing and data-loading implementation is consistent with the intended architecture:

- `src/app/router.tsx` owns application route composition and lazy route loading.
- Route modules expose `clientLoader` functions for route-level data requirements.
- React Query remains the data-loading and caching mechanism shared by route loaders and feature components.
- Feature API modules own query definitions while application routes compose those queries.
- Protected routes are enforced at the application route boundary.
- Error and loading states are handled at multiple appropriate boundaries.
- Query invalidation and prefetching are handled through the shared React Query client.

The router adapter currently uses an `any` type for the dynamically imported route module. This is a type-safety observation rather than a routing/data-loading architectural violation and does not require refactoring for ARC-03.

ARC-03 is complete based on repository inspection.

### Verification

The following checks were performed:

```bash
find src/app/routes -type f \( -name '*.ts' -o -name '*.tsx' \) -print | sort

grep -RInE \
  "createBrowserRouter|createRouter|RouterProvider|RouteObject|loader|clientLoader|action|HydrateFallback|defer|QueryClient|queryOptions|useQuery|useInfiniteQuery|queryClient|invalidateQueries|prefetchQuery" \
  src/app src/lib src/features \
  2>/dev/null

grep -RInE \
  "ProtectedRoute|RequireAuth|useUser|Navigate|redirect|AuthLoader" \
  src/app src/lib \
  2>/dev/null

grep -RInE \
  "ErrorBoundary|errorElement|Suspense|fallback|Loading|Spinner|isLoading|isPending|isFetching" \
  src/app src/components src/features \
  2>/dev/null
```

### Fast Refresh Observation

The relationship between route-level `clientLoader` exports and React Fast Refresh was reviewed.

The route modules intentionally export `clientLoader` alongside the default route component because the router adapter consumes this convention through `convert(queryClient)`. No architectural change was required as part of ARC-03.

### ARC-04 — API and External Data Boundaries

**Status:** `DONE`

### Current State

- [x] Reviewed the centralized Axios configuration in `src/lib/api-client.ts`.
- [x] Confirmed feature API modules use `apiClient` rather than calling Axios directly.
- [x] Confirmed API response types are declared at the API boundary through typed `apiClient` calls.
- [x] Reviewed runtime validation with Zod for request/input schemas and environment configuration.
- [x] Reviewed API error handling and confirmed Axios errors propagate through the existing React Query/API layers.
- [x] Confirmed `401` responses are handled centrally by the API client and redirect to the login route.
- [x] Confirmed cookie-based authentication is configured centrally through `withCredentials`.
- [x] Reviewed integration coverage for authentication and discussion API error cases.
- [x] No API boundary refactor was required.

### Review Result

The current API and external data boundary is consistent with the intended architecture:

- `src/lib/api-client.ts` owns the shared Axios instance and HTTP methods.
- Feature API modules own endpoint-specific operations and consume the shared API client.
- Request/input validation is colocated with the feature API or form that owns the operation.
- API response types are supplied at the call site through TypeScript generics.
- Authentication-related HTTP behavior remains centralized in the API client.
- Integration tests provide coverage for important authentication and API failure cases.

A type-safety observation remains: the API client generic describes the expected response shape at compile time but does not perform runtime response validation. This does not currently require architectural refactoring for ARC-04.

ARC-04 is complete based on repository inspection.

### Verification

The following checks were performed:

```bash
sed -n '1,220p' src/lib/api-client.ts

grep -RInE \\
  "axios|Axios|apiClient|ApiResponse|Response|zod|z\\\\.object|safeParse|parse|schema" \\
  src/lib src/features src/types src/config \\
  2>/dev/null

find src/features -type f \\
  \\( -path '*/api/*' -o -path '*/types.ts' \\) \\
  -print | sort

grep -RInE \\
  "AxiosError|isAxiosError|catch|throw new|Error\\\\(|response\\\\.data|status" \\
  src/lib src/features \\
  2>/dev/null

grep -RInE \\
  "Authorization|Bearer|cookie|credentials|401|403|logout|redirectToLogin" \\
  src/lib src/features \\
  2>/dev/null
```

## ARC-05 — Authentication and Authorization Review

### Current State

- [x] Reviewed authentication state management through `react-query-auth`.
- [x] Confirmed authentication state is initialized through `AuthLoader` and `/auth/me`.
- [x] Reviewed protected route handling through `ProtectedRoute`.
- [x] Confirmed unauthenticated users are redirected to the login route.
- [x] Reviewed role definitions and authorization checks.
- [x] Confirmed role-based UI authorization is centralized through `Authorization` and `useAuthorization`.
- [x] Reviewed resource-level authorization policy for comment deletion.
- [x] Confirmed authentication uses cookie-based credentials with Axios `withCredentials`.
- [x] Confirmed no application code stores authentication tokens in `localStorage` or `sessionStorage`.
- [x] Confirmed `401` responses are handled centrally by the API client.
- [x] Reviewed logout behavior through `/auth/logout`.
- [x] Reviewed authentication integration coverage for login, current-user lookup, invalid credentials, and logout.
- [x] No authentication or authorization refactor was required.

### Review Result

The current authentication and authorization implementation is consistent with the intended client-side architecture.

- Authentication state is managed centrally through `react-query-auth`.
- `AuthLoader` resolves the current authenticated user before rendering the application.
- `ProtectedRoute` prevents unauthenticated users from accessing protected application routes.
- Authentication credentials are handled through cookies rather than application-managed browser storage.
- Axios is configured with `withCredentials: true`, allowing the browser to send authentication cookies with API requests.
- Unauthorized API responses (`401`) are handled centrally by redirecting the user to the login route.
- Logout is implemented through the backend `/auth/logout` endpoint.
- Roles are explicitly typed as `ADMIN` and `USER`.
- Role-based UI access is centralized through `Authorization` and `useAuthorization`.
- Resource-level authorization for comment deletion checks both the user's role and resource ownership.

A security boundary observation remains: client-side route protection and authorization checks must not be treated as enforcement of backend authorization. The backend must independently validate authentication, roles, resource ownership, and permissions for protected operations.

Cookie security attributes such as `HttpOnly`, `Secure`, `SameSite`, expiration, and server-side session/token invalidation cannot be established from the frontend implementation alone. The repository's mock authentication implementation documents `Secure` and `HttpOnly` as requirements for a real API, but these attributes should be verified against the actual backend before production deployment.

ARC-05 is complete based on repository inspection.

## Phase 3 — Reliability

### REL-01 — Error Handling

**Status:** `DONE`

#### Current State

- Global mutation errors are handled through React Query `MutationCache`.
- Feature-level duplicate mutation error toasts were removed.
- Feature-level success toasts remain unchanged.
- API errors are normalized through `getApiErrorMessage`.
- Network failures receive a user-facing fallback message.
- The application route error boundary uses the shared error fallback.
- Error fallback supports error-boundary reset behavior.
- API error handling has dedicated tests.
- `vp test`, `vp check`, and `vp build` pass.

#### Definition of Done

- [x] Global error handling reviewed.
- [x] Route errors handled consistently.
- [x] API errors normalized.
- [x] Mutation failures handled globally.
- [x] Network failures provide a user-facing message.
- [x] Duplicate mutation error notifications removed.
- [x] Error handling behavior is tested.
- [x] Tests pass.
- [x] Typecheck/lint/format verification passes.
- [x] Production build succeeds.

### REL-02 — Loading and Empty States

**Status:** `DONE`

Reviewed important asynchronous flows for:

- Loading states.
- Empty states.
- Retry behavior.
- Disabled states.
- Race conditions.
- Stale data.

### Implementation

- [x] Discussions list has a loading state.
- [x] Discussions list has an error state with manual retry.
- [x] Discussions list preserves the existing empty state behavior through `SimpleTable`.
- [x] Users list has a loading state.
- [x] Users list has an error state with manual retry.
- [x] Users list preserves the existing empty state behavior through `SimpleTable`.
- [x] Comments list has a loading state.
- [x] Comments list has an error state with manual retry.
- [x] Comments list has an explicit empty state.
- [x] Comments pagination has a loading state and disables the load-more action while fetching.
- [x] Comment creation disables form actions while the mutation is pending.
- [x] Comment deletion disables dialog actions while the mutation is pending.
- [x] Discussion detail loading and error states were reviewed.
- [x] Global Suspense and authentication loading fallbacks were reviewed.
- [x] Global React Query query and mutation error handling was reviewed.
- [x] Error boundary fallback was reviewed.
- [x] Existing query configuration was reviewed.

### Verification

- [x] `vp test` passes: 5 test files, 25 tests.
- [x] `vp check` reports 0 errors.
- [x] Existing lint warnings are limited to shared accessibility components and remain non-blocking.
- [x] `git diff --check` passes.

### Follow-up

Data consistency concerns such as cache invalidation consistency, stale data, concurrent mutations, and mutation lifecycle behavior are deferred to `REL-03`.

### REL-03 — Data Consistency

**Status:** `DONE`

- [x] Reviewed React Query query-key structure.
- [x] Centralized discussion, comment, and user query keys where shared cache coordination is required.
- [x] Reviewed mutation cache invalidation.
- [x] Verified comment create/delete invalidation for discussion-specific infinite queries.
- [x] Verified discussion create/update/delete invalidation behavior.
- [x] Verified user deletion invalidation behavior.
- [x] Reviewed profile mutation lifecycle and authenticated-user refetch behavior.
- [x] Reviewed optimistic update usage; no optimistic cache updates are currently required.
- [x] Reviewed stale-data configuration.
- [x] Reviewed concurrent mutation behavior.
- [x] `vp check`: 0 errors, 3 existing accessibility warnings.
- [x] `vp test`: 5 Vitest files, 25 tests passed.
- [x] `git diff --check`: passes.

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
- Current task: `REL-02`
- Status: `IN_PROGRESS`
