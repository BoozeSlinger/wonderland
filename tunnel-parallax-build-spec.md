# Last Call Collective — Tunnel Parallax
## Claude Code Build Spec | Full Implementation Guide

---

## Project Overview

Build a scroll-driven parallax website where the user falls through a dark tunnel alongside TVTender.
The camera never moves. Everything else does.
One continuous seamless background — multiple texture layers crossfading into each other as depth increases.
TVTender floats fixed on screen. The world rushes upward around both the user and TVTender.

**Stack:** HTML + CSS + Vanilla JS + GSAP (ScrollTrigger, ScrollSmoother)
**Total scroll depth:** 8000px
**Deliverables:** `index.html`, `style.css`, `main.js` — all three complete, no placeholders

---

## POV Rule — Enforce Everywhere

The camera is eye-level floating beside TVTender inside a vertical shaft.
Looking horizontally at the walls — not up, not down.
Walls are flat vertical surfaces scrolling upward past the viewer.
TVTender and viewer are stationary. The world moves upward around them.
Think: the 1951 Disney Alice in Wonderland rabbit hole scene.

---

## File Structure

```
/
├── index.html
├── style.css
├── main.js
└── assets/
    ├── textures/
    │   ├── bar-interior.png
    │   ├── earth-roots.png
    │   ├── stone-brick.png
    │   ├── shelves-jars.png
    │   └── wallpaper.png
    ├── frames/
    │   ├── sconce-left.png
    │   ├── sconce-right.png
    │   ├── frame-large.png
    │   └── frame-small.png
    ├── objects/
    │   ├── receipt.png
    │   ├── shot-glass.png
    │   ├── bottle.png
    │   ├── tap-handle.png
    │   ├── vial.png
    │   ├── coaster.png
    │   └── barstool.png
    ├── characters/
    │   ├── tvtender.png
    │   ├── last-call-lou.png
    │   └── the-static.png
    ├── signs/
    │   ├── neon-last-call.png
    │   └── neon-down-the-drain.png
    └── tunnel/
        └── tunnel-rim.png
```

---

## Layer Stack

| Z-Index | ID | Type | Scrolls |
|---|---|---|---|
| 0 | #layer-void | CSS gradient, static | No |
| 1 | #layer-bar | Texture, fades out first | Yes 0.20x |
| 2 | #layer-earth | Texture, crossfades | Yes 0.25x |
| 3 | #layer-brick | Texture, crossfades | Yes 0.25x |
| 4 | #layer-shelves | Texture, crossfades | Yes 0.25x |
| 5 | #layer-wallpaper | Texture, last section | Yes 0.25x |
| 6 | #layer-frames | Wall decor PNGs | Yes 0.40x |
| 7 | #layer-objects | Floating objects | Yes 0.60–0.91x each |
| 8 | #layer-text | Copy zones | Yes 0.35x |
| 9 | #layer-neon | Neon signs | Yes 0.35x |
| 10 | #layer-characters | Lou + The Static | Yes 0.30x |
| 18 | #tvtender | Fixed hero — never scrolls | No — position: fixed |
| 20 | #tunnel-rim | Fixed foreground frame | No — position: fixed |
| 99 | #atmosphere | Grain vignette scanlines | No — position: fixed |

