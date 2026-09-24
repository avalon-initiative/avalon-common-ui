# avalon-common-ui

Shared Vue 3 component library for Avalon's first-party clients (the Hub web
app and the mobile/desktop Hub), developed and documented in Storybook.
Published as `@avalon-initiative/common-ui` to GitHub Packages.

The library holds presentation only: no network calls and no protocol logic.
Components take data in through props and report intent through events.

## Install

The package is published to GitHub Packages, which requires an auth token
with `read:packages` even for public packages. Map the scope in your
`.npmrc`:

```ini
@avalon-initiative:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @avalon-initiative/common-ui
```

`vue` (^3.5) is a peer dependency.

## Use

Import the stylesheets once at your app's entry point, then import components:

```ts
import '@avalon-initiative/common-ui/tokens.css'   // design tokens (CSS custom properties)
import '@avalon-initiative/common-ui/global.css'   // base page styles
import '@avalon-initiative/common-ui/style.css'    // component styles

import { AvalonButton } from '@avalon-initiative/common-ui'
```

Colors, spacing and radii come from the `--av-*` tokens in `tokens.css`;
components never hardcode a color.

## Develop

```bash
make install         # npm ci
make storybook       # Storybook on http://localhost:6006
make check           # lint, type-check, component tests, build, smoke test
make build-storybook # static Storybook build
make help            # everything else
```

Conventions:

- `src/components/` holds only `.vue` files; `src/styles/` holds only
  `.module.scss` (CSS Modules, one per component, bound with `:class`);
  `src/stories/` holds `.stories.ts`; `src/types/` holds `*.types.ts`;
  `src/state/` holds extracted script logic that is not markup.
- No `<style>` blocks in `.vue` files (lint enforces it) and `<script setup>`
  stays glue-only.
- Icons are hand-drawn 24x24 stroke paths using `currentColor`; there is no
  icon-library dependency.
- Responsive behavior lives in each component's own stylesheet. Never fork a
  component into a mobile variant. Three layout pitfalls to check for on any
  row or column layout: a wrapping flex row whose text column is `flex: 1`
  (zero basis) never wraps its siblings and instead shrinks the text to an
  ellipsis, so give it a minimum basis (`flex: 1 1 8rem`); a column layout with
  `align-items: flex-start` sizes each child to its longest unbreakable word,
  so use `stretch`; and message bodies need `overflow-wrap: anywhere`
  (`break-word` does not reduce min-content width).
- Every component has a story and a render test in `tests/ui-components.test.ts`.

### Trying a change in an app before releasing

```bash
make pack                                   # produces avalon-initiative-common-ui-<version>.tgz
cd ../your-app && npm install ../avalon-common-ui/avalon-initiative-common-ui-<version>.tgz
```

Restore the app's dependency to the published version before merging.

## Release

Versions are `0.0.1`-style semver. From an up-to-date `main`:

```bash
make release VER=0.1.0 TITLE="Optional title"
git push origin main --tags
```

`make release` runs the pre-release checks first and changes nothing if they
fail, then bumps `package.json` and the lockfile, commits, and creates the
annotated tag `v<VER>` (or `v<VER>-<title-slug>`). Pushing the tag starts the
release workflow: it verifies the tag matches `package.json`, requires the
tagged commit to be on `main`, reruns the checks, publishes the package to
GitHub Packages, and creates a GitHub Release with the packed tarball.
Published versions are immutable; ship a fix as a new version.

## Component inventory

Every component below is `Avalon<Name>` in `src/components/`, with a
matching `.types.ts` in `src/types/`; three (`AvalonCalendarMonth`,
`AvalonDateTimeField`, `AvalonEditableField`) have enough non-trivial script
logic to also have their own file in `src/state/`.

**Primitives** — `AvalonButton`, `AvalonCard`, `AvalonModal`, `AvalonIcon`,
`AvalonAvatar`, `AvalonTextField`, `AvalonDateTimeField`, `AvalonForm`,
`AvalonEditableField`, `AvalonColorPicker`, `AvalonFilterBar`,
`AvalonWarningBanner`, `AvalonMetricTile`.

**Navigation** — `AvalonSidebarNav`, `AvalonBottomNav`.

**Identity and social** — `AvalonAuthCard`, `AvalonUserChip`,
`AvalonPresenceBadge`, `AvalonFriendRow`, `AvalonFriendRequestRow`,
`AvalonSuggestionRow`, `AvalonCapabilityConsentRow`.

**Guilds** — `AvalonGuildCard`, `AvalonGuildMemberRow`, `AvalonRoleBadge`,
`AvalonChannelList`, `AvalonChatMessage`, `AvalonChatComposer`.

**Events** — `AvalonEventCard`, `AvalonCalendarMonth`, `AvalonRsvpControl`,
`AvalonRsvpRosterPanel`.

**Achievements and integrators** — `AvalonAchievementCard`,
`AvalonIntegratorCard`, `AvalonConnectionCard`, `AvalonBadgeIcon` (filled
hexagonal tier badges: achievement, rare, epic, legendary, event, rank,
guild, special; separate from `AvalonIcon`'s single-color stroke model).

Each has a Storybook story under `src/stories/` — the fastest way to see a
component's states and props without wiring up the app around it.

## License

Apache-2.0. See `LICENSE`.
