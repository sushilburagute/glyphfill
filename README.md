# glyphfill

Show progress inside a word. As a task completes, letters get heavier or fill with ink.

This repo is a pnpm + Turborepo monorepo:

| Path                 | What it is                                                         |
| -------------------- | ------------------------------------------------------------------ |
| `packages/glyphfill` | The npm package (vanilla core + `glyphfill/react`). See its README. |
| `apps/web`           | Next.js docs and playground, deployed to Vercel                    |

## Develop

```sh
pnpm install
pnpm dev          # watches the package and runs the site at http://localhost:3000
```

| Command          | Does                                                     |
| ---------------- | -------------------------------------------------------- |
| `pnpm build`     | Builds the package, then the site                        |
| `pnpm test`      | Runs the package's unit tests (Vitest)                   |
| `pnpm typecheck` | Type-checks everything                                   |
| `pnpm lint`      | Lints and checks formatting (Biome). `pnpm format` fixes |
| `pnpm check`     | Checks the published package shape (publint, attw)       |

## Release to npm

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets).

```sh
pnpm changeset            # describe your change; pick patch / minor / major
pnpm version-packages     # applies pending changesets: bumps version, writes CHANGELOG
pnpm release              # builds and publishes to npm (needs `npm login`)
```

## Deploy the site to Vercel

1. Import the repo in Vercel and set **Root Directory** to `apps/web`.
2. Leave the commands alone. `apps/web/vercel.json` installs from the repo root and builds with `turbo run build --filter=web`, so the package builds first.
3. If Vercel's pnpm version doesn't match the lockfile, add the env var `ENABLE_EXPERIMENTAL_COREPACK=1` so it uses the `packageManager` version from `package.json`.
