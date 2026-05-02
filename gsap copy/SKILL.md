---
name: gsap
description: "Professional-grade JavaScript animation library (v3.14.2). Tweens, Timelines, ScrollTrigger, React integration (useGSAP), and advanced plugins. Use when animating DOM, SVG, canvas, Three.js, or WebGL elements."
source: "https://github.com/greensock/GSAP"
docs: "https://gsap.com/docs/v3/"
version: "3.14.2"
risk: safe
---

# GSAP — GreenSock Animation Platform

Professional-grade JavaScript animation for the modern web. Framework-agnostic. Works with DOM, SVG, Canvas, Three.js, WebGL, and any numeric property.

## Installation

```bash
npm install gsap
npm install @gsap/react  # React hook (optional)
```

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Always register plugins before use
gsap.registerPlugin(ScrollTrigger);
```

---

## Core Concepts

### Tweens — The Basics

A **Tween** animates properties on a target from one state to another.

```js
// gsap.to() — animate TO values
gsap.to(".box", { x: 100, rotation: 27, duration: 1 });

// gsap.from() — animate FROM values (starts at given values, ends at current)
gsap.from(".box", { opacity: 0, y: -50, duration: 0.8 });

// gsap.fromTo() — define both start AND end values explicitly
gsap.fromTo(".box",
  { opacity: 0, scale: 0.5 },        // from
  { opacity: 1, scale: 1, duration: 1 } // to
);

// gsap.set() — instantly set properties (no animation)
gsap.set(".box", { x: 100, opacity: 0 });
```

### Common Special Properties

```js
gsap.to(".el", {
  x: 200,             // translateX (px by default)
  y: 100,             // translateY
  xPercent: -50,      // translateX as %
  yPercent: -50,      // translateY as %
  rotation: 360,      // degrees
  rotationX: 45,      // 3D X-axis
  rotationY: 45,      // 3D Y-axis
  scale: 1.5,
  scaleX: 2,
  scaleY: 0.5,
  skewX: 10,
  skewY: 10,
  opacity: 0,
  width: "100%",
  background: "#ff0000",
  duration: 1,          // seconds
  delay: 0.5,           // seconds before start
  ease: "power2.out",   // easing function
  repeat: -1,           // -1 = infinite
  yoyo: true,           // reverse on repeat
  stagger: 0.1,         // offset between multiple targets
  onComplete: () => {},
  onStart: () => {},
  onUpdate: () => {},
});
```

---

## Timelines — Sequencing

```js
const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

// Sequence one after another (default)
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 200 })
  .to(".box3", { rotation: 360 });
```

### Position Parameter

The 3rd argument controls WHERE on the timeline an animation is placed:

```js
tl.to(".a", { x: 100 }, 0)          // absolute: at 0 seconds
  .to(".b", { y: 100 }, "+=1")       // 1s AFTER the previous ends
  .to(".c", { scale: 2 }, "-=0.5")   // 0.5s BEFORE the previous ends
  .to(".d", { opacity: 0 }, "<")     // at the START of the previous
  .to(".e", { rotation: 90 }, "<+=0.2") // 0.2s after start of previous
  .to(".f", { x: -100 }, "myLabel")  // at a named label
  .addLabel("myLabel", 2);           // add label at 2 seconds
```

### Timeline Control

```js
const tl = gsap.timeline({ paused: true });

tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.seek(2);           // jump to 2 seconds
tl.progress(0.5);     // jump to 50%
tl.timeScale(2);      // double speed
tl.kill();            // destroy
```

### Timeline Callbacks

```js
const tl = gsap.timeline({
  onStart: () => console.log("started"),
  onComplete: () => console.log("done"),
  onRepeat: () => console.log("repeat"),
  repeat: 2,
  repeatDelay: 0.5,
  yoyo: true,
});
```

---

## Easing

```js
// Syntax: "type.direction"
// Types: power0-4, back, bounce, circ, elastic, expo, sine
// Directions: in, out, inOut