---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last Call Collective</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ═══════════════════════════════════════════════════
       SCROLL ENGINE — only element that creates scroll depth
       Everything visual lives OUTSIDE this wrapper
  ════════════════════════════════════════════════════ -->
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <div id="scroll-spacer"></div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 0 — VOID BACKGROUND (static, never moves)
  ════════════════════════════════════════════════════ -->
  <div id="layer-void"></div>

  <!-- ═══════════════════════════════════════════════════
       LAYERS 1–5 — TEXTURE BACKGROUNDS (crossfade on scroll)
       Each .inner div is 16000px tall so texture never runs out
  ════════════════════════════════════════════════════ -->
  <div id="layer-bar" class="parallax-layer texture-layer">
    <div class="inner"></div>
  </div>

  <div id="layer-earth" class="parallax-layer texture-layer" style="opacity:0">
    <div class="inner"></div>
  </div>

  <div id="layer-brick" class="parallax-layer texture-layer" style="opacity:0">
    <div class="inner"></div>
  </div>

  <div id="layer-shelves" class="parallax-layer texture-layer" style="opacity:0">
    <div class="inner"></div>
  </div>

  <div id="layer-wallpaper" class="parallax-layer texture-layer" style="opacity:0">
    <div class="inner"></div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 6 — WALL DECORATIONS (frames + sconces)
  ════════════════════════════════════════════════════ -->
  <div id="layer-frames" class="parallax-layer">
    <div class="inner">
      <img src="/assets/frames/sconce-left.png"  class="wall-decor" style="left:3%;  top:1200px; width:70px;">
      <img src="/assets/frames/sconce-right.png" class="wall-decor" style="right:3%; top:1200px; width:70px;">
      <img src="/assets/frames/frame-large.png"  class="wall-decor" style="left:2%;  top:2400px; width:140px;">
      <img src="/assets/frames/frame-small.png"  class="wall-decor" style="right:2%; top:3400px; width:110px;">
      <img src="/assets/frames/frame-large.png"  class="wall-decor" style="right:2%; top:5000px; width:140px;">
      <img src="/assets/frames/frame-small.png"  class="wall-decor" style="left:2%;  top:6200px; width:110px;">
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 7 — FLOATING OBJECTS
       data-speed: scroll multiplier (higher = moves faster upward)
       data-drift: horizontal px drift (+ = right, - = left)
       data-rot: base rotation in degrees
  ════════════════════════════════════════════════════ -->
  <div id="layer-objects" class="parallax-layer">
    <div class="inner">
      <img src="/assets/objects/receipt.png"
           class="float-obj" id="obj-receipt"
           data-speed="0.75" data-drift="40" data-rot="-20"
           style="left:9%;   top:700px;  width:100px;">

      <img src="/assets/objects/shot-glass.png"
           class="float-obj" id="obj-glass"
           data-speed="0.82" data-drift="-30" data-rot="15"
           style="right:11%; top:1400px; width:85px;">

      <img src="/assets/objects/bottle.png"
           class="float-obj" id="obj-bottle"
           data-speed="0.70" data-drift="20" data-rot="-35"
           style="left:68%;  top:2100px; width:120px;">

      <img src="/assets/objects/tap-handle.png"
           class="float-obj" id="obj-tap"
           data-speed="0.87" data-drift="-45" data-rot="25"
           style="right:9%;  top:2900px; width:105px;">

      <img src="/assets/objects/vial.png"
           class="float-obj" id="obj-vial"
           data-speed="0.78" data-drift="30" data-rot="-10"
           style="left:14%;  top:3700px; width:75px;">

      <img src="/assets/objects/coaster.png"
           class="float-obj" id="obj-coaster"
           data-speed="0.91" data-drift="-20" data-rot="40"
           style="right:20%; top:4500px; width:90px;">

      <img src="/assets/objects/barstool.png"
           class="float-obj" id="obj-barstool"
           data-speed="0.73" data-drift="35" data-rot="-25"
           style="left:62%;  top:5400px; width:135px;">
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 8 — WALL TEXT ZONES
  ════════════════════════════════════════════════════ -->
  <div id="layer-text" class="parallax-layer">
    <div class="inner">

      <div class="text-zone" id="zone-1" style="top:600px;">
        <h1>Your bar is bleeding money.</h1>
        <p>You just can't see the hole yet.</p>
      </div>

      <div class="text-zone" id="zone-2" style="top:2200px;">
        <h2>The average bar loses 20–25% of profit every month.</h2>
        <p>Dead stock. Over-pouring. Invisible online. All the same drain.</p>
      </div>

      <div class="text-zone" id="zone-3" style="top:3800px;">
        <h2>We're all bleeding here.</h2>
        <p>There's a system on the other side of this wall.</p>
      </div>

      <div class="text-zone" id="zone-4" style="top:5400px;">
        <h2>You made it. Now let's fix your bar.</h2>
        <div class="offer-cards">
          <div class="card">
            <span class="card-title">Profit Leak Audit</span>
            <span class="card-price">$499</span>
          </div>
          <div class="card">
            <span class="card-title">High-Proof Tier 2</span>
            <span class="card-price">$599/mo</span>
          </div>
          <div class="card">
            <span class="card-title">THE CALL</span>
            <span class="card-price">$1,149/mo</span>
          </div>
        </div>
        <a href="#" class="cta-btn">Book The Call</a>
      </div>

    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 9 — NEON SIGNS
  ════════════════════════════════════════════════════ -->
  <div id="layer-neon" class="parallax-layer">
    <div class="inner">
      <img src="/assets/signs/neon-last-call.png"
           class="neon-sign" style="top:4600px; width:500px;">
      <img src="/assets/signs/neon-down-the-drain.png"
           class="neon-sign" style="top:5200px; width:620px;">
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       LAYER 10 — SECONDARY CHARACTERS
  ════════════════════════════════════════════════════ -->
  <div id="layer-characters" class="parallax-layer">
    <div class="inner">
      <img src="/assets/characters/last-call-lou.png"
           id="char-lou"
           style="left:-40px; top:2800px; width:180px; opacity:0;">
      <img src="/assets/characters/the-static.png"
           id="char-static"
           style="right:4%; top:4000px; width:160px; opacity:0;">
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       TVTENDER — FIXED CENTER, NEVER SCROLLS (z-index: 18)
  ════════════════════════════════════════════════════ -->
  <img src="/assets/characters/tvtender.png" id="tvtender" alt="TVTender">

  <!-- ═══════════════════════════════════════════════════
       TUNNEL RIM — FIXED FOREGROUND FRAME (z-index: 20)
  ════════════════════════════════════════════════════ -->
  <img src="/assets/tunnel/tunnel-rim.png" id="tunnel-rim" alt="">

  <!-- ═══════════════════════════════════════════════════
       ATMOSPHERE — FIXED TOP LAYER (z-index: 99)
  ════════════════════════════════════════════════════ -->
  <div id="atmosphere">
    <div class="atmo-vignette"></div>
    <div class="atmo-scanlines"></div>
    <div class="atmo-grain"></div>
  </div>

  <!-- ═══════════════════════════════════════════════════
       SCRIPTS — GSAP CDN
  ════════════════════════════════════════════════════ -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollSmoother.min.js"></script>
  <script src="main.js"></script>

