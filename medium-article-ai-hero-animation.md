# I Made a Cinematic AI Hero Animation for My Website in One Afternoon (Whisk → Flow → Claude Code)

You know those premium product sites where the hero literally *plays a story* as you scroll? A can spinning, ingredients bursting, everything buttery smooth? I watched a tutorial doing this for a drink brand and thought: I don't have a can. I have a fundraising platform.

Turns out the flow works for *any* brand — you just need one hero object and a story. Here's my exact pipeline, with every prompt I used, so you can copy-paste your way through it.

**The flow:** Google Whisk (first frame) → Whisk again (last frame) → Google Flow / Veo (the transition video) → WebP frames → Claude Code (the actual website).

---

## Step 1: Find your hero object

Before touching any AI tool, ask: *what's the one object that IS my brand?*

For a drink brand it's obviously the can. For my project — a reimagined GoFundMe where donating is called "planting a light" and sharing is "sending a lantern" — the answer was staring at me: **a glowing paper lantern**.

The story wrote itself: hands holding a lantern → the light glows brighter → the hands release it → it flies high. That's a donation, visually. One object, one emotional arc, three frames.

Quick tip: if you're stuck, paste your site's copy into Claude and ask "what's my hero object?" That's literally what I did.

## Step 2: Generate the first frame (Google Whisk)

Whisk lets you feed separate **subject** and **style** reference images. Use that. My subject reference was a stock photo of a paper lantern; my style reference was an existing brand asset from my site (a dawn-toned illustration), so the output matched my palette instead of looking like Generic AI Art™.

Here's my first frame prompt — swap the object and colors for yours:

```
Create a high-quality professional studio image of a single
hand holding a small glowing paper lantern by its handle,
raised slightly, entering the frame from below. The lantern
emits a warm amber glow that softly lights the fingers.
A few fine golden sparks drift upward around it.

STYLE:
• Premium brand photography — clean, warm, hopeful
• Balanced soft studio lighting with a large diffused key
• Golden-hour warmth: soft rim light on the hand and lantern
• Natural skin tones, gentle shadows, no harsh contrast
• Minimal composition, slight vignette, no busy gradients

BACKGROUND:
• Soft light pink golden-hour gradient (#FBE3D6 fading to
  #F6C9B8), like a dawn sky in a studio
• Seamless backdrop, no horizon line, no clouds
• No textures, no props, no reflections

FRAMING:
• Full vertical frame, hand entering from the bottom third
• Lantern at the visual center
• Clear empty space above the lantern for it to rise into
• Generous margins for later motion-tracking

OUTPUT:
• High-resolution still image
• Smooth uniform background for easy masking
• Keep hand pose, skin tone, lantern shape, and glow
  consistent
```

The structure matters more than the words: **describe the shot → STYLE → BACKGROUND → FRAMING → OUTPUT.** The "empty space above for it to rise into" line is doing real work — you're composing for motion that doesn't exist yet.

Two honest warnings: hands are still the thing AI fumbles most, so expect a few regenerations. And keep the background dead simple — you'll thank yourself at the website stage.

## Step 3: Generate the last frame (same chat, reference attached)

This is the trick that keeps everything consistent: **feed your first frame back in as the reference** and describe only what changed. You're not generating a new image, you're generating the end of a story.

```
Using the reference image, keep the exact same soft pink
golden-hour gradient background, the same hanging wisteria
flowers at the top, and the same paper lantern design.

Now show the final moment of the story: the hands are gone,
lowered out of frame. The lantern has been released and floats
high in the upper third of the frame, slightly smaller with
distance. Its glow is at its brightest — a radiant warm golden
core lighting the paper from within. A trail of tiny golden
sparks curves gently below it, marking the path it rose along.
The lower half of the frame is calm, open, empty pink sky.

STYLE:
• Identical photography style, lighting, and color grade
  as the reference image
• Glow stronger and warmer than the reference

FRAMING:
• Same camera position — do not zoom or tilt
• Lantern centered horizontally, upper third vertically

OUTPUT:
• High-resolution still, same aspect ratio as reference
• Lantern shape, ribs, handle, and lettering unchanged
```

The three lines that matter most: *"same camera position — do not zoom or tilt"*, *"identical lighting and color grade"*, and naming exactly what stays (the wisteria, the lantern design). Video models interpolate between your frames — if the camera or grade drifts between them, the transition gets weird.

