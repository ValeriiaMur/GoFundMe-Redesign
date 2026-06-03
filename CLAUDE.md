# GoFundMe — Agent Rules

Next.js (App Router) + TypeScript app. These rules are binding for any agent working in this repo.

## Stack

- **Next.js 16** (App Router, `src/` dir, RSC by default)
- **TypeScript** (strict)
- **Tailwind CSS v4** for all styling (no CSS-in-JS, no styled-components)
- **shadcn/ui** (new-york, neutral base) on top of Tailwind — primitives live in `src/components/ui`
- **Vitest + React Testing Library** for tests
- **pnpm** as the package manager

## Workflow: TDD (red → green → refactor)

Every behavioral change is driven by a test. No production code is written without a failing test first.

1. **Red** — write the smallest test that expresses the desired behavior. Run `pnpm test` and watch it fail for the right reason.
2. **Green** — write the minimum code to make the test pass. Nothing more.
3. **Refactor** — clean up with the test as a safety net. Keep it green.

Co-locate tests next to the unit they cover: `button.tsx` → `button.test.tsx`. Use `pnpm test:watch` while iterating.

## Components

- **One component per file.** A file exports a single primary component (plus its own types/variants). No grab-bag files.
- **Short and modular.** If a component grows past ~80 lines or mixes concerns, split it. Extract child components, hooks (`src/hooks`), and pure helpers (`src/lib`).
- **One component per page.** Each route under `src/app/**/page.tsx` should be a thin composition that renders a single top-level component from `src/components`. Keep `page.tsx` files free of layout/logic — they wire data to a component.
- Prefer **Server Components**; add `"use client"` only when a component needs state, effects, or browser APIs. Keep client components as small leaves.
- Reusable primitives → `src/components/ui`. Feature components → `src/components/<feature>`.

## Conventions

- Compose class names with `cn()` from `@/lib/utils`.
- Import via the `@/*` alias, not long relative paths.
- Use `next/image` and `next/link`; don't hand-roll `<img>`/`<a>` for internal assets/routes.
- Type everything; no `any`. Run `pnpm typecheck` before considering work done.

## Commands

```bash
pnpm dev          # local dev server
pnpm test         # run tests once (CI mode)
pnpm test:watch   # TDD watch mode
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm build        # production build
```

## Definition of done

A change is done only when: a test covers it, `pnpm test` is green, `pnpm typecheck` and `pnpm lint` pass, and the component rules above hold.

## Adding shadcn components

`pnpm dlx shadcn@latest add <component>` — config is in `components.json`. Generated files land in `src/components/ui`.
