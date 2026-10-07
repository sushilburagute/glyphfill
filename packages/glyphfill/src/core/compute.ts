export type Mode = 'sweep' | 'fill' | 'weight';

/** `pct` is `null` while loading (no `value` given). */
export type TooltipOption = boolean | string | ((word: string, pct: number | null) => string);

export interface GlyphFillOptions {
  /**
   * Percent complete, 0–100. Out-of-range and non-finite values are clamped.
   * Leave it out (or pass `null`) to show a loading animation instead.
   */
  value?: number | null;
  /** How progress is drawn. Defaults to `'sweep'`. */
  mode?: Mode;
  /** Font weight for the unfilled part. Defaults to 100. */
  minWeight?: number;
  /** Font weight for the filled part. Defaults to 900. */
  maxWeight?: number;
  /** Transition length in ms. Defaults to 300. Ignored under `prefers-reduced-motion`. */
  duration?: number;
  /** Hover/focus tooltip. `true` shows "WORD · 40% completed", `false` hides it. */
  tooltip?: TooltipOption;
  /** Any CSS color. Filled letters change to it; unfilled letters keep the text color. */
  fillColor?: string;
}

export const DEFAULTS = {
  mode: 'sweep',
  minWeight: 100,
  maxWeight: 900,
  duration: 300,
  tooltip: true,
} as const satisfies Required<Omit<GlyphFillOptions, 'value' | 'fillColor'>>;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function clampPercent(value: number): number {
  return Number.isFinite(value) ? clamp(value, 0, 100) : 0;
}

/** CSS accepts font weights in [1, 1000]. */
export function clampWeight(weight: number): number {
  return Number.isFinite(weight) ? clamp(weight, 1, 1000) : 400;
}

function lerpWeight(min: number, max: number, t: number): number {
  return Math.round(min + (max - min) * t);
}

/**
 * How much of each letter is filled, from 0 to 1. With `p = value/100 × count`,
 * letter `i` is covered by `clamp(p − i, 0, 1)`: letters behind the progress
 * point are 1, letters ahead are 0, and the letter on the boundary is between.
 */
export function computeCoverage(count: number, value: number): number[] {
  const p = (clampPercent(value) / 100) * count;
  return Array.from({ length: count }, (_, i) => clamp(p - i, 0, 1));
}

/** Weight per letter for sweep mode. */
export function computeWeights(
  count: number,
  value: number,
  min: number = DEFAULTS.minWeight,
  max: number = DEFAULTS.maxWeight,
): number[] {
  return computeCoverage(count, value).map((t) => lerpWeight(min, max, t));
}

/** Single weight for the whole word in weight mode. */
export function computeWeight(
  value: number,
  min: number = DEFAULTS.minWeight,
  max: number = DEFAULTS.maxWeight,
): number {
  return lerpWeight(min, max, clampPercent(value) / 100);
}

export function tooltipText(tooltip: TooltipOption, word: string, pct: number | null): string | undefined {
  if (tooltip === false) return undefined;
  if (typeof tooltip === 'function') return tooltip(word, pct);
  if (typeof tooltip === 'string') return tooltip;
  return pct === null ? `${word} · loading` : `${word} · ${Math.round(pct)}% completed`;
}
