export type Mode = 'sweep' | 'fill' | 'weight';

export type TooltipOption = boolean | string | ((word: string, pct: number) => string);

export interface GlyphFillOptions {
  /** Percent complete, 0–100. Out-of-range and non-finite values are clamped. */
  value: number;
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
}

export const DEFAULTS = {
  mode: 'sweep',
  minWeight: 100,
  maxWeight: 900,
  duration: 300,
  tooltip: true,
} as const satisfies Required<Omit<GlyphFillOptions, 'value'>>;

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
 * Weight per letter for sweep mode. With `p = value/100 × count`, letter `i`
 * is covered by `clamp(p − i, 0, 1)`: letters behind the progress point get
 * `max`, letters ahead get `min`, and the letter on the boundary is between.
 */
export function computeWeights(
  count: number,
  value: number,
  min: number = DEFAULTS.minWeight,
  max: number = DEFAULTS.maxWeight,
): number[] {
  const p = (clampPercent(value) / 100) * count;
  return Array.from({ length: count }, (_, i) => lerpWeight(min, max, clamp(p - i, 0, 1)));
}

/** Single weight for the whole word in weight mode. */
export function computeWeight(
  value: number,
  min: number = DEFAULTS.minWeight,
  max: number = DEFAULTS.maxWeight,
): number {
  return lerpWeight(min, max, clampPercent(value) / 100);
}

export function tooltipText(tooltip: TooltipOption, word: string, pct: number): string | undefined {
  if (tooltip === false) return undefined;
  if (typeof tooltip === 'function') return tooltip(word, pct);
  if (typeof tooltip === 'string') return tooltip;
  return `${word} · ${Math.round(pct)}% completed`;
}
