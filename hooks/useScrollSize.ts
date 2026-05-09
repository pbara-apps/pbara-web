"use client";

import { useScrollPosition } from "react-haiku";
import { useMemo } from "react";

export interface ScrollSize {
  /** Horizontal distance from left edge (px) — `window.scrollX`. */
  scrollX: number;
  /** Vertical distance from top edge (px) — `window.scrollY`. */
  scrollY: number;
}

/**
 * Window scroll position (`scrollX` / `scrollY`), backed by
 * {@link useScrollPosition} from `react-haiku`.
 */
export function useScrollSize(): ScrollSize {
  const [raw] = useScrollPosition();
  const position = raw as { x: number; y: number };

  return useMemo(
    () => ({
      scrollX: position.x,
      scrollY: position.y,
    }),
    [position.x, position.y],
  );
}
