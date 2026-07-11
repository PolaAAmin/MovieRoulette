import { useMemo, useRef, useCallback, useState } from "react";

interface Props {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  /** Minimum allowed gap between the two thumbs (prevents overlap). */
  minGap?: number;
  /** Optional formatter for the value labels (e.g. add "min" suffix). */
  format?: (v: number) => string;
}

/**
 * Dual-thumb range slider built with pointer events (no native inputs).
 *
 * Why not two stacked <input type="range">? Because the top input's element
 * box covers/clips the bottom input's thumb on WebKit/Blink, making one thumb
 * invisible / ungraggable. This custom implementation renders two thumb
 * divs on a single track and handles pointer events directly, so both
 * thumbs are always visible and draggable.
 */
export default function DualRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  minGap = 1,
  format,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const lo = Math.min(valueMin, valueMax);
  const hi = Math.max(valueMin, valueMax);
  const range = max - min || 1;

  const fmt = format ?? ((v: number) => String(v));

  const loPct = useMemo(() => ((lo - min) / range) * 100, [lo, min, range]);
  const hiPct = useMemo(() => ((hi - min) / range) * 100, [hi, min, range]);

  /** Convert a pointer X position to a clamped value in [min, max]. */
  const pointerToValue = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(min + pct * range);
    },
    [min, range]
  );

  const handlePointerDown = useCallback(
    (which: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(which);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const v = pointerToValue(e.clientX);
      if (dragging === "min") {
        onChange(Math.min(v, hi - minGap), hi);
      } else {
        onChange(lo, Math.max(v, lo + minGap));
      }
    },
    [dragging, pointerToValue, onChange, lo, hi, minGap]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setDragging(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Keyboard support: arrow keys nudge the focused thumb
  const handleKeyDown = useCallback(
    (which: "min" | "max") => (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? Math.max(1, Math.round(range / 20)) : 1;
      let next: number | null = null;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = (which === "min" ? lo : hi) - step;
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = (which === "min" ? lo : hi) + step;
      if (next === null) return;
      e.preventDefault();
      if (which === "min") onChange(Math.min(next, hi - minGap), hi);
      else onChange(lo, Math.max(next, lo + minGap));
    },
    [lo, hi, onChange, minGap, range]
  );

  return (
    <div className="dual-range-wrapper">
      <div
        className="dual-range"
        ref={trackRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="dual-range-track" />
        <div
          className="dual-range-fill"
          style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
        />
        {/* Min thumb */}
        <div
          className={`dual-range-thumb min ${dragging === "min" ? "active" : ""}`}
          style={{ left: `${loPct}%` }}
          onPointerDown={handlePointerDown("min")}
          onKeyDown={handleKeyDown("min")}
          role="slider"
          tabIndex={0}
          aria-label="minimum value"
          aria-valuemin={min}
          aria-valuemax={hi - minGap}
          aria-valuenow={lo}
        />
        {/* Max thumb */}
        <div
          className={`dual-range-thumb max ${dragging === "max" ? "active" : ""}`}
          style={{ left: `${hiPct}%` }}
          onPointerDown={handlePointerDown("max")}
          onKeyDown={handleKeyDown("max")}
          role="slider"
          tabIndex={0}
          aria-label="maximum value"
          aria-valuemin={lo + minGap}
          aria-valuemax={max}
          aria-valuenow={hi}
        />
      </div>
      <div className="range-label">
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </div>
    </div>
  );
}
