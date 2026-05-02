"use client";

import { forwardRef } from "react";

const NeonLayer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div id="layer-neon" className="parallax-layer">
      <div ref={ref} className="inner">
        <img
          src="/assets/signs/neon-last-call.png"
          className="neon-sign"
          style={{ top: 2550, position: "absolute" }}
          alt=""
        />
        <img
          src="/assets/signs/neon-down-the-drain.png"
          className="neon-sign"
          style={{ top: 2830, position: "absolute" }}
          alt=""
        />
      </div>
    </div>
  );
});

NeonLayer.displayName = "NeonLayer";

export default NeonLayer;
