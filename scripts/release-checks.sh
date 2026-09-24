#!/usr/bin/env bash
# Pre-release validation gate: lint, type-check, component tests, library
# build, built-package smoke test, and Storybook build.
#
# `make release` runs this before it changes anything, so a broken build fails
# locally instead of after a tag has been pushed. CI runs the same script.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "release-checks: lint"
npm run lint
echo "release-checks: type-check"
npm run typecheck
echo "release-checks: component tests"
npm test
echo "release-checks: library build"
npm run build
echo "release-checks: built-package smoke test"
node scripts/smoke-dist.mjs
echo "release-checks: Storybook build"
npm run build-storybook

echo "release-checks: all checks passed"