gsap.to(".el", { ease: "power2.out" });    // smooth deceleration
gsap.to(".el", { ease: "bounce.out" });    // bouncy landing
gsap.to(".el", { ease: "elastic.out(1, 0.3)" }); // elastic
gsap.to(".el", { ease: "back.out(1.7)" }); // overshoot
gsap.to(".el", { ease: "none" });          // linear
gsap.to(".el", { ease: "steps(5)" });      // stepped (5 steps)

// Custom ease (requires CustomEase plugin)
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
CustomEase.create("myEase", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1");
gsap.to(".el", { ease: "myEase" });
```

**Ease Visualizer:** https://gsap.com/docs/v3/Eases

---

## Staggers

```js
// Stagger multiple targets
gsap.to(".box", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,  // 100ms between each
});

// Advanced stagger
gsap.to(".box", {
  y: 100,
  stagger: {
    amount: 1,        // total stagger across all = 1 second
    from: "center",   // "start" | "center" | "end" | "random" | index
    grid: "auto",     // for grid arrangements
    ease: "power1.in",
  },
});
```

---

## ScrollTrigger Plugin

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Basic usage — animate as element enters viewport
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",         // element that triggers the animation
    start: "top 80%",        // "triggerPosition viewportPosition"
    end: "bottom 20%",
    scrub: true,             // ties animation to scroll position
    pin: true,               // pin the trigger element
    markers: true,           // dev markers (remove in production)
    toggleActions: "play pause reverse reset",
    // "onEnter onLeave onEnterBack onLeaveBack"
    // values: play, pause, resume, reset, restart, complete, reverse, none
  },
});

// Standalone ScrollTrigger (no animation)
ScrollTrigger.create({
  trigger: ".section",
  start: "top 50%",
  onEnter: () => console.log("entered"),
  onLeave: () => console.log("left"),
  onEnterBack: () => console.log("entered back"),
});
```

### ScrollTrigger with Timeline

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "+=500",
    scrub: 1,   // smooth scrub with 1s lag
    pin: true,
    snap: {
      snapTo: "labels",
      duration: { min: 0.2, max: 3 },
      ease: "power1.inOut",
    },
  },
});

tl.addLabel("step1")
  .to(".hero", { opacity: 0 })
  .addLabel("step2")
  .to(".content", { y: -100 });
```

### ScrollTrigger Batch (for lists/grids)

```js
ScrollTrigger.batch(".card", {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.15,
    });
  },
  start: "top 85%",
});
```

### ScrollTrigger Cleanup

```js
// Refresh after dynamic content loads
ScrollTrigger.refresh();

// Kill all ScrollTriggers
ScrollTrigger.killAll();

// Kill specific instance
const st = ScrollTrigger.create({ ... });
st.kill();
```

---

## React Integration — useGSAP()

```bash
npm install @gsap/react
```

### Basic React Usage

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register once at app level
gsap.registerPlugin(useGSAP);

function Component() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP created here is auto-reverted on unmount
    gsap.to(".box", { x: 360, duration: 1 });
  }, { scope: container }); // scope limits selector text to container

  return (
    <div ref={container}>
      <div className="box" />
    </div>
  );
}
```

### useGSAP Config Options

```tsx
useGSAP(() => {
  // ...
}, {
  dependencies: [value],    // re-run when value changes (like useEffect)
  scope: containerRef,      // scope CSS selectors to this element
  revertOnUpdate: true,     // revert animations when dependencies change
});

// Or pass deps array directly (shorthand)
useGSAP(() => { /* ... */ }, [value]);

// No deps = runs once on mount (default: [])
useGSAP(() => { /* ... */ });
```

### Interaction Handlers (contextSafe)

Animations created in event handlers (after mount) need `contextSafe()`:

```tsx
function Component() {
  const container = useRef(null);

  // Method 1: destructure from hook (for outside-hook use)
  const { contextSafe } = useGSAP({ scope: container });

  const handleClick = contextSafe(() => {
    gsap.to(".box", { rotation: 360, duration: 0.5 });
  });

  return (
    <div ref={container}>
      <div className="box" />
      <button onClick={handleClick}>Animate</button>
    </div>
  );
}
```

