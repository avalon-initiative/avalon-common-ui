SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help install build typecheck lint test smoke storybook build-storybook check pack clean \
	release-checks release release-skip-tests

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  make %-18s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm ci

build: ## Build the library (dist/: ES bundle, types, style.css, tokens.css, global.css)
	npm run build

typecheck: ## Type-check sources, tests and config
	npm run typecheck

lint: ## Lint
	npm run lint

test: ## Component tests
	npm test

smoke: build ## Build, then import the built package and render a component
	node scripts/smoke-dist.mjs

storybook: ## Storybook dev server on :6006
	npm run storybook

build-storybook: ## Static Storybook build
	npm run build-storybook

check: lint typecheck test smoke ## Everything a pull request must pass except the Storybook build

pack: build ## Produce the publishable tarball without publishing
	npm pack

clean: ## Remove build output
	rm -rf dist storybook-static *.tgz

release-checks: ## Run the pre-release gate (lint, type-check, tests, build, smoke, Storybook)
	bash scripts/release-checks.sh

.PHONY: release
## Run pre-release checks, then bump the version, commit, and create a release tag.
##
## Usage:
##   make release VER=0.1.0 TITLE="Some release title"
## - VER prompts if missing (shows current version). TITLE is optional.
## - Tag format:
##   - If TITLE is provided: v<VER>-<TITLE_SLUG>
##   - If TITLE is empty:    v<VER>
## - Runs scripts/release-checks.sh first; aborts with no changes made if it fails.
## - Bumps package.json and package-lock.json. Pushing the tag is what publishes.
release:
	@set -euo pipefail; \
	if [ "$(SKIP_CHECKS)" = "1" ]; then \
		echo "release: skipping pre-release checks (SKIP_CHECKS=1) -- only use this if you already ran and passed them"; \
	else \
		echo "release: running pre-release checks (scripts/release-checks.sh)"; \
		if ! bash scripts/release-checks.sh; then \
			echo "release: pre-release checks failed -- nothing was changed, fix and re-run 'make release'"; \
			exit 1; \
		fi; \
	fi; \
	ver="$(strip $(VER))"; \
	current_ver="$$(node -p 'require("./package.json").version')"; \
	if [ -z "$$ver" ]; then \
		read -r -p "Release version (current: $$current_ver): " ver; \
		if [ -z "$$ver" ]; then ver="$$current_ver"; fi; \
	fi; \
	if ! [[ "$$ver" =~ ^[0-9]+\.[0-9]+\.[0-9]+$$ ]]; then \
		echo "release: invalid VER '$$ver' (expected X.Y.Z)"; \
		exit 1; \
	fi; \
	title="$(strip $(TITLE))"; \
	if [ -z "$$title" ] && [ -t 0 ]; then \
		read -r -p "Release title (optional): " title; \
	fi; \
	title_slug="$$(printf '%s' "$$title" | sed -E 's/[[:space:]]+/-/g; s/[^A-Za-z0-9._-]//g; s/^-+//; s/-+$$//')"; \
	tag_name="v$$ver"; \
	if [ -n "$$title_slug" ]; then \
		tag_name="$$tag_name-$$title_slug"; \
	fi; \
	echo "release: tag='$$tag_name' version='$$ver'"; \
	if git rev-parse -q --verify "refs/tags/$$tag_name" >/dev/null; then \
		echo "release: git tag '$$tag_name' already exists"; \
		exit 1; \
	fi; \
	npm version --no-git-tag-version --allow-same-version "$$ver" >/dev/null; \
	git add -- package.json package-lock.json; \
	if git diff --cached --quiet -- package.json package-lock.json; then \
		echo "release: no version changes to commit (continuing with tag)"; \
	else \
		git commit -m "Release $$tag_name"; \
	fi; \
	git tag -a "$$tag_name" -m "$$tag_name"; \
	echo "release done: $$tag_name"; \
	echo "Next: git push origin main --tags   (the tag push publishes the package)"

.PHONY: release-skip-tests
## Same as 'release', but skips the pre-release checks.
## Only use this when you already ran the checks and don't want to wait on them again.
release-skip-tests: SKIP_CHECKS=1
release-skip-tests: release
