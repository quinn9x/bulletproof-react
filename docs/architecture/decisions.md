# Architecture Decisions

> This document records architectural decisions that should remain stable across development sessions.
>
> Add a decision when changing it would affect architecture, dependencies, security, testing strategy, or development workflow.

## ADR-001 — Feature-Based Architecture

**Status:** Accepted

### Context

The application contains multiple business domains and needs to remain maintainable as the project grows.

### Decision

Business and domain code lives inside `src/features`.

Each feature owns its:

- API logic
- Components
- Hooks
- Schemas
- Domain types
- Feature-specific behavior

### Reason

Feature ownership makes domain boundaries explicit and keeps related code together.

### Consequences

Benefits:

- Easier feature-level refactoring
- Clearer ownership
- Better scalability

Trade-offs:

- Requires explicit boundaries between features
- Shared abstractions must be chosen carefully

## ADR-002 — Server State Uses React Query

**Status:** Accepted

### Context

The application communicates with APIs and needs caching, synchronization, loading states, mutation handling, and invalidation.

### Decision

Server state is managed by React Query.

Do not introduce another global state library for server state.

### Reason

Server state has different semantics from local UI state.

### Consequences

- Query keys must be standardized.
- Mutations must define invalidation or update behavior.
- API functions should remain independent from UI components.

## ADR-003 — State Ownership

**Status:** Accepted

### Decision

Use the following state ownership rules:

| State               | Owner                           |
| ------------------- | ------------------------------- |
| Server state        | React Query                     |
| URL state           | Router / search params          |
| Form state          | Form library / local form state |
| Local UI state      | React state                     |
| Global client state | Only when justified             |

### Reason

Avoid unnecessary global state and keep state close to its owner.

## ADR-004 — Authentication and Authorization Are Separate

**Status:** Accepted

### Decision

Authentication answers:

> Who is the user?

Authorization answers:

> What is the user allowed to do?

They must be treated as separate concerns.

### Security Rule

Frontend authorization controls user experience.

Backend authorization remains the final security boundary.

The frontend must never be considered sufficient protection for privileged operations.

## ADR-005 — API Boundary Validation

**Status:** Proposed

### Context

External API responses are runtime data even when TypeScript types exist.

### Decision

API boundaries should validate external data at runtime.

### Candidate

`Zod`

### Status

Not implemented.

### Next Step

Evaluate the current API layer during `API-02`.

## ADR-006 — Feature Public APIs

**Status:** Proposed

### Context

Direct imports into another feature's implementation create hidden coupling.

### Decision

Each feature should expose a small public API.

Consumers should prefer imports from the feature's public entry point rather than importing implementation details directly.

### Status

Not implemented.

### Related Tasks

- `ARC-01`
- `ARC-02`

## ADR-007 — Architecture Rules Must Be Enforceable

**Status:** Accepted

### Decision

Folder structure and documentation alone are not sufficient.

Important dependency rules should be enforced through tooling where possible.

Examples:

- Import boundary rules
- ESLint rules
- TypeScript configuration
- CI checks

### Reason

Conventions degrade as the team and codebase grow.

## ADR-008 — CI Is the Source of Merge Quality

**Status:** Accepted

### Decision

A pull request must pass the project's required automated checks before merging.

Expected checks:

- Typecheck
- Lint
- Formatting
- Tests
- Build
- Critical E2E checks where applicable

### Reason

Local correctness is not sufficient for team-level consistency.

## ADR-009 — Testing Follows Risk, Not Coverage Percentage

**Status:** Accepted

### Decision

Testing effort is prioritized by business and technical risk.

Preferred strategy:

- Unit tests for isolated logic
- Component tests for important UI behavior
- Integration tests for feature workflows
- Limited E2E tests for critical user journeys

### Rejected Approach

Do not optimize solely for an arbitrary global coverage percentage.

## ADR-010 — Measure Before Performance Optimization

**Status:** Accepted

### Decision

Performance changes should be based on measurements whenever practical.

Before optimizing:

1. Establish a baseline.
2. Identify the bottleneck.
3. Make the change.
4. Measure again.

### Reason

Premature optimization increases complexity without proving user benefit.

## ADR-011 — Repository Is the Source of Truth

**Status:** Accepted

### Decision

When project documentation, AI memory, and actual code disagree, the repository and git history must be inspected first.

The discrepancy must then be corrected in the project state files.

### Reason

AI sessions are temporary.

The repository is persistent.

## ADR-012 — AI Session Handoff

**Status:** Accepted

### Decision

AI-assisted development uses three persistent files:

- `progress.md` — Current project state
- `roadmap.md` — Long-term improvement plan
- `decisions.md` — Architectural decisions

Every completed task should update `progress.md`.

### Rules

- Only one task may be `IN_PROGRESS`.
- Completed tasks should not be repeated without verification.
- Architectural changes should be recorded in `decisions.md`.
- Long-term roadmap changes should be recorded in `roadmap.md`.
- The repository remains the source of truth.

### Goal

A new AI session should be able to resume development without depending on the previous conversation history.

### ADR-013 — Enable TypeScript Strict Mode

**Date:** `2026-09-28`

**Decision:** Enable TypeScript `strict` mode in both `tsconfig.app.json` and `tsconfig.node.json`.

**Reason:**

The project already passes TypeScript verification with the stricter typechecking rules enabled. This establishes a stronger type-safety baseline without requiring a broad refactor.

**Verification:**

- `pnpm exec tsc -b` passes.
- `pnpm exec vp check` reports 0 errors.
- `pnpm exec vp test` passes: 3 test files, 13 tests.
- `pnpm exec vp build` succeeds.
- Existing lint warnings remain tracked under `FND-03`.