```tsx
// Method 2: 2nd argument inside hook (for event listeners)
useGSAP((_, contextSafe) => {
  const onHover = contextSafe(() => {
    gsap.to(".box", { x: 100 });
  });

  document.querySelector(".box").addEventListener("mouseenter", onHover);

  // Clean up event listeners in the return
  return () => {
    document.querySelector(".box").removeEventListener("mouseenter", onHover);
  };
}, { scope: container });
```

### useGSAP + ScrollTrigger (React)

```tsx
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AnimatedSection() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from(".title", {
      opacity: 0,
      y: 60,
      duration: 1,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
    });
  }, { scope: ref });

  return (
    <section ref={ref}>
      <h2 className="title">Hello</h2>
    </section>
  );
}
```

---

## Utility Methods (gsap.utils)

```js
// Clamp value between min and max
gsap.utils.clamp(0, 100, 150);     // → 100

// Map a value from one range to another
gsap.utils.mapRange(0, 100, 0, 1, 50); // → 0.5

// Normalize (map to 0-1)
gsap.utils.normalize(0, 100, 75);  // → 0.75

// Wrap around array indices
const wrap = gsap.utils.wrap(0, 5);
wrap(6); // → 1

// Interpolate between values
const lerp = gsap.utils.interpolate(0, 100);
lerp(0.5); // → 50

// Interpolate between colors
const colorLerp = gsap.utils.interpolate("#ff0000", "#0000ff");
colorLerp(0.5); // → "#800080"

// Random number
gsap.utils.random(0, 100);        // random float
gsap.utils.random(0, 100, true);  // snap to integers
gsap.utils.random([1, 2, 5, 10]); // random from array

// Snap to increment
const snap = gsap.utils.snap(10);
snap(23); // → 20

// Convert to array (handles NodeList, strings, etc.)
gsap.utils.toArray(".boxes"); // → Array of elements

// Pipeline (compose functions)
const transform = gsap.utils.pipe(
  gsap.utils.clamp(-100, 100),
  gsap.utils.normalize(-100, 100),
);
```

---

## quickSetter / quickTo — High-Performance Updates

```js
// quickSetter: best for mouse tracking (fires on every frame)
const setX = gsap.quickSetter(".cursor", "x", "px");
const setY = gsap.quickSetter(".cursor", "y", "px");

document.addEventListener("mousemove", (e) => {
  setX(e.clientX);
  setY(e.clientY);
});

// quickTo: same but with inertia/smoothing
const xTo = gsap.quickTo(".cursor", "x", { duration: 0.3, ease: "power3" });
const yTo = gsap.quickTo(".cursor", "y", { duration: 0.3, ease: "power3" });

document.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

---

## gsap.matchMedia — Responsive Animations

```js
const mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // Desktop animations
  gsap.to(".hero", { x: 200 });
  return () => { /* optional cleanup */ };
});

mm.add("(max-width: 799px)", () => {
  // Mobile animations
  gsap.to(".hero", { y: 100 });
});

// Cleanup all (e.g. on route change in SPA)
mm.revert();
```

---

## gsap.context — Cleanup for Non-React

```js
// Scoped cleanup (good for vanilla JS components)
const ctx = gsap.context(() => {
  gsap.to(".box", { x: 100 });
  gsap.from(".title", { opacity: 0 });
}, containerElement); // optional scope

// Revert all animations created inside the context
ctx.revert();
```

---

## Tween / Timeline Control Methods

```js
const tween = gsap.to(".box", { x: 100, paused: true });

