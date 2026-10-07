<p align="center">
  <a href="https://glyphfill.sush.dev">
    <img src=".github/assets/banner.png" alt="glyphfill: the word glyphfill, half heavy and half hairline thin, showing progress inside a word" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://glyphfill.sush.dev"><b>Website and playground</b></a> ·
  <a href="https://www.npmjs.com/package/glyphfill">npm</a> ·
  <a href="https://sush.dev">sush.dev</a>
</p>

# glyphfill

Show progress inside a word. As a task completes, letters get heavier or fill with ink. Components for React, Vue and Svelte, plus plain JavaScript. See [the package README](packages/glyphfill/README.md) for the API.

This repo is a pnpm + Turborepo monorepo:

| Path                 | What it is                                                                |
| -------------------- | ------------------------------------------------------------------------- |
| `packages/glyphfill` | The npm package: core, `glyphfill/react`, `glyphfill/vue`, `glyphfill/svelte` |
| `apps/web`           | Next.js site and playground, deployed to Vercel at glyphfill.sush.dev     |

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

CI runs all of these on every push and pull request (`.github/workflows/ci.yml`).

## Release to npm

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets).

1. Describe a change: `pnpm changeset`, pick patch / minor / major, commit the file.
2. Push to `main`. The Release workflow opens a "Version packages" pull request.
3. Merge it. The workflow publishes to npm with provenance.

The workflow needs a repository secret `NPM_TOKEN` (an npm automation or granular publish token). To publish by hand instead: `pnpm version-packages && pnpm release` after `npm login`.

## Deploy the site to Vercel

1. Import the repo in Vercel and set **Root Directory** to `apps/web`. `apps/web/vercel.json` installs from the repo root and builds with Turbo, so the package builds first.
2. Add the domain `glyphfill.sush.dev` under **Settings → Domains**, then add the CNAME record Vercel shows to the `sush.dev` DNS.
3. Add `NEXT_PUBLIC_GA_ID` (your `G-…` Measurement ID) under **Settings → Environment Variables** for Production. Google Analytics only loads where it's set.
4. If Vercel's pnpm version doesn't match the lockfile, also add `ENABLE_EXPERIMENTAL_COREPACK=1` so it uses the `packageManager` version.

The site serves `/llms.txt` and `/llms-full.txt` (the package README) for AI assistants, plus `robots.txt`, `sitemap.xml` and Open Graph images.

## License

MIT © [Sushil Buragute](https://sush.dev)