</body>
</html>
```

---

## style.css

```css
/* ═══════════════════════════════════
   CSS VARIABLES
════════════════════════════════════ */
:root {
  --black:    #000000;
  --void:     #0D0D0D;
  --charcoal: #2A2A2A;
  --burgundy: #1a0500;
  --amber:    #C8780A;
  --depth:    8000px;
}

/* ═══════════════════════════════════
   RESET + BASE
════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%;
  height: 100%;
  background: var(--black);
  overflow-x: hidden;
}

/* ═══════════════════════════════════
   SCROLL ENGINE
════════════════════════════════════ */
#smooth-wrapper {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: hidden;
}

#smooth-content {
  will-change: transform;
}

#scroll-spacer {
  height: var(--depth);
  width: 100%;
}

/* ═══════════════════════════════════
   LAYER 0 — VOID
════════════════════════════════════ */
#layer-void {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(ellipse at center, #1a0500 0%, #000000 65%);
  pointer-events: none;
}

/* ═══════════════════════════════════
   PARALLAX LAYER BASE
   All layers share this — fixed container, tall inner div
════════════════════════════════════ */
.parallax-layer {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
}

.parallax-layer .inner {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 16000px;
  will-change: transform;
}

/* ═══════════════════════════════════
   TEXTURE LAYERS
════════════════════════════════════ */
.texture-layer .inner {
  background-repeat: repeat-y;
  background-size: cover;
  background-position: center top;
}

