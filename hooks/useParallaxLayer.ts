"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEPTH = 8000;

/**
 * Sets up a parallax animation on an inner div element.
 * Call this inside a gsap.context() callback.
 */
export function setupParallaxLayer(
  innerEl: HTMLElement | null,
  speed: number,
  scrub = 2
): void {
  if (!innerEl) return;

  gsap.to(innerEl, {
    y: -(speed * DEPTH),
    ease: "none",
    force3D: true,
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub,
    },
  });
}
