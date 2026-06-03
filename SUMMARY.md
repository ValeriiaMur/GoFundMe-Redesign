# GoFundMe — Living Summary

> Single source of truth for what exists and why. Update this in the **same** change as any feature, route, component, or decision. A stale entry here is a failing check (see [CLAUDE.md](CLAUDE.md)).

_Last updated: 2026-06-03_

## Concept

A reimagined GoFundMe where every cause is a **place** and every place has a **community keeping watch over it**. The demo universe is the *Wildfire Watch* — a volunteer network protecting canyon towns — tying a profile, fundraisers, and a community into one continuous, ambient experience (each cause is rendered against a looping "world" video).

Tagline: _"Reach out. Someone's already reaching back."_

## What's built

The three PRD surfaces, seamlessly cross-linked:

| Surface | Route | Top component |
| --- | --- | --- |
| **Community** (home) | `/` → renders `watch` | [`community-page.tsx`](src/components/community/community-page.tsx) |
| **Fundraiser** | `/cause/[id]` | [`fundraiser-page.tsx`](src/components/fundraiser/fundraiser-page.tsx) |
| **Profile** | `/u/[handle]` | [`profile-page.tsx`](src/components/profile/profile-page.tsx) |

Each `page.tsx` is a thin wrapper that renders one top-level component (per CLAUDE.md component rules).

## Architecture

- **App shell** — [`app-shell.tsx`](src/components/app/app-shell.tsx), [`header.tsx`](src/components/app/header.tsx), [`site-provider.tsx`](src/components/app/site-provider.tsx) wrap every route.
- **Ambient worlds** — [`worlds.ts`](src/lib/worlds.ts) is a manifest of optimized looping clips (WebM + MP4 + poster) served from `public/worlds/`. [`world-video.tsx`](src/components/world/world-video.tsx) / [`world-card.tsx`](src/components/world/world-card.tsx) render them; each cause/community references a `WorldKey`.
- **Mock data layer** — [`data.ts`](src/lib/data.ts) holds the entire mock universe: `PEOPLE`, `FUNDRAISERS`, `COMMUNITIES`, `ACTIVITY`, `PROFILES`, and typed interfaces. No backend yet — all reads are from this module.
- **Shared interaction primitives** — `src/components/shared/`: donate/lantern modals, `action-bar`, `activity-feed`, `progress-meter`, `milestone-trail`, `celebration`, `toast`, `scrolly-story`. These power the "Meaning Actions" (Donate, Share, Follow, plus the signature **Lantern**).
- **Profile signature view** — [`constellation.tsx`](src/components/profile/constellation.tsx) maps a person's causes/communities as a star map of impact.
- **Hooks** — [`use-in-view`](src/hooks/use-in-view.ts), [`use-prefers-reduced-motion`](src/hooks/use-prefers-reduced-motion.ts) (motion is reduced-motion aware).
- **Helpers** — [`progress.ts`](src/lib/progress.ts) (goal math), [`seeded.ts`](src/lib/seeded.ts) (deterministic pseudo-random for stable demo visuals), [`utils.ts`](src/lib/utils.ts) (`cn`).

## Decisions & tradeoffs

- **Mock data over a real backend.** 1-week scope; the brief rewards an engaging, integrated experience over infra. All domain types live in `data.ts` so a real API can slot in behind the same interfaces later.
- **Ambient world videos as the spine.** Differentiates from the flat real product and makes each cause feel like a destination worth returning to (the "repeat visits" metric). Tradeoff: video weight — mitigated with WebM+poster, lazy `use-in-view` playback, and `prefers-reduced-motion` fallbacks.
- **Lanterns as a lightweight meaning-action.** A free, emotional signal (vs. donating money) to lower the bar for participation and drive the "meaningful actions" metric.
- **RSC by default, client islands only where needed** (modals, video, in-view) — keeps initial payload small for the "fast page load" requirement.

## Metrics & instrumentation

> ⚠️ **Not yet implemented** — planned. The PRD asks us to explain what we capture and why.

Planned event taxonomy, mapped to the impact metrics (Repeat Visits, Meaning Actions):

- `cause_view`, `community_view`, `profile_view` — reach & cross-surface navigation.
- `donate_*` (open / complete / amount) — primary meaning action; funnel.
- `lantern_lit` — low-friction meaning action; engagement breadth.
- `follow`, `share` — repeat-visit and virality drivers.
- `world_play` / scroll depth on `scrolly-story` — does the ambient narrative hold attention?

## What's next

- [ ] Wire a real analytics layer (event emitter + provider) behind the actions above.
- [ ] Confirm test coverage on each page's top-level component (currently covered: `ui/button`, `world/*`, `shared/activity-feed`, hooks, `lib/*`).
- [ ] Profile data exists only for `janahan`; add more or guard unknown handles.
- [ ] Lighthouse/perf pass against the "fast load" benchmark.