#layer-bar       { z-index: 1; }
#layer-earth     { z-index: 2; }
#layer-brick     { z-index: 3; }
#layer-shelves   { z-index: 4; }
#layer-wallpaper { z-index: 5; }

#layer-bar       .inner { background-image: url('/assets/textures/bar-interior.png'); }
#layer-earth     .inner { background-image: url('/assets/textures/earth-roots.png'); }
#layer-brick     .inner { background-image: url('/assets/textures/stone-brick.png'); }
#layer-shelves   .inner { background-image: url('/assets/textures/shelves-jars.png'); }
#layer-wallpaper .inner { background-image: url('/assets/textures/wallpaper.png'); }

/* ═══════════════════════════════════
   LAYER 6 — WALL DECORATIONS
════════════════════════════════════ */
#layer-frames { z-index: 6; }

.wall-decor {
  position: absolute;
  opacity: 0.85;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.9));
}

/* ═══════════════════════════════════
   LAYER 7 — FLOATING OBJECTS
════════════════════════════════════ */
#layer-objects { z-index: 7; }

.float-obj {
  position: absolute;
  opacity: 0.88;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.85));
  animation: objectGlow 6s ease-in-out infinite alternate;
}

@keyframes objectGlow {
  0%   { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.85)); }
  100% { filter: drop-shadow(0 8px 22px rgba(200,120,10,0.18)); }
}

/* ═══════════════════════════════════
   LAYER 8 — TEXT ZONES
════════════════════════════════════ */
#layer-text { z-index: 8; }

.text-zone {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(580px, 85vw);
  text-align: center;
  color: var(--amber);
  opacity: 0;
}

.text-zone h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1rem;
  text-shadow: 0 0 40px rgba(200,120,10,0.4);
}

.text-zone h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.8rem;
  text-shadow: 0 0 30px rgba(200,120,10,0.3);
}

.text-zone p {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  opacity: 0.72;
  line-height: 1.6;
}

/* ═══════════════════════════════════
   OFFER CARDS
════════════════════════════════════ */
.offer-cards {
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  border: 1px solid rgba(200,120,10,0.5);
  padding: 1.5rem 2rem;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(200,120,10,0.06);
  backdrop-filter: blur(4px);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  color: var(--amber);
  opacity: 0.85;
}

.card-price {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 700;
}

.cta-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 1rem 3rem;
  background: var(--amber);
  color: var(--black);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background 0.2s, transform 0.1s;
}

.cta-btn:hover {
  background: #e08c0f;
  transform: translateY(-1px);
}

/* ═══════════════════════════════════
   LAYER 9 — NEON SIGNS
════════════════════════════════════ */
#layer-neon { z-index: 9; }

.neon-sign {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  mix-blend-mode: screen;
  max-width: 600px;
  width: 55%;
  pointer-events: none;
}

/* ═══════════════════════════════════
   LAYER 10 — SECONDARY CHARACTERS
════════════════════════════════════ */
#layer-characters { z-index: 10; }

#char-lou,
#char-static {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 0 20px rgba(200,120,10,0.3));
}

/* ═══════════════════════════════════
   TVTENDER — FIXED, NEVER SCROLLS
════════════════════════════════════ */
#tvtender {
  position: fixed;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%) rotate(-35deg);
  width: 260px;
  z-index: 18;
  pointer-events: none;
  filter: drop-shadow(0 0 30px rgba(200,120,10,0.25));
  animation: tvSway 4s ease-in-out infinite;
}

@keyframes tvSway {
  0%   { transform: translateX(-50%) rotate(-35deg) translateY(0px);  }
  25%  { transform: translateX(-50%) rotate(-33deg) translateY(-10px); }
  50%  { transform: translateX(-50%) rotate(-35deg) translateY(-18px); }
  75%  { transform: translateX(-50%) rotate(-37deg) translateY(-10px); }
  100% { transform: translateX(-50%) rotate(-35deg) translateY(0px);  }
}

/* ═══════════════════════════════════
   TUNNEL RIM — FIXED FOREGROUND
════════════════════════════════════ */
#tunnel-rim {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 20;
  pointer-events: none;
}

