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
| **Communities index** — "The Doorway" | `/communities` | Static | [`communities-index.tsx`](src/components/communities/communities-index.tsx) |
| **Community** detail — "The Watch Room" | `/communities/[handle]` | SSG (`wildfire-watch`) | [`community-page.tsx`](src/components/community/community-page.tsx) |
| **Fundraiser** detail | `/f/[id]` | SSG (`alerts`, `shelter`, `replant`) | [`fundraiser-page.tsx`](src/components/fundraiser/fundraiser-page.tsx) |
| **Profile** | `/u/[handle]` | SSG (`janahan`) | [`profile-page.tsx`](src/components/profile/profile-page.tsx) |

Navigation flow: **Communities list → community detail → fundraiser detail → profile**, matching GoFundMe. Header menu is `Home` + `Communities` (the list); a fundraiser links back up to its community; profile constellation/impact links travel into causes and communities. Each `page.tsx` is a thin wrapper rendering one top-level component (per CLAUDE.md).

## Architecture

- **App shell** — [`app-shell.tsx`](src/components/app/app-shell.tsx), [`header.tsx`](src/components/app/header.tsx), [`site-provider.tsx`](src/components/app/site-provider.tsx), [`analytics-provider.tsx`](src/components/app/analytics-provider.tsx) wrap every route.
- **Hierarchy accessors** — [`structure.ts`](src/lib/structure.ts) is the single sanctioned way to traverse relations: `getCommunity`/`communityByHandle`, `getCause`, `getProfile`, `listCommunities`/`listCauses`/`listProfiles`, `causesOf` (down), `communityOf` (up), `siblingCauses` (sideways). Routes and page components go through these — none index the raw record maps directly (only `site-provider` seeds state from them).
- **Ambient worlds** — [`worlds.ts`](src/lib/worlds.ts) manifest of optimized clips (WebM + MP4 + poster) from `public/worlds/`; [`world-video.tsx`](src/components/world/world-video.tsx) renders them.
- **Mock data layer** — [`data.ts`](src/lib/data.ts): `PEOPLE`, `FUNDRAISERS`, `COMMUNITIES`, `ACTIVITY`, `PROFILES` + typed interfaces. No backend; all reads from this module.
- **Shared primitives** — `src/components/shared/`: donate/lantern modals, `action-bar`, `activity-feed`, `progress-meter`, `milestone-trail`, `celebration`, `toast`, `scrolly-story`.
- **Profile signature view** — [`constellation.tsx`](src/components/profile/constellation.tsx) maps a person's causes/communities as a star map of impact.
- **Communities index "Doorway"** (design-handoff redesign, 2026-06-03) — the index is a living master-detail: [`doorway.tsx`](src/components/communities/doorway.tsx) holds `previewedIndex` state, a plain text intro (per product owner: no hero video, no live-label chip on the index — the ambient worlds live in the feature panel/tiles), a featured panel ([`doorway-feature.tsx`](src/components/communities/doorway-feature.tsx): playing world clip + sparks + stats + "Enter {name} →" + steward avatar cluster) and a list of [`doorway-tile.tsx`](src/components/communities/doorway-tile.tsx) tiles. Hover/focus previews; activating an already-previewed tile (or the Enter button) navigates via `goCommunity`. **Single-community case (current data) collapses gracefully**: full-width feature panel, list hidden (`.idx-grid.solo`) — the placeholder communities from the handoff were *not* added (product decision). Live labels guard on empty `pulse` (the watch community's pulse is intentionally blank). `communities-index.tsx` stays a thin wrapper computing live `raisedOf`/`progressOf` from `SiteProvider`.
- **Community "Watch Room"** (design-handoff redesign, 2026-06-03) — the community detail body is a master-detail: [`watch-room.tsx`](src/components/community/watch-room.tsx) holds the `selectedCauseId` client state, a 340px rail of [`front-row.tsx`](src/components/community/front-row.tsx) rows (poster thumbnails with live `WorldGrow` sparks + thin progress track), and [`front-detail.tsx`](src/components/community/front-detail.tsx) — a video-led panel (320px playing world clip, sparks, scrim) that swaps **in place** with no navigation. Built entirely from existing atoms: `WorldVideo` (new `still` poster-only prop), `WorldGrow`, `ProgressMeter` (new `size="lg"` + `daysLeft`), `MilestoneTrail` (new `layout="horizontal"`), `ActivityFeed` (filtered to the selected front + community), `Avatar`, `Btn`. CTAs reuse the existing donate/lantern/follow flows so all analytics events keep firing.

## Metrics & instrumentation

The brief asks for instrumentation around **Repeat Visits** and **Meaningful Actions (Donate, Share, Follow)**. Implemented as a vendor-neutral taxonomy in [`analytics.ts`](src/lib/analytics.ts):

| Event | Fires on | Brand language | Why |
| --- | --- | --- | --- |
| `page_view` | every route change (`AnalyticsProvider`) | — | Repeat visits / returning users, segmented by section |
| `donate` | confirmed donation | "plant a light" | Primary meaningful action; carries amount, cause, community, milestone crossed |
| `share_lantern` | lantern sent | "send a lantern" | Share/virality signal; carries target kind + id |
| `follow` | follow a cause or person | "keep watch" | Retention intent; target + on/off |
| `join_community` | join/leave a community | — | Community growth |

**Design:** events flow through a pluggable `sink` (`setAnalyticsSink`). Until a sink is installed, `track()` is a safe no-op and never throws. **PostHog is wired**: [`posthog.ts`](src/lib/posthog.ts) is the only file importing posthog-js — `initPostHog()` (client-only, idempotent) inits the SDK and installs `captureSink((event, props) => posthog.capture(...))`. `AnalyticsProvider` calls it on mount before the first `page_view`. Autocapture pageviews are disabled (`capture_pageview: false`) so our typed `page_view` is the single source; `capture_pageleave` stays on for dwell time. Config comes from `.env`: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`. No key → silent no-op.

## Decisions & tradeoffs

- **Mock data over a real backend.** 1-week scope rewards an engaging, integrated experience over infra. Domain types live in `data.ts` so a real API can slot in behind the same interfaces.
- **SSG for all detail pages** for fast first paint; content is static per the mock data.
- **Ambient world videos as the spine** — differentiates from the flat real product, drives repeat visits. Tradeoff: video weight — mitigated with WebM+poster, lazy `use-in-view` playback, `prefers-reduced-motion` fallbacks.
- **Analytics decoupled from vendor.** The taxonomy + sink is the testable core; [`posthog.ts`](src/lib/posthog.ts) is the only vendor adapter. Swapping vendors is a one-file change and events unit-test (via `captureSink`) without a network or the SDK.
- **No world-name labels.** The old `worldName` field ("The Signal", etc.) was removed from the data model entirely; surfaces show the real `title`. `world` (the ambient clip key) stays.
- **Explicit hierarchy helpers** (`structure.ts`) make the Community → Fundraiser → Profile structure legible and refactor-safe.
- **Lanterns as a lightweight meaning-action** — a free, emotional signal (vs. donating) that lowers the bar for participation.
- **Deterministic, rounded values in SSR'd inline styles** ([`seeded.ts`](src/lib/seeded.ts)) to avoid hydration mismatches from full-precision float CSS.
- **Watch Room master-detail over stacked cards** (per the chosen handoff direction A). Selecting a front updates the panel in place — keeps people inside the community context instead of bouncing between routes. The swap animation (`.wr-swap`, ~300ms rise) only *enters*; the resting state is fully visible so animation throttling can never hide content, and it's disabled under `prefers-reduced-motion`. Rail thumbnails are poster-only (`WorldVideo still`) for performance, but the sparks layer still renders so every thumbnail glimmers. Milestone "reached" lights from **live** `raised` (donations bloom the trail), not the static flag. The old sidebar (stewards / "Who we are") was removed with the stacked-card body; `steward-list.tsx` was deleted. The community hero kept its ambient entrance but is de-chipped (`.live-label` dot + mono text, no pill), fixed at 560px, full-width padding, with a bottom scrim for legibility. All Watch Room CSS uses theme tokens, so `dusk` keeps working.
- **`ProgressMeter` wording** changed from "keeping watch" to "supporters" (handoff spec + standing preference for GoFundMe-plain language); it ripples to the fundraiser hero too.

## Quality gates

`pnpm typecheck`, `pnpm lint`, `pnpm test` (61 tests, 18 files), and `pnpm build` all pass. Build prerenders `/`, `/communities`, `/communities/wildfire-watch`, `/f/{alerts,shelter,replant}`, `/u/janahan`.

## What's next

- [ ] Verify PostHog events land in the dashboard (live key in `.env`; do an end-to-end smoke check in the browser).
- [ ] Capture/document real page-load benchmarks (Lighthouse / Web Vitals) — brief asks for it.
- [ ] Deploy (Vercel easiest for Next 16; AWS "preferred" not required).
- [ ] Add a `SiteProvider`/`AnalyticsProvider` test asserting events fire through an injected sink.
- [ ] More than one community to light up the Doorway's master-detail list (layout + tests already support it; product owner declined placeholder communities for now); guard unknown profile handles.
