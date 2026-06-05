# GoFundMe — Living Summary

> Single source of truth for what exists and why. Update this in the **same** change as any feature, route, component, or decision. A stale entry here is a failing check (see [CLAUDE.md](CLAUDE.md)).

_Last updated: 2026-06-04_

## Concept

A reimagined GoFundMe where every cause is a **place** and every place has a **community keeping watch over it**. A three-tier universe — **Community → Fundraisers → People** — rendered against ambient looping "world" videos. The demo universe is the _Wildfire Watch_, a volunteer network protecting canyon towns. Theme: dawn + humanist type, tagline _"Help finds a way."_

## What's built

Route structure mirrors GoFundMe, with an explicit Community → Fundraiser → Profile hierarchy:

| Surface | Route | Render | Top component |
| --- | --- | --- | --- |
| **Home / discover** (doorway DNA) | `/` | Static | [`discover-page.tsx`](src/components/home/discover-page.tsx) |
| **Communities index** — "The Doorway" | `/communities` | Static | [`communities-index.tsx`](src/components/communities/communities-index.tsx) |
| **Community** detail — "The Watch Room" | `/communities/[handle]` | SSG (`wildfire-watch`) | [`community-page.tsx`](src/components/community/community-page.tsx) |
| **Fundraiser** detail | `/f/[id]` | SSG (`alerts`, `shelter`, `replant`) | [`fundraiser-page.tsx`](src/components/fundraiser/fundraiser-page.tsx) |
| **Profile** | `/u/[handle]` | SSG (`janahan`) | [`profile-page.tsx`](src/components/profile/profile-page.tsx) |

Navigation flow: **Communities list → community detail → fundraiser detail → profile**, matching GoFundMe. Header menu is `Home` + `Communities` + `Profile`; a fundraiser links back up to its community; profile constellation/impact links travel into causes and communities. Each `page.tsx` is a thin wrapper rendering one top-level component (per CLAUDE.md).

## Architecture