/* ═══════════════════════════════════
   ATMOSPHERE OVERLAY — ALWAYS ON TOP
════════════════════════════════════ */
#atmosphere {
  position: fixed;
  inset: 0;
  z-index: 99;
  pointer-events: none;
}

.atmo-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 28%,
    rgba(0,0,0,0.55) 65%,
    rgba(0,0,0,0.90) 100%
  );
}

.atmo-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0,0,0,0.04) 3px,
    rgba(0,0,0,0.04) 4px
  );
}

.atmo-grain {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* ═══════════════════════════════════
   MOBILE
════════════════════════════════════ */
@media (max-width: 768px) {
  .float-obj    { display: none; }
  #char-lou     { display: none; }
  #tvtender     { width: 160px; bottom: 8%; }
  .offer-cards  { flex-direction: column; align-items: center; }
  .card         { min-width: 240px; }
}
```

---

## main.js

```javascript
// ═══════════════════════════════════
// REGISTER GSAP PLUGINS
// ═══════════════════════════════════
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const DEPTH = 8000;
const isMobile = window.innerWidth < 768;

// ═══════════════════════════════════
// SCROLL SMOOTHER
// ═══════════════════════════════════
const smoother = ScrollSmoother.create({
  wrapper:         "#smooth-wrapper",
  content:         "#smooth-content",
  smooth:          isMobile ? 1 : 2.2,
  effects:         true,
  normalizeScroll: true,
  wholePixels:     true
});

// ═══════════════════════════════════
// PARALLAX LAYER HELPER
// Moves each layer's .inner div upward at given speed
// ═══════════════════════════════════
function parallaxLayer(id, speed) {
  gsap.to(`${id} .inner`, {
    y: -(speed * DEPTH),
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start:   "top top",
      end:     "bottom bottom",
      scrub:   2
    }
  });
}

parallaxLayer("#layer-bar",        0.20);
parallaxLayer("#layer-earth",      0.25);
parallaxLayer("#layer-brick",      0.25);
parallaxLayer("#layer-shelves",    0.25);
parallaxLayer("#layer-wallpaper",  0.25);
parallaxLayer("#layer-frames",     0.40);
parallaxLayer("#layer-text",       0.35);
parallaxLayer("#layer-neon",       0.35);
parallaxLayer("#layer-characters", 0.30);

// ═══════════════════════════════════
// FLOATING OBJECTS — individual speeds + drift + rotation
// ═══════════════════════════════════
if (!isMobile) {
  document.querySelectorAll(".float-obj").forEach(obj => {
    const speed = parseFloat(obj.dataset.speed);
    const drift = parseFloat(obj.dataset.drift);
    const rot   = parseFloat(obj.dataset.rot);

    gsap.to(obj, {
      y:        -(speed * DEPTH),
      x:        drift,
      rotation: rot + (Math.random() * 20 - 10),
      ease:     "none",
      scrollTrigger: {
        trigger: "body",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   1.5 + Math.random() * 0.8
      }
    });
  });
}

// ═══════════════════════════════════
// TEXTURE CROSSFADES
// Each transition overlaps slightly for seamless blend
// ═══════════════════════════════════

// Bar → Earth (scroll 8%–18%)
ScrollTrigger.create({
  trigger: "body",
  start: "8% top",
  end:   "18% top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set("#layer-bar",   { opacity: 1 - self.progress });
    gsap.set("#layer-earth", { opacity: self.progress });
  }
});

// Earth → Brick (scroll 25%–38%)
ScrollTrigger.create({
  trigger: "body",
  start: "25% top",
  end:   "38% top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set("#layer-earth", { opacity: 1 - self.progress });
    gsap.set("#layer-brick", { opacity: self.progress });
  }
});

// Brick → Shelves (scroll 45%–57%)
ScrollTrigger.create({
  trigger: "body",
  start: "45% top",
  end:   "57% top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set("#layer-brick",   { opacity: 1 - self.progress });
    gsap.set("#layer-shelves", { opacity: self.progress });
  }
});

