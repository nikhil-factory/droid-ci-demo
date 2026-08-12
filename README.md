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

## Cloud Jenkins

A demo Jenkins runs on GCE (`factory-development-9da77`, `us-west2`), provisioned
by Terraform in [`deploy/jenkins/`](deploy/jenkins). It is configured entirely via
Configuration-as-Code (no setup wizard) with the NodeJS `node20` tool auto-installed.

Two pipeline jobs (plain git checkout, so no GitHub API rate limits), each
triggered by a GitHub push webhook:

- `droid-ci-demo` builds `*/main` (green)
- `droid-ci-demo-pr` builds `*/bug/discount-sign` (red — the planted bug)

Provision / tear down:

```bash
cd deploy/jenkins
export GOOGLE_OAUTH_ACCESS_TOKEN=$(gcloud auth print-access-token)
terraform apply     # creates static IP, firewall, VM (startup script installs Jenkins)
terraform output    # jenkins_url, webhook_url; admin password is a sensitive output
terraform destroy   # tears everything down
```

After apply, add a GitHub webhook (`push` + `pull_request`) pointing at the
`webhook_url` output (`http://<IP>:8080/github-webhook/`).

## Demo flow

1. Open a PR that introduces a bug (see below), or push to `bug/discount-sign`.
2. CI fails — GitHub Actions on the PR, and the Jenkins `droid-ci-demo-pr` job.
3. Hand Droid the failing build URL (GitHub Actions run, or Jenkins build).
4. Droid reads the logs, identifies the bug, and proposes/pushes a fix.

### Suggested planted bug

Change the discount math in `src/pricing.ts` so a test fails deterministically, e.g.:

```ts
// BUG: should be (1 - discountPercent / 100)
return round2(amount * (1 + discountPercent / 100));
```

This breaks `applyDiscount` and `orderTotal` tests with a clear, diagnosable error.
