# Testing Architecture

## Purpose

This document defines the testing strategy for the repository.

The goal is to provide reliable coverage for important application behavior without creating unnecessary test maintenance or duplicating implementation details.

## Test Layers

### Unit Tests

Unit tests cover isolated, deterministic logic.

Use unit tests for:

- Pure utility functions
- Data transformations
- Validation logic
- Authentication helpers
- Small domain-level functions

Unit tests should be fast and should not require a browser or network connection.

### Integration Tests

Integration tests verify application code together with its API boundary.

The project uses MSW to intercept HTTP requests and provide deterministic API responses.

Use integration tests for:

- Authentication flows
- API client behavior
- Query and mutation behavior
- Important API error cases
- Interactions between application code and MSW handlers

Integration tests should exercise the same API boundary used by the application rather than mocking the API client itself.

### E2E Tests

End-to-end tests should verify critical user journeys in a real browser.

Initial E2E coverage should focus on a small number of high-value flows:

- User login
- User registration
- Access to an authenticated application route
- Core discussion workflow

E2E tests should be added after the unit and integration test baseline is stable.

## Current Test Infrastructure

The repository uses:

- Vite+ for test execution
- Vitest through `vp test`
- MSW for HTTP mocking
- Existing mock database infrastructure under `src/testing/mocks`
- Shared test setup under `src/testing/setup.ts`

Test files use the Vite+ test import convention:

```ts
import { describe, expect, it } from 'vite-plus/test';
```

## Current Tests

### Utility Tests

`src/utils/format.test.ts`

Covers date formatting behavior.

### Authentication Unit Tests

`src/lib/auth.test.ts`

Covers authentication-related logic independently from the HTTP layer.

### Authentication Integration Tests

`src/lib/auth.integration.test.ts`

Covers:

- Getting the current authenticated user
- Successful login
- Rejected login with invalid credentials
- Logout

These tests use the application's MSW handlers rather than replacing the API client with mocks.

## MSW Strategy

MSW is the preferred mechanism for testing HTTP boundaries.

The test server is initialized from:

`src/testing/mocks/server.ts`

The shared test lifecycle is configured in:

`src/testing/setup.ts`

Existing application mock handlers should be reused whenever they represent the behavior required by a test.

Tests should not duplicate handler logic unless the test requires a deliberately different server response.

## Test Isolation

Tests should be deterministic and independent.

Tests must not rely on:

- Execution order
- A previous test's authentication state
- Persistent local state
- A developer's local database
- External network services

Authentication state, cookies, and other mutable test state should be reset between tests where necessary.

## What Should Be Tested

Prioritize behavior that is:

1. Critical to authentication or authorization
2. Important to application data integrity
3. Shared by multiple features
4. Likely to regress
5. Difficult to verify manually

Avoid adding tests solely to increase test count or line coverage.

## What Should Not Be Tested Directly

Avoid tests that depend on implementation details such as:

- Internal component structure
- Private helper implementation
- Exact CSS classes
- React Query internals
- MSW implementation details
- Generated UI-library code

Prefer observable behavior over implementation details.

## Initial Test Matrix

| Area                           | Layer           | Priority | Status      |
| ------------------------------ | --------------- | -------- | ----------- |
| `formatDate`                   | Unit            | High     | Implemented |
| Authentication helpers         | Unit            | High     | Implemented |
| Get current user               | Integration     | High     | Implemented |
| Login                          | Integration     | High     | Implemented |
| Invalid login                  | Integration     | High     | Implemented |
| Logout                         | Integration     | High     | Implemented |
| Registration                   | Integration     | High     | Planned     |
| Protected route behavior       | Integration/E2E | High     | Planned     |
| Discussion CRUD                | Integration     | Medium   | Planned     |
| User management                | Integration     | Medium   | Planned     |
| Critical authenticated journey | E2E             | High     | Planned     |

## Verification Commands

The standard verification commands are:

```bash
vp test
vp check
vp build
```

`vp test` must pass before a testing task is considered complete.

`vp check` must have no errors. Existing warnings should be tracked separately and should not be silently treated as test failures.

`vp build` should complete successfully before a checkpoint is considered complete.

## Next Testing Work

The next testing work should focus on:

- Registration behavior
- Important query and mutation behavior
- Protected application routes
- Critical discussion workflows
- A minimal browser-level smoke test

The project should expand coverage incrementally rather than introducing a large E2E suite at once.
