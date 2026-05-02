"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLenis } from "@/hooks/useLenis";
import { setupParallaxLayer } from "@/hooks/useParallaxLayer";
import TextureLayer from "./TextureLayer";
import FloatingObject from "./FloatingObject";
import TVTender from "./TVTender";
import TextZone from "./TextZone";
import CharacterLayer, { type CharacterLayerHandle } from "./CharacterLayer";
import NeonLayer from "./NeonLayer";
import WallDecorLayer from "./WallDecorLayer";
import TunnelRim from "./TunnelRim";
import Atmosphere from "./Atmosphere";

gsap.registerPlugin(ScrollTrigger);

const DEPTH = 8000;

export default function TunnelScene() {
  useLenis();

  // ── Texture layer inner refs ──────────────────────────
  const barInnerRef     = useRef<HTMLDivElement>(null);
  const earthInnerRef   = useRef<HTMLDivElement>(null);
  const brickInnerRef   = useRef<HTMLDivElement>(null);
  const shelvesInnerRef = useRef<HTMLDivElement>(null);
  const wallpaperInnerRef = useRef<HTMLDivElement>(null);

  // ── Other layer inner refs ────────────────────────────
  const framesInnerRef  = useRef<HTMLDivElement>(null);
  const objectsInnerRef = useRef<HTMLDivElement>(null);
  const textInnerRef    = useRef<HTMLDivElement>(null);
  const neonInnerRef    = useRef<HTMLDivElement>(null);
  const charsRef        = useRef<CharacterLayerHandle>(null);

  // ── Text zone refs ────────────────────────────────────
  const zone1Ref = useRef<HTMLDivElement>(null);
  const zone2Ref = useRef<HTMLDivElement>(null);
  const zone3Ref = useRef<HTMLDivElement>(null);
  const zone4Ref = useRef<HTMLDivElement>(null);

  // ── Floating object refs ──────────────────────────────
  const receiptRef  = useRef<HTMLImageElement>(null);
  const glassRef    = useRef<HTMLImageElement>(null);
  const bottleRef   = useRef<HTMLImageElement>(null);
  const tapRef      = useRef<HTMLImageElement>(null);
  const vialRef     = useRef<HTMLImageElement>(null);
  const coasterRef  = useRef<HTMLImageElement>(null);
  const barstoolRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // ── Texture layer parallax ──────────────────────
      setupParallaxLayer(barInnerRef.current,     0.20);
      setupParallaxLayer(earthInnerRef.current,   0.25);
      setupParallaxLayer(brickInnerRef.current,   0.25);
      setupParallaxLayer(shelvesInnerRef.current, 0.25);
      setupParallaxLayer(wallpaperInnerRef.current, 0.25);

      // ── Decor / text / neon / character layer parallax ─
      setupParallaxLayer(framesInnerRef.current,  0.40);
      setupParallaxLayer(objectsInnerRef.current, 0.25);
      setupParallaxLayer(textInnerRef.current,    0.35);
      setupParallaxLayer(neonInnerRef.current,    0.35);
      if (charsRef.current) {
        setupParallaxLayer(charsRef.current.innerEl, 0.30);
      }

      // ── Floating objects — individual speed differentials ─
      if (!isMobile) {
        const objects: Array<{
          ref: React.RefObject<HTMLImageElement | null>;
          relSpeed: number; // speed beyond base 0.25x
          drift: number;
          rot: number;
          scrub: number;
        }> = [
          { ref: receiptRef,  relSpeed: 0.50, drift:  40, rot: -20, scrub: 1.5 },
          { ref: glassRef,    relSpeed: 0.57, drift: -30, rot:  15, scrub: 2.1 },
          { ref: bottleRef,   relSpeed: 0.45, drift:  20, rot: -35, scrub: 1.8 },
          { ref: tapRef,      relSpeed: 0.62, drift: -45, rot:  25, scrub: 2.3 },
          { ref: vialRef,     relSpeed: 0.53, drift:  30, rot: -10, scrub: 1.6 },
          { ref: coasterRef,  relSpeed: 0.66, drift: -20, rot:  40, scrub: 2.2 },
          { ref: barstoolRef, relSpeed: 0.48, drift:  35, rot: -25, scrub: 1.9 },
        ];

        objects.forEach(({ ref, relSpeed, drift, rot, scrub }) => {
          if (!ref.current) return;
          gsap.to(ref.current, {
            y:        -(relSpeed * DEPTH),
            x:        drift,
            rotation: rot + (Math.random() * 20 - 10),
            ease:     "none",
            scrollTrigger: {
              trigger: document.body,
              start:   "top top",
              end:     "bottom bottom",
              scrub,
            },
          });
        });
      }

      // ── Texture crossfades — direct element refs, no DOM query per tick ──
      const elBar       = barInnerRef.current?.parentElement;
      const elEarth     = earthInnerRef.current?.parentElement;
      const elBrick     = brickInnerRef.current?.parentElement;
      const elShelves   = shelvesInnerRef.current?.parentElement;
      const elWallpaper = wallpaperInnerRef.current?.parentElement;

      // bar → earth  (8–18%)
      ScrollTrigger.create({
        trigger: document.body,
        start: "8% top",
        end:   "18% top",
        scrub: true,
        onUpdate: (self) => {
          if (elBar)   gsap.set(elBar,   { opacity: 1 - self.progress });
          if (elEarth) gsap.set(elEarth, { opacity: self.progress });
        },
      });

      // earth → brick  (25–38%)
      ScrollTrigger.create({
        trigger: document.body,
        start: "25% top",
        end:   "38% top",
        scrub: true,
        onUpdate: (self) => {
          if (elEarth) gsap.set(elEarth, { opacity: 1 - self.progress });
          if (elBrick) gsap.set(elBrick, { opacity: self.progress });
        },
      });

      // brick → shelves  (45–57%)
      ScrollTrigger.create({
        trigger: document.body,
        start: "45% top",
        end:   "57% top",
        scrub: true,
        onUpdate: (self) => {
          if (elBrick)   gsap.set(elBrick,   { opacity: 1 - self.progress });
          if (elShelves) gsap.set(elShelves, { opacity: self.progress });
        },
      });

      // shelves → wallpaper  (65–77%)
      ScrollTrigger.create({
        trigger: document.body,
        start: "65% top",
        end:   "77% top",
        scrub: true,
        onUpdate: (self) => {
          if (elShelves)   gsap.set(elShelves,   { opacity: 1 - self.progress });
          if (elWallpaper) gsap.set(elWallpaper, { opacity: self.progress });
        },
      });

      // ── Text zones — scroll-percent triggers ───────────
      // Each zone fades in then out at the scroll % where it's visually centered.
      // Positions are in the text layer's .inner div (speed 0.35x).
      const textZoneTriggers: Array<{
        ref: React.RefObject<HTMLDivElement | null>;
        fadeIn:  [string, string];
        fadeOut: [string, string];
      }> = [
        { ref: zone1Ref, fadeIn: ["0%",  "7%"],  fadeOut: ["9%",  "15%"] },
        { ref: zone2Ref, fadeIn: ["30%", "40%"], fadeOut: ["42%", "50%"] },
        { ref: zone3Ref, fadeIn: ["60%", "70%"], fadeOut: ["72%", "80%"] },
        { ref: zone4Ref, fadeIn: ["80%", "88%"], fadeOut: ["90%", "96%"] },
      ];

      textZoneTriggers.forEach(({ ref, fadeIn, fadeOut }) => {
        const el = ref.current;
        if (!el) return;

        // Fade in — immediateRender:false so it doesn't set opacity:0 before ST fires
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, immediateRender: false },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: document.body,
              start: `${fadeIn[0]} top`,
              end:   `${fadeIn[1]} top`,
              scrub: 1.5,
            },
          }
        );

        // Fade out — use gsap.to so no explicit from-state is applied at load
        gsap.to(el, {
          opacity: 0,
          ease: "power2.in",
          immediateRender: false,
          scrollTrigger: {
            trigger: document.body,
            start: `${fadeOut[0]} top`,
            end:   `${fadeOut[1]} top`,
            scrub: 1.5,
          },
        });
      });

      // ── Last Call Lou — flickers in at 32%, runs left ──
      ScrollTrigger.create({
        trigger: document.body,
        start:   "32% top",
        once:    true,
        onEnter: () => {
          const lou = charsRef.current?.louEl;
          if (!lou) return;
          gsap
            .timeline()
            .to(lou, { opacity: 1, duration: 0.25, ease: "power1.in" })
            .to(lou, { x: -320, opacity: 0, duration: 1.4, ease: "power2.in" }, "+=0.9");
        },
      });

      // ── The Static — flickers at 55%, lingers, fades ───
      ScrollTrigger.create({
        trigger: document.body,
        start:   "55% top",
        once:    true,
        onEnter: () => {
          const st = charsRef.current?.staticEl;
          if (!st) return;
          gsap
            .timeline()
            .to(st, { opacity: 1,   duration: 0.08 })
            .to(st, { opacity: 0,   duration: 0.08 }, "+=0.06")
            .to(st, { opacity: 1,   duration: 0.08 }, "+=0.04")
            .to(st, { opacity: 0.9, duration: 0.25 }, "+=0.08")
            .to(st, { opacity: 0,   duration: 0.9  }, "+=2.2");
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Scroll spacer — sole source of scroll depth */}
      <div style={{ height: DEPTH, width: "100%" }} />

      {/* Layer 0 — Void */}
      <div id="layer-void" />

      {/* Layers 1–5 — Texture backgrounds */}
      <TextureLayer id="layer-bar"       ref={barInnerRef}       initialOpacity={1} />
      <TextureLayer id="layer-earth"     ref={earthInnerRef}     initialOpacity={0} />
      <TextureLayer id="layer-brick"     ref={brickInnerRef}     initialOpacity={0} />
      <TextureLayer id="layer-shelves"   ref={shelvesInnerRef}   initialOpacity={0} />
      <TextureLayer id="layer-wallpaper" ref={wallpaperInnerRef} initialOpacity={0} />

      {/* Layer 6 — Wall decor */}
      <WallDecorLayer ref={framesInnerRef} />

      {/* Layer 7 — Floating objects */}
      <div id="layer-objects" className="parallax-layer">
        <div ref={objectsInnerRef} className="inner">
          <FloatingObject ref={receiptRef}  src="/assets/objects/receipt.png"    id="obj-receipt"  top={200}  left="9%"   width={100} />
          <FloatingObject ref={glassRef}    src="/assets/objects/shot-glass.png" id="obj-glass"    top={500}  right="11%" width={85}  />
          <FloatingObject ref={bottleRef}   src="/assets/objects/bottle.png"     id="obj-bottle"   top={900}  left="68%"  width={120} />
          <FloatingObject ref={tapRef}      src="/assets/objects/tap-handle.png" id="obj-tap"      top={1300} right="9%"  width={105} />
          <FloatingObject ref={vialRef}     src="/assets/objects/vial.png"       id="obj-vial"     top={1700} left="14%"  width={75}  />
          <FloatingObject ref={coasterRef}  src="/assets/objects/coaster.png"    id="obj-coaster"  top={2100} right="20%" width={90}  />
          <FloatingObject ref={barstoolRef} src="/assets/objects/barstool.png"   id="obj-barstool" top={2500} left="62%"  width={135} />
        </div>
      </div>

      {/* Layer 8 — Text zones */}
      <div id="layer-text" className="parallax-layer">
        <div ref={textInnerRef} className="inner">
          <TextZone ref={zone1Ref} id="zone-1" top={600}>
            <h1>Your bar is bleeding money.</h1>
            <p>You just can&apos;t see the hole yet.</p>
          </TextZone>

          <TextZone ref={zone2Ref} id="zone-2" top={1500}>
            <h2>The average bar loses 20–25% of profit every month.</h2>
            <p>Dead stock. Over-pouring. Invisible online. All the same drain.</p>
          </TextZone>

          <TextZone ref={zone3Ref} id="zone-3" top={2400}>
            <h2>We&apos;re all bleeding here.</h2>
            <p>There&apos;s a system on the other side of this wall.</p>
          </TextZone>

          <TextZone ref={zone4Ref} id="zone-4" top={2700}>
            <h2>You made it. Now let&apos;s fix your bar.</h2>
            <div className="offer-cards">
              <div className="offer-card">
                <span className="card-title">Profit Leak Audit</span>
                <span className="card-price">$499</span>
              </div>
              <div className="offer-card">
                <span className="card-title">High-Proof Tier 2</span>
                <span className="card-price">$599/mo</span>
              </div>
              <div className="offer-card">
                <span className="card-title">THE CALL</span>
                <span className="card-price">$1,149/mo</span>
              </div>
            </div>
            <a href="#" className="cta-btn">Book The Call</a>
          </TextZone>
        </div>
      </div>

      {/* Layer 9 — Neon signs */}
      <NeonLayer ref={neonInnerRef} />

      {/* Layer 10 — Characters */}
      <CharacterLayer ref={charsRef} />

      {/* TVTender — fixed, z-index 18 */}
      <TVTender />

      {/* Tunnel rim — fixed foreground, z-index 20 */}
      <TunnelRim />

      {/* Atmosphere — grain + scanlines + vignette, z-index 99 */}
      <Atmosphere />
    </>
  );
}