Optional but nice: generate a *middle* frame too (lantern just leaving the fingertips). Three keyframes = smoother story.

## Step 4: The transition video (Google Flow / Veo)

Now attach your first and last frames in Flow and describe the journey between them. Write it like stage directions — beginning state, the build, the constraints, the end state:

```
Create a smooth cinematic transition from the first frame
(hands holding the glowing lantern) to the final frame
(lantern floating high in the sky) using the uploaded
reference images.

Begin with two hands gently cupping the glowing paper lantern
against the soft pink golden-hour sky.
The lantern's inner glow slowly intensifies, becoming a
radiant warm golden core that lights the paper from within.
As the glow peaks, the hands gently lift, open, and release
the lantern, then lower gracefully out of the bottom of the
frame.
The lantern rises upward in a soft, natural sway — slowly at
first, then steadily climbing.
Introduce tiny golden sparks trailing behind the lantern as
it rises, increasing gradually along its path.
The lantern ends small and bright in the upper third of the
frame, hovering gently, glow at its warmest.
All motion must look soft, weightless, and serene — no fast
movement, no shaking.
Ensure the lantern stays sharp, well-lit, and unobstructed
throughout.
Background stays the same soft pink golden-hour gradient with
no additional effects.
Camera remains completely static for the entire transition.
End in the final composition: empty calm sky below, lantern
glowing high above with its spark trail.
```

"Camera remains completely static" is non-negotiable. You want the *object* to move, not the world — that's what makes the scroll-scrub feel intentional later.

## Step 5: Video → WebP frames

The website won't play a video — it'll scrub through frames as you scroll. Convert your clip at [ezgif.com/video-to-webp](https://ezgif.com/video-to-webp), or if you like the terminal:

```
ffmpeg -i lantern.mp4 -vf "fps=30,scale=1600:-1" \
  -quality 80 frames/frame-%03d.webp
```

Aim for somewhere around 60–120 frames. More = smoother scrub, heavier page. Drop them in your project (mine live in `public/hero/lantern/`).

## Step 6: Hand it to Claude Code

This is where it becomes a real website. Here's the prompt I gave Claude Code — adapt the brand bits and keep the mechanics:

```
Design a premium, scroll-driven hero for my website
("Help finds a way" — dawn theme, lantern motif).

Hero Background:
- The entire hero background is a WebP image sequence of my
  lantern animation, frames in
  public/hero/lantern/frame-001.webp ... frame-NNN.webp.
- As the user scrolls down, the sequence plays forward
  (scroll-scrubbed, mapped to scroll progress); scrolling up
  reverses it. Render to a <canvas> for smoothness.
- The hero is pinned (sticky) for ~150vh of scroll so the
  full release-and-rise story plays before the page continues.
- Soft light-pink backdrop (#FBE3D6 → #F6C9B8) behind the
  frames so letterboxing never shows.

Hero Overlay:
- Headline + tagline + primary CTA.
- Text fades/translates subtly tied to scroll: headline
  visible while hands hold the lantern, CTA appears as the
  lantern lifts, ends on "Follow the light →" as it flies
  high.

Loading Experience:
- Preload the initial sequence before revealing the hero:
  full-screen overlay with the wordmark, a thin horizontal
  progress bar, and a % indicator; reveal only when ready
  to avoid flicker.

Constraints:
- prefers-reduced-motion: skip the scrub — show the final
  frame as a static hero.
- Mobile: shorter pin distance, smaller frame set.
- Lazy-load all frames after the first ~10; never block
  page load on the full sequence.
```

If your site sells multiple things (flavors, plans, communities), add PREV/NEXT controls that crossfade the overlay text and swap to a different frame sequence per variant — that's the move from the original drink-brand tutorial, and it translates to anything.

## The recipe, compressed

One hero object. First frame with studio-grade prompt structure. Last frame generated *from* the first frame with "do not move the camera." A transition prompt written like stage directions. Frames, not video. And a Claude Code prompt that treats accessibility (reduced motion, preloading, mobile) as part of the design, not an afterthought.

The whole thing took me an afternoon, and most of that was regenerating fingers.

Go make your object fly. 🏮
