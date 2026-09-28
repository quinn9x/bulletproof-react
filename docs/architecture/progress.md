# Project Progress

> Persistent checkpoint for AI-assisted development.
> This file must reflect the actual state of the repository.

## Project

- Repository: `quinn9x/bulletproof-react`
- Baseline commit: `fd8e1788e83d1e55cb410a1b3cbc30aa9e760e4d`
- Current phase: Phase 1 — Quality Foundation
- Current task: `REL-01`
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
- The Dev Container was based on `ghcr.io/voidzero-dev/vite-plus:1.0.0`.
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

## ARC-01 — Application Boundary Review

### Current State

- [x] Reviewed dependencies from `src/features/*/api`.
- [x] Confirmed feature API modules do not import from `src/app` or `src/components`.
- [x] Reviewed dependencies from `src/lib`, `src/config`, `src/types`, and `src/components`.
- [x] Confirmed shared/application-independent layers do not import from `src/app` or `src/features`.
- [x] Confirmed application routes compose feature APIs and feature components.
- [x] No dependency direction violations were found in the reviewed boundaries.
- [x] No code refactor was required.

### Review Result

The current dependency direction is consistent with the intended application architecture:

- `src/app` composes application routes and features.
- `src/features` owns feature-specific API and component code.
- `src/components` provides shared UI/common components.
- `src/lib`, `src/config`, and `src/types` remain independent of application routes and feature modules.
- No reverse dependency from shared/core layers into `src/app` or `src/features` was detected.

ARC-01 is complete based on repository inspection.

### Verification

The following dependency checks were performed:

```bash
grep -RInE "from ['\"](@/)?app/|from ['\"]\.\.?/.*/app/" \
  src/features \
  2>/dev/null

grep -RInE "from ['\"](@/)?components/|from ['\"]\.\.?/.*/components/" \
  src/features \
  2>/dev/null

grep -RInE "from ['\"](@/)?(app|features)/|from ['\"]\.\.?/.*/(app|features)/" \
  src/lib src/config src/types src/components \
  2>/dev/null
```

## ARC-02 — Feature Module Consistency

### Current State

- [x] Reviewed organization of all feature modules under `src/features`.
- [x] Reviewed feature API, component, hook, and type organization.
- [x] Confirmed feature APIs own endpoint-specific query and mutation definitions.
- [x] Confirmed feature components consume feature APIs rather than duplicating HTTP access.
- [x] Reviewed cross-feature imports.
- [x] Reviewed authorization usage across feature components.
- [x] Confirmed no broad shared feature abstraction is required by multiple features.
- [x] No feature-module architectural refactor was required.

### Review Result

The feature modules currently follow a consistent organization:

- Feature-specific API operations remain under each feature's `api` directory.
- Feature UI remains under feature `components` directories.
- Feature-specific schemas are colocated with the operations/forms that own them.
- Shared HTTP behavior remains in `src/lib/api-client.ts`.
- Shared authorization behavior remains in `src/lib`.
- Cross-feature dependencies were reviewed and no architectural coupling requiring refactoring was identified.

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

## ARC-03 — Routing and Data Loading

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

## ARC-04 — API and External Data Boundaries

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

The current API and external data boundary is consistent with the intended architecture.

- `src/lib/api-client.ts` owns the shared Axios instance and HTTP methods.
- Feature API modules own endpoint-specific operations and consume the shared API client.
- Request/input validation is colocated with the feature API or form that owns the operation.
- API response types are supplied at the call site through TypeScript generics.
- Authentication-related HTTP behavior remains centralized in the API client.
- Integration tests cover important authentication and API failure cases.

A type-safety observation remains: the API client generic describes the expected response shape at compile time but does not perform runtime response validation. This does not currently require architectural refactoring for ARC-04.

ARC-04 is complete based on repository inspection.

### Verification

The API boundary was reviewed through:

- `src/lib/api-client.ts`
- Feature API modules under `src/features/*/api`
- `src/types/api.ts`
- Authentication integration tests
- Discussion API integration tests
- Zod schemas and environment validation

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

### Verification

The authentication and authorization review covered:

- `src/lib/auth.tsx`
- `src/lib/protected-route.tsx`
- `src/lib/authorization.tsx`
- `src/lib/use-authorization.ts`
- `src/lib/roles.ts`
- `src/lib/api-client.ts`
- `src/app/provider.tsx`
- Authentication integration tests
- Discussion authorization integration tests
- Mock authentication and cookie handling

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

- `ghcr.io/voidzero-dev/vite-plus:1.0.0`

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
- Backend enforcement of authentication, authorization, resource ownership, and session invalidation must be verified separately from the client architecture review.
- Production cookie security attributes (`HttpOnly`, `Secure`, `SameSite`, expiration) cannot be verified from the frontend repository alone.

## Next Tasks

1. `REL-01` — Error Handling
2. `REL-02` — Loading and Empty States
3. `REL-03` — Data Consistency

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
- Last verified commit: `c9e8b2dbbf1c0dbad44e3b14fe4ca67e8551c894`
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
