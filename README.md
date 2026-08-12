# droid-ci-demo

A small Node.js/TypeScript service used to demo **Droid diagnosing and fixing CI failures** from a build link (GitHub Actions today, Jenkins for the customer scenario).

The app is a tiny order-pricing API:

- `src/pricing.ts` — pure functions: `subtotal`, `applyDiscount`, `taxFor`, `orderTotal`.
- `src/server.ts` — Express app: `GET /health`, `POST /orders/total`.
- `src/__tests__/` — Jest unit + API tests.

## Local development

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm run build       # tsc -> dist/
npm test            # jest (writes reports/junit.xml)
npm run dev         # run the server via ts-node
```

## CI

- **GitHub Actions** (`.github/workflows/ci.yml`): runs typecheck, build, and tests on every PR and on pushes to `main`.
- **Jenkins** (`Jenkinsfile`): same stages, publishes the JUnit report. Requires the NodeJS plugin with a tool installation named `node20`.

## Demo flow

1. Open a PR that introduces a bug (see below).
2. CI fails.
3. Hand Droid the failing build URL (GitHub Actions run, or Jenkins build).
4. Droid reads the logs, identifies the bug, and proposes/pushes a fix.

### Suggested planted bug

Change the discount math in `src/pricing.ts` so a test fails deterministically, e.g.:

```ts
// BUG: should be (1 - discountPercent / 100)
return round2(amount * (1 + discountPercent / 100));
```

This breaks `applyDiscount` and `orderTotal` tests with a clear, diagnosable error.
