# GoFundMe — Living Summary

> Single source of truth for what exists and why. Update this in the **same** change as any feature, route, component, or decision. A stale entry here is a failing check (see [CLAUDE.md](CLAUDE.md)).

_Last updated: 2026-06-03_

## Concept

A reimagined GoFundMe where every cause is a **place** and every place has a **community keeping watch over it**. A three-tier universe — **Community → Fundraisers → People** — rendered against ambient looping "world" videos. The demo universe is the _Wildfire Watch_, a volunteer network protecting canyon towns. Theme: dawn + humanist type, tagline _"Help finds a way."_

## What's built

Route structure mirrors GoFundMe, with an explicit Community → Fundraiser → Profile hierarchy:

| Surface | Route | Render | Top component |
| --- | --- | --- | --- |
| **Home / discover** | `/` | Static | [`discover-page.tsx`](src/components/home/discover-page.tsx) |
| **Communities index** (list of all) | `/communities` | Static | [`communities-index.tsx`](src/components/communities/communities-index.tsx) |
| **Community** detail | `/communities/[handle]` | SSG (`wildfire-watch`) | [`community-page.tsx`](src/components/community/community-page.tsx) |
| **Fundraiser** detail | `/f/[id]` | SSG (`alerts`, `shelter`, `replant`) | [`fundraiser-page.tsx`](src/components/fundraiser/fundraiser-page.tsx) |
| **Profile** | `/u/[handle]` | SSG (`janahan`) | [`profile-page.tsx`](src/components/profile/profile-page.tsx) |

Navigation flow: **Communities list → community detail → fundraiser detail → profile**, matching GoFundMe. Header menu is `Home` + `Communities` (the list); a fundraiser links back up to its community; profile constellation/impact links travel into causes and communities. Each `page.tsx` is a thin wrapper rendering one top-level component (per CLAUDE.md).

## Architecture

- **App shell** — [`app-shell.tsx`](src/components/app/app-shell.tsx), [`header.tsx`](src/components/app/header.tsx), [`site-provider.tsx`](src/components/app/site-provider.tsx), [`analytics-provider.tsx`](src/components/app/analytics-provider.tsx) wrap every route.
- **Hierarchy accessors** — [`structure.ts`](src/lib/structure.ts) is the single sanctioned way to traverse relations: `getCommunity`/`communityByHandle`, `getCause`, `getProfile`, `listCommunities`/`listCauses`, `causesOf` (down), `communityOf` (up), `siblingCauses` (sideways). Routes/components never reach into raw record maps directly.
- **Ambient worlds** — [`worlds.ts`](src/lib/worlds.ts) manifest of optimized clips (WebM + MP4 + poster) from `public/worlds/`; [`world-video.tsx`](src/components/world/world-video.tsx) / [`world-card.tsx`](src/components/world/world-card.tsx) render them.
- **Mock data layer** — [`data.ts`](src/lib/data.ts): `PEOPLE`, `FUNDRAISERS`, `COMMUNITIES`, `ACTIVITY`, `PROFILES` + typed interfaces. No backend; all reads from this module.
- **Shared primitives** — `src/components/shared/`: donate/lantern modals, `action-bar`, `activity-feed`, `progress-meter`, `milestone-trail`, `celebration`, `toast`, `scrolly-story`.
- **Profile signature view** — [`constellation.tsx`](src/components/profile/constellation.tsx) maps a person's causes/communities as a star map of impact.

## Metrics & instrumentation

The brief asks for instrumentation around **Repeat Visits** and **Meaningful Actions (Donate, Share, Follow)**. Implemented as a vendor-neutral taxonomy in [`analytics.ts`](src/lib/analytics.ts):

| Event | Fires on | Brand language | Why |
| --- | --- | --- | --- |
| `page_view` | every route change (`AnalyticsProvider`) | — | Repeat visits / returning users, segmented by section |
| `donate` | confirmed donation | "plant a light" | Primary meaningful action; carries amount, cause, community, milestone crossed |
| `share_lantern` | lantern sent | "send a lantern" | Share/virality signal; carries target kind + id |
| `follow` | follow a cause or person | "keep watch" | Retention intent; target + on/off |
| `join_community` | join/leave a community | — | Community growth |

**Design:** events flow through a pluggable `sink` (`setAnalyticsSink`). Until a sink is installed, `track()` is a safe no-op and never throws. **PostHog is wired by the user**: install posthog-js and point the sink at it — `setAnalyticsSink((p) => posthog.capture(p.event, p.properties))` (documented in `analytics-provider.tsx`). `.env` expects `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Decisions & tradeoffs

- **Mock data over a real backend.** 1-week scope rewards an engaging, integrated experience over infra. Domain types live in `data.ts` so a real API can slot in behind the same interfaces.
- **SSG for all detail pages** for fast first paint; content is static per the mock data.
- **Ambient world videos as the spine** — differentiates from the flat real product, drives repeat visits. Tradeoff: video weight — mitigated with WebM+poster, lazy `use-in-view` playback, `prefers-reduced-motion` fallbacks.
- **Analytics decoupled from vendor.** The taxonomy + sink is the testable core; posthog-js is a thin adapter the user attaches. Swapping vendors is a one-file change and events unit-test without a network.
- **Explicit hierarchy helpers** (`structure.ts`) make the Community → Fundraiser → Profile structure legible and refactor-safe.
- **Lanterns as a lightweight meaning-action** — a free, emotional signal (vs. donating) that lowers the bar for participation.
- **Deterministic, rounded values in SSR'd inline styles** ([`seeded.ts`](src/lib/seeded.ts)) to avoid hydration mismatches from full-precision float CSS.

## Quality gates

`pnpm typecheck`, `pnpm lint`, `pnpm test` (40 tests, 13 files), and `pnpm build` all pass. Build prerenders `/`, `/communities`, `/communities/wildfire-watch`, `/f/{alerts,shelter,replant}`, `/u/janahan`.

## What's next

- [ ] Wire posthog-js into `setAnalyticsSink` and verify events land (user-owned).
- [ ] Capture/document real page-load benchmarks (Lighthouse / Web Vitals) — brief asks for it.
- [ ] Deploy (Vercel easiest for Next 16; AWS "preferred" not required).
- [ ] Add a `SiteProvider`/`AnalyticsProvider` test asserting events fire through an injected sink.
- [ ] More than one community to exercise the `/communities` index; guard unknown profile handles.