tween.play();
tween.pause();
tween.resume();
tween.reverse();
tween.restart();
tween.seek(0.5);           // jump to 0.5s
tween.progress(0.5);       // jump to 50%
tween.timeScale(2);        // 2x speed
tween.duration();          // get duration
tween.totalDuration();     // includes repeats
tween.kill();              // destroy, remove from parent
tween.revert();            // undo and remove
tween.invalidate();        // clear cached start values (re-read from DOM)
tween.isActive();          // currently animating?
tween.paused();            // is paused?
tween.then(() => {});      // Promise-like (fires on complete)
```

---

## Plugin Reference

| Plugin | Use Case |
|--------|----------|
| **ScrollTrigger** (free) | Scroll-driven animations, pinning, scrubbing |
| **ScrollSmoother** (Club) | Smooth scrolling with parallax |
| **ScrollToPlugin** (free) | Animate scroll position |
| **Flip** (free) | FLIP animation technique for layout transitions |
| **SplitText** (Club) | Split text into chars/words/lines |
| **Draggable** (free) | Drag & drop with bounds/snapping |
| **Observer** (free) | Unified input detection (scroll/wheel/touch) |
| **MorphSVG** (Club) | SVG path morphing |
| **MotionPath** (free) | Animate along SVG paths |
| **DrawSVG** (Club) | SVG stroke drawing animation |
| **Inertia** (Club) | Physics-based momentum for Draggable |
| **CustomEase** (free) | Draw your own easing curves |
| **ScrambleText** (Club) | Text scramble effects |
| **TextPlugin** (Club) | Animate text character by character |

```js
// Import and register plugins
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(
  ScrollTrigger, Flip, Draggable, Observer, ScrollToPlugin,
  MotionPathPlugin, CustomEase
);
```

---

## Common Patterns

### Animate on Enter Viewport

```js
gsap.utils.toArray(".fade-in").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
    },
  });
});
```

### Scroll-Driven Horizontal Scroll

```js
const sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth,
  },
});
```

### Smooth Cursor Follower

```js
const cursor = document.querySelector(".cursor");
let xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3" });
let yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3" });

window.addEventListener("mousemove", ({ x, y }) => {
  xTo(x);
  yTo(y);
});
```

### Intro Sequence Timeline

```js
const intro = gsap.timeline({ defaults: { ease: "power2.out" } });

intro
  .from(".logo", { opacity: 0, y: -20, duration: 0.8 })
  .from(".nav a", { opacity: 0, y: -10, stagger: 0.1 }, "-=0.4")
  .from(".hero-title", { opacity: 0, y: 60, duration: 1 }, "-=0.2")
  .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.6");
```

### Three.js / WebGL Integration

```js
// Animate any numeric property — works with Three.js objects directly
const camera = new THREE.PerspectiveCamera();

gsap.to(camera.position, {
  z: 5,
  duration: 2,
  ease: "power2.inOut",
  onUpdate: () => renderer.render(scene, camera),
});

// With ScrollTrigger
gsap.to(camera.position, {
  z: 10,
  scrollTrigger: {
    trigger: ".canvas-wrapper",
    scrub: 2,
    start: "top top",
    end: "bottom bottom",
  },
  onUpdate: () => renderer.render(scene, camera),
});
```

---

## Common Gotchas

1. **Always register plugins** before using them: `gsap.registerPlugin(ScrollTrigger)`
2. **React Strict Mode** runs effects twice — use `useGSAP()` instead of bare `useEffect()` for automatic cleanup
3. **Interaction animations** created in event handlers need `contextSafe()` to be cleaned up properly
4. **`immediateRender`**: `gsap.from()` applies the starting values immediately by default — can conflict with other tweens on same target. Use `immediateRender: false` if needed
5. **`invalidate()`** before re-using a tween — clears cached start values so it re-reads from the DOM
6. **ScrollTrigger.refresh()** after dynamic content loads or layout changes
7. **Units**: GSAP uses `px` for transforms by default. Use `%`, `vw`, etc. by passing as strings: `x: "50%"`
8. **SVG**: SVG elements don't support 3D transforms in all browsers; use 2D transforms or `svgOrigin`
9. **`kill()` vs `revert()`**: `kill()` stops and removes the animation, `revert()` also undoes the applied styles

---

## Resources

- **Docs:** https://gsap.com/docs/v3/
- **Cheatsheet:** https://gsap.com/cheatsheet
- **Ease Visualizer:** https://gsap.com/docs/v3/Eases
- **Demos:** https://demos.gsap.com/
- **React Guide:** https://gsap.com/resources/React
- **ScrollTrigger:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **GitHub:** https://github.com/greensock/GSAP
- **Forums:** https://gsap.com/community/
- **YouTube:** https://www.youtube.com/@GreenSockLearning
