"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLenis(): void {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", () => ScrollTrigger.update());

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);
}