- **App shell** — [`app-shell.tsx`](src/components/app/app-shell.tsx), [`header.tsx`](src/components/app/header.tsx), [`site-provider.tsx`](src/components/app/site-provider.tsx), [`analytics-provider.tsx`](src/components/app/analytics-provider.tsx) wrap every route.
- **Header** (hero-redesign handoff, 2026-06-04) — reusable across all pages, frosted per spec (`--glass` dawn `oklch(0.95 0.006 60/0.72)` + `blur(14px) saturate(1.1)`): the official GoFundMe logo (`public/hero/gofundme-logo.png`, `next/image`, 38px with a white drop-shadow glow) dead-center in a 3-column grid; right side has **only the profile avatar** (Start button moved into the hero CTA, 2026-06-04). **No nav links** (removed by user request; the handoff also specifies none). The avatar is a deliberate divergence from the handoff (user asked for profile access). Emblem dock slot, wordmark and bell are gone with the IntroDock.
- **Lantern hero** (full "Hero Redesign" handoff implementation, 2026-06-04) — [`lantern-hero.tsx`](src/components/home/lantern-hero.tsx) renders the pinned (`--pin: 250vh`, 200vh < 860px) canvas scrub of the 8-frame lantern release (de-watermarked WebPs in `public/hero/lantern/`). Layers per spec: dawn backdrop, canvas (cover-fit with 0.62 horizontal focal), flame **flicker**, 14 drifting **sparks** ([`lantern-sparks.tsx`](src/components/home/lantern-sparks.tsx)) plus the card-style `WorldGrow` gold lanterns at `progress 0.8 / intensity 0.9` (~19 particles; 2026-06-04, user request: hero glimmers like the tiles, then "more sparks"; renders in both scrub and reduced-motion modes), left/bottom scrims, `.lhero-dissolve` into the page bg. **Three beats** ([`lantern-beats.tsx`](src/components/home/lantern-beats.tsx)) crossfade in a rAF loop via refs (no React re-renders): "Start fundraising on GoFundMe" + *Help finds a way.* + live stats + **"Start a GoFundMe"** (opens `NotBuiltModal`; beat 1, 2026-06-04) → "…and let it lift." (Light a lantern → donate flow) → "Follow the light." Slide dots, featured-community rail, "Scroll to release" cue, and a fixed dawn preloader ([`lantern-loader.tsx`](src/components/home/lantern-loader.tsx)). Choreography is pure math in [`lantern.ts`](src/lib/lantern.ts) (`frameBlendAt`, `heroOverlayAt`, `staticFrameSrc`), driven by [`use-lantern-scrub.ts`](src/hooks/use-lantern-scrub.ts). Reduced motion gets the static held-and-glowing pose (frame 2, progress 0.16 per spec). "Light a lantern" opens the real `DonateModal` for the community's lead cause; "Send this lantern ↑" opens the lantern modal — existing analytics keep firing.
- **Home body** (handoff sections, 2026-06-04) — below the hero: [`value-props.tsx`](src/components/home/value-props.tsx) (Raise → Share → Receive band with drawn-in hairlines + light sweeps), [`atlas.tsx`](src/components/home/atlas.tsx) — the 4-column bento (`watch watch alerts shelter / watch watch lanterns replant / live impact start start`) composed of one-component-per-file tiles: [`watch-tile.tsx`](src/components/home/watch-tile.tsx) (2×2, world poster + WorldGrow + white shadowed title + avatar stack + "Enter the watch →"), [`cause-tile.tsx`](src/components/home/cause-tile.tsx) ×3 (live progress fill + funded%/days left, navigates to `/f/[id]`), [`lantern-tile.tsx`](src/components/home/lantern-tile.tsx) (clay, tap → flying lantern + count), [`live-tile.tsx`](src/components/home/live-tile.tsx), [`impact-tile.tsx`](src/components/home/impact-tile.tsx) (centered $K), [`start-tile.tsx`](src/components/home/start-tile.tsx) (ink CTA; opens `NotBuiltModal`, 2026-06-04), then [`site-footer.tsx`](src/components/home/site-footer.tsx). The old DoorwayFeature/FrontRow home sections were replaced (those components still power `/communities` and the Watch Room). `Avatar` now renders a **single initial** (handoff fix: two letters read as cramped blobs). New tokens in `globals.css`: `--accent-h`, `--ink`, `--clay`, `--ember-deep`, `--hero-text/dim`, `--dawn-a/b`; `Btn` gained `kind="ink"`.
- **Hierarchy accessors** — [`structure.ts`](src/lib/structure.ts) is the single sanctioned way to traverse relations: `getCommunity`/`communityByHandle`, `getCause`, `getProfile`, `listCommunities`/`listCauses`/`listProfiles`, `causesOf` (down), `communityOf` (up), `siblingCauses` (sideways). Routes and page components go through these — none index the raw record maps directly (only `site-provider` seeds state from them).
- **Ambient worlds** — [`worlds.ts`](src/lib/worlds.ts) manifest of optimized clips (WebM + MP4 + poster) from `public/worlds/`; [`world-video.tsx`](src/components/world/world-video.tsx) renders them.
- **Mock data layer** — [`data.ts`](src/lib/data.ts): `PEOPLE`, `FUNDRAISERS`, `COMMUNITIES`, `ACTIVITY`, `PROFILES` + typed interfaces. No backend; all reads from this module.
- **Shared primitives** — `src/components/shared/`: donate/lantern modals, `action-bar`, `activity-feed`, `progress-meter`, `milestone-trail`, `celebration`, `toast`, `scrolly-story`.
- **Profile signature view** — [`constellation.tsx`](src/components/profile/constellation.tsx) maps a person's causes/communities as a star map of impact.
- **Home body keeps the doorway DNA** (2026-06-03) — body is full-width (`.home-body`) with mono kickers. Communities section reuses `DoorwayFeature` (immersive card, "Enter {name} →"); fundraisers section reuses `FrontRow` rows styled as cards (`.home-rows`) that navigate to `/f/[id]`. Old `cause-card.tsx`, `community-tile.tsx`, and `reveal.tsx` became unused and were deleted.
- **IntroDock removed** (2026-06-04) — the full-screen video arrival that docked into the header emblem slot was retired with the hero-redesign handoff (user decision): the lantern hero is now the arrival moment, and the centered-logo header has no dock target. `intro-dock.tsx` (+ test) deleted; ambient world videos still live on community/fundraiser surfaces and home's doorway cards.
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
- **Dead-code sweep (2026-06-04)** — export/usage scan (knip OOM'd in the sandbox; custom Node scan instead) plus a CSS-class audit. Removed: the unused shadcn `ui/button.tsx` (+ test; scaffold nothing imported — re-add via `pnpm dlx shadcn add button` if needed), dead CSS from retired designs (`.btn-start`, `.prose-inline`, `.side-h`, `.cbody*`, `.world-grid`, `.world-card*`, `.steward-list`, `.scrolly-name`, `.discover-hero/-h/-sub`, `.tile-stats` + their responsive rules), and the hand-picked reduced-motion `animation: none` list superseded by the canonical global reset. Un-exported internal-only `ease`, `STATIC_PROGRESS` (lantern.ts) and `WORLDS` (worlds.ts; `getWorld` is the API). Exported `*Props` types stay — they document component APIs.
- **`ProgressMeter` wording** changed from "keeping watch" to "supporters" (handoff spec + standing preference for GoFundMe-plain language); it ripples to the fundraiser hero too.
- **Canvas crossfade over raw frame swapping** (lantern hero). The handoff shipped only 8 frames (~1.1MB total), far below the article's 60–120; stepping between them would judder. Blending frame *n* → *n+1* with `globalAlpha` makes the scrub feel continuous at zero extra asset cost. All scroll math lives in pure, unit-tested functions; the canvas never re-renders React (progress in a ref, state only on act changes).
- **"Start a GoFundMe" opens a playful not-built modal** (2026-06-04, replaces the dummy button; now the hero beat-1 CTA, not a header button) — [`not-built-modal.tsx`](src/components/shared/not-built-modal.tsx) reuses the shared `Modal`/`Btn` atoms, content centered (`.modal-center`); honest about the demo's edges without a dead click. The Giphy gif was replaced with the **interactive unlit lantern** (user-picked twist, 2026-06-04): the brand lantern in grey, plus a "Strike a match" button — the flame catches for ~1.4s, then puffs out in a wisp of smoke and the copy admits "…and it's out." (phases `unlit → flicker → smoke`, timers cleaned on unmount, animations off under reduced motion). Copy: "Yes, it's a demo — and starting a fundraiser wasn't in scope." Triggered from the hero beat-1 CTA and the bento StartTile. No creation flow exists in the mock universe.
- **Hero h1 softened + downsized** (2026-06-04) — `.lhero-h` moved from near-black `oklch(0.2 0.014 56)` to a warmer Apple-black charcoal `oklch(0.31 0.022 52)` and from `clamp(46px, 7vw, 104px)` to `clamp(38px, 5.4vw, 78px)` per user feedback; CTA/ink tokens unchanged.
- **Watch Room copy speaks plain "causes"** (2026-06-04) — header now reads "This community · N causes / The causes this community carries"; the "fronts" metaphor confused (they're simply causes inside a community).

## Quality gates

`pnpm typecheck`, `pnpm lint`, `pnpm test` (93 tests, 25 files), and `pnpm build` all pass. Build prerenders `/`, `/communities`, `/communities/wildfire-watch`, `/f/{alerts,shelter,replant}`, `/u/janahan`.

## AI usage log

See [`AI-USAGE.md`](AI-USAGE.md): Claude Code (implementation), Claude (design), Vimeo (video sources), Codex (code reviews).

## What's next

- [ ] Verify PostHog events land in the dashboard (live key in `.env`; do an end-to-end smoke check in the browser).
- [ ] Capture/document real page-load benchmarks (Lighthouse / Web Vitals) — brief asks for it.
- [ ] Deploy (Vercel easiest for Next 16; AWS "preferred" not required).
- [ ] Add a `SiteProvider`/`AnalyticsProvider` test asserting events fire through an injected sink.
- [ ] More than one community to light up the Doorway's master-detail list (layout + tests already support it; product owner declined placeholder communities for now); guard unknown profile handles.
- [ ] A denser lantern frame set (30–60 frames) would let the crossfade go even smoother; the pipeline in `medium-article-ai-hero-animation.md` can regenerate them.
- [ ] Wire "Start a GoFundMe" to a real (or mocked) creation flow when one exists.
