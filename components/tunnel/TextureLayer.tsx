"use client";

import { forwardRef } from "react";

interface TextureLayerProps {
  id: string;
  initialOpacity?: number;
}

const TextureLayer = forwardRef<HTMLDivElement, TextureLayerProps>(
  ({ id, initialOpacity = 1 }, ref) => {
    return (
      <div
        id={id}
        className="parallax-layer texture-layer"
        style={{ opacity: initialOpacity }}
      >
        <div ref={ref} className="inner" />
      </div>
    );
  }
);

TextureLayer.displayName = "TextureLayer";

export default TextureLayer;
