# CLAUDE.md — @ojfbot/landing

Personal landing page and portfolio — **jim.software**. Vite + React + Three.js single-page site, deployed on Vercel. Pulls a live feed from [[daily-logger]] (the Signal section).

> **User-scope baseline applies.** Grill before non-trivial work, vertical slices, ubiquitous-language sourcing (`domain-knowledge/CONTEXT.md` / `GLOSSARY.md`) — documented in `~/.claude/CLAUDE.md`. Fleet skills are symlinked into `.claude/skills/` via `core/scripts/install-agents.sh`.

## Commands

```bash
pnpm install            # install dependencies
pnpm dev                # vite dev server
pnpm build              # tsc -b && vite build
pnpm preview            # vite preview (production build)
pnpm lint               # biome check .
pnpm lint:fix           # biome check --write .
pnpm capture-previews   # tsx scripts/capture-previews.ts (Playwright portfolio thumbnails)
```

**Use pnpm, never npm** (`pnpm-lock.yaml`). Lint/format is **Biome** (`biome.json`), not ESLint/Prettier.

## Structure

```
src/             # React app — section components (see below)
public/          # static assets
scripts/         # capture-previews.ts (Playwright)
index.html       # Vite entry
vite.config.ts   # Vite + @vitejs/plugin-react
vercel.json      # deploy config (.vercel/ is the linked project)
```

**Sections** (per `README.md`): CorridorCanvas (Three.js procedural corridor background) · Hero · BioCard · Portfolio · Signal (daily-logger feed) · Teaser · Footer.

## Conventions

- **Stack:** React 18 + `react-dom` + `three`; TypeScript; Vite build. No CSS framework — component-scoped styles.
- **Lint = Biome.** Run `pnpm lint` before committing. No CI workflows exist in this repo.
- **Three.js perf:** CorridorCanvas is the heaviest component — keep the procedural background GPU-cheap; profile before adding geometry.
- **Deploy:** Vercel-linked (`.vercel/`); `pnpm build` output is what ships. Don't commit build artifacts (`dist/`, `tsconfig.tsbuildinfo`).
