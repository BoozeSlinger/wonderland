"use client";

import { forwardRef } from "react";

interface TextZoneProps {
  id: string;
  top: number;
  children: React.ReactNode;
}

const TextZone = forwardRef<HTMLDivElement, TextZoneProps>(
  ({ id, top, children }, ref) => {
    return (
      <div
        ref={ref}
        className="text-zone"
        id={id}
        style={{ top, position: "absolute" }}
      >
        {children}
      </div>
    );
  }
);

TextZone.displayName = "TextZone";

export default TextZone;
