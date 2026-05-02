"use client";

import { forwardRef } from "react";

interface FloatingObjectProps {
  src: string;
  id: string;
  top: number;
  left?: string;
  right?: string;
  width: number;
  alt?: string;
}

const FloatingObject = forwardRef<HTMLImageElement, FloatingObjectProps>(
  ({ src, id, top, left, right, width, alt = "" }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        id={id}
        className="float-obj hidden md:block"
        style={{
          top,
          left,
          right,
          width,
          position: "absolute",
        }}
        alt={alt}
      />
    );
  }
);

FloatingObject.displayName = "FloatingObject";

export default FloatingObject;
