"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface CharacterLayerHandle {
  innerEl: HTMLDivElement | null;
  louEl: HTMLImageElement | null;
  staticEl: HTMLImageElement | null;
}

const CharacterLayer = forwardRef<CharacterLayerHandle>((_, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const louRef = useRef<HTMLImageElement>(null);
  const staticRef = useRef<HTMLImageElement>(null);

  useImperativeHandle(ref, () => ({
    get innerEl() { return innerRef.current; },
    get louEl()   { return louRef.current; },
    get staticEl(){ return staticRef.current; },
  }));

  return (
    <div id="layer-characters" className="parallax-layer">
      <div ref={innerRef} className="inner">
        <img
          ref={louRef}
          src="/assets/characters/last-call-lou.png"
          id="char-lou"
          style={{ left: -40, top: 1400, width: 180, opacity: 0, position: "absolute" }}
          alt=""
        />
        <img
          ref={staticRef}
          src="/assets/characters/the-static.png"
          id="char-static"
          style={{ right: "4%", top: 2000, width: 160, opacity: 0, position: "absolute" }}
          alt=""
        />
      </div>
    </div>
  );
});

CharacterLayer.displayName = "CharacterLayer";

export default CharacterLayer;
