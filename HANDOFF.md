# Tunnel Parallax Site — Session Handoff
**Date:** 2026-05-02  
**Dev server:** `pnpm dev` → http://localhost:3001  
**Build status:** ✅ Zero TypeScript errors, clean production build

---

## What Was Built

Full Next.js 16 / React 19 scroll-driven parallax site.  
Stack: TypeScript · Tailwind v4 · Lenis v1.3 · GSAP 3.15 ScrollTrigger

### Files created / modified
```
app/layout.tsx              — fonts (LeMurmure via Fontshare, Big Shoulders via Google)
app/page.tsx                — imports TunnelScene
app/globals.css             — all layer CSS, z-index stack, animations
components/tunnel/
  TunnelScene.tsx           — main "use client" orchestrator, all GSAP
  TextureLayer.tsx          — forwardRef inner div for parallax layers
  FloatingObject.tsx        — forwardRef img for individual objects
  TVTender.tsx              — fixed hero character
  TextZone.tsx              — forwardRef text zone div
  CharacterLayer.tsx        — Lou + Static with useImperativeHandle refs
  NeonLayer.tsx             — neon signs layer
  WallDecorLayer.tsx        — frames + sconces
  TunnelRim.tsx             — fixed foreground frame (uses tunnel-rim.webp)
  Atmosphere.tsx            — vignette + scanlines + grain
hooks/
  useLenis.ts               — Lenis init, wires to GSAP ticker + ScrollTrigger.update
  useParallaxLayer.ts       — setupParallaxLayer() utility, called inside gsap.context
```

---

## Current Behavior

| Scroll % | What happens |
|---|---|
| 0% | bar-interior texture · Zone 1 "Your bar is bleeding money." fades in |
| 8–18% | Bar crossfades → earth-roots texture |
| 25–38% | Earth → stone-brick crossfade |
| 30% | Last Call Lou flickers in, runs left offscreen |
| 45–57% | Brick → shelves crossfade |
| 55% | The Static flickers on the wall |
| 60–70% | Zone 3 "We're all bleeding here." |
| 65–77% | Shelves → wallpaper crossfade |
| 80–88% | Zone 4 offer cards + "Book The Call" CTA |

Floating objects (receipt, shot-glass, bottle, tap-handle, vial, coaster, barstool) drift at individual speeds on desktop. Hidden on mobile (`hidden md:block`).

---

## Known Issues / Next Steps

### 🔴 Critical — visual design intent not fully realized

**The tunnel is supposed to be a narrow vertical shaft** (see reference image in this session).  
The camera looks DOWN the shaft as the walls scroll upward. The center of the viewport should show a dark narrow drop, with stone/texture walls on the left and right edges only.

Currently the texture layers fill the entire viewport width. The correct look:
- Narrow black center void running top→bottom
- Wall textures visible only on the left ~30% and right ~30%
- Objects float through the center void
- TVTender sits in the center void

**Fix needed in globals.css:** The `.parallax-layer .inner` background should use `background-size` and positioning to render only on the sides, OR the texture images themselves handle this with transparent centers.

### 🟡 Tunnel-rim blend mode compromise

The tunnel-rim.webp is fully opaque. Currently using `mix-blend-mode: multiply` + `opacity: 0.85` as a workaround so the scene shows through. This darkens everything.

Ideal fix: Replace with a proper PNG/WebP that has alpha transparency in the center corridor, opaque stone on the edges.

### 🟡 TVTender positioning

TVTender is at `bottom: 12%; left: 50%; z-index: 22`. It sits above the tunnel-rim.  
Per the spec it should be at z-index 18 (below the rim) and visible through the rim's transparent center. Once the rim has proper alpha, drop TVTender back to z-index 18.

### 🟡 Text zone z-index

Text layer is at z-index 23 (above tunnel-rim) as a workaround for the opaque rim.  
Should be z-index 8 once the rim has proper alpha transparency.

### 🟢 Object positions adapted from spec

The spec's original positions (top: 700px–5400px) exceeded what the 0.35x parallax speed can bring into view in 8000px of scroll. Positions were recalculated:

| Object | Spec top | Adapted top |
|---|---|---|
| receipt | 700px | 200px |
| shot-glass | 1400px | 500px |
| bottle | 2100px | 900px |
| tap-handle | 2900px | 1300px |
| vial | 3700px | 1700px |
| coaster | 4500px | 2100px |
| barstool | 5400px | 2500px |

### 🟢 Neon sign positions adapted

Spec positions (4600px, 5200px) also exceeded visible range. Moved to 2550px and 2830px.

---

## Architecture Notes

### Why Lenis instead of ScrollSmoother

Spec called for ScrollSmoother (GSAP Club plugin, not available). Lenis v1.3 replaces it:
- Lenis smooth-scrolls native window scroll
- `lenis.on("scroll", () => ScrollTrigger.update())` keeps GSAP in sync
- `gsap.ticker.add((time) => lenis.raf(time * 1000))` drives Lenis frame loop

### Why text/TVTender z-index are above tunnel-rim

The tunnel-rim.webp currently lacks alpha transparency. Temporary workaround:
- TVTender: z-index 22
- `#layer-text`: z-index 23

Revert both once rim has proper alpha.

### Text zone trigger approach

Text zones use `trigger: document.body` with scroll-percentage start/end (`"60% top"`, `"70% top"`) rather than element-based triggers, because the elements live inside a `position: fixed; overflow: hidden` container — ScrollTrigger can't track their viewport position correctly.

### GSAP context

All animations live in one `gsap.context(() => { ... })` with `ctx.revert()` on cleanup. No stray tweens.

---

## Performance State

All compositor-safe after session audit:

| Was | Fixed to |
|---|---|
| `objectGlow` keyframe animated `filter: drop-shadow` | Opacity-only pulse |
| `filter` on GSAP-animated chars (Lou, Static) | Removed, `will-change: transform, opacity` |
| `filter: drop-shadow` on TVTender (CSS-animated) | Removed, `will-change: transform` |
| `backdrop-filter: blur` on offer cards | Solid `rgba(10,5,0,0.72)` bg |
| Crossfades queried DOM by string selector every scroll tick | Direct element refs resolved once at setup |
| Parallax tweens without GPU hint | `force3D: true` on all 10 inner-div tweens |

---

## Asset Map

All assets in `public/assets/`. Placeholders (SVG amber-on-dark) were generated for missing files at session start. Ryan has since replaced all placeholders with real art.

```
textures/   bar-interior.png · earth-roots.png · stone-brick.png · shelves-jars.png · wallpaper.png
frames/     sconce-left.png · sconce-right.png · frame-large.png · frame-small.png
objects/    receipt.png · shot-glass.png · bottle.png · tap-handle.png · vial.png · coaster.png · barstool.png
characters/ tvtender.png · last-call-lou.png · the-static.png
signs/      neon-last-call.png · neon-down-the-drain.png
tunnel/     tunnel-rim.webp  ← used directly (no .png needed)
```

---

## Quick Commands

```bash
pnpm dev          # dev server → localhost:3001
pnpm build        # production build (must pass before deploy)
pnpm exec tsc --noEmit  # type check
```