// Shelves → Wallpaper (scroll 65%–77%)
ScrollTrigger.create({
  trigger: "body",
  start: "65% top",
  end:   "77% top",
  scrub: true,
  onUpdate: (self) => {
    gsap.set("#layer-shelves",   { opacity: 1 - self.progress });
    gsap.set("#layer-wallpaper", { opacity: self.progress });
  }
});

// ═══════════════════════════════════
// TEXT ZONES — fade in as they approach center, fade out as they pass
// ═══════════════════════════════════
document.querySelectorAll(".text-zone").forEach(zone => {
  gsap.fromTo(zone,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger:  zone,
        start:    "top 80%",
        end:      "top 45%",
        scrub:    1.5
      }
    }
  );

  gsap.fromTo(zone,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "power2.in",
      scrollTrigger: {
        trigger:  zone,
        start:    "top 30%",
        end:      "top 5%",
        scrub:    1.5
      }
    }
  );
});

// ═══════════════════════════════════
// LAST CALL LOU — flickers in at scroll 32%, runs offscreen left
// ═══════════════════════════════════
ScrollTrigger.create({
  trigger:     "body",
  start:       "32% top",
  once:        true,
  onEnter: () => {
    gsap.timeline()
      .to("#char-lou", {
        opacity:  1,
        duration: 0.25,
        ease:     "power1.in"
      })
      .to("#char-lou", {
        x:        -320,
        opacity:  0,
        duration: 1.4,
        ease:     "power2.in"
      }, "+=0.9");
  }
});

// ═══════════════════════════════════
// THE STATIC — flickers on wall at scroll 55%, grin lingers
// ═══════════════════════════════════
ScrollTrigger.create({
  trigger:  "body",
  start:    "55% top",
  once:     true,
  onEnter: () => {
    gsap.timeline()
      .to("#char-static", { opacity: 1,   duration: 0.08 })
      .to("#char-static", { opacity: 0,   duration: 0.08 }, "+=0.06")
      .to("#char-static", { opacity: 1,   duration: 0.08 }, "+=0.04")
      .to("#char-static", { opacity: 0.9, duration: 0.25 }, "+=0.08")
      .to("#char-static", { opacity: 0,   duration: 0.9  }, "+=2.2");
  }
});
```

---

## Build Checklist

- [ ] 1. Drop all asset files into correct folders — verify paths match exactly
- [ ] 2. Open index.html — confirm all 10 layers visible statically, no broken images
- [ ] 3. Confirm z-index stack is correct — tunnel rim always in front
- [ ] 4. Add main.js — confirm ScrollSmoother buttery scroll only first
- [ ] 5. Confirm parallaxLayer() firing — walls should move upward on scroll
- [ ] 6. Confirm texture crossfades — bar fades to earth, earth to brick, etc.
- [ ] 7. Confirm floating objects each move at different speeds
- [ ] 8. Confirm TVTender sway animation plays — no scroll influence
- [ ] 9. Confirm text zones fade in at center viewport, fade out as they pass
- [ ] 10. Trigger Lou at 32% scroll — confirm he runs offscreen
- [ ] 11. Trigger The Static at 55% scroll — confirm flicker + fade
- [ ] 12. Test on mobile — objects hidden, TVTender scaled down
- [ ] 13. Compress all PNGs via squoosh.app before final deploy
- [ ] 14. Test Chrome, Safari, Firefox

---

## Color Palette Reference

| Variable | Hex | Usage |
|---|---|---|
| --black | #000000 | Base background |
| --void | #0D0D0D | Layer void |
| --charcoal | #2A2A2A | Midtones |
| --burgundy | #1a0500 | Warm void glow |
| --amber | #C8780A | All text, accents, glows |

**No other colors. Ever.**

---

## Typography Reference

| Use | Font | Weight |
|---|---|---|
| h1, h2 | Playfair Display | 700, 900 |
| Body, buttons, prices | Inter | 400, 600, 700 |
| All text color | #C8780A (amber) | — |
