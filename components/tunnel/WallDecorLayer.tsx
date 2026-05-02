"use client";

import { forwardRef } from "react";

const WallDecorLayer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div id="layer-frames" className="parallax-layer">
      <div ref={ref} className="inner">
        <img
          src="/assets/frames/sconce-left.png"
          className="wall-decor"
          style={{ left: "3%", top: 600, width: 70 }}
          alt=""
        />
        <img
          src="/assets/frames/sconce-right.png"
          className="wall-decor"
          style={{ right: "3%", top: 600, width: 70 }}
          alt=""
        />
        <img
          src="/assets/frames/frame-large.png"
          className="wall-decor"
          style={{ left: "2%", top: 1400, width: 140 }}
          alt=""
        />
        <img
          src="/assets/frames/frame-small.png"
          className="wall-decor"
          style={{ right: "2%", top: 2200, width: 110 }}
          alt=""
        />
        <img
          src="/assets/frames/frame-large.png"
          className="wall-decor"
          style={{ right: "2%", top: 3000, width: 140 }}
          alt=""
        />
        <img
          src="/assets/frames/frame-small.png"
          className="wall-decor"
          style={{ left: "2%", top: 3800, width: 110 }}
          alt=""
        />
      </div>
    </div>
  );
});

WallDecorLayer.displayName = "WallDecorLayer";

export default WallDecorLayer;
